import { useStaging } from '../context/StagingContext'

const sizes = [
  { key: 'S', label: 'Small', range: '< 20 sqm' },
  { key: 'M', label: 'Medium', range: '20-40 sqm' },
  { key: 'L', label: 'Large', range: '40+ sqm' },
]

export default function RoomSizeSelector() {
  const { roomSize, setRoomSize } = useStaging()

  return (
    <div className="grid grid-cols-3 gap-3">
      {sizes.map((size) => (
        <button
          key={size.key}
          onClick={() => setRoomSize(size.key)}
          className={`
            flex flex-col items-center py-4 px-3 rounded-xl border transition-all
            ${roomSize === size.key 
              ? 'bg-dark-card border-gold text-white' 
              : 'bg-transparent border-dark-border text-gray-400 hover:border-gray-500'
            }
          `}
        >
          <span className="text-2xl font-bold mb-1">{size.key}</span>
          <span className="text-sm">{size.label}</span>
          <span className="text-xs text-gray-500 mt-0.5">{size.range}</span>
        </button>
      ))}
    </div>
  )
}
