import React from 'react'
import { classNames } from '../utils'

export default function ComingSoon({children, className}) {
  return (
    <div 
        className={classNames(
            'relative',
            className
        )}>
            <div className='center primary-material text-white px-2 py-1 whitespace-nowrap rounded-lg font-bold z-10'>Coming soon</div>
          <div className='blur-sm pointer-events-none h-full'>{children}</div>
    </div>
  )
}
