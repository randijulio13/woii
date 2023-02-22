import classNames from 'classnames'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'
import { db } from '../lib/firebase'

export default function SavePinButton({ pin, className }) {
  const { user } = useContext(UserContext)
  const [isSaved, setIsSaved] = useState(false)
  const [totalSave, setTotalSave] = useState(0)

  useEffect(() => {
    getSavedPinUser()
  }, [])

  const getSavedPinUser = async () => {
    const q = query(collection(db, 'savedPins'), where('pinId', '==', pin.id))
    const querySnapshot = await getDocs(q)
    setTotalSave(querySnapshot.docs.length)
    querySnapshot.docs.filter((doc) => {
      doc = doc.data()
      if (doc.uid == user.uid) {
        setIsSaved(true)
      }
    })
  }
  
  const handleSavePin = async (event) => {
    event.stopPropagation()
    const savedPinId = `${user.uid}_${pin.id}`
    if (isSaved) {
      await deleteDoc(doc(db, 'savedPins', savedPinId))
      setIsSaved(false)
      setTotalSave((totalSave) => totalSave - 1)
    } else {
      await setDoc(doc(db, 'savedPins', savedPinId), {
        uid: user.uid,
        pinId: pin.id,
      })
      setIsSaved(true)
      setTotalSave((totalSave) => totalSave + 1)
    }
  }

  return (
    <button
      onClick={handleSavePin}
      className={classNames(
        'absolute rounded-full py-2 px-4 font-bold text-white duration-300 hover:scale-110 active:scale-100',
        className,
        {
          'bg-black hover:bg-gray-800': isSaved,
          'bg-red-500 hover:bg-red-600': !isSaved,
        }
      )}
    >
      {totalSave} {isSaved ? 'Saved' : 'Save'}
    </button>
  )
}
