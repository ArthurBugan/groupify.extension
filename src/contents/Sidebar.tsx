import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import { supabase } from "~core/store"
import { cn } from "~lib/utils"

interface Group {
  created_at: string
  icon: string
  id: number
  name: string
  user_id: string
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("#sections > .style-scope")
}

const Groups = () => {
  const [modal, setChannelsModal] = useStorage("channels-modal", false)
  const [open, setOpen] = useState(false)

  const [groups, setGroups] = useState<Group[] | { [x: string]: any }[]>([])

  useEffect(() => {
    if (modal) {
      setChannelsModal(false)
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document
        .querySelectorAll("plasmo-csui")
        .forEach((e) => e.classList.add("dark"))
    }

    ;(async () => {
      const { data, error } = await supabase.from("groups").select()
      setGroups(data)
    })()
  }, [])

  const toggleOpen = () => setOpen((p) => !p)
  const toggleChannels = () => setChannelsModal((p) => !p)

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="px-6 my-4 w-full flex flex-row items-center justify-between">
        <Button variant="ghost" onClick={toggleOpen}>
          <BiChevronRight
            size={20}
            className={`transition-all text-primary ${open && "rotate-90"}`}
          />
        </Button>
        <p className="text-2xl text-primary">My groups</p>

        <Button onClick={toggleChannels} variant="ghost">
          <BiFolderPlus size={20} className="text-primary" />
        </Button>
      </div>

      <div
        className={cn(
          "transition-all px-6 my-4 w-full flex flex-row items-center justify-between",
          open ? "block" : "hidden"
        )}>
        {groups.map((g) => (
          <div key={g.id}>
            <p className="text-primary text-2xl">{g.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Groups
