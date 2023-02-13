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
import { removeHttps, addHttps } from '../helpers'
import { FaArrowLeft } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import Comment from '../components/Comment'
import ProfilePic from '../components/ProfilePic'
import PinDropdown from '../components/PinDropdown'
import DeletePinModal from '../components/DeletePinModal'

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()

  const getComments = async () => {
    const commentsSnap = await getDocs(
      query(collection(db, 'pinComments'), where('pinId', '==', pinId))
    )
    setComments(() => {
      return commentsSnap.docs.map((doc) => {
        return doc.data()
      })
    })
    let userArr = []
    commentsSnap.forEach((doc) => {
      userArr.push(doc.data().userId)
    })
    if (userArr.length > 0) {
      getCommentUser(userArr)
    }
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

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const openDeleteModal = () => {
    setDeleteModalOpen(true)
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

  const handleBack = () => {
    navigate(-1)
  }

  const handleDeletePin = async () => {
    await deleteDoc(doc(db, 'pins', pinId))
    const savedPinSnapshot = await getDocs(
      query(collection(db, 'savedPins'), where('pinId', '==', pinId))
    )
    savedPinSnapshot.forEach(async (queryDoc) => {
      await deleteDoc(doc(db, 'savedPins', queryDoc.id))
    })

    const pinComments = await getDocs(
      query(collection(db, 'pinComments'), where('pinId', '==', pinId))
    )
    pinComments.forEach(async (queryDoc) => {
      await deleteDoc(doc(db, 'pinComments', queryDoc.id))
    })

    handleBack()
  }

  const addComment = async (data) => {
    const docRef = await addDoc(collection(db, 'pinComments'), {
      pinId,
      comment: data.comment,
      userId: user.uid,
      timestamp: Timestamp.fromDate(new Date()),
    })
    // await addDoc(collection(docRef, 'comments'), {
    //   comment: data.comment,
    //   userId: user.uid,
    //   timestamp: Timestamp.fromDate(new Date()),
    // })
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
      <div className="flex flex-col items-center lg:my-8">
        <div className="relative min-h-screen w-full overflow-hidden bg-white shadow-2xl lg:min-h-full lg:w-2/3 lg:rounded-3xl">
          {isLoading ? (
            <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-black/30">
              <Loader />
            </div>
          ) : (
            <div className="m-4 grid min-h-screen grid-cols-1 gap-x-4 lg:min-h-[256px] lg:grid-cols-2">
              <img
                src={imageUrl}
                className="rounded-2xl"
                alt=""
                ref={imageRef}
              />
              <div className="flex h-full flex-col gap-y-2 overflow-auto p-4">
                <div className="relative flex items-center justify-between">
                  <PinDropdown
                    allowDelete={user?.uid == pin?.userId}
                    {...{ openDeleteModal }}
                  />
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
                    <a
                      href={addHttps(pin?.destinationLink)}
                      className="underline"
                      target="_blank"
                    >
                      {pin
                        ? removeHttps(pin?.destinationLink).split('/')[0]
                        : ''}
                    </a>
                  )}
                  <h1 className="text-4xl font-bold">{pin?.title}</h1>

                  <Link
                    onClick={(e) => e.stopPropagation()}
                    to={`/profile/${pinUser?.email.split('@')[0]}`}
                    className="flex items-center gap-x-2"
                  >
                    <ProfilePic url={pinUser?.photoURL} className="h-6" />
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
                            return (
                              <Comment key={index} {...{ comment, users }} />
                            )
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
                  <ProfilePic url={user?.photoURL} className="h-12" />
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
          )}
        </div>
      </div>
      <DeletePinModal
        {...{
          isOpen: deleteModalOpen,
          closeModal: closeDeleteModal,
          handleDeletePin,
        }}
      />
    </Template>
  )
}
