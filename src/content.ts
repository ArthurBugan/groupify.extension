import type { PlasmoCSConfig } from "plasmo"
import { relayMessage } from "@plasmohq/messaging"


export const config: PlasmoCSConfig = {
  matches: ["https://groupify.dev/*", "https://www.youtube.com/*", "https://youtube.com/*"]
}

relayMessage({
  name: "save-auth"
});

const flag = document.createElement('div');
flag.id = 'groupify-flag';
flag.style.display = 'none';
document.body.appendChild(flag);