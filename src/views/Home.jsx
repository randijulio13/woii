import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import PinCard from '../components/PinCard'
import Template from '../components/Template'
import { db } from '../lib/firebase'
import Loader from '../components/Loader'
import CreateButton from '../components/CreateButton'

export default function Home() {
  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [queryLimit, setQueryLimit] = useState(20)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllPins()
  }, [])

  const getAllPins = async () => {
    const querySnapshot = await getDocs(
      collection(db, 'pins'),
      limit(queryLimit)
    )

    let arr = []
    let userArr = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      arr.push(data)
      userArr.push(data.userId)
    })
    setPins(arr)
    getAllUsers(userArr)
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
    <Template>
      {isLoading ? (
        <div className="h-[calc(100vh-72px)]">
          <Loader />
        </div>
      ) : (
        // <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lgmd:grid-cols-4 lg:grid-cols-6">
        <div className="columns-1 gap-8 p-4 md:columns-2 lgmd:columns-4 lg:columns-6">
          {pins.map((pin, index) => {
            let user = getUser(pin.userId)
            return <PinCard {...{ pin, pinUser: user }} key={index} />
          })}
        </div>
      )}
      <CreateButton />
    </Template>
  )
}
