import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { classNames } from '../utils'


export default function IconBtn({className, iconClassName, icon, size = 'lg', box=false, disabled=false, 
  onClick = ()=>{}, ...props}) {
  return (
    <div 
      className={classNames(
        'text-center duration-200 cursor-pointer rounded-lg relative p-2', 
        box ? 
          classNames(
            size=='sm'?'w-8 h-8':'w-10 h-10',
            disabled?'disabled':''
          ): 
          disabled ?
            'text-gray-800' :
            'hover:text-indigo-500 active:text-indigo-700',
          className)} 
      onClick={(e) => {
        if(!disabled){
          onClick(e)
        }
      }} {...props}>
        <FontAwesomeIcon className={classNames('center', iconClassName)} icon={icon} size={size} fixedWidth/>
    </div>
  )
}
