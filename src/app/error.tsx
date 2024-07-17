'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          {process.env.NODE_ENV === 'development' 
            ? `An error occurred: ${error.message}\n\nStack trace:\n${error.stack}`
            : "We're sorry, but there was an error processing your request. Please try again later."}
        </AlertDescription>
      </Alert>
    </div>
  )
}
