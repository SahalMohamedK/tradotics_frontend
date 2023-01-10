import React, { useEffect, useState } from 'react'
import { classNames } from '../utils'

export default function RatioBar({className, positiveFg = 'bg-green-500', 
  negativeFg ='bg-red-500', positiveValue=0, negativeValue=0}) {

  const [curPositiveValue, setPositiveValue] = useState(0)
  const [curNegativeValue, setNegativeValue] = useState(0)

  useEffect(()=>{
    setPositiveValue(positiveValue)
    setNegativeValue(negativeValue)
  }, [positiveValue, negativeValue])

  return (
     <div className={classNames('flex items-center', className)}>
        <div className="w-full bg-secondary-700 rounded-l-full h-2.5">
            <div className={classNames("h-2.5 duration-1000 rounded-l-full ml-auto",negativeFg)} style={{width: curNegativeValue+'%'}}></div>
        </div>
        <div className="w-full bg-secondary-700 rounded-r-full h-2.5 border-l border-white">
            <div className={classNames(" h-2.5 duration-1000 rounded-r-full",positiveFg)} style={{width: curPositiveValue+'%'}}></div>
        </div>
    </div>
  )
}
