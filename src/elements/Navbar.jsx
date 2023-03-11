import { faUser, faMoon, faPlus, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Filter } from './Filter'
import Icon from '../components/Icon'
import IconBtn from '../components/IconBtn'
import logo from '../media/logo.png'
import { Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { classNames } from '../utils'
import { useAPI } from '../contexts/APIContext'
import { useUI } from '../contexts/UIContext'


export default function Navbar({ filter = true }) {
  const { user, signout } = useAPI()
  const { toast } = useUI()

  function logout() {
    signout().then(response => {
      toast.success("Logged out", response.data.message)
    }).catch(err => {
      toast.error("Unable to logout", err.response.data.details)
    })
  }

  return (
    <div className='backdrop-blur border-b bg-primary-900/50 border-white/10 text-white font-medium top-0 fixed w-full z-50 px-4 md:px-8 py-3'>
      <div className='items-center flex justify-between'>
        <div className='flex items-center'>
          <Link to='/dashboard'><img src={logo} alt="" width='200' /></Link>
          <div className='ml-2 px-2 bg-indigo-500 rounded-full text-sm'>beta</div>
        </div>
        {filter &&
          <Filter className='mx-auto' label='Apply filter' />
        }
        <div className='flex items-center w-60'>
          <IconBtn className='ml-auto mr-3 md:mr-5 text-secondary-500' icon={faMoon} />
          <Link className='mr-3 md:mr-5' to='/add-trades'><IconBtn className=' text-secondary-500' icon={faPlus} /></Link>
          <Menu as="div" className="relative inline-block">
            <div>
              <Menu.Button className="circle !h-9 !w-9 bg-secondary-800/50 border-white/10 border">
                <Icon className='center text-secondary-500' icon={faUser} />
              </Menu.Button>
            </div>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-secondary-800 shadow-lg material focus:outline-none">
                <div className="px-2 py-1">
                  <div className='m-2'>{user.firstName} {user.lastName}</div>
                  <hr className='border-secondary-700' />
                  <Menu.Item>
                    {({ active }) =>
                      <Link className={classNames('w-full text-left flex space-x-1 duration-200 rounded p-1 my-1', active ? 'bg-indigo-500' : '')}
                        to='/settings'>
                        <Icon icon={faGear} size='sm' />
                        <div>Settings</div>
                      </Link>
                    }
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) =>
                      <button className={classNames('w-full text-left flex space-x-1 duration-200 rounded p-1 my-1', active ? 'bg-indigo-500' : '')}
                        onClick={logout}>
                        <Icon icon={faRightFromBracket} size='sm' />
                        <div>Logout</div>
                      </button>
                    }
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}