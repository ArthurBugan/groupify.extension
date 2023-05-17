import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../base.css"
import type { PlasmoGetOverlayAnchor } from "plasmo"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
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

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () => {
  return document.querySelector("body")
}

const schema = z.object({
  name: z.string(),
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
    const { data, error } = await supabase
      .from("groups")
      .insert({ ...groupData, user_id: session.user.id })
      .select()

    groups.add(data[0])

    if (!error) {
      toast.custom((t) => (
        <div
          className={`bg-background px-6 py-4 shadow-md rounded-full text-xl text-primary ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}>
          New Group created! ✅
        </div>
      ))

      dialog.toggleOpen()
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
            <SheetTitle>Add Group</SheetTitle>
          </SheetHeader>

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

              <SheetFooter>
                <Button
                  className="w-full text-xl"
                  size="lg"
                  disabled={methods.formState.isSubmitting}>
                  Submit
                </Button>
              </SheetFooter>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ManageChannels