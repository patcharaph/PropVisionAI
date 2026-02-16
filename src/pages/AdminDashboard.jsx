import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Clock, AlertCircle, DollarSign, Users, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetchStats()
  }, [days])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const adminKey = localStorage.getItem('adminKey') || ''
      const response = await fetch(
        `${API_BASE_URL}/api/admin/stats?days=${days}&key=${adminKey}`
      )
      
      if (!response.ok) {
        if (response.status === 401) {
          const key = prompt('Enter admin API key:')
          if (key) {
            localStorage.setItem('adminKey', key)
            fetchStats()
            return
          }
        }
        throw new Error('Failed to fetch stats')
      }
      
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, subValue, color = 'gold' }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 text-${color}`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-xl font-bold text-gold">Admin Dashboard</h1>
          
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value={1}>Last 24h</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-12">Loading stats...</div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400">
            {error}
          </div>
        )}

        {stats && !loading && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={TrendingUp}
                label="Total Generations"
                value={stats.totalGenerations}
              />
              <StatCard
                icon={Clock}
                label="Avg Time"
                value={`${(stats.avgGenerationTime / 1000).toFixed(1)}s`}
                subValue="per generation"
              />
              <StatCard
                icon={AlertCircle}
                label="Error Rate"
                value={`${stats.errorRate}%`}
                color={parseFloat(stats.errorRate) > 10 ? 'red-500' : 'gold'}
              />
              <StatCard
                icon={DollarSign}
                label="Total Cost"
                value={`$${stats.totalCost}`}
                subValue="API costs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  Event Counts
                </h2>
                <div className="space-y-3">
                  {Object.entries(stats.eventCounts || {}).map(([event, count]) => (
                    <div key={event} className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{event}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
                  {Object.keys(stats.eventCounts || {}).length === 0 && (
                    <div className="text-gray-500 text-sm">No events recorded</div>
                  )}
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gold" />
                  Daily Costs
                </h2>
                <div className="space-y-3">
                  {(stats.dailyCosts || []).map(({ date, cost }) => (
                    <div key={date} className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{date}</span>
                      <span className="text-white font-medium">${cost}</span>
                    </div>
                  ))}
                  {(stats.dailyCosts || []).length === 0 && (
                    <div className="text-gray-500 text-sm">No cost data</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h2>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.eventCounts?.upload || 0}
                  </div>
                  <div className="text-xs text-gray-500">Uploads</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.eventCounts?.generate_start || 0}
                  </div>
                  <div className="text-xs text-gray-500">Started</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">
                    {stats.eventCounts?.generate_success || 0}
                  </div>
                  <div className="text-xs text-gray-500">Success</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.eventCounts?.share || 0}
                  </div>
                  <div className="text-xs text-gray-500">Shared</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
