import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Toaster } from "react-hot-toast"
import { AiOutlineClose } from "react-icons/ai"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import Combobox from "~components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "~components/ui/dialog"
import { Input } from "~components/ui/input"
import { supabase } from "~core/store"
import { sleep } from "~lib/utils"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText

  style.textContent += `
    #plasmo-shadow-container {
      position: fixed !important;
      left: 0px;
      top: 0px;
      height: auto;
      width: 100%;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    #plasmo-inline {
      left: -10vw;
    }`
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("body")
}

const schema = z.object({
  name: z.string(),
  icon: z.string()
})

export type Schema = z.infer<typeof schema>

const ManageChannels = (props) => {
  const [modal, setOpen] = useStorage("channels-modal", false)
  const [session] = useStorage("user-data")

  const { ...methods } = useForm<Schema>({
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (group_data: Schema) => {
    console.log(group_data)

    return
    const { data: curSession, error: errorSession } =
      await supabase.auth.getSession()

    const { data, error } = await supabase
      .from("groups")
      .insert({ ...group_data, user_id: session.user.id })

    if (!error) {
      toast.custom((t) => (
        <div
          className={`bg-background px-6 py-4 shadow-md rounded-full text-xl text-primary ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}>
          New Group created! ✅
        </div>
      ))

      setTimeout(() => {
        setOpen(false)
      }, 200)
    }
  }

  if (!modal) {
    return null
  }

  return (
    <div className="h-screen flex items-center relative">
      <Toaster position="top-left" />

      <Dialog open={modal} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col gap-y-5">
          <DialogHeader>
            <AiOutlineClose
              className="absolute right-4 cursor-pointer"
              size={18}
              onClick={() => setOpen(false)}
            />
            <DialogTitle>Add Group</DialogTitle>
          </DialogHeader>

          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-y-5"
              onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-x-4">
                <Input
                  name="name"
                  className="flex-3"
                  placeholder="Group Name"
                />

                <Combobox name="icon" className="flex-1" />
              </div>

              <Button
                className="w-full text-primary text-xl bg-transparent hover:bg-accent"
                size="lg"
                disabled={methods.formState.isSubmitting}>
                Submit
              </Button>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageChannels
