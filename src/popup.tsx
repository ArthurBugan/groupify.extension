import type { Session } from "@supabase/supabase-js"
import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "./core/store"

function IndexOptions() {
  const [session] = useStorage<Session>("user-data", (userData: Session) =>
    typeof userData === "undefined" ? null : userData
  )

  const [email, setEmail] = useState("")

  const handleLogin = async (type: "LOGIN" | "SIGNUP", email: string) => {
    try {
      const {
        error,
        data: { user, session }
      } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo:
            "chrome-extension://eigbphlpbefiaehoamaanpjpmmgcnaam/options.html"
        }
      })

      if (error) {
        alert("Error with auth: " + error.message)
      } else if (!user) {
        alert("Signup successful, confirmation mail should be sent soon!")
      }
    } catch (error) {
      console.log("error", error)
      alert(error.error_description || error)
    }
  }

  console.log(session?.user, "session")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      {session?.user && (
        <div>
          {session?.user.email} - {session?.user?.id}
        </div>
      )}
      {!session && (
        <div>
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                handleLogin("SIGNUP", email)
              }}
              className="bg-indigo-700 hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-indigo-600 hover:text-white">
              Enter with magic link!
            </button>
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
