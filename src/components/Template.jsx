import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import UserContext from '../contexts/UserContext'
import CreateButton from './CreateButton'
import Loader from './Loader'
import Navbar from './Navbar'
import 'react-toastify/dist/ReactToastify.css';

export default function Template({ children, className, ...props }) {
  return (
    <div className={`${className}`}>
      <Navbar />
      <div className="relative bg-white">{children}</div>
      <ToastContainer />
    </div>
  )
}
