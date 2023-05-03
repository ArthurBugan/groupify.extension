import "../base.css"

import cssText from "data-text:../style.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { BiChevronRight } from "react-icons/bi"

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
  return (
    <div className="px-8 my-2 flex flex-row">
      <p className="text-2xl dark:text-white text-black">
        Manage Subscriptions
      </p>
      <BiChevronRight size={20} className="dark:text-white text-black m-auto" />
    </div>
  )
}

export default Groups
