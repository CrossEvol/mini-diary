import { profileAtom } from '@/atoms/profile.atom'
import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import { UserProfile, ZResult } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

const useProfile = () => {
  const [profile, setProfile] = useAtom(profileAtom)

  const setupUserProfile = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      return
    }
    if (profile) {
      return
    }
    const res = await fetchClient.get<ZResult<UserProfile>>(
      `${ApiUrl()}/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (res.status === 200) {
      setProfile(res.data)
    }
  }, [profile, setProfile])

  return { profile, setupUserProfile }
}

export default useProfile
