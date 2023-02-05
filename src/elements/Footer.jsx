import React from 'react'
import logoImg from '../media/logo.png'
import IconBtn from '../components/IconBtn'
import { faFacebook, faInstagram, faLinkedinIn, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Icon from '../components/Icon'

export default function Footer() {
    return (
        <footer className='backdrop-blur material bg-primary-900/50 mt-20 p-5 md:px-28 md:pt-10 md:pb-4'>
            <div className='md:flex justify-between'>
                <div className='md:w-1/3'>
                    <img src={logoImg} alt="" width='200'/>
                    <div className='mt-5 flex justify-center md:justify-start space-x-5'>
                        <a href='https://www.youtube.com/channel/UCyOguespfg26AYB2cd_uBlQ'><IconBtn icon={faYoutube}/></a>
                        <a href='https://www.facebook.com/profile.php?id=100086898324327'><IconBtn icon={faFacebook}/></a>
                        <a href='https://www.instagram.com/tradotics/'><IconBtn icon={faInstagram}/></a>
                        <a href='https://twitter.com/tradotics'><IconBtn icon={faTwitter}/></a>
                        <a href='https://www.linkedin.com/company/tradotics/?viewAsMember=true '><IconBtn icon={faLinkedinIn}/></a>
                    </div>
                </div>
                <div className='mt-10 md:mt-0 md:w-1/3'>
                    <div className='text-secondary-500'>Links</div>
                    <Link className='block hover:text-indigo-500 duration-200' to=''>Terms and conditions</Link>
                    <Link className='block hover:text-indigo-500 duration-200' to=''>Privacy policy</Link>
                    <Link className='block hover:text-indigo-500 duration-200' to=''>Blog</Link>
                </div>
                <div className='mt-10 md:mt-0 md:w-1/3'>
                    <div className='text-secondary-500'>Contact us</div>
                    {/* <div className='flex items-center space-x-2'>
                        <Icon icon={faMapMarker}/>
                        <div>Malappuram, Kerala, India, 676320</div>
                    </div> */}
                    <div className='flex items-center space-x-2'>
                        <Icon icon={faEnvelope}/>
                        <div>tradotics@gmail.com</div>
                    </div>
                    {/* <div className='flex items-center space-x-2'>
                        <Icon icon={faPhone}/>
                        <div>+9199999999</div>
                    </div> */}
                </div>
            </div>
            <div className='border-t border-white/10 mt-10 text-center md:flex text-secondary-500 pt-4 text-sm'>
                <div>
                    Copyright &#169; 2023 <Link className='font-bold hover:text-indigo-500 duration-200'>Tradotics</Link> All Rights Reserved.
                </div>
                <div className='mt-4 md:mt-0 md:ml-auto'>
                    Developed by <a href='https://www.instagram.com/inksignature/' className='font-bold hover:text-indigo-500 duration-200'>Ink Signature</a>. 
                </div>
            </div>
        </footer>
    )
}
