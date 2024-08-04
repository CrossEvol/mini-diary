import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { profileAtom } from '@/atoms/profile.atom'
import useNotify from '@/hooks/useNotify'
import fetchClient from '@/utils/fetch.client'
import { UserProfile, ZResult } from 'electron/main/server/zod.type'
import { useAtom } from 'jotai'
import * as React from 'react'

const EventEmitterLayout = () => {
    const [eventEmitter] = useAtom(eventEmitterAtom)
    const { notifySuccess, notifyError } = useNotify()
    const [profile, setProfile] = useAtom(profileAtom)

    const setupUserProfile = async () => {
        if (!localStorage.getItem('token')) {
            return
        }
        if (!!profile) {
            return
        }
        const res = await fetchClient.get<ZResult<UserProfile>>(
            `http://localhost:${localStorage.getItem('port')}/profile`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        if (res.status === 200) {
            setProfile(res.data)
        }
    }

    let flag = true

    React.useEffect(() => {
        if (flag) {
            window.electronAPI.onUpdatePort((value) => {
                localStorage.setItem('port', value.toString())
                setupUserProfile()
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

            window.electronAPI.onNotifySuccess((value) => notifySuccess(value))
            window.electronAPI.onNotifyError((value) => notifyError(value))
        }

        return () => {
            flag = false
        }
    }, [eventEmitter])

    return <div className='hidden'></div>
}

export default EventEmitterLayout
