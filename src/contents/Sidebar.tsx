import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

import { useToast } from "~/components/ui/use-toast"
import { useCreateDialog } from "~/core/store"
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
  const [isUploading, setUploading] = useState(false)
  const { toast, dismiss } = useToast()
  const toggleOpen = useCreateDialog((state) => state.toggleOpen)
  const { data, loading } = useGroupifyStorage("groups", null, session)

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document
        .querySelectorAll("plasmo-csui")
        .forEach((e) => e.classList.add("dark"))
    }
  }, [session])

  if (isUploading) {
    return (
      <div className="w-full flex flex-col mt-2">
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-3" />

        <div className="flex gap-y-4 w-full">
          <div className="w-full px-4 my-3 flex items-center">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
            <p className="text-xl text-primary m-auto">
              {chrome.i18n.getMessage("sidebar_loading")}
            </p>
          </div>
        </div>
      </div>
    )
  }

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
                window.open("https://groupify.dev/dashboard/groups")
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
              className="w-full flex items-center justify-start dark:hover:bg-slate-900"
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
            className="dark:hover:bg-slate-900"
            onClick={() => window.open("https://groupify.dev/dashboard/groups")}
            variant="ghost">
            <BiFolderPlus size={16} className="text-primary" />
          </Button>
        </div>

        <CollapsibleContent className="space-y-2">
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-black dark:text-white"
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
          {!data?.length && !loading && (
            <span className="px-4 my-2 flex flex-row items-center justify-between text-primary text-sm">
              {chrome.i18n.getMessage("sidebar_groups_not_found")}
            </span>
          )}
          {data?.map?.((g) => (
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
