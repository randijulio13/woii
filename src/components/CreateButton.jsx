import React from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import classNames from 'classnames'

export default function CreateButton() {
  return (
    <div className={classNames("z-50 fixed bottom-5 right-5 lg:hidden")}>
      <Link to="/create" onClick={(event) => event.stopPropagation()}>
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-white shadow-lg outline-none duration-200 hover:scale-110 hover:bg-red-600 active:scale-100">
          <FaPlus />
        </button>
      </Link>
    </div>
  )
}
