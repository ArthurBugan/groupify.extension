import * as React from "react"
import { useController, useFormContext } from "react-hook-form"

import { cn } from "~lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, ...props }, ref) => {
    const formContext = useFormContext()

    const {
      field,
      fieldState: { invalid, isTouched, isDirty, error },
      formState: { isSubmitting }
    } = useController({ name })

    if (!formContext || !name) {
      const msg = !formContext
        ? "TextInput must be wrapped by the FormProvider"
        : "Name must be defined"
      console.error(msg)
      return null
    }

    return (
      <div className={className}>
        <input
          name={name}
          onChange={field.onChange}
          onBlur={field.onBlur}
          value={field.value || ""}
          type={type}
          className={cn(
            "flex h-14 w-full rounded-md border border-input bg-transparent px-3 text-primary py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-xl file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="my-1 font-regular text-red-400">
            {error?.message}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
