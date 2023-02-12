import React from 'react'
import { FaSpinner } from 'react-icons/fa'

export default function Loader() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className="animate-spin rounded-full bg-black p-2 text-4xl text-white">
        <FaSpinner />
      </span>
    </div>
  )
}
