import { Storage } from "@plasmohq/storage"

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  const storage = new Storage();

  if (request.name === "save-auth") {
    await storage.set("authorization", request.body.token);
  }

  sendResponse({ status: [] });
});