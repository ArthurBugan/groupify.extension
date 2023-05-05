import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { useEffect } from "react"
import { BiChevronRight } from "react-icons/bi"

import { useStorage } from "@plasmohq/storage/hook"

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

  useEffect(() => {
    if (modal) {
      setChannelsModal(false)
    }
  }, [])

  console.log(modal)

  return (
    <>
      <div className="px-8 my-2 flex flex-row">
        <p
          className="text-2xl text-primary"
          onClick={() => setChannelsModal((prev) => !prev)}>
          Manage Subscription
        </p>
        <BiChevronRight size={20} className="text-primary m-auto" />
      </div>
    </>
  )
}

export default Groups
