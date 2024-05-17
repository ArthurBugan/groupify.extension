import { zodResolver } from "@hookform/resolvers/zod"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"

import "~base.css"
import "~style.css"

const schema = z.object({
  email: z.string().email()
})

export type Schema = z.infer<typeof schema>

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

function Options() {
  const [session] = useStorage("authorization")

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document
        .querySelectorAll("plasmo-csui")
        .forEach((e) => e.classList.add("dark"))
    }
  }, [])

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-primary">
        <div className="shadow-lg bg-primary">
          <Button
            variant="secondary"
            className="h-24 w-40"
            onClick={() =>
              window.open("https://groupify.dev/dashboard/channels")
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
    <div className="flex h-screen w-full items-center justify-center bg-primary">
      <div className="w-full max-w-lg rounded-lg p-6 shadow-lg bg-secondary">
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
            <Button className="w-full my-5" variant="secondary">
              <a
                className="text-lg font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 text-primary"
                target="_blank"
                href="https://ko-fi.com/scriptingarthur">
                {chrome.i18n.getMessage("popup_support")}
              </a>
            </Button>
            <Button className="w-full my-5" variant="secondary">
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
