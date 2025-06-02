import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  allowPasswordManager?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, allowPasswordManager = false, ...props }, ref) => {
    const passwordManagerProps = allowPasswordManager ? {} : {
      autoComplete: "off",
      "data-1p-ignore": true,
      "data-lpignore": true,
      "data-form-type": "other"
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-base",
          className,
        )}
        ref={ref}
        {...passwordManagerProps}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
