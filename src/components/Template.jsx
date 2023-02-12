import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'
import CreateButton from './CreateButton'
import Loader from './Loader'
import Navbar from './Navbar'

export default function Template({ children, className, ...props }) {
  return (
    <div className={`${className}`}>
      <Navbar />
      <div className="relative bg-white">{children}</div>
      {/* <CreateButton /> */}
    </div>
  )
}
