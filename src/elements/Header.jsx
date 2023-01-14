import React from 'react'
import { classNames } from '../utils'
import logoImg from '../media/logo.png'
import { Link } from 'react-router-dom'
import { HashLink} from 'react-router-hash-link';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import IconBtn from '../components/IconBtn'
import { useState } from 'react'

export default function Header() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <header className={classNames(' overflow-y-hidden duration-200 backdrop-blur-lg border-b bg-primary-900/50 !border-white/10 text-white font-medium top-0 fixed w-full z-50 px-4 md:px-8 py-3',
            collapsed?'h-60':'h-16 md:h-auto')} >
            <div className='items-center md:flex'>
                <div className='flex items-center'>
                    <Link to='/'><img src={logoImg} alt="" width='200'/></Link>
                    <IconBtn className='secondary-btn ml-auto block md:hidden' iconClassName={classNames('duration-200',collapsed?'rotate-180 ':'')}
                        icon={faAngleDown} onClick={() => setCollapsed(!collapsed)} box/>
                </div>
                <div className='flex flex-col md:flex-row ml-auto md:space-x-10 text-center space-y-4 md:space-y-0 my-4 md:my-0'>
                    <Link className='hover:text-indigo-500' to='/'>Home</Link>
                    <Link className='hover:text-indigo-500' to='/features'>Features</Link>
                    <HashLink className='hover:text-indigo-500' to='/#pricing'>Pricing</HashLink>
                </div>
                <div className='flex md:ml-auto'>
                    {/* <Link className='w-full secondary-btn mr-2' to='/signup'>Signup</Link> */}
                    <Link className='w-full secondary-btn mr-2' to='/early-access'>Apply for early access</Link>
                    <Link className='w-full primary-btn' to='/signin'>Signin</Link>
                </div>
            </div>
        </header>
    )
}
