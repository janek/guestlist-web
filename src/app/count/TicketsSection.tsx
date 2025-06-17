'use client'

import { useEffect, useState } from 'react'

type TicketData = {
  total_sold: string
  total_allocation: string
}

function useAnimatedCounter(target: number, duration: number = 500) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setCurrent(0)
      return
    }

    const startTime = Date.now()
    const startValue = current

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(startValue + (target - startValue) * easeOut)
      
      setCurrent(value)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [target, duration])

  return current
}

function GradientProgress({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function TicketsSection() {
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/ra-tickets')
        
        if (!response.ok) {
          throw new Error('Failed to fetch ticket data')
        }
        
        const data = await response.json()
        setTicketData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTicketData()
  }, [])

  const sold = ticketData ? parseInt(ticketData.total_sold) : 0
  const total = ticketData ? parseInt(ticketData.total_allocation) : 0
  const ticketPercentage = total > 0 ? (sold / total) * 100 : 0

  const animatedSold = useAnimatedCounter(sold)
  const animatedPercentage = useAnimatedCounter(ticketPercentage)

  if (loading) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
        <div className="space-y-3 max-w-64 mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
        <div className="space-y-3 max-w-64 mx-auto">
          <GradientProgress value={0} />
          <p className="text-xs text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!ticketData) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
        <div className="space-y-3 max-w-64 mx-auto">
          <GradientProgress value={0} />
          <p className="text-xs text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
      <div className="space-y-3 max-w-64 mx-auto">
        <GradientProgress value={animatedPercentage} />
        <p className="text-sm text-gray-600 font-medium font-mono">
          {animatedSold}/{total}
        </p>
      </div>
    </div>
  )
} 