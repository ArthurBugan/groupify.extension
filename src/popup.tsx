import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "@supabase/supabase-js"
import type { PlasmoCSConfig } from "plasmo"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"

import { supabase } from "./core/store"

import "~base.css"
import "~style.css"

import { useEffect } from "react"

import { Input } from "~components/ui/input"

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

const schema = z.object({
  email: z.string().email()
})

export type Schema = z.infer<typeof schema>

function IndexOptions() {
  const [session] = useStorage<Session>("user-data", (userData: Session) =>
    typeof userData === "undefined" ? null : userData
  )

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document.querySelector("html").classList.add("dark")
    }
  }, [])

  const { ...methods } = useForm<Schema>({
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (groupData: Schema) => {
    try {
      const {
        error,
        data: { user, session }
      } = await supabase.auth.signInWithOtp({
        email: groupData.email,
        options: {
          emailRedirectTo:
            "chrome-extension://eigbphlpbefiaehoamaanpjpmmgcnaam/options.html"
        }
      })

      if (error) {
        console.log(`Erro: ${error.message} ❌`)
        return
      }

      console.log("Please verify your inbox! ✅")
    } catch (error) {
      console.log(error.error_description || error)
    }
  }

  return (
    <div className="flex flex-col w-72 m-5">
      {session?.user && (
        <div>
          {session?.user.email} - {session?.user?.id}
        </div>
      )}

      {!session && (
        <div>
          <div className="mb-4">
            <FormProvider {...methods}>
              <form>
                <div className="flex flex-col gap-y-5">
                  <div>
                    <Input type="text" name="email" placeholder="Email" />
                  </div>

                  <Button
                    onClick={methods.handleSubmit(onSubmit)}
                    type="button"
                    variant="default"
                    className="w-full text-xl">
                    {chrome.i18n.getMessage("popup_btn")}
                  </Button>

                  <Button
                    onClick={() =>
                      window.open("https://ko-fi.com/scriptingarthur")
                    }
                    type="button"
                    variant="ghost"
                    className="w-full text-xl">
                    {chrome.i18n.getMessage("popup_support")}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexOptions
