import React, { useContext, useEffect, useState } from 'react'
import Container from '../components/Container'
import Template from '../components/Template'
import UserContext from '../contexts/UserContext'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const [profileUser, setProfileUser] = useState(null)
  const { user } = useContext(UserContext)
  let { userName } = useParams()

  useEffect(() => {
    if (!userName) {
      userName = user.email.split('@')[0]
      setProfileUser({
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      })
    }
    getUser()
  }, [])

  const getUser = async () => {
    const q = query(
      collection(db, 'users'),
      where('email', '>=', userName),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setProfileUser(doc.data())
    })
  }

  const getPins = async () => {
    const q = query(collection(db, 'pins'), where('capital', '==', true))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data())
    })
  }

  return (
    <Template>
      <div className="py-8">
        <Container className="flex flex-col gap-y-2">
          <div className="flex justify-center">
            <img
              src={profileUser?.photoURL}
              className="rounded-full"
              width="120px"
              alt=""
            />
          </div>
          <h1 className="text-center font-title text-4xl font-semibold tracking-widest">
            {profileUser?.name}
          </h1>
          <h2 className="text-center text-gray-400">{profileUser?.email}</h2>
        </Container>
      </div>
    </Template>
  )
}
