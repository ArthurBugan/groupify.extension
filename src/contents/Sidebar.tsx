import cssText from "data-text:../base.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { supabase, useCreateDialog } from "~core/store"
import { useGroups } from "~core/store"
import { useSupabase } from "~lib/hooks"
import { sleep } from "~lib/utils"

import GroupItem from "./GroupItem"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("#sections > .style-scope")
}

const Groups = () => {
  const [session] = useStorage("user-data")
  const groups = useGroups()
  const { data } = useSupabase("groups", null)
  const dialog = useCreateDialog()

  useEffect(() => {
    ;(async () => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document
          .querySelectorAll("plasmo-csui")
          .forEach((e) => e.classList.add("dark"))
      }

      if (session) {
        const { data, error: errorSession } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })

        if (errorSession) {
          alert(errorSession)
          return
        }
      }
    })()
  }, [session])

  return (
    <div className="flex gap-y-4 w-full">
      <Collapsible className="w-full group">
        <div className="px-4 my-3 flex flex-row items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              className="w-full flex items-center justify-start"
              variant="ghost">
              <div className="gap-x-2 flex flex-row">
                <BiChevronRight
                  size={18}
                  className="transition-all text-primary group-data-[state='open']:rotate-90"
                />
                <p className="text-xl text-primary">My groups</p>
              </div>
            </Button>
          </CollapsibleTrigger>

          <Button onClick={dialog.toggleOpen} variant="ghost">
            <BiFolderPlus size={16} className="text-primary" />
          </Button>
        </div>

        <CollapsibleContent className="space-y-2">
          {!data.length && (
            <span className="px-4 my-2 flex flex-row items-center justify-between text-primary text-sm">
              No groups found
            </span>
          )}
          {data.map((g) => (
            <div key={g.id}>
              <GroupItem {...g} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default Groups
