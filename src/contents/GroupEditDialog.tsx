import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../base.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AiFillDelete, AiOutlineClose } from "react-icons/ai"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import Combobox from "~components/ui/combobox"
import ComboboxChannels from "~components/ui/combobox-channels"
import { Input } from "~components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "~components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~components/ui/tooltip"
import { supabase, useEditDialog, useFormState, useGroups } from "~core/store"

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
  created_at: z.string(),
  icon: z.string(),
  id: z.number(),
  name: z.string().min(2, { message: "Group name is required" }),
  user_id: z.string().uuid(),
  channels: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      thumbnail: z.string(),
      new_content: z.boolean()
    })
  )
})

export type Schema = z.infer<typeof schema>

let timer
const EditManageChannels = (props) => {
  const editDialog = useEditDialog()
  const form = useFormState()
  const group = useGroups()
  const [session] = useStorage("user-data")

  const [isOpened, setOpenedTooltip] = useState(false)

  const { ...methods } = useForm<Schema>({
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (editDialog.isOpen) {
      console.log("Dentro do isOpen")
      methods.reset(form.values)
    }
  }, [editDialog.isOpen])

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      keyName: "custom_id",
      control: methods.control,
      name: "channels"
    }
  )

  const onSubmit = async (groupData: Schema) => {
    const { data, error: insertError } = await supabase
      .from("groups")
      .update({ name: groupData.name, icon: groupData.icon })
      .eq("id", groupData.id)

    let { data: groups } = await supabase.from("groups").select()

    group.create(groups)

    const channels = groupData.channels.map((c) => ({
      id: c.id,
      name: c.name,
      thumbnail: c.thumbnail,
      new_content: c.new_content,
      group_id: groupData.id,
      user_id: session.user.id
    }))

    const { error } = await supabase.from("channels").upsert(channels)

    if (!insertError && !error) {
      toast.custom((t) => (
        <div
          className={`bg-background px-6 py-4 shadow-md rounded-full text-xl text-primary ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}>
          {chrome.i18n.getMessage("group_dialog_edit_success")}
        </div>
      ))
    }

    editDialog.toggleOpen()
  }

  const toggleTooltip = () => {
    setOpenedTooltip((p) => !p)
  }

  const deleteGroupTimer = () => {
    timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase.from("groups").delete().match({
          id: form.values.id,
          user_id: form.values.user_id
        })

        if (error) {
          throw error
        }

        group.remove(form.values.id)

        toast.custom((t) => (
          <div
            className={`bg-background px-6 py-4 shadow-md rounded-full text-xl text-primary ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}>
            {chrome.i18n.getMessage("group_dialog_edit_delete_success")}
          </div>
        ))

        editDialog.toggleOpen()
      } catch (error) {
        alert(error.error_description || error)
      }
    }, 3000)
  }

  const deleteGroup = () => {
    clearTimeout(timer)
    console.log("clicou")
  }

  if (!editDialog.isOpen) return null

  console.log(methods.formState.errors, methods.getValues(), timer)

  return (
    <div className="h-screen flex items-center relative">
      <Sheet open={editDialog.isOpen}>
        <SheetContent size="sm">
          <div className="flex flex-col gap-y-5">
            <SheetHeader>
              <AiOutlineClose
                className="absolute right-4 cursor-pointer text-primary"
                size={18}
                onClick={editDialog.toggleOpen}
              />
              <SheetTitle>
                {chrome.i18n.getMessage("group_dialog_edit_group")}
              </SheetTitle>
            </SheetHeader>

            <FormProvider {...methods}>
              <form className="flex flex-col gap-y-5">
                <div>
                  <Input name="user_id" className="hidden" />
                  <Input name="created_at" className="hidden" />
                  <Input name="id" className="hidden" />

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
                </div>

                <ComboboxChannels
                  append={append}
                  name="channel"
                  className="flex-1"
                />

                {fields?.length > 0 && (
                  <div className="text-primary font-bold text-2xl">
                    {chrome.i18n.getMessage("group_dialog_edit_group_items")}
                  </div>
                )}
                <div className="flex flex-col gap-y-5 max-h-[70vh] overflow-y-auto">
                  {fields?.map((c, index) => (
                    <div
                      key={c.id}
                      className="flex flex-row w-full items-center justify-between">
                      <img
                        src={c.thumbnail}
                        className="rounded-full h-10 w-10"
                      />
                      <p className="text-primary text-lg">{c.name}</p>
                      <Button variant="secondary" type="button">
                        <AiFillDelete
                          size={20}
                          onClick={async () => {
                            const { data, error } = await supabase
                              .from("channels")
                              .delete()
                              .match({
                                id: c.id,
                                group_id: form.values.id,
                                user_id: form.values.user_id
                              })

                            return remove(index)
                          }}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </form>
            </FormProvider>
          </div>

          <SheetFooter className="mt-auto">
            <Button
              className="w-full text-xl"
              size="lg"
              type="submit"
              onClick={methods.handleSubmit(onSubmit)}
              disabled={methods.formState.isSubmitting}>
              {chrome.i18n.getMessage("group_dialog_edit_group")}
            </Button>

            <TooltipProvider>
              <Tooltip open={isOpened}>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full text-xl"
                    size="lg"
                    onMouseOver={toggleTooltip}
                    onMouseLeave={() => setOpenedTooltip(false)}
                    onMouseUp={deleteGroup}
                    onMouseDown={deleteGroupTimer}
                    disabled={methods.formState.isSubmitting}>
                    {chrome.i18n.getMessage("group_dialog_delete_group")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{chrome.i18n.getMessage("tooltip_delete")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default EditManageChannels
