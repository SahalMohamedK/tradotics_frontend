import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import IconBtn from '../components/IconBtn'
import { classNames, range } from '../utils'

export default function Pagination({className, size = 25, limit = 25, onChange=()=>{}}) {
  const [cur, setCur] = useState(1)

  useEffect(() => {
    onChange(cur)
  }, [cur])

  function prev(){
    if(cur-size>0){
      setCur(cur-size)
    }
  }

  function next(){
    if(cur+size<=limit){
      setCur(cur+size)
    }
  }

  return (
    <div className={className}>
        <div className='flex space-x-2 items-center'>
          <IconBtn
            className='secondary-btn !py-0 !px-0 !h-6 !w-6'
            icon={faAngleLeft}
            size='sm'
            onClick={prev}
            disabled = {cur-size <= 0}
            box/>
          <div className='bg-secondary-800 material h-6 rounded-lg flex items-center'>
          <div className='mx-2 text-xs'>{cur} - {cur + size - 1 <= limit ? cur + size - 1: limit} / {limit}</div>
          </div>
          <IconBtn
            className='secondary-btn !py-0 !px-0 !h-6 !w-6'
            icon={faAngleRight}
            size='sm'
            onClick={next}
            disabled={cur + size > limit}
            box />
      </div>
    </div>
  )
}
