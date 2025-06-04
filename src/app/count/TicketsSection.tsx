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
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets</h2>
        <p className="text-xs text-gray-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets</h2>
        <p className="text-xs text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!ticketData) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets</h2>
        <p className="text-xs text-gray-500">No data available</p>
      </div>
    )
  }

  const sold = parseInt(ticketData.total_sold)
  const total = parseInt(ticketData.total_allocation)
  const ticketPercentage = total > 0 ? (sold / total) * 100 : 0

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Tickets</h2>
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