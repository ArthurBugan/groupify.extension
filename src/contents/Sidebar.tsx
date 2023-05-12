import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { supabase } from "~core/store"

import GroupItem from "./GroupItem"

export interface GroupType {
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
  const [groups, setGroups] = useState<GroupType[] | { [x: string]: any }[]>([])

  const [session, setSession] = useStorage("user-data", null)

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
      if (session !== null) {
        const { data, error: errorSession } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })

        if (errorSession) {
          alert(errorSession)
          return
        }

        const { data: groups, error: groupsError } = await supabase
          .from("groups")
          .select()

        if (groupsError) {
          alert(groupsError)
        }

        setGroups(groups)
      }
    })()
  }, [session])

  const toggleChannels = () => {
    toast.custom((t) => (
      <div
        className={`bg-background px-6 py-4 shadow-md rounded-full text-2xl text-primary ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}>
        New Group created! ✅
      </div>
    ))
    setChannelsModal((p) => !p)
  }

  return (
    <div className="flex gap-y-4 w-full">
      <Collapsible className="w-full group">
        <div className="px-6 my-4 flex flex-row items-center justify-between">
          <CollapsibleTrigger as="div">
            <Button variant="ghost">
              <BiChevronRight
                size={20}
                className="transition-all text-primary group-data-[state='open']:rotate-90"
              />
            </Button>
          </CollapsibleTrigger>
          <p className="text-2xl text-primary">My </p>

          <Button onClick={toggleChannels} variant="ghost">
            <BiFolderPlus size={20} className="text-primary" />
          </Button>
        </div>

        <CollapsibleContent className="space-y-2">
          {groups.map((g) => (
            <GroupItem key={g.id} {...g} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default Groups
