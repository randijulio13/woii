import styled from '@emotion/styled/macro'
import React, { useContext, useEffect, useState } from 'react'
import { linkGenerate } from '../lib/cloudinary'
import { MdDownload } from 'react-icons/md'
import { ImRedo2 } from 'react-icons/im'
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

export default function PinCard({ pin, pinUser }) {
  const { user } = useContext(UserContext)
  const imageUrl = linkGenerate(pin.publicId, 250)
  const [imgHeight, setImgHeight] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [totalSave, setTotalSave] = useState(0)

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
    width: `${imgWidth}px`,
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

  const handleSavePin = async () => {
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

  const handleDownload = () => {
    saveAs(linkGenerate(pin.publicId), pin.id + '.jpg')
  }

  return (
    <div className="mb-4 aspect-auto w-full">
      <Background>
        <DisplayOver>
          <Hover>
            <button
              onClick={handleDownload}
              className="absolute top-3 left-3 rounded-full bg-white/80 p-1 text-2xl text-black hover:bg-white"
            >
              <MdDownload />
            </button>

            <button
              onClick={handleSavePin}
              className={classNames(
                'absolute top-3 right-3 rounded-full py-1 px-4 font-bold text-white',
                {
                  'bg-black hover:bg-gray-800': isSaved,
                  'bg-red-500 hover:bg-red-600': !isSaved,
                }
              )}
              //   className={`$absolute top-3 right-3 rounded-full bg-red-500 py-1 px-4 font-bold text-white hover:bg-red-600`}
            >
              {totalSave} {isSaved ? 'Saved' : 'Save'}
            </button>

            {pin.destinationLink && (
              <a
                href={pin.destinationLink}
                target="_blank"
                className="absolute bottom-3 left-3 flex items-center gap-x-2 rounded-full bg-white/80 px-2 py-1 text-black outline-none hover:bg-white"
              >
                <span className="text-lg">
                  <ImRedo2 />
                </span>
                {destinationLink(pin.destinationLink)}
              </a>
            )}
          </Hover>
        </DisplayOver>
      </Background>
      <div className="mt-2 flex items-center gap-x-2">
        <img
          src={pinUser?.photoURL}
          className="aspect-square h-6 rounded-full"
          alt=""
        />
        <span className="text-sm font-bold">{pinUser?.name}</span>
      </div>
    </div>
  )
}
