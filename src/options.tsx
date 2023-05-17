import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/store"

function IndexOptions() {
  const [session, setSession] = useStorage("user-data")

  useEffect(() => {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      {session?.user && (
        <div>
          {session.user.id} - {session.user?.email}
        </div>
      )}
      {!session && (
        <div>
          <div className="mb-4">Hello not logged in</div>
          <div className="flex flex-col gap-2">
            <a
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
