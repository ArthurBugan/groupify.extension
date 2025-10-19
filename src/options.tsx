import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "@/components/ui/button"

import "@/style.css"
import { useUser } from "@/hooks/useQuery/useUser"

const schema = z.object({
  email: z.string().email()
})

export type Schema = z.infer<typeof schema>

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

function Options() {
	const { userData, loading: isLoadingUser, error: userError } = useUser();

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document
        .querySelectorAll("plasmo-csui")
        .forEach((e) => e.classList.add("dark"))
    }
  }, [])

  if (!userData) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-primary">
        <div className="shadow-lg bg-primary">
          <Button
            variant="secondary"
            className="w-40 h-24"
            onClick={() =>
              window.open("https://groupify.dev/dashboard/groups")
            }>
            <span className="text-3xl">
              {chrome.i18n.getMessage("sidebar_unauthorized")}
            </span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-primary">
      <div className="p-6 w-full max-w-lg rounded-lg shadow-lg bg-secondary">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight hover:text-gray-700 text-primary">
            Support Groupify through Donations
          </h1>
          <p className="text-primary text-[1.4rem]">
            Groupify is a completely open-source YouTube extension that makes it
            easy to manage your subscriptions. Consider supporting our project
            through a donation.
          </p>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button className="my-5 w-full" variant="secondary">
              <a
                className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 text-primary"
                target="_blank"
                href="https://ko-fi.com/scriptingarthur">
                {chrome.i18n.getMessage("popup_support")}
              </a>
            </Button>
            <Button className="my-5 w-full" variant="secondary">
              <a
                className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 text-primary"
                target="_blank"
                href="https://groupify.dev/dashboard/groups">
                Manage Subscriptions
              </a>
            </Button>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Groupify Features:</h2>
            <ul className="space-y-2 text-primary text-[1.4rem]">
              <li>
                <strong className="font-bold text-primary">
                  Organize your YouTube subscriptions
                </strong>{" "}
                into custom collections for easy access.
              </li>
              <li>
                <strong className="font-bold text-primary">
                  Discover new content
                </strong>{" "}
                from your favorite creators in a clean, distraction-free layout.
              </li>
              <li>
                <strong className="font-bold text-primary">
                  Stay up-to-date
                </strong>{" "}
                with the latest videos from your subscribed channels.
              </li>
              <li>
                <strong className="font-bold text-primary">
                  Completely open-source
                </strong>{" "}
                and free to use.
              </li>
            </ul>
          </div>
          <div className="text-center text-smtext-primary text-[1.4rem]">
            Need help?
            <a
              className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 text-primary"
              href="mailto:admin@groupify.dev">
              {" "}
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Options
