import { useStaging } from '../context/StagingContext'
import { PROMPT_PRESETS } from '../constants/promptPresets'

export default function PromptPresetSelector() {
  const { promptPreset, setPromptPreset } = useStaging()

  return (
    <div className="space-y-3">
      {PROMPT_PRESETS.map((preset) => {
        const isActive = promptPreset === preset.id

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setPromptPreset(preset.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
              isActive
                ? 'bg-dark-card border-gold text-white'
                : 'bg-transparent border-dark-border text-gray-300 hover:border-gray-500'
            }`}
          >
            <p className="text-sm font-semibold">{preset.name}</p>
            <p className="text-xs text-gray-400 mt-1">{preset.description}</p>
          </button>
        )
      })}
    </div>
  )
}
