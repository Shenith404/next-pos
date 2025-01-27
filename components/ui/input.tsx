'use client'
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


export const CustomInput = ({
  type,
  name,
  value,
  onchange,
  placeholder,
  label,
  errors,
  className,
}:
  {
    type: string,
    name: string,
    value: any,
    onchange: any,
    placeholder: string,
    label?: string,
    errors?: any,
    className?: string
  }
) => {

  return (
    <div className={className ? className : "p-2 border bg-gray-50  rounded-md"}>
      {label && <h1 className="mb-1 text-sm font ">{label}</h1>}
      <Input

        type={type}
        name={name}
        onChange={onchange as any}
        value={value}
        placeholder={placeholder}
        className={errors !== undefined ? "border-red-600" : "" + className}
      >
      </Input>
      {errors && <p className="text-red-600 py-1">{errors}</p>}

    </div>
  )
}

export default CustomInput