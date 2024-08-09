import { profileAtom } from '@/atoms/profile.atom'
import fetchClient from '@/utils/fetch.client'
import { UserProfile, ZResult } from 'electron/main/server/zod.type'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

const useProfile = () => {
    const [profile, setProfile] = useAtom(profileAtom)

    const setupUserProfile = useCallback(async () => {
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
    }, [profile, setProfile])

    return { setupUserProfile }
}

export default useProfile
