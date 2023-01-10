import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { classNames } from '../utils'


export default function IconBtn({className, iconClassName, icon, size = 'lg', box=false,  ...props}) {
  return (
    <div className={classNames(
          'text-center duration-200 cursor-pointer rounded-lg relative', 
          box? size==='sm'?'h-8 w-8':'h-10 w-10':'hover:text-indigo-500 active:text-indigo-700 p-2',
          
          className)} {...props}>
        <FontAwesomeIcon className={classNames('center', iconClassName)} icon={icon} size={size} fixedWidth/>
    </div>
  )
}
