import React from 'react'
import { classNames } from '../utils'

export default function Tooltip({children, className, content, placement='bottom'}) {
  return (
    <div className={classNames('relative flex items-center justify-center group', className)}>
        {children}
        <div className='absolute w-auto px-5 py-2 m-2 min-w-max left-14 rounded bg-blue-500 font-bold text-lg text-white scale-0 
            duration-200 group-hover:scale-100 hidden md:block'>
            <div className='absolute w-3 h-3 rotate-45 bg-blue-500 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'></div>
            {content}
        </div>
    </div>
  )
}
