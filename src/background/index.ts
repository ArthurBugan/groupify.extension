import { Storage } from "@plasmohq/storage"

export { };

console.log("background");

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  const storage = new Storage();

  console.log(request, sender);
  if (request.name === "save-auth") {
    await storage.set("authorization", request.body.token);
  }

  sendResponse({ status: [] });
});