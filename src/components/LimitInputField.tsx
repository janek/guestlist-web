import React from 'react';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"; 
import { Input } from "@/components/ui/input";
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form';

const LimitInputField = ({ control, name, label }: { control: Control, name: 'limit_free' | 'limit_half' | 'limit_skip', label: string }) => {
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
              placeholder='0'
              {...field}
              value={field.value === 0 ? '' : field.value}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? parseInt(e.target.value, 10) : 0,
                )
              }
              className="w-20"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LimitInputField;
