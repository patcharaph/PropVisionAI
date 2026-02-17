import { useState } from 'react'
import { useStaging } from '../context/StagingContext'
import { useI18n } from '../context/I18nContext'

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
  const { t } = useI18n()
  
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
              {tier === 'LOW' && t('cost.low')}
              {tier === 'MID' && t('cost.mid')}
              {tier === 'HIGH' && t('cost.high')}
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
