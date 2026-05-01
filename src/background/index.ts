declare const browser: any

if (typeof chrome !== "undefined" && chrome.sidePanel) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
}

if (typeof browser !== "undefined") {
  if (browser.sidebarAction) {
    browser.sidebarAction
      .setPanel({ panel: "sidepanel.html" })
      .catch((e: any) => console.error(e))
  }
  if (browser.browserAction) {
    browser.browserAction.onClicked.addListener(() => {
      if (browser.sidebarAction) {
        browser.sidebarAction.open()
      }
    })
  }
}
