import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { useEffect } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { supabase } from "~core/store"
import { useSupabase } from "~lib/hooks"
import { sleep } from "~lib/utils"

import GroupItem from "./GroupItem"

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
  const [session] = useStorage("user-data")

  const { data } = useSupabase("groups")

  useEffect(() => {
    if (modal) {
      setChannelsModal(false)
    }

    ;(async () => {
      if (session) {
        const { data, error: errorSession } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })

        if (errorSession) {
          alert(errorSession)
          return
        }

        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document
            .querySelectorAll("plasmo-csui")
            .forEach((e) => e.classList.add("dark"))
        }
      }
    })()
  }, [session])

  const toggleChannels = () => {
    setChannelsModal((p) => !p)
  }

  console.log(data, "data")

  return (
    <div className="flex gap-y-4 w-full">
      <Collapsible className="w-full group">
        <div className="px-4 my-3 flex flex-row items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost">
              <BiChevronRight
                size={16}
                className="transition-all text-primary group-data-[state='open']:rotate-90"
              />
            </Button>
          </CollapsibleTrigger>
          <p className="text-xl text-primary">My groups</p>

          <Button onClick={toggleChannels} variant="ghost">
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
