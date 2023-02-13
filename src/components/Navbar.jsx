import React, { useContext, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import UserDropdown from './UserDropdown'
import { RiCameraLensFill } from 'react-icons/ri'

export default function Navbar() {
  const { user, setUser } = useContext(UserContext)

  const menus = [
    { title: 'Home', to: '/' },
    { title: 'Create', to: '/create' },
  ]

  return (
    <nav className="sticky top-0 z-50  flex h-[72px] w-full items-center justify-between bg-white px-5 shadow">
      <div className="flex w-1/4 items-center space-x-4">
        <NavLink to="/" className="outline-none">
          <h1 className="flex items-center font-title text-3xl">
            W
            <span className="text-red-500">
              <RiCameraLensFill />
            </span>
            ii
          </h1>
        </NavLink>
        <div className="hidden gap-x-3 lg:flex">
          {menus.map((menu, index) => (
            <NavLink
              key={index}
              to={menu.to}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-black px-4 py-2 font-bold text-white duration-200 hover:scale-110 active:scale-100'
                  : 'rounded-full px-4 py-2 font-bold duration-200 hover:scale-110 hover:bg-gray-200 active:scale-100'
              }
            >
              {menu.title}
            </NavLink>
          ))}
        </div>
      </div>
      {/* <div className="w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border bg-gray-200 px-4 py-2.5 outline-none duration-300 placeholder:font-semibold hover:bg-gray-300 focus:bg-gray-200 active:bg-gray-100"
        />
      </div> */}
      <div className="flex w-1/4 justify-end">
        <UserDropdown />
      </div>
    </nav>
  )
}
