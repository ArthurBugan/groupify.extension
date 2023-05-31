import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/store"

import "~base.css"
import "~style.css"

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

function IndexOptions() {
  const [session, setSession] = useStorage("user-data")

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.querySelector("html").classList.add("dark")
    }

    ;(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        alert(error)
        return setSession(error)
      }

      setSession(data.session)
    })()
  }, [])

  return (
    <div className="bg-secondary w-screen h-screen">
      {session?.user && (
        <div>
          {session.user.id} - {session.user?.email}
        </div>
      )}
      {!session && (
        <div>
          <div className="mb-4 text-primary">Hello not logged in</div>
          <div className="flex flex-col gap-2">
            <a
              className="text-primary"
              href="#"
              onClick={() => window.open("https://ko-fi.com/scriptingarthur")}>
              Support me
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexOptions
