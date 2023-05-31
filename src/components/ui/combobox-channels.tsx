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
  CommandItem,
  CommandList
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
  const [filter, setFilter] = React.useState<string>("")
  const formContext = useFormContext()
  const timer = React.useRef(null)

  const dbRef = React.useRef(null)
  const itemsRef = React.useRef(null)

  React.useEffect(() => {
    indexedDB.databases().then((databases) => {
      const database = databases
        .filter((d) => d.name.includes("yt-it-response-store"))
        .sort((a, b) => a.name.length - b.name.length)[0]

      let db
      const request = indexedDB.open(database.name)

      request.onerror = (event) => {
        console.error("Why didn't you allow my web app to use IndexedDB?!")
      }

      request.onsuccess = (event) => {
        db = event.target.result

        const transaction = db.transaction(["ResponseStore"], "readwrite")
        const objectStore = transaction.objectStore("ResponseStore")

        const objectStoreRequest = objectStore.get([
          "service:guide:fallback",
          1
        ])

        objectStoreRequest.onsuccess = (event) => {
          const result =
            event.target.result.innertubeResponse.items[1]
              .guideSubscriptionsSectionRenderer.items

          dbRef.current =
            result[
              result.length - 1
            ].guideCollapsibleEntryRenderer.expandableItems
        }
      }
    })

    itemsRef.current = JSON.parse(
      document.querySelector("html").getAttribute("ysm-guide-data")
    )
  }, [])

  const itemsCount = React.useMemo(() => {
    const filterCount = (items) => {
      return items.filter((i) =>
        i.guideEntryRenderer.formattedTitle.simpleText
          .toLowerCase()
          .includes(filter.toLowerCase())
      ).length
    }

    if (itemsRef.current == null) {
      if (filter.length > 0) {
        return filterCount(dbRef.current)
      }

      return dbRef.current?.length || 0
    }

    const item =
      itemsRef.current.items[1].guideSubscriptionsSectionRenderer.items
    const values =
      item[item.length - 1].guideCollapsibleEntryRenderer.expandableItems
    values.pop()

    if (filter.length > 0) {
      return filterCount(values)
    }

    return values.length
  }, [itemsRef.current, dbRef.current, filter])

  const items = React.useMemo(() => {
    const filterCount = (items) => {
      return items.filter((i) =>
        i.guideEntryRenderer.formattedTitle.simpleText
          .toLowerCase()
          .includes(filter.toLowerCase())
      )
    }

    if (itemsRef.current == null) {
      if (filter.length > 0) {
        return filterCount(dbRef.current)
      }

      return dbRef.current
    }

    const item =
      itemsRef.current.items[1].guideSubscriptionsSectionRenderer.items

    const values =
      item[item.length - 1].guideCollapsibleEntryRenderer.expandableItems
    values.pop()

    if (filter.length > 0) {
      return filterCount(values)
    }

    return values
  }, [itemsRef.current, dbRef.current, , filter])

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
            <p className="h-14 flex items-center">
              {chrome.i18n.getMessage("combobox_channels_placeholder")}
            </p>
          )}
          <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[290px] p-0 bg-primary">
        <Command className="w-full">
          <input
            className="flex h-14 w-full rounded-md border border-input bg-transparent px-3 text-primary py-2 text-xl ring-offset-background file:border-0 file:bg-transparent file:text-xl file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              clearTimeout(timer.current)

              timer.current = setTimeout(() => {
                setFilter(e.target.value)
                clearTimeout(timer.current)
              }, 500)
            }}
            placeholder={chrome.i18n.getMessage(
              "combobox_channels_placeholder"
            )}
          />

          <CommandList>
            <CommandEmpty>
              {chrome.i18n.getMessage("combobox_channels_no_items_found")}
            </CommandEmpty>
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
                    title={item?.formattedTitle?.simpleText}
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
                      className="h-10 w-10 rounded-full"
                    />
                    <p>{item?.formattedTitle?.simpleText}</p>
                  </CommandItem>
                )
              }}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboboxDemo
