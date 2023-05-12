"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { useController, useFormContext } from "react-hook-form"

import { Button } from "~components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "~components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~components/ui/popover"
import { cn } from "~lib/utils"

interface ComboboxProps {
  items: any[]
  className: string
  name: string
}

export function ComboboxDemo({ items, name, className }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const formContext = useFormContext()

  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { isSubmitting }
  } = useController({ name })

  if (!formContext || !name) {
    const msg = !formContext
      ? "ComboBox must be wrapped by the FormProvider"
      : "Name must be defined"
    console.error(msg)
    return null
  }

  const item = items.find(
    (framework) => framework.value.toLowerCase() === field.value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className} asChild>
        <Button
          variant="outline"
          size={"lg"}
          role="combobox"
          aria-expanded={open}
          className="justify-between text-primary w-full text-xl">
          {field.value ? (
            <p className="flex flex-row items-center justify-center">
              <span className="hidden">{item.label}</span>
              {item?.icon}
            </p>
          ) : (
            "Icon..."
          )}
          <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[290px] p-0 bg-primary">
        <Command className="w-full">
          <CommandInput placeholder="Search icon..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandGroup>
            {items.map((framework) => (
              <CommandItem
                className="w-full justify-center items-center"
                key={framework.value}
                title={framework.label}
                onSelect={(currentValue) => {
                  field.onChange(currentValue)
                  setOpen(false)
                }}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    field.value === framework.value.toLowerCase()
                      ? "opacity-100"
                      : "hidden opacity-0"
                  )}
                />
                <div className="hidden">{framework.label}</div>
                {framework.icon}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
