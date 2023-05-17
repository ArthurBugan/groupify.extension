import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
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
import { supabase } from "~core/store"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector("body")
}

const schema = z.object({
  created_at: z.string(),
  icon: z.string(),
  id: z.number(),
  name: z.string(),
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

const EditManageChannels = (props) => {
  const [modal, setOpen] = useStorage("edit-channels-modal", false)
  const [session] = useStorage("user-data")
  const [values] = useStorage("form-values", {})

  const { ...methods } = useForm<Schema>({
    values,
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: methods.control,
      name: "channels"
    }
  )

  const onSubmit = async (groupData: Schema) => {
    const { data, error: insertError } = await supabase
      .from("groups")
      .update({ name: groupData.name, icon: groupData.icon })
      .eq("id", groupData.id)

    const channels = groupData.channels.map((c) => ({
      id: c.id,
      name: c.name,
      thumbnail: c.thumbnail,
      new_content: c.new_content,
      group_id: groupData.id,
      user_id: session.user.id
    }))

    const { error } = await supabase.from("channels").insert(channels)

    if (!error && !error) {
      toast.custom((t) => (
        <div
          className={`bg-background px-6 py-4 shadow-md rounded-full text-xl text-primary ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}>
          Group Edited! ✅
        </div>
      ))
    }

    setOpen(false)
  }

  console.log(methods.formState.errors, methods.getValues())

  if (!modal) return null

  return (
    <div className="h-screen flex items-center relative">
      <Sheet open={modal}>
        <SheetContent size="sm">
          <div className="flex flex-col gap-y-5">
            <SheetHeader>
              <AiOutlineClose
                className="absolute right-4 cursor-pointer text-primary"
                size={18}
                onClick={() => setOpen(false)}
              />
              <SheetTitle>Edit Group</SheetTitle>
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
                      className="flex-3"
                      placeholder="Group Name"
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
                    Group channels
                  </div>
                )}
                {fields?.map((c, index) => (
                  <div
                    key={c.id}
                    className="flex flex-row w-full items-center justify-between">
                    <img src={c.thumbnail} className="h-10 w-10" />
                    <p className="text-primary text-lg">{c.name}</p>
                    <Button variant="secondary">
                      <AiFillDelete size={20} onClick={() => remove(index)} />
                    </Button>
                  </div>
                ))}

                <SheetFooter>
                  <Button
                    className="w-full text-xl"
                    size="lg"
                    type="submit"
                    onClick={methods.handleSubmit(onSubmit)}
                    disabled={methods.formState.isSubmitting}>
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full text-xl"
                    size="lg"
                    disabled={methods.formState.isSubmitting}>
                    Delete group
                  </Button>
                </SheetFooter>
              </form>
            </FormProvider>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default EditManageChannels
