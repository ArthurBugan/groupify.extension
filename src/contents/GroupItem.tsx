import type { PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiEdit } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { DynamicIcon } from "~components/ui/icon"
import { supabase } from "~core/store"
import { type GroupType, useSupabase } from "~lib/hooks"
import { getFamily } from "~lib/utils"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return null
}

const GroupItem: React.FC<GroupType> = (g) => {
  const [modal, setOpen] = useStorage("edit-channels-modal", false)
  const [values, setFormValues] = useStorage("form-values", {})

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { data, loading } = useSupabase("channels", ["group_id", g.id], isOpen)

  const toggleEditDialog = () => {
    setOpen((p) => !p)
  }

  const editItem = async () => {
    if (!data.length) {
      const { data } = await supabase
        .from("channels")
        .select()
        .eq("group_id", g.id)
    }

    await setFormValues({ channels: data, ...g })
    toggleEditDialog()
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full group/child">
      <div className="px-4 my-2 flex flex-row items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost">
            <BiChevronRight
              size={16}
              className="transition-all text-primary group-data-[state='open']/child:rotate-90"
            />
          </Button>
        </CollapsibleTrigger>

        <p className="text-primary truncate text-lg">{g.name}</p>
        <DynamicIcon lib={getFamily(g.icon)} icon={g.icon} />

        <Button variant="ghost">
          <BiEdit
            onClick={editItem}
            size={16}
            className="transition-all text-primary"
          />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="pl-8 pr-2 my-1 gap-y-6 flex flex-col items-start justify-between">
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {!loading && !data.length && (
            <span className="text-primary text-sm">No channels found</span>
          )}
          {!loading &&
            data.map((c) => (
              <a
                key={c.id}
                href={`/channel/${c.id}/videos`}
                data-external-id={c.id}
                className="cursor-pointer flex flex-row gap-x-2 items-center justify-start"
                id={c.id}>
                <img className="rounded-full w-6 h-6" src={c.thumbnail} />
                <p className="text-primary text-xl">{c.name}</p>
              </a>
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default GroupItem
