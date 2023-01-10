import React from 'react'
import { classNames } from '../utils'

function Card({children, className, innerClassName}) {
  return (
    <div className={className}>
        <div className='p-1 h-full relative'>
            <div className={classNames('card', innerClassName)}>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Card