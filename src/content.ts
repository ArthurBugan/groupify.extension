import type { PlasmoCSConfig } from "plasmo"
import { relayMessage } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"


export const config: PlasmoCSConfig = {
  matches: ["https://localhost/*", "https://groupify.dev/*", "https://www.youtube.com/*", "https://youtube.com/*"]
}

relayMessage({
  name: "save-auth"
});