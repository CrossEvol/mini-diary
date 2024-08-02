import EventEmitter from 'eventemitter3'
import { atom } from 'jotai'

export const eventEmitterAtom = atom(new EventEmitter())
