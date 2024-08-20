import { profileAtom } from '@/atoms/profile.atom'
import UserProfile from '@/components/profile/user-profile'
import { User } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'

const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  nickname: 'John Doe',
  password: 'abc123',
  pinCode: '528518',
  avatar:
    'https://avatars.githubusercontent.com/u/67866644?s=400&u=02cfa9f8268a6862b4974af7a01f2168a4ed62bd&v=4'
}

const UserProfileView = () => {
  const [profile] = useAtom(profileAtom)

  return (
    <UserProfile user={profile ? { ...profile!, password: '' } : mockUser} />
  )
}

export default UserProfileView
