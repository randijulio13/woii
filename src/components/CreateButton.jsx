import React from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

export default function CreateButton() {
    return (
        <div className="fixed z-90 bottom-5 lg:bottom-10 right-5 lg:right-10">
            <Link to="/create">
                <button className='rounded-full h-14 w-14 duration-200 hover:scale-110 bg-black active:scale-100 hover:bg-gray-900 text-white shadow-lg flex items-center justify-center font-bold text-xl'><FaPlus /></button>
            </Link>
        </div>
    )
}
