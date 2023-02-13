import { Menu, Transition } from '@headlessui/react'
import { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import DropdownButton from './DropdownButton'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaCopy, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function PinDropdown({ allowDelete, openDeleteModal }) {
  const handleCopy = () => {
    let url = document.URL
    navigator.clipboard.writeText(url)
    toast('Copied link to your clipboard to share', {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    })
  }

  const handleDelete = () => {
    openDeleteModal()
  }

  return (
    <Menu as="div">
      <div>
        <Menu.Button className="flex aspect-square h-[40px] items-center justify-center rounded-full outline-none duration-200 hover:scale-110 hover:bg-gray-100 active:scale-100 active:bg-white">
          <BsThreeDotsVertical />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 top-12 origin-top-left space-y-2 rounded-2xl bg-white px-3 py-2 shadow-lg focus:outline-none">
          <div className="flex flex-col gap-y-2">
            <Menu.Item className="flex items-center gap-x-2">
              <button
                className="rounded-xl px-4 py-2 outline-none duration-300 hover:scale-110 hover:bg-gray-100 active:scale-100 active:bg-black active:text-white"
                onClick={handleCopy}
              >
                <FaCopy />
                Copy Link
              </button>
            </Menu.Item>
            {allowDelete && (
              <Menu.Item className="flex items-center gap-x-2">
                <button
                  onClick={handleDelete}
                  className="rounded-xl bg-red-500 px-4 py-2 text-white outline-none duration-300 hover:scale-110 hover:bg-red-600 active:scale-100 active:bg-red-500"
                >
                  <FaTrashAlt />
                  Delete
                </button>
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
