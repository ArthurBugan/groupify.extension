import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiEdit } from "react-icons/bi"

import { Button } from "~components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~components/ui/collapsible"
import { type GroupType, useGroupifyStorage } from "~lib/hooks"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return null
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

const GroupItem: React.FC<GroupType> = (g) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [localData, setLocalData] = useState<any[]>([])
  const { data, loading } = useGroupifyStorage("channels", g.id, isOpen)

  useEffect(() => {
    if (!loading && localData.length === 0) {
      setLocalData(data)
    }
  }, [loading])

  useEffect(() => {
    if (!isOpen) {
      setLocalData([])
    }
  }, [isOpen])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/child">
      <div className="px-4 gap-x-2 my-2 flex flex-row items-center justify-start">
        <CollapsibleTrigger asChild>
          <Button
            className="dark:hover:bg-slate-900 w-full flex items-center justify-start"
            variant="ghost">
            <BiChevronRight
              size={16}
              className="text-black dark:text-white transition-all text-primary group-data-[state='open']/child:rotate-90"
            />
            <div className="gap-x-2 flex flex-row">
              <img
                className={"text-2xl text-primary text-black dark:text-white"}
                src={`https://api.iconify.design/${g.icon.replace(
                  ":",
                  "/"
                )}.svg`}
              />
              <p className="text-black dark:text-white line-clamp-1 text-primary truncate text-lg">
                {g.name}
              </p>
            </div>
          </Button>
        </CollapsibleTrigger>

        <Button variant="ghost" className="ml-auto">
          <BiEdit
            onClick={() => window.open("https://groupify.dev/dashboard/groups")}
            size={16}
            className="transition-all dark:hover:bg-slate-900 text-primary text-black dark:text-white"
          />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="pl-8 pr-2 my-1 gap-y-1 flex flex-col items-start justify-between">
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

          {!loading && !data.length && (
            <span className="text-primary text-sm text-black dark:text-white">
              {chrome.i18n.getMessage("group_item_not_found")}
            </span>
          )}

          {!loading &&
            localData.map((c) => (
              <a
                key={c.id}
                href={
                  /iPad|iPhone/.test(navigator.platform)
                    ? `youtube://${
                        c.channelId.includes("@")
                          ? `/@${c.channelId?.split("@")[1]}/videos`
                          : `/channel/${
                              c.channelId?.split("/")[1] || c.channelId
                            }/videos`
                      }`
                    : c.channelId.includes("@")
                    ? `https://youtube.com/@${
                        c.channelId?.split("@")[1]
                      }/videos`
                    : `https://youtube.com/channel/${
                        c.channelId?.split("/")[1] || c.channelId
                      }/videos`
                }
                target="_blank"
                data-external-id={c.id}
                className="hover:bg-accent dark:hover:bg-slate-900 flex-1 w-full rounded-lg cursor-pointer text-black dark:text-white"
                id={c.id}>
                <div className="px-2 gap-x-2 my-2 flex flex-row items-center justify-start">
                  <img className="rounded-full w-6 h-6" src={c.thumbnail} />
                  <p className="text-primary text-xl text-black dark:text-white">
                    {c.name}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default GroupItem
