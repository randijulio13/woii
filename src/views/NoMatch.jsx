import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineCaretLeft } from 'react-icons/ai'

export default function NoMatch() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-2 bg-black text-white">
      <h1 className="text-2xl">Page Not Found</h1>
      <Link to="/" className="flex items-center justify-center gap-x-2">
        <AiOutlineCaretLeft /> <span>Go to Home</span>
      </Link>
    </div>
  )
}
