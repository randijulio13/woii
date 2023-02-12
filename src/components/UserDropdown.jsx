import { Menu, Transition } from '@headlessui/react'
import { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import DropdownButton from './DropdownButton'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function UserDropdown() {
    const { user, setUser } = useContext(UserContext)

    const handleSignOut = () => {
        signOut(auth).then(() => {
            setUser(null)
        })
    }
    return (

        <Menu as="div">
            <div>
                <Menu.Button className='rounded-full outline-none hover:bg-gray-100 duration-200 hover:scale-110 p-2 h-14 active:bg-white active:scale-100'>
                    <img src={user.photoURL} className="rounded-full h-full" alt="" />
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
                <Menu.Items className="absolute right-2 py-2 space-y-2 px-3 origin-top-right rounded-lg bg-white shadow-lg focus:outline-none">
                    <div>
                        <span className='tracking-light text-sm text-gray-500'>Currently In</span>
                        <Menu.Item>
                            <Link to={'/profile'}>
                                <DropdownButton>
                                    <div className="flex gap-x-4 my-1">
                                        <div>
                                            <img src={user.photoURL} className='rounded-full h-16' alt="" />
                                        </div>
                                        <div className='w-auto flex flex-col justify-center items-start min-h-full'>
                                            <span className="font-bold">{user.displayName}</span>
                                            <span className="text-gray-400 text-sm">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownButton>
                            </Link>
                        </Menu.Item>
                    </div>

                    <div>
                        <span className='tracking-light text-sm text-gray-500'>More Options</span>
                        <Menu.Item>
                            <DropdownButton onClick={handleSignOut}>
                                Logout
                            </DropdownButton>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )

}
