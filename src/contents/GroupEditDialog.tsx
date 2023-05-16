import { zodResolver } from "@hookform/resolvers/zod"
import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { FormProvider, useForm } from "react-hook-form"
import { AiOutlineClose } from "react-icons/ai"
import * as z from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import Combobox from "~components/ui/combobox"
import { DataTable } from "~components/ui/data-table"
import { Input } from "~components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "~components/ui/sheet"
import { supabase } from "~core/store"
import { type Payment, columns } from "~lib/columns"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
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
  const [values] = useStorage("form-values", {})

  const data = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com"
    },
    {
      id: "118ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com"
    },
    {
      id: "728ed5as",
      amount: 100,
      status: "pending",
      email: "m@example.com"
    },
    {
      id: "728ed5gg",
      amount: 100,
      status: "pending",
      email: "m@example.com"
    },
    {
      id: "728edasd1",
      amount: 100,
      status: "pending",
      email: "m@example.com"
    },
    {
      id: "72zzd52f",
      amount: 100,
      status: "pending",
      email: "m@example.com"
    }
  ]

  const { ...methods } = useForm<Schema>({
    values,
    mode: "all",
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: zodResolver(schema)
  })

  const onSubmit = async (group_data: Schema) => {
    console.log(values, group_data)
  }

  if (!modal) {
    return null
  }

  return (
    <div className="h-screen flex items-center relative">
      <Sheet open={modal}>
        <SheetContent size="sm">
          <div className="flex flex-col gap-y-5">
            <SheetHeader>
              <AiOutlineClose
                className="absolute right-4 cursor-pointer"
                size={18}
                onClick={() => setOpen(false)}
              />
              <SheetTitle>Edit Group</SheetTitle>
            </SheetHeader>

            <FormProvider {...methods}>
              <form
                className="flex flex-col gap-y-5"
                onSubmit={methods.handleSubmit(onSubmit)}>
                <div>
                  <div className="flex flex-row gap-x-4">
                    <Input
                      name="name"
                      className="flex-3"
                      placeholder="Group Name"
                    />

                    <Combobox name="icon" className="flex-1" />
                  </div>
                </div>

                <DataTable columns={columns} data={data} />

                <SheetFooter>
                  <Button
                    className="w-full text-xl"
                    size="lg"
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
