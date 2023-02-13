import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

export default function ProfilePic({ url, className, ...props }) {
  return (
    <>
      <img
        {...props}
        src={url}
        className={`${className} aspect-square rounded-full`}
        onError={(event) => {
          event.target.src = '/profile.jpg'
          event.onerror = null
        }}
      />
    </>
  )
}
