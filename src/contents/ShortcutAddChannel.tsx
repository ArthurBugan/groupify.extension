import cssText from "data-text:../style.css"
import { PlusCircle } from "lucide-react"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect } from "react"

import { Button } from "~components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~components/ui/dropdown-menu"
import { useGroups } from "~core/store"
import { useSupabase } from "~lib/hooks"
import { sleep } from "~lib/utils"

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
  sleep(2000)
  if (document.querySelector("html[dark]") != null) {
    document
      .querySelectorAll("plasmo-csui")
      .forEach((e) => e.classList.add("dark"))
  }

  return document.querySelector("#above-the-fold #owner #subscribe-button")
}

const ShortcutAddChannel = () => {
  const { data } = useSupabase("groups", null)

  return (
    <div className="flex flex-row ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-full flex items-center justify-start px-4"
            variant="ghost">
            <PlusCircle size={20} className="mr-2" />
            <p className="text-xl text-primary">
              {" "}
              {chrome.i18n.getMessage("sidebar_groups_shortcut")}
            </p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <>
            <DropdownMenuLabel>
              {" "}
              <p className="text-xl text-primary">
                {chrome.i18n.getMessage("sidebar_groups")}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {data.map((g) => (
              <DropdownMenuItem key={g.id}>
                <Button
                  onClick={() => {
                    console.log(
                      document.querySelector("ytd-video-owner-renderer a")
                        ?.href,
                      document.querySelector("ytd-video-owner-renderer img")
                        .src,
                      document.querySelector(
                        "ytd-video-owner-renderer .yt-formatted-string"
                      ).text
                    )
                  }}
                  className="w-full flex items-center justify-start"
                  variant="ghost">
                  <p className="text-xl text-primary"> {g.name}</p>
                </Button>
              </DropdownMenuItem>
            ))}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ShortcutAddChannel
