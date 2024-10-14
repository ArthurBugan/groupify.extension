import type { PlasmoCSConfig } from "plasmo"
import { MdOutlineSecurity } from "react-icons/md"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import { useGroupifyStorage } from "~lib/hooks"

import GroupItem from "./contents/GroupItem"

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
  const { data } = useGroupifyStorage("groups", null, session)

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document.querySelector("html").classList.add("dark")
    }

    ;(async () => {
      if (session === null) {
        window.open("https://groupify.dev/dashboard/groups")
      }
    })()
  }, [session])

  if (!session) {
    return (
      <div className="flex w-[350px] h-96 flex-col items-center justify-center bg-white p-6 shadow-lg dark:bg-gray-800">
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
    <>
      <div className="flex w-[350px] h-full gap-y-4 flex-col bg-white p-6 dark:bg-gray-800">
        {!data?.length && (
          <span className="w-[300px] px-4 my-2 flex flex-row items-center justify-between text-black dark:text-white text-primary text-sm">
            {chrome.i18n.getMessage("sidebar_groups_not_found")}
          </span>
        )}
        {data?.map((g) => (
          <div className="w-[300px]" key={g.id}>
            <GroupItem {...g} />
          </div>
        ))}
      </div>
    </>
  )
}

export default Popup
