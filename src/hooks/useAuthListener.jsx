import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'

export default function useAuthListener() {

    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('authUser') || '{}')
    })

    useEffect(() => {
        const listener = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                localStorage.setItem('authUser', JSON.stringify(authUser));
                setUser(authUser);
            } else {
                localStorage.removeItem('authUser');
                setUser(null);
            }
        })

        return () => listener?.()
    }, [])


    return { user, setUser }
}
