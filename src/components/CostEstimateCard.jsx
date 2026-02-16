import { useState } from 'react'
import { useStaging } from '../context/StagingContext'

const tiers = ['LOW', 'MID', 'HIGH']

function formatCost(amount) {
  if (amount >= 1000000) {
    return `฿${(amount / 1000000).toFixed(1)}M`
  }
  return `฿${(amount / 1000).toFixed(0)}K`
}

export default function CostEstimateCard() {
  const [selectedTier, setSelectedTier] = useState('MID')
  const { getRenovationCosts } = useStaging()
  
  const costs = getRenovationCosts()
  
  if (!costs) return null

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
      <div className="grid grid-cols-3 gap-2">
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`
              flex flex-col items-center py-3 px-2 rounded-xl transition-all
              ${selectedTier === tier 
                ? 'bg-dark-bg border border-gold' 
                : 'bg-transparent hover:bg-dark-bg/50'
              }
            `}
          >
            <span className={`text-xs font-medium mb-1 ${
              selectedTier === tier ? 'text-gold' : 'text-gray-500'
            }`}>
              {tier}
            </span>
            <span className={`text-lg font-bold ${
              selectedTier === tier ? 'text-gold' : 'text-white'
            }`}>
              {formatCost(costs[tier])}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
