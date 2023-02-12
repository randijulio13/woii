import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Template from '../components/Template'
import { db } from '../lib/firebase'
import { linkGenerate } from '../lib/cloudinary'
import UserContext from '../contexts/UserContext'
import classNames from 'classnames'
import Loader from '../components/Loader'
import { FaCopy } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { removeHttps } from '../helpers'
import { FaArrowLeft } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import Comment from '../components/Comment'

export default function Pin() {
  const { pinId } = useParams()
  const [pin, setPin] = useState(null)
  const [imageUrl, setImageUrl] = useState()
  const { user } = useContext(UserContext)
  const [isSaved, setIsSaved] = useState(false)
  const [totalSave, setTotalSave] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const imageRef = useRef()
  const [pinUser, setPinUser] = useState()
  const navigate = useNavigate()
  const docRef = doc(db, 'pins', pinId)
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()

  const getComments = async () => {
    const commentsSnap = await getDocs(query(collection(docRef, 'comments')))
    setComments(() => {
      return commentsSnap.docs.map((doc) => {
        return doc.data()
      })
    })
    let userArr = []
    commentsSnap.forEach((doc) => {
      userArr.push(doc.data().userId)
    })
    getCommentUser(userArr)
  }

  const getCommentUser = async (userArr) => {
    const usersSnap = await getDocs(
      query(collection(db, 'users'), where('uid', 'in', userArr))
    )
    let newUserArr = []
    usersSnap.forEach((doc) => {
      newUserArr.push(doc.data())
    })
    setUsers(newUserArr)
  }

  const getPin = async () => {
    const docSnap = await getDoc(docRef)

    setPin(docSnap.data())
    setImageUrl(() => linkGenerate(docSnap.data().publicId, 768))
    getPinUser(docSnap.data().userId)
  }

  const getPinUser = async (uid) => {
    const userRef = doc(db, 'users', uid)
    const docSnap = await getDoc(userRef)
    setPinUser(docSnap.data())
  }

  const getSavedPinUser = async () => {
    const q = query(collection(db, 'savedPins'), where('pinId', '==', pinId))
    const querySnapshot = await getDocs(q)
    setTotalSave(querySnapshot.docs.length)

    getIsSaved(querySnapshot.docs)
    setIsLoading(false)
  }

  const getIsSaved = async (docs) => {
    docs.filter((doc) => {
      doc = doc.data()
      if (doc.uid == user.uid) {
        setIsSaved(true)
      }
    })
  }

  const handleSavePin = async () => {
    const savedPinId = `${user.uid}_${pinId}`
    if (isSaved) {
      await deleteDoc(doc(db, 'savedPins', savedPinId))
      setIsSaved(false)
      setTotalSave((totalSave) => totalSave - 1)
    } else {
      await setDoc(doc(db, 'savedPins', savedPinId), {
        uid: user.uid,
        pinId: pinId,
      })
      setIsSaved(true)
      setTotalSave((totalSave) => totalSave + 1)
    }
  }

  const handleCopy = () => {
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

  const handleBack = () => {
    navigate(-1)
  }

  const addComment = async (data) => {
    await addDoc(collection(docRef, 'comments'), {
      comment: data.comment,
      userId: user.uid,
      timestamp: Timestamp.fromDate(new Date()),
    })
    reset()
    getComments()
  }

  useEffect(() => {
    getPin()
    getSavedPinUser()
    getComments()
  }, [])
  return (
    <Template>
      <button
        onClick={handleBack}
        className="absolute left-4 hidden aspect-square rounded-full p-3 outline-none duration-300 hover:scale-110 hover:bg-gray-200 active:scale-100 active:bg-black active:text-white lg:block"
      >
        <FaArrowLeft />
      </button>
      <div className="lg:my-8 flex flex-col items-center">
        <div className="relative w-full min-h-screen lg:min-h-full lg:w-2/3 overflow-hidden lg:rounded-3xl bg-white shadow-2xl">
          {isLoading && (
            <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-black/30">
              <Loader />
            </div>
          )}
          <div className="m-4 grid lg:min-h-[256px] h-screen grid-cols-1 gap-x-4 lg:grid-cols-2">
            <img src={imageUrl} className="rounded-2xl" alt="" ref={imageRef} />
            <div className="flex flex-col gap-y-2 p-4 h-full overflow-auto">
              <div className="relative flex items-center justify-between">
                <button
                  className="rounded-full bg-white p-3 text-lg font-bold outline-none duration-300 hover:scale-110 hover:bg-gray-100 active:scale-100 active:bg-black active:text-white"
                  onClick={handleCopy}
                >
                  <FaCopy />
                </button>
                <button
                  onClick={handleSavePin}
                  className={classNames(
                    'rounded-300 rounded-full py-2 px-4 font-bold text-white outline-none duration-300 hover:scale-110 active:scale-100',
                    {
                      'bg-black hover:bg-gray-800': isSaved,
                      'bg-red-500 hover:bg-red-600': !isSaved,
                    }
                  )}
                >
                  {totalSave} {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
              <div className="max-h-[calc(100vh-72px)] space-y-4 overflow-auto">
                {pin?.destinationLink && (
                  <a href={pin?.destinationLink} className="underline">
                    {pin ? removeHttps(pin?.destinationLink).split('/')[0] : ''}
                  </a>
                )}
                <h1 className="text-4xl font-bold">{pin?.title}</h1>

                <Link
                  onClick={(e) => e.stopPropagation()}
                  to={`/profile/${pinUser?.email.split('@')[0]}`}
                  className="flex items-center gap-x-2"
                >
                  <img
                    src={pinUser?.photoURL}
                    className="aspect-square h-6 rounded-full"
                    alt=""
                  />
                  <span className="text-sm font-bold">{pinUser?.name}</span>
                </Link>

                <p className="tracking-light text-sm">{pin?.description}</p>
                <div>
                  {comments.length > 0 ? (
                    <>
                      <h2 className="mb-2 font-bold">
                        {comments.length} Comments
                      </h2>
                      <div className="mb-2 flex flex-col gap-y-2">
                        {comments.map((comment, index) => {
                          return <Comment key={index} {...{ comment, users }} />
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-bold">Comments</h2>
                      <span>
                        No comments yet! Add one to start the conversation.
                      </span>
                    </>
                  )}
                </div>
              </div>
              <form
                onSubmit={handleSubmit(addComment)}
                className="mt-auto flex items-center gap-x-4 border-t pt-4"
              >
                <img
                  src={user.photoURL}
                  className="aspect-square h-12 rounded-full"
                  alt=""
                />
                <input
                  {...register('comment', { required: true })}
                  type="text"
                  className="h-12 w-full rounded-full bg-gray-200 px-3 outline-none"
                  placeholder="Add a comment"
                />
                <button className="hidden" type="submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Template>
  )
}
