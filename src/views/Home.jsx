import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import CreateButton from '../components/CreateButton'
import Loader from '../components/Loader'
import PinCard from '../components/PinCard'
import Template from '../components/Template'
import { db } from '../lib/firebase'

export default function Home() {
  const [pins, setPins] = useState([])
  const [users, setUsers] = useState([])
  const [queryLimit, setQueryLimit] = useState(25)
  const [limitReached, setLimitReached] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllPins()
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [queryLimit])

  const handleScroll = useCallback(() => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight
    if (bottom) {
      if (!limitReached) {
        setQueryLimit((queryLimit) => queryLimit + 1)
      }
    }
  }, [pins])

  const getAllPins = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, 'pins'), limit(queryLimit))
    )

    let arr = []
    let userArr = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      arr.push(data)
      userArr.push(data.userId)
    })
    if (arr.length < queryLimit) {
      setLimitReached(true)
    }
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
        <div className="columns-1 gap-8 p-4 md:columns-2 lgmd:columns-4 lg:columns-5 xl:columns-6">
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
