import React, { useContext, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import UserDropdown from './UserDropdown'
import { RiCameraLensFill } from 'react-icons/ri'

export default function Navbar() {

    const { user, setUser } = useContext(UserContext)
    
    return (
        <nav className='w-full sticky h-[72px]  top-0 z-50 shadow flex items-center justify-between px-5 bg-white'>
            <div className='flex space-x-4 items-center w-1/4'>
                <NavLink to="/" className='outline-none'><h1 className="font-title text-3xl flex items-center">W<span className='text-red-500'><RiCameraLensFill /></span>ii</h1></NavLink>
                <NavLink to="/" className={({ isActive }) => isActive ? 'bg-black text-white rounded-full font-bold px-4 py-2 hover:scale-110 active:scale-100 duration-200' : 'hover:scale-110 active:scale-100 duration-200 rounded-full font-bold px-4 py-2 hover:bg-gray-200'}>
                    Home
                </NavLink>
                <NavLink to="/create" className={({ isActive }) => isActive ? 'bg-black text-white rounded-full font-bold px-4 py-2 hover:scale-110 active:scale-100 duration-200' : 'hover:scale-110 active:scale-100 duration-200 rounded-full font-bold px-4 py-2 hover:bg-gray-200'}>
                    Create
                </NavLink>
            </div>
            <div className="w-1/2">
                <input type="text" placeholder='Search' className='hover:bg-gray-300 placeholder:font-semibold border active:bg-gray-100 focus:bg-gray-200 duration-300 rounded-full w-full outline-none bg-gray-200 px-4 py-2.5' />
            </div>
            <div className='w-1/4 flex justify-end'>
                <UserDropdown />
            </div>
        </nav>
    )
}
