'use client'

import { useEffect, useState } from 'react'

type TicketData = {
  total_sold: string
  total_allocation: string
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

  if (loading) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-gray-300 animate-pulse" />
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
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2" />
          <p className="text-xs text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!ticketData) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2" />
          <p className="text-xs text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  const sold = parseInt(ticketData.total_sold)
  const total = parseInt(ticketData.total_allocation)
  const ticketPercentage = total > 0 ? (sold / total) * 100 : 0

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets sold</h2>
      <div className="space-y-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-gray-500 to-gray-700"
            style={{ width: `${ticketPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 font-medium">
          {sold}/{total}
        </p>
      </div>
    </div>
  )
} 