"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

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

export function ComboboxDemo({ items }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  console.log(value, "value")

  const item = items.find(
    (framework) => framework.value.toLowerCase() === value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant="outline"
          size={"lg"}
          role="combobox"
          aria-expanded={open}
          className="justify-between text-primary w-full text-xl">
          {value ? (
            <p className="flex flex-row items-center justify-center">
              <span>{item.label}</span>
              {item?.icon}
            </p>
          ) : (
            "Select icon..."
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
                className="w-full"
                key={framework.value}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue === value.toLocaleLowerCase()
                      ? ""
                      : currentValue
                  )
                  setOpen(false)
                }}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {framework.label}
                {framework.icon}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
