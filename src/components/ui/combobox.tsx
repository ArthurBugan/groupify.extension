import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { useController, useFormContext } from "react-hook-form"
import { VirtuosoGrid } from "react-virtuoso"

import { Button } from "~components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "~components/ui/command"
import {
  DynamicIcon,
  type Library,
  LibraryIcons,
  returnLibraryIcons
} from "~components/ui/icon"
import { Popover, PopoverContent, PopoverTrigger } from "~components/ui/popover"
import { cn, getFamily } from "~lib/utils"

interface ComboboxProps {
  className?: string
  name: string
}

const ComboboxDemo: React.FC<ComboboxProps> = ({ name, className }) => {
  const [open, setOpen] = React.useState(false)
  const formContext = useFormContext()

  const itemsCount = React.useMemo(() => {
    return Object.keys(LibraryIcons)
      .map((framework) => Object.keys(returnLibraryIcons(framework as Library)))
      .flat().length
  }, [])

  const items = React.useMemo(() => {
    return Object.keys(LibraryIcons)
      .map((framework) => Object.keys(returnLibraryIcons(framework as Library)))
      .flat()
  }, [])

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
              <span className="hidden">{field.value}</span>
              <DynamicIcon lib={getFamily(field.value)} icon={field.value} />
            </p>
          ) : (
            chrome.i18n.getMessage("combobox_placeholder")
          )}
          <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[290px] p-0 bg-primary">
        <Command className="w-full">
          <CommandInput
            placeholder={chrome.i18n.getMessage("combobox_placeholder")}
          />
          <CommandEmpty>
            {chrome.i18n.getMessage("combobox_no_items_found")}
          </CommandEmpty>

          <CommandGroup>
            <VirtuosoGrid
              className="virtuoso-scroller"
              listClassName="grid grid-cols-4"
              totalCount={itemsCount}
              itemContent={(index) => {
                return (
                  <CommandItem
                    className="w-full justify-center items-center"
                    key={items[index]}
                    title={items[index]}
                    value={items[index]}
                    onSelect={() => {
                      field.onChange(items[index])
                      setOpen(false)
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === items[index]
                          ? "opacity-100"
                          : "hidden opacity-0"
                      )}
                    />
                    <DynamicIcon
                      size={24}
                      lib={getFamily(items[index])}
                      className="text-primary"
                      icon={items[index]}
                    />
                  </CommandItem>
                )
              }}
            />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboboxDemo
