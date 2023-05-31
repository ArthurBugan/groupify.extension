import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { FormProvider, useForm } from "react-hook-form"
import { AiOutlineClose } from "react-icons/ai"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import Combobox from "~components/ui/combobox"
import { Input } from "~components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "~components/ui/sheet"
import { supabase, useCreateDialog, useGroups } from "~core/store"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector("body")
}

const schema = z.object({
  name: z.string().min(2, { message: "Group name is required" }),
  icon: z.string()
})

export type Schema = z.infer<typeof schema>

const ManageChannels = (props) => {
  const dialog = useCreateDialog()
  const groups = useGroups()
  const [session] = useStorage("user-data")

  const { ...methods } = useForm<Schema>({
    defaultValues: {
      icon: "FcFolder"
    },
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (groupData: Schema) => {
    try {
      const { data, error } = await supabase
        .from("groups")
        .insert({ ...groupData, user_id: session.user.id })
        .select()

      groups.add(data[0])

      if (error) {
        throw error
      }

      alert(chrome.i18n.getMessage("group_dialog_success"))
      return dialog.toggleOpen()
    } catch (error) {
      alert(error.error_description || error)
    }
  }

  if (!dialog.isOpen) return null

  return (
    <div className="h-screen w-screen">
      <Sheet open={dialog.isOpen}>
        <SheetContent
          size="sm"
          position="right"
          className="flex flex-col gap-y-5">
          <SheetHeader>
            <AiOutlineClose
              className="absolute right-4 cursor-pointer text-primary"
              size={18}
              onClick={dialog.toggleOpen}
            />
            <SheetTitle>
              {chrome.i18n.getMessage("group_dialog_add_group")}
            </SheetTitle>
          </SheetHeader>

          <FormProvider {...methods}>
            <form className="flex flex-col gap-y-5">
              <div className="flex flex-row gap-x-4">
                <Input
                  name="name"
                  className="w-full"
                  placeholder={chrome.i18n.getMessage(
                    "group_dialog_group_name"
                  )}
                />

                <Combobox name="icon" className="flex-1" />
              </div>
            </form>
          </FormProvider>
          <SheetFooter className="mt-auto">
            <Button
              className="w-full text-xl"
              size="lg"
              onClick={methods.handleSubmit(onSubmit)}
              disabled={methods.formState.isSubmitting}>
              {chrome.i18n.getMessage("group_dialog_submit_group")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ManageChannels
