import EventEmitter from 'eventemitter3'
import { atom } from 'jotai'

export const eventEmitterAtom = atom(new EventEmitter())

export enum EmitterEvent {
    EXPORT_DIARY = 'EXPORT_DIARY',
    EXPORT_ALL_DIARY = 'EXPORT_ALL_DIARY',
    IMPORT_DIARY = 'IMPORT_DIARY',
    IMPORT_ALL_DIARY = 'IMPORT_ALL_DIARY',
}

