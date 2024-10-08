import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { useImportContentStorage } from '@/hooks/useImportContentStorage'
import useNotify from '@/hooks/useNotify'
import useProfile from '@/hooks/useProfile'
import { verifyContentFormat } from '@/utils/file.util'
import { useAtom } from 'jotai'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

const EventEmitterLayout = () => {
  let flag = true
  const [eventEmitter] = useAtom(eventEmitterAtom)
  const { notifySuccess, notifyError } = useNotify()
  const { saveImportContent } = useImportContentStorage()
  const navigate = useNavigate()
  const { setupUserProfile } = useProfile()

  React.useEffect(() => {
    if (flag) {
      window.electronAPI.onUpdatePort((value) => {
        localStorage.setItem('port', value.toString())
        setupUserProfile()
      })
      window.electronAPI.onVerifyImport(async (value) => {
        await saveImportContent(value.content)
        return value.format === verifyContentFormat(value.content)
      })

      window.electronAPI.onExportDiary((value) => {
        console.log('redirect: ', EmitterEvent.EXPORT_DIARY)
        eventEmitter.emit(EmitterEvent.EXPORT_DIARY, value)
      })
      window.electronAPI.onExportAllDiaries((value) => {
        console.log('redirect: ', EmitterEvent.EXPORT_ALL_DIARY)
        eventEmitter.emit(EmitterEvent.EXPORT_ALL_DIARY, value)
      })

      window.electronAPI.onImportDiary((value) => {
        console.log('redirect: ', EmitterEvent.IMPORT_DIARY)
        eventEmitter.emit(EmitterEvent.IMPORT_DIARY, value)
      })
      window.electronAPI.onImportAllDiaries((value) => {
        console.log('redirect: ', EmitterEvent.IMPORT_ALL_DIARY)
        eventEmitter.emit(EmitterEvent.IMPORT_ALL_DIARY, value)
      })

      window.electronAPI.onNotifySuccess((value) => {
        setTimeout(() => notifySuccess(value.message), 100)
        if (value.redirectUrl) {
          navigate(value.redirectUrl)
        }
      })
      window.electronAPI.onNotifyError((value) => {
        setTimeout(() => notifyError(value.message), 100)
        if (value.redirectUrl) {
          navigate(value.redirectUrl)
        }
      })
    }

    return () => {
      flag = false
    }
  }, [eventEmitter])

  return <div className="hidden"></div>
}

export default EventEmitterLayout
