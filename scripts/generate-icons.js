/**
 * Generate PNG icons from SVG base files
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Requirements:
 *   npm install sharp
 * 
 * This script converts SVG icons to PNG format for PWA and favicon use.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons')

const ICON_SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

async function generateIcons() {
  try {
    // Dynamic import for sharp (needs to be installed)
    const sharp = (await import('sharp')).default

    const svgSource = path.join(ICONS_DIR, 'icon-512x512.svg')
    const svgBuffer = fs.readFileSync(svgSource)

    console.log('Generating PNG icons from SVG...\n')

    for (const icon of ICON_SIZES) {
      const outputPath = path.join(ICONS_DIR, icon.name)
      
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath)

      console.log(`✓ Generated ${icon.name} (${icon.size}x${icon.size})`)
    }

    // Generate ICO file info
    console.log('\n📝 To create favicon.ico, use an online converter or:')
    console.log('   https://realfavicongenerator.net/')
    console.log('   Upload icon-512x512.svg for best results\n')

    console.log('✅ All icons generated successfully!')

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.error('❌ Sharp is not installed. Run:')
      console.error('   npm install sharp --save-dev')
      console.error('\nThen run this script again.')
    } else {
      console.error('❌ Error generating icons:', error.message)
    }
    process.exit(1)
  }
}

generateIcons()
