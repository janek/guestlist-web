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
    
    console.log('Success! RA tickets data:')
    console.log(`  Total sold: ${data.total_sold}`)
    console.log(`  Total allocation: ${data.total_allocation}`)
    
    if (data.total_allocation > 0) {
      const percentage = ((data.total_sold / data.total_allocation) * 100).toFixed(1)
      console.log(`  Sold percentage: ${percentage}%`)
    }
    
  } catch (error) {
    console.error('Failed to fetch RA tickets data:')
    console.error(error instanceof Error ? error.message : String(error))
    
    console.log('\nTo refresh the RA token:')
    console.log('  1. Go to https://ra.co/pro/events/2190534/overview (logged in)')
    console.log('  2. Open DevTools -> Network tab')
    console.log('  3. Filter by "query"')
    console.log('  4. Copy the Bearer token from Authorization header')
    console.log('  5. Update RA_API_TOKEN in your .env.local file')
    console.log('  6. Restart dev server and test /count')
    console.log('  7. Update token in deployment and redeploy')
    
    process.exit(1)
  }
}

testRaTickets() 