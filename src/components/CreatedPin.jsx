import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import PinCard from '../components/PinCard'
import Template from '../components/Template'
import { db } from '../lib/firebase'
import Loader from '../components/Loader'
import CreateButton from '../components/CreateButton'
import ProfilePic from './ProfilePic'

export default function CreatedPin({ user }) {
  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [queryLimit, setQueryLimit] = useState(20)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.uid) {
      getPins()
    }
  }, [user])

  const getPins = async () => {
    const pinRef = collection(db, 'pins')
    const q = query(pinRef, where('userId', '==', user.uid))
    const querySnapshot = await getDocs(q)
    let pinArr = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      pinArr.push(data)
    })
    setPins(pinArr)
    setIsLoading(false)
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="h-72 flex items-center justify-center flex-col">
          <Loader />
        </div>
      ) : (
        <div className="columns-1 gap-8 p-4 md:columns-2 lgmd:columns-4 lg:columns-6">
          {pins.map((pin, index) => {
            return <PinCard {...{ pin, pinUser: user }} key={index} />
          })}
        </div>
      )}
    </div>
  )
}
