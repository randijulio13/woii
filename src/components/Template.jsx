import React from 'react'
import CreateButton from './CreateButton'
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
