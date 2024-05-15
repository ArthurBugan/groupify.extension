import type { PlasmoCSConfig } from "plasmo"
import { relayMessage } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"


export const config: PlasmoCSConfig = {
  matches: ["https://localhost/*", "https://groupify.dev/*", "https://www.youtube.com/*", "https://youtube.com/*"]
}

relayMessage({
  name: "save-auth"
});

window.addEventListener("load", async () => {
  console.log(
    "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
  );

  const storage = new Storage({
    area: "local"
  });

  if (!document.location.host.includes("youtube")) {
    return;
  }

  indexedDB.databases().then((databases) => {
    const database = databases
      .filter((d) => d.name.includes("yt-it-response-store"))
      .sort((a, b) => a.name.length - b.name.length)[0]

    let db
    const request = indexedDB.open(database.name)

    request.onerror = (event) => {
      console.error("Why didn't you allow my web app to use IndexedDB?!")
    }

    request.onsuccess = (event) => {
      db = event.target.result

      const transaction = db.transaction(["ResponseStore"], "readwrite")
      const objectStore = transaction.objectStore("ResponseStore")

      const objectStoreRequest = objectStore.get([
        "service:guide:fallback",
        1
      ])

      objectStoreRequest.onsuccess = (event) => {
        const result =
          event.target.result.innertubeResponse.items[1]
            .guideSubscriptionsSectionRenderer.items

        storage.set("channels", result[
          result.length - 1
        ].guideCollapsibleEntryRenderer.expandableItems)
      }
    }
  })
})