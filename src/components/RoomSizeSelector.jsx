import { useStaging } from '../context/StagingContext'
import { useI18n } from '../context/I18nContext'

const sizes = ['S', 'M', 'L']

export default function RoomSizeSelector() {
  const { roomSize, setRoomSize } = useStaging()
  const { getRoomSizeMeta } = useI18n()

  return (
    <div className="grid grid-cols-3 gap-3">
      {sizes.map((sizeKey) => {
        const size = getRoomSizeMeta(sizeKey)
        return (
        <button
          key={sizeKey}
          onClick={() => setRoomSize(sizeKey)}
          className={`
            flex flex-col items-center py-4 px-3 rounded-xl border transition-all
            ${roomSize === sizeKey
              ? 'bg-dark-card border-gold text-white' 
              : 'bg-transparent border-dark-border text-gray-400 hover:border-gray-500'
            }
          `}
        >
          <span className="text-2xl font-bold mb-1">{sizeKey}</span>
          <span className="text-sm">{size.label}</span>
          <span className="text-xs text-gray-500 mt-0.5">{size.range}</span>
        </button>
        )
      })}
    </div>
  )
}
