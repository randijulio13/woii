import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import React, { useContext } from 'react'
import { FcGoogle } from 'react-icons/fc'
import UserContext from '../contexts/UserContext'
import { auth, db, provider } from '../lib/firebase'

export default function SignIn() {
  const { user, setUser } = useContext(UserContext)

  const handleSignin = async () => {
    let result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential.accessToken
    setUser(result.user)
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email:result.user.email,
      name: result.user.displayName,
      photoURL: result.user.photoURL,
      lastLogin: serverTimestamp(),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <button
        onClick={handleSignin}
        className="flex items-center gap-x-2 rounded bg-white px-4 py-2 shadow outline-none duration-300 hover:bg-gray-200"
      >
        <FcGoogle /> Sign in with Google
      </button>
    </div>
  )
}
