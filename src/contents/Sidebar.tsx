import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { useGroupifyStorage } from "~lib/hooks"
import { sleep } from "~lib/utils"

import GroupItem from "./GroupItem"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("ytd-guide-entry-renderer:nth-child(3)")
}

const Sidebar = () => {
  const [session] = useStorage("authorization")
  const { data } = useGroupifyStorage("groups", null, session)

  useEffect(() => {
    ;(async () => {
      if (document.querySelector("html[dark]") != null) {
        document
          .querySelectorAll("plasmo-csui")
          .forEach((e) => e.classList.add("dark"))
      }
    })()
  }, [session])

  console.log("session sidebar", session)

  if (!session) {
    return (
      <div className="w-full flex flex-col">
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-3" />

        <div className="flex gap-y-4 w-full">
          <div className="w-full px-4 my-3 flex items-center">
            <Button
              variant="destructive"
              className="text-xl text-primary m-auto"
              onClick={() =>
                window.open("https://groupify.dev/dashboard/channels")
              }>
              {chrome.i18n.getMessage("sidebar_unauthorized")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
                <p className="text-xl text-primary">
                  {chrome.i18n.getMessage("sidebar_groups")}
                </p>
              </div>
            </Button>
          </CollapsibleTrigger>

          <Button
            onClick={() => window.open("https://groupify.dev/dashboard/groups")}
            variant="ghost">
            <BiFolderPlus size={16} className="text-primary" />
          </Button>
        </div>

        <CollapsibleContent className="space-y-2">
          {!data?.length && (
            <span className="px-4 my-2 flex flex-row items-center justify-between text-primary text-sm">
              {chrome.i18n.getMessage("sidebar_groups_not_found")}
            </span>
          )}
          {data?.map((g) => (
            <div key={g.id}>
              <GroupItem {...g} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default Sidebar
