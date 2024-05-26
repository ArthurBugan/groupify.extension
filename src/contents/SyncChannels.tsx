import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Toaster } from "~/components/ui/toasters"
import { useToast } from "~/components/ui/use-toast"
import { useCreateDialog } from "~/core/store"

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
  return document.querySelector("body")
}

const ManageChannels = (props) => {
  const [session] = useStorage("authorization")
  const isOpen = useCreateDialog((state) => state.isOpen)

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
    })()
  }, [session])

  if (!isOpen) {
    return null
  }

  return (
    <div className="h-60 w-60">
      <Toaster />
    </div>
  )
}

export default ManageChannels
