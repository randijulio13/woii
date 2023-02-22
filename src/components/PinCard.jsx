import styled from '@emotion/styled/macro'
import { saveAs } from 'file-saver'
import React, { useEffect, useState } from 'react'
import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { getImgMeta } from '../helpers'
import { linkGenerate } from '../lib/cloudinary'
import ProfilePic from './ProfilePic'
import SavePinButton from './SavePinButton'

export default function PinCard({ pin, pinUser }) {
  const imageUrl = linkGenerate(pin.publicId, 250)
  const [imgHeight, setImgHeight] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    getMeta()
  }, [])

  const getMeta = async () => {
    let res = await getImgMeta(imageUrl)
    setImgHeight(res.naturalHeight)
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
    borderRadius: '20px',
    backgroundPosition: 'center',
    [`:hover ${DisplayOver}`]: {
      backgroundColor: 'rgba(0,0,0,.5)',
    },
    [`:hover ${Hover}`]: {
      opacity: 1,
    },
  })

  const handleDownload = (event) => {
    event.stopPropagation()
    saveAs(linkGenerate(pin.publicId), pin.id + '.jpg')
  }

  return (
    <div className={`mb-4 aspect-auto`}>
      <Background onClick={() => navigate(`/pin/${pin.id}`)}>
        <img
          src={imageUrl}
          alt=""
          className="w-full"
          height={`${imgHeight}px`}
        />
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
            <SavePinButton pin={pin} className="top-3 right-3" />

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
