import { create } from 'zustand'

interface ICounterStore {
    count: number
    inc: () => void
}

export const useCounterStore = create<ICounterStore>((set) => ({
    count: 1,
    inc: () => set((state) => ({ count: state.count + 1 })),
}))
