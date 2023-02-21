import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../../contexts/UIContext'

export default function UnderConstruction() {
  let {setLoading} = useUI()

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className='h-full relative'>
        <div className='center text-center'>
            <div className='text-4xl font-bold uppercase'>This page is under<br/>Construction!</div>
              <div className='text-secondary-500 mt-5'>Go to <Link to='/dashboard' className='text-indigo-500'>dashboard</Link></div>
        </div>
    </div>
  )
}
