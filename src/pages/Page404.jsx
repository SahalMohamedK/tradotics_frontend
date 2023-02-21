import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../contexts/UIContext'

export default function Page404() {
    let { setLoading } = useUI()

    useEffect(() => {
        setLoading(false)
    })
  return (
    <div className='h-screen relative'>
        <div className='center text-center'>
            <div className='text-8xl font-bold mb-5 text-indigo-500'>404</div>
            <div className='text-2xl font-bold'>OPPS! PAGE NOT FOUND</div>
            <div className='text-secondary-500'>Sorry, the page you're looking for doesn't exists.</div>
            <Link className='primary-btn w-fit mt-5 mx-auto' to='/'>Return Home</Link>
        </div>
    </div>
  )
}
