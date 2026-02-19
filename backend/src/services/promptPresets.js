const NEGATIVE_PROMPT = [
  'low resolution',
  'blurry',
  'distorted geometry',
  'warped perspective',
  'cluttered scene',
  'oversaturated colors',
  'cartoonish style',
  'noisy texture',
  'poor lighting',
  'watermark',
  'text artifacts',
].join(', ')

const PRESET_BASE_PROMPTS = {
  default_premium: ({ roomType, densityPrompt }) => `Create a high-end real-estate visual of a ${roomType}, featuring balanced composition, clean architecture, warm natural light, premium materials, realistic textures, and polished editorial quality. Maintain accurate proportions, inviting atmosphere, and market-ready presentation. Requirements: ${densityPrompt}. Maintain original room layout and window positions. Do not alter structural walls or windows.`,
  luxury_classic: ({ roomType, densityPrompt }) => `Create an elegant luxury real-estate visual of a ${roomType} in a timeless style: refined symmetry, marble and natural stone surfaces, brass accents, layered ambient lighting, rich but neutral palette, soft shadows, and sophisticated hotel-like atmosphere. Ultra-realistic, premium editorial finish. Requirements: ${densityPrompt}. Maintain original room layout and window positions. Do not alter structural walls or windows.`,
  modern_luxury: ({ roomType, densityPrompt }) => `Create a modern luxury real-estate visual of a ${roomType} with minimalist architecture, floor-to-ceiling glass, seamless lines, curated designer furniture, indirect architectural lighting, muted neutral tones, and cinematic daylight. Clean, upscale, ultra-realistic, magazine-grade quality. Requirements: ${densityPrompt}. Maintain original room layout and window positions. Do not alter structural walls or windows.`,
}

export const PROMPT_PRESET_IDS = Object.keys(PRESET_BASE_PROMPTS)
export const DEFAULT_PROMPT_PRESET = 'default_premium'

export function resolvePromptPreset(rawPreset) {
  return PROMPT_PRESET_IDS.includes(rawPreset) ? rawPreset : DEFAULT_PROMPT_PRESET
}

export function buildPrompt({ preset, roomType, densityPrompt }) {
  const safePreset = resolvePromptPreset(preset)
  const promptBuilder = PRESET_BASE_PROMPTS[safePreset] ?? PRESET_BASE_PROMPTS[DEFAULT_PROMPT_PRESET]

  return {
    preset: safePreset,
    prompt: promptBuilder({ roomType, densityPrompt }),
    negativePrompt: NEGATIVE_PROMPT,
  }
}
