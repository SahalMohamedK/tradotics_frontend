import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import IconBtn from '../components/IconBtn'

export default function Pagination({className, size = 25, limit = 25, onChange=()=>{}, loading = false}) {
  const [start, setStart] = useState(0)

  useEffect(() => {
    onChange(start, size)
  }, [start])

  function prev(){
    if((start+1)-size>0){
      setStart(start-size)
    }
  }

  function next(){
    if((start+1)+size<=limit){
      setStart(start+size)
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
            disabled = {start-size <= 0 || loading}
            box/>
          <div className='bg-secondary-800 material h-6 rounded-lg flex items-center'>
          <div className='mx-2 text-xs'>{start+1} - {start + size <= limit ? start + size: limit} / {limit}</div>
          </div>
          <IconBtn
            className='secondary-btn !py-0 !px-0 !h-6 !w-6'
            icon={faAngleRight}
            size='sm'
            onClick={next}
            disabled={start + size > limit || loading}
            box />
      </div>
    </div>
  )
}
