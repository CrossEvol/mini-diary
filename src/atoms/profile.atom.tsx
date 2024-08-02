import { UserProfile } from 'electron/main/server/zod.type'
import { atom } from 'jotai'

export const profileAtom = atom<UserProfile | null>(null)
