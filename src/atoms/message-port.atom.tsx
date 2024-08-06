import { atom } from 'jotai'

export const portAtom = atom<MessagePort | null>(null)
