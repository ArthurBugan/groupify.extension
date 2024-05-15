import { create } from 'zustand'

interface EditDialogStore {
  isOpen: boolean;
  toggleOpen: () => void;
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

