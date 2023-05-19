import { createClient } from "@supabase/supabase-js"
import { create } from 'zustand'
import { type Schema } from '~contents/GroupEditDialog'

export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

interface EditDialogStore {
  isOpen: boolean;
  toggleOpen: () => void;
}

interface FormStore {
  values: Schema
  setForm: (values) => void;
}

interface GroupStore {
  items: any[],
  add: (group) => void;
  create: (group) => void;
  remove: (group) => void;
}

export const useCreateDialog = create<EditDialogStore>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export const useEditDialog = create<EditDialogStore>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export const useFormState = create<FormStore>((set) => ({
  values: {
    channels: []
  },
  setForm: (data) => set(() => ({ values: data })),
}))

export const useGroups = create<GroupStore>((set) => ({
  items: [],
  add: (data) => set((state) => ({ items: [...state.items, data] })),
  create: (data) => set(() => ({ items: data })),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
}))

export const useChannels = create<GroupStore>((set) => ({
  items: [],
  add: (data) => set((state) => ({ items: [...state.items, data] })),
  create: (data) => set(() => ({ items: data })),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
}))

