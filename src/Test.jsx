import React, { useEffect, useRef } from 'react'
import { useUI } from './contexts/UIContext'

export default function Test() {
    const { setIsLoading } = useUI()
    let test = useRef()

    useEffect(() => {
        setIsLoading(false)
    }, [])
  
    return (
        <div>
            
        </div>
    )
}
