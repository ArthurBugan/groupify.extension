import type { PlasmoCSConfig } from "plasmo"
import { MdOutlineSecurity } from "react-icons/md"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"

import "~base.css"
import "~style.css"

import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: [
    "https://youtube.com/*",
    "https://www.youtube.com/*",
    "https://www.groupify.dev/*",
    "https://groupify.dev/*"
  ],
  all_frames: true
}

function Popup() {
  const [session] = useStorage("authorization")

  console.log("session", session)

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document.querySelector("html").classList.add("dark")
    }

    ;(async () => {
      if (session === null) {
        window.open("https://groupify.dev/dashboard/groups")
      }

      if (session) {
        console.log("sidebar", session)
      }
    })()
  }, [session])

  if (!session) {
    return (
      <div className="flex h-96 w-96 flex-col items-center justify-center bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mx-4 space-y-4 w-full max-w-md rounded-lg items-center justify-center bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8">
          <MdOutlineSecurity size={24} className="dark:text-gray-50 m-auto" />
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300">
              Please login to continue
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              You need to authenticate to access this information.
            </p>
          </div>
          <div>
            <Button variant="default" className="w-full">
              <a
                className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
                target="_blank"
                href="https://groupify.dev/login">
                Login
              </a>
            </Button>
            <div className="text-center text-lg text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <a
                className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
                target="_blank"
                href="https://groupify.dev/register">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-80 w-80 flex-col items-center justify-center bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300">
          You are authenticated!
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          You can now organize your subscriptions
        </p>
      </div>
      <Button
        className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
        variant="link">
        <a target="_blank" href="https://groupify.dev/dashboard/groups">
          Go to Dashboard
        </a>
      </Button>
    </div>
  )
}

export default Popup
