import type { PlasmoCSConfig } from "plasmo"
import { relayMessage } from "@plasmohq/messaging"


export const config: PlasmoCSConfig = {
  matches: ["*://localhost/*", "https://groupify.dev/*", "https://www.youtube.com/*", "https://youtube.com/*"]
}

relayMessage({
  name: "save-auth"
});