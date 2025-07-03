#!/usr/bin/env bun

async function testRaTickets() {
  try {
    console.log('Testing RA tickets API...')
    
    const response = await fetch('http://localhost:3000/api/ra-tickets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('✓ Success! RA tickets data:')
    console.log(`  Total sold: ${data.total_sold}`)
    console.log(`  Total allocation: ${data.total_allocation}`)
    
    if (data.total_allocation > 0) {
      const percentage = ((data.total_sold / data.total_allocation) * 100).toFixed(1)
      console.log(`  Sold percentage: ${percentage}%`)
    }
    
  } catch (error) {
    console.error('✗ Failed to fetch RA tickets data:')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

testRaTickets() 