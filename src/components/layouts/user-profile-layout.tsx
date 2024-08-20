import { profileAtom } from '@/atoms/profile.atom'
import useProfile from '@/hooks/useProfile'
import { useAtom } from 'jotai'
import React from 'react'

const UserProfileLayout = () => {
  const [profile] = useAtom(profileAtom)
  const { setupUserProfile } = useProfile()

  React.useEffect(() => {
    if (localStorage.getItem('port')) {
      setupUserProfile()
    }

    return () => {}
  }, [profile, localStorage.getItem('token')])

  return <div className="hidden">UserProfileLayout</div>
}

export default UserProfileLayout
