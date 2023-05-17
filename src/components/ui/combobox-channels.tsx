import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import {
  type UseFieldArrayAppend,
  useController,
  useFormContext
} from "react-hook-form"
import { VirtuosoGrid } from "react-virtuoso"

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
  className: string
  name: string
  append: (param: any) => void
}

const ComboboxDemo: React.FC<ComboboxProps> = ({ append, name, className }) => {
  const [open, setOpen] = React.useState(false)
  const formContext = useFormContext()

  const itemsCount = React.useMemo(() => {
    const items = JSON.parse(
      document.querySelector("html").getAttribute("ysm-guide-data")
    )

    return (
      items.items[1].guideSubscriptionsSectionRenderer.items[
        items.items[1].guideSubscriptionsSectionRenderer.items.length - 1
      ].guideCollapsibleEntryRenderer.expandableItems.length - 1
    )
  }, [])

  const items = React.useMemo(() => {
    const items = JSON.parse(
      document.querySelector("html").getAttribute("ysm-guide-data")
    )

    const values =
      items.items[1].guideSubscriptionsSectionRenderer.items[
        items.items[1].guideSubscriptionsSectionRenderer.items.length - 1
      ].guideCollapsibleEntryRenderer.expandableItems

    values.pop()

    return values
  }, [])

  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error },
    formState
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
          className="w-full items-center flex justify-between text-primary text-xl">
          {field.value ? (
            <p className="flex flex-row items-center justify-center">
              <span className="hidden">{field.value}</span>
            </p>
          ) : (
            <p className="h-14 flex items-center">Add a channel...</p>
          )}
          <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[290px] p-0 bg-primary">
        <Command className="w-full">
          <CommandInput placeholder="Search channel..." />
          <CommandEmpty>No channel found.</CommandEmpty>

          <CommandGroup>
            <VirtuosoGrid
              className="virtuoso-scroller"
              listClassName="grid grid-cols-1"
              totalCount={itemsCount}
              itemContent={(index) => {
                const item = items[index].guideEntryRenderer
                return (
                  <CommandItem
                    className="px-4 gap-x-4 w-full flex justify-start items-center"
                    key={item?.entryData?.guideEntryData?.guideEntryId}
                    title={item}
                    onSelect={() => {
                      append({
                        id: item.entryData.guideEntryData.guideEntryId,
                        name: item.formattedTitle?.simpleText,
                        thumbnail: item?.thumbnail?.thumbnails[0].url,
                        new_content:
                          item.presentationStyle ===
                          "GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT"
                      })

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
                    <img
                      src={item?.thumbnail?.thumbnails[0].url}
                      className="h-10 w-10"
                    />
                    <p>{item?.formattedTitle?.simpleText}</p>
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
