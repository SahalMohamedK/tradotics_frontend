import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { classNames } from '../utils'

export default function Icon({className,  icon, size = 'lg', boxSize='1.5rem'}) {
  if (icon) {
    return (
      <div className={classNames('relative rounded-lg', className)} style={{width: boxSize, height: boxSize, minWidth: boxSize, minHeight:boxSize}}>
          <FontAwesomeIcon className='center' icon={icon} size={size} fixedWidth/>
      </div>
    )
  }
}
