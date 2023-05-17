import { createClient } from "@supabase/supabase-js"
import { create } from 'zustand'

export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)

interface EditDialogStore {
  isOpen: boolean;
  toggleOpen: () => void;
}

interface FormStore {
  values: {};
  setForm: (values) => void;
}

interface GroupStore {
  items: any[],
  add: (group) => void;
  create: (group) => void;
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
  values: {},
  setForm: (data) => set(() => ({ values: data })),
}))

export const useGroups = create<GroupStore>((set) => ({
  items: [],
  add: (data) => set((state) => ({ items: [...state.items, data] })),
  create: (data) => set(() => ({ items: data }))
}))

export const useChannels = create<GroupStore>((set) => ({
  items: [],
  add: (data) => set((state) => ({ items: [...state.items, data] })),
  create: (data) => set(() => ({ items: data }))
}))

