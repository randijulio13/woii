import React from 'react'

export default function SignoutButton() {
    const { user, setUser } = useContext(UserContext)

    const handleSignOut = () => {
        signOut(auth).then(() => {
            setUser(null)
        })
    }
    return (
        <button className="flex items-center gap-x-2 bg-red-400 px-4 py-2 rounded outline-none shadow text-white hover:bg-red-500 duration-300" onClick={handleSignOut}>
            <img src={user.photoURL} className="h-8 rounded-full" referrerPolicy="no-referrer" />
            Sign Out
        </button>
    )
}
