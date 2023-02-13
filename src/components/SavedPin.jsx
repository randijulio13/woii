import {
  collection,
  getDocs, query,
  where
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import PinCard from '../components/PinCard'
import { db } from '../lib/firebase'

export default function SavedPin({ user }) {
  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [queryLimit, setQueryLimit] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [savedPinId, setSavedPinId] = useState([])

  useEffect(() => {
    getSavedPins()
  }, [])

  const getSavedPins = async () => {
    const pinRef = collection(db, 'savedPins')
    const q = query(pinRef, where('uid', '==', user.uid))
    const querySnapshot = await getDocs(q)
    let pinIdArr = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      pinIdArr.push(data.pinId)
    })
    if (pinIdArr.length > 0) {
      getPins(pinIdArr)
    } else {
      setIsLoading(false)
    }
  }

  const getPins = async (arr) => {
    const pinRef = collection(db, 'pins')
    const q = query(pinRef, where('__name__', 'in', arr))
    const querySnapshot = await getDocs(q)
    let pinArr = []
    let userArr = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      pinArr.push(data)
      userArr.push(data.userId)
    })
    getAllUsers(userArr)
    setPins(pinArr)
    setIsLoading(false)
  }

  const getUser = (uid) => {
    let user = users.filter((user, index) => {
      return user.uid == uid
    })
    return user[0]
  }

  const getAllUsers = async (userArr) => {
    const q = query(collection(db, 'users'), where('uid', 'in', userArr))
    const querySnapshot = await getDocs(q)
    let newUserArr = []
    querySnapshot.forEach((doc) => {
      newUserArr.push(doc.data())
    })
    setUsers(newUserArr)
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex h-72 flex-col items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="columns-1 gap-8 p-4 md:columns-2 lgmd:columns-4 lg:columns-5 xl:columns-6">
          {pins.map((pin, index) => {
            let user = getUser(pin.userId)
            return <PinCard {...{ pin, pinUser: user }} key={index} />
          })}
        </div>
      )}
    </div>
  )
}
