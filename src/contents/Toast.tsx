import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { Toaster } from "react-hot-toast"

import "~base.css"
import "~style.css"

export const getOverlayAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector("body")
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

const Toast = () => <Toaster position="top-left" />

export default Toast
