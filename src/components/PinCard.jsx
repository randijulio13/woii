import styled from '@emotion/styled/macro'
import React, { useContext, useEffect, useState } from 'react'
import { linkGenerate } from '../lib/cloudinary'
import { MdDownloadForOffline } from 'react-icons/md'
import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import { getImgMeta, destinationLink } from '../helpers'
import { saveAs } from 'file-saver'
import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import UserContext from '../contexts/UserContext'
import classNames from 'classnames'
import { Link, useNavigate } from 'react-router-dom'
import ProfilePic from './ProfilePic'

export default function PinCard({ pin, pinUser }) {
  const { user } = useContext(UserContext)
  const imageUrl = linkGenerate(pin.publicId, 250)
  const [imgHeight, setImgHeight] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [totalSave, setTotalSave] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    getMeta()
    getSavedPinUser()
  }, [])

  const getIsSaved = async (docs) => {
    docs.filter((doc) => {
      doc = doc.data()
      if (doc.uid == user.uid) {
        setIsSaved(true)
      }
    })
  }

  const getSavedPinUser = async () => {
    const q = query(collection(db, 'savedPins'), where('pinId', '==', pin.id))
    const querySnapshot = await getDocs(q)
    setTotalSave(querySnapshot.docs.length)

    getIsSaved(querySnapshot.docs)
  }

  const getMeta = async () => {
    let res = await getImgMeta(imageUrl)
    setImgHeight(res.naturalHeight)
    setImgWidth(res.naturalWidth)
  }

  const Hover = styled.div({
    opacity: 0,
    transition: 'opacity 350ms ease',
  })

  const DisplayOver = styled.div({
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    width: '100%',
    zIndex: 2,
    transition: 'background-color 350ms ease',
    backgroundColor: 'transparent',
    padding: '20px 20px 0 20px',
    boxSizing: 'border-box',
  })

  const Background = styled.div({
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    color: '#FFF',
    position: 'relative',
    cursor: 'zoom-in',
    height: `${imgHeight}px`,
    width: `100%`,
    borderRadius: '20px',
    backgroundImage: `url(${imageUrl})`,
    backgroundPosition: 'center',
    [`:hover ${DisplayOver}`]: {
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    [`:hover ${Hover}`]: {
      opacity: 1,
    },
  })

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

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'pins', pin.id))
  }

  const handleDownload = (event) => {
    event.stopPropagation()
    saveAs(linkGenerate(pin.publicId), pin.id + '.jpg')
  }

  return (
    <div className="mb-4 aspect-auto w-full">
      <Background onClick={() => navigate(`/pin/${pin.id}`)}>
        <DisplayOver>
          <Hover>
            <button
              onClick={handleDownload}
              className="absolute top-3 left-3 aspect-square h-8 rounded-full bg-white/80 p-1 text-2xl text-black hover:bg-white"
            >
              <MdDownloadForOffline />
            </button>
            {pin.destinationLink && (
              <a
                onClick={(event) => event.stopPropagation()}
                href={`https://${pin.destinationLink}`}
                target="_blank"
                className="absolute top-3 left-12 flex aspect-square h-8 items-center justify-center rounded-full bg-white/80 p-1 text-lg text-black hover:bg-white"
              >
                <BsArrowUpRightCircleFill />
              </a>
            )}
            <button
              onClick={handleSavePin}
              className={classNames(
                'absolute top-3 right-3 rounded-full py-2 px-4 font-bold text-white duration-300 hover:scale-110 active:scale-100',
                {
                  'bg-black hover:bg-gray-800': isSaved,
                  'bg-red-500 hover:bg-red-600': !isSaved,
                }
              )}
            >
              {totalSave} {isSaved ? 'Saved' : 'Save'}
            </button>

            <Link
              onClick={(e) => e.stopPropagation()}
              to={`/profile/${pinUser?.email.split('@')[0]}`}
              className="absolute left-3 bottom-3 flex items-center gap-x-2"
            >
              <ProfilePic url={pinUser?.photoURL} className="h-6" />
              <span className="text-sm font-bold">
                {pinUser?.email.split('@')[0]}
              </span>
            </Link>
          </Hover>
        </DisplayOver>
      </Background>
    </div>
  )
}
