import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.eu.embeddable.com/web-component/v1/query', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzZWN1cml0eVRva2VuSWQiOiJlNGY5NGM5NS0yYzEzLTQwNzMtYTk1NS03ODhiZDhhZWMzZWUiLCJpYXQiOjE3NDg5OTkyNDIsImV4cCI6MTc0OTYwNDA0Mn0.RieURED_SJpcfESLaCe0LaDPuydKvqyfAqQroNpeywo',
        'content-type': 'application/json',
        'origin': 'https://ra.co',
        'referer': 'https://ra.co/',
      },
      body: JSON.stringify({
        inputName: "dataset",
        datasetId: "8a1cd37e-0e2e-4772-b687-8e6995d63352",
        measures: ["events.total_sold", "events.total_allocation"],
        variableValues: {},
        componentId: "cc8ea8c0-3da0-431e-98f5-94a05ae82a35",
        timezone: "Europe/Berlin"
      }),
    })

    if (!response.ok) {
      throw new Error(`RA API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract the ticket data from the response
    if (data.data && data.data.length > 0) {
      const ticketInfo = data.data[0]
      return NextResponse.json({
        total_sold: ticketInfo['events.total_sold'],
        total_allocation: ticketInfo['events.total_allocation']
      })
    } else {
      throw new Error('No ticket data found in response')
    }
  } catch (error) {
    console.error('Error fetching RA ticket data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket data' },
      { status: 500 }
    )
  }
} 