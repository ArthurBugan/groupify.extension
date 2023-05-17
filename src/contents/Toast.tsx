import cssText from "data-text:../base.css"
import type { PlasmoGetOverlayAnchor } from "plasmo"
import { Toaster } from "react-hot-toast"

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () => {
  return document.querySelector("body")
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Toast = () => <Toaster position="top-left" />

export default Toast
