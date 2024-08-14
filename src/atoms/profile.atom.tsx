import { UserProfile } from 'electron/main/server/api.type'
import { atom } from 'jotai'

export const profileAtom = atom<UserProfile | null>(null)
