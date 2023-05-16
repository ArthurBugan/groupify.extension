import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { FormProvider, useForm } from "react-hook-form"
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

import { returnLibraryIcons } from "../components/ui/icon"

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

const EditManageChannels = (props) => {
  const [modal, setOpen] = useStorage("edit-channels-modal", false)
  const [session] = useStorage("user-data")

  const { ...methods } = useForm<Schema>({
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (group_data: Schema) => {
    console.log(session.user.id)
  }

  if (!modal) {
    return null
  }

  return (
    <div className="h-screen flex items-center relative">
      <Dialog open={modal} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex flex-col gap-y-5">
            <DialogHeader>
              <AiOutlineClose
                className="absolute right-4 cursor-pointer"
                size={18}
                onClick={() => setOpen(false)}
              />
              <DialogTitle>Add Group</DialogTitle>
            </DialogHeader>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-row gap-x-4">
                  <Input
                    name="name"
                    className="flex-3"
                    placeholder="Group Name"
                  />

                  <Combobox
                    name="icon"
                    className="flex-1"
                    items={returnLibraryIcons("fc")}
                  />
                </div>

                <Button
                  className="w-full text-primary text-xl bg-transparent hover:bg-accent"
                  size="lg"
                  disabled={methods.formState.isSubmitting}>
                  Submit
                </Button>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditManageChannels
