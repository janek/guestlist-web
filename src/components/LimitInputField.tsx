import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"

type CustomControl = Control<{
  limit_free: number 
  limit_half: number 
  limit_skip: number
  organisation?: string
}>
const LimitInputField = ({
  control,
  name,
  label,
}: {
  control: CustomControl
  name: "limit_free" | "limit_half" | "limit_skip"
  label: string
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="text-left">
          <FormLabel htmlFor={`${name}-input`}>{label}</FormLabel>
          <FormControl>
            <Input
              id={`${name}-input`}
              type="number"
              min="0"
              placeholder="0"
              {...field}
              value={
                field.value === 0 || field.value === null ? "" : field.value
              }
              onChange={(e) =>
                field.onChange(
                  e.target.value ? Number.parseInt(e.target.value, 10) : 0,
                )
              }
              className="w-20"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default LimitInputField
