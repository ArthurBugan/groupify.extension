import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/store"

import { Input } from "~components/ui/input"
import { Button } from "~components/ui/button"

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
  const [session, setSession] = useStorage("user-data")

  useEffect(() => {
    if (document.querySelector("html[dark]") != null) {
      document
        .querySelectorAll("plasmo-csui")
        .forEach((e) => e.classList.add("dark"))
    }

    ;(async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("options", data)

      if (error) {
        console.log(error)
        return setSession(error)
      } else {
        setSession(data.session)
      }
    })()
  }, []);

  const { ...methods } = useForm<Schema>({
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  });

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

      alert("Please verify your inbox! ✅")
    } catch (error) {
      console.log(error.error_description || error)
    }
  };

  return (
    <div className="bg-secondary w-screen p-20 h-screen">
      {session?.user && (
        <div>
          <p className="font-bold text-xl mb-4">
            Welcome {session.user?.email}
          </p>
          <Button
            onClick={() =>
              window.open("https://ko-fi.com/scriptingarthur")
            }
            type="button"
            className="w-full text-xl">
            {chrome.i18n.getMessage("popup_support")}
          </Button>
        </div>
      )}
      {!session && (
        <div className="dark">
          <p className="mb-4 text-center font-bold text-xl">
            Login!
          </p>
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

export default Options;
