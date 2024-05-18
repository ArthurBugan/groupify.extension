import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { BiChevronRight, BiFolderPlus } from "react-icons/bi"
import { v4 } from "uuid"

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
  const [isUploading, setUploading] = useState(false)
  const { data } = useGroupifyStorage("groups", null, session)

  useEffect(() => {
    ;(async () => {
      if (document.querySelector("html[dark]") != null) {
        document
          .querySelectorAll("plasmo-csui")
          .forEach((e) => e.classList.add("dark"))
      }

      if (!session) {
        return
      }

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

            let items =
              result[result.length - 1].guideCollapsibleEntryRenderer
                .expandableItems

            items.pop()

            items = items.map(({ guideEntryRenderer: item }, index) => {
              return {
                channelId: item.entryData.guideEntryData.guideEntryId,
                id: item.entryData.guideEntryData.guideEntryId,
                name: item.formattedTitle?.simpleText,
                thumbnail: item?.thumbnail?.thumbnails[0].url,
                newContent:
                  item.presentationStyle ===
                  "GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT"
              }
            })

            setUploading(true)
            fetch(
              `${process.env.PLASMO_PUBLIC_GROUPIFY_URL}/youtube-channels`,
              {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(items),
                headers: {
                  "Content-Type": "application/json"
                }
              }
            ).then(() => {
              setUploading(false)
            })
          }
        }
      })
    })()
  }, [session])

  if (isUploading) {
    return (
      <div className="w-full flex flex-col">
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
