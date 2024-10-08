import EventEmitter from 'eventemitter3'
import { atom } from 'jotai'

export const eventEmitterAtom = atom(new EventEmitter())

export enum EmitterEvent {
  SYNC = 'sync',
  EXPORT_DIARY = 'EXPORT_DIARY',
  EXPORT_ALL_DIARY = 'EXPORT_ALL_DIARY',
  IMPORT_DIARY = 'IMPORT_DIARY',
  IMPORT_ALL_DIARY = 'IMPORT_ALL_DIARY',
  SEND_BLOCKS_TO_EDITOR = 'SEND_BLOCKS_TO_EDITOR',
  RETURN_MARKDOWN_FROM_BLOCKS = 'RETURN_MARKDOWN_FROM_BLOCKS'
}
