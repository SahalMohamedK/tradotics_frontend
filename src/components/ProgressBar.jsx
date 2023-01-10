import React, { useEffect, useState } from 'react'
import { classNames } from '../utils'

export default function ProgressBar({className, fg='bg-gradient-to-r from-indigo-700 to-indigo-400', value=0, max=0}) {
    const [curValue, setCurValue] = useState(0)

    useEffect(() => {
        setCurValue(value*100/max)
    }, [value, max])

  return (
    <div className={classNames("w-full bg-secondary-700 rounded-full h-2.5 mr-3", className)}>
        <div className={classNames("h-2.5 rounded-full duration-1000 ease-in-out", fg)} style={{width: curValue+'%'}}></div>
    </div>
  )
}
