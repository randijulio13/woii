import React, { useContext, useEffect, useMemo, useState } from 'react'
import Container from '../components/Container'
import Template from '../components/Template'
import UserContext from '../contexts/UserContext'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import CreatedPin from '../components/CreatedPin'
import SavedPin from '../components/SavedPin'
import ProfilePic from '../components/ProfilePic'
import CreateButton from '../components/CreateButton'

export default function Profile() {
  const [profileUser, setProfileUser] = useState(null)
  const { user } = useContext(UserContext)
  const [activeTab, setActiveTab] = useState('Created')
  let { userName } = useParams()

  const tabs = useMemo(() => {
    return [{ title: 'Created' }, { title: 'Saved' }]
  })

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
  }, [userName])

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

  const handleShareProfile = () => {
    let url = document.URL
    navigator.clipboard.writeText(url)
    toast('Copied link to your clipboard to share', {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    })
  }

  return (
    <Template>
      <div className="py-8">
        <div className="flex flex-col items-center justify-center gap-y-4">
          <div className="flex justify-center">
            <ProfilePic url={profileUser?.photoURL} className="w-[120px]" />
          </div>
          <h1 className="text-center text-4xl font-bold">
            {profileUser?.name}
          </h1>
          <h2 className="text-center text-gray-400">{profileUser?.email}</h2>
          <div className="flex justify-center">
            <button
              onClick={handleShareProfile}
              className="flex h-12 items-center justify-center rounded-full bg-gray-100 px-4 font-bold outline-none duration-200 hover:scale-110 hover:bg-gray-300 active:scale-100 active:bg-black active:text-white"
            >
              Share
            </button>
          </div>

          <div className="mt-4 flex gap-x-4">
            {tabs.map((tab, index) => {
              return (
                <button
                  onClick={() => setActiveTab(tab.title)}
                  key={index}
                  className={classNames(
                    'bg-white px-3 py-1 font-bold text-black outline-none duration-300',
                    {
                      'border-b-4 border-b-black': tab.title == activeTab,
                      'rounded-lg hover:scale-110 hover:bg-gray-200 active:scale-100 active:bg-black active:text-white':
                        tab.title != activeTab,
                    }
                  )}
                >
                  {tab.title}
                </button>
              )
            })}
          </div>
          {profileUser ? (
            activeTab == 'Created' ? (
              <CreatedPin user={profileUser} />
            ) : (
              <SavedPin user={profileUser} />
            )
          ) : (
            ''
          )}
        </div>
      </div>
      {user?.uid == profileUser?.uid && <CreateButton />}
    </Template>
  )
}
