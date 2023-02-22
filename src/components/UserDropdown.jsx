import { Menu, Transition } from '@headlessui/react'
import { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import DropdownButton from './DropdownButton'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import ProfilePic from './ProfilePic'

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
        <Menu.Button className="h-14 rounded-full p-2 outline-none duration-200 hover:scale-110 hover:bg-gray-100 active:scale-100 active:bg-white">
          <ProfilePic className="h-full" url={user?.photoURL} />
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
        <Menu.Items className="absolute right-2 origin-top-right space-y-2 rounded-lg bg-white py-2 px-3 shadow-lg focus:outline-none">
          <div>
            <span className="tracking-light text-sm text-gray-500">
              Currently In
            </span>
            <Menu.Item>
              <Link to={`/profile/${user.email.split('@')[0]}`}>
                <DropdownButton>
                  <div className="my-1 flex gap-x-4">
                    <div>
                      <ProfilePic url={user?.photoURL} className="h-16" />
                    </div>
                    <div className="flex min-h-full w-auto flex-col items-start justify-center">
                      <span className="font-bold">{user.displayName}</span>
                      <span className="text-sm text-gray-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownButton>
              </Link>
            </Menu.Item>
          </div>

          <div>
            <span className="tracking-light text-sm text-gray-500">
              More Options
            </span>
            <Menu.Item>
              <DropdownButton onClick={handleSignOut}>Logout</DropdownButton>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
