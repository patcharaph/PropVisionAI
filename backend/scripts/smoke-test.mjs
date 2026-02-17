import { spawn } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(backendDir, '..')

const args = new Set(process.argv.slice(2))
const baseUrlArg = process.argv.find((arg) => arg.startsWith('--base-url='))
const baseUrl = baseUrlArg ? baseUrlArg.replace('--base-url=', '') : 'http://127.0.0.1:8080'
const useExisting = args.has('--use-existing')
const withGenerate = args.has('--with-generate')

const imageArg = process.argv.find((arg) => arg.startsWith('--image='))
const imagePath = imageArg
  ? path.resolve(process.cwd(), imageArg.replace('--image=', ''))
  : path.resolve(repoRoot, 'public', 'demo-after.jpg')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function parseEnvValue(name) {
  const fromProcess = process.env[name]
  if (typeof fromProcess === 'string' && fromProcess.trim() !== '') {
    return fromProcess.trim()
  }

  const envPath = path.join(backendDir, '.env')
  if (!existsSync(envPath)) {
    return ''
  }

  const content = readFileSync(envPath, 'utf8')
  const line = content
    .split(/\r?\n/)
    .find((row) => row.trim().startsWith(`${name}=`))

  if (!line) {
    return ''
  }

  return line.slice(name.length + 1).trim()
}

async function waitForReady(timeoutMs = 20000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/health`)
      if (res.ok) {
        return true
      }
    } catch {
      // keep retrying until timeout
    }

    await sleep(400)
  }

  return false
}

async function runJsonTest(name, method, endpoint, expected, body) {
  let actual = -1
  let text = ''

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    actual = res.status
    text = await res.text()
  } catch (error) {
    text = String(error)
  }

  return {
    name,
    method,
    endpoint,
    expected,
    actual,
    pass: actual === expected,
    body: text.slice(0, 300),
  }
}

async function runMultipartTest(name, endpoint, expected, formFields) {
  let actual = -1
  let text = ''

  try {
    const form = new FormData()

    if (formFields.imagePath) {
      const fileBuffer = readFileSync(formFields.imagePath)
      const fileName = path.basename(formFields.imagePath)
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' })
      form.append('image', blob, fileName)
    }

    for (const [key, value] of Object.entries(formFields)) {
      if (key === 'imagePath' || typeof value === 'undefined') {
        continue
      }
      form.append(key, value)
    }

    const res = await fetch(`${baseUrl}${endpoint}`, { method: 'POST', body: form })
    actual = res.status
    text = await res.text()
  } catch (error) {
    text = String(error)
  }

  return {
    name,
    method: 'POST',
    endpoint,
    expected,
    actual,
    pass: actual === expected,
    body: text.slice(0, 300),
  }
}

function printSummary(results) {
  const total = results.length
  const passed = results.filter((item) => item.pass).length
  const failed = total - passed

  console.log('')
  console.log(`Smoke Test Summary: ${passed}/${total} passed, ${failed} failed`)
  for (const result of results) {
    const status = result.pass ? 'PASS' : 'FAIL'
    console.log(`[${status}] ${result.method} ${result.endpoint} (expected ${result.expected}, got ${result.actual})`)
    if (!result.pass) {
      console.log(`  body: ${result.body}`)
    }
  }
  console.log('')

  return failed === 0
}

let backendProc = null
let backendLogs = ''
let backendSpawnError = null

try {
  if (!useExisting) {
    backendProc = spawn('node', ['src/index.js'], {
      cwd: backendDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    })

    backendProc.on('error', (error) => {
      backendSpawnError = error
    })
    backendProc.stdout.on('data', (chunk) => {
      backendLogs += chunk.toString()
    })
    backendProc.stderr.on('data', (chunk) => {
      backendLogs += chunk.toString()
    })
  }

  if (backendSpawnError) {
    throw backendSpawnError
  }

  const ready = await waitForReady()
  if (!ready) {
    console.error('Backend is not ready in time.')
    if (backendLogs) {
      console.error('Recent backend logs:')
      console.error(backendLogs.slice(-1500))
    }
    process.exitCode = 1
  } else {
    const adminKey = parseEnvValue('ADMIN_API_KEY')
    const expectAdminAuth = adminKey !== ''
    const tests = []

    tests.push(await runJsonTest('health', 'GET', '/health', 200))
    tests.push(await runJsonTest('quota', 'GET', '/api/quota/smoke-user', 200))
    tests.push(await runJsonTest('track-upload', 'POST', '/api/track/upload', 200, { userId: 'smoke-user' }))
    tests.push(await runJsonTest('track-share', 'POST', '/api/track/share', 200, { userId: 'smoke-user', platform: 'line' }))
    tests.push(await runJsonTest('feedback-invalid', 'POST', '/api/feedback', 400, { userId: 'smoke-user', generationId: 'gen-smoke', rating: 0, comment: 'invalid rating' }))
    tests.push(await runJsonTest('feedback-valid', 'POST', '/api/feedback', 200, { userId: 'smoke-user', generationId: 'gen-smoke', rating: 5, comment: 'ok' }))

    if (expectAdminAuth) {
      tests.push(await runJsonTest('admin-no-key', 'GET', '/api/admin/stats?days=7', 401))
      tests.push(await runJsonTest('admin-with-key', 'GET', `/api/admin/stats?days=7&key=${encodeURIComponent(adminKey)}`, 200))
    } else {
      tests.push(await runJsonTest('admin-no-key', 'GET', '/api/admin/stats?days=7', 200))
    }

    tests.push(await runJsonTest('generate-missing-image', 'POST', '/api/generate', 400, { roomSize: 'S', userId: 'smoke-user' }))

    if (existsSync(imagePath)) {
      tests.push(await runMultipartTest('generate-invalid-room-size', '/api/generate', 400, { imagePath, roomSize: 'X', userId: 'smoke-user' }))

      if (withGenerate) {
        tests.push(await runMultipartTest('generate-valid', '/api/generate', 200, { imagePath, roomSize: 'S', userId: 'smoke-user' }))
      }
    } else {
      console.warn(`Image file not found: ${imagePath}`)
      console.warn('Skipping multipart generate tests.')
    }

    const ok = printSummary(tests)
    process.exitCode = ok ? 0 : 1
  }
} finally {
  if (backendProc && !backendProc.killed) {
    backendProc.kill('SIGTERM')
    await sleep(500)
    if (!backendProc.killed) {
      backendProc.kill('SIGKILL')
    }
  }
}
