import UserProfile from '@/components/user-profile'

const mockUser = {
    id: 1,
    email: 'user@example.com',
    nickname: 'John Doe',
    password: 'abc123',
    pin_code: '528518',
    avatar: 'https://avatars.githubusercontent.com/u/67866644?s=400&u=02cfa9f8268a6862b4974af7a01f2168a4ed62bd&v=4',
}

const UserProfileView = () => {
    const handleSave = (updatedUser: {
        email: string
        nickname: string
        avatar: string
    }) => {
        console.log('Updated User:', updatedUser)
        // Here you can call an API to save the updated user data
    }

    return <UserProfile user={mockUser} onSave={handleSave} />
}

export default UserProfileView
