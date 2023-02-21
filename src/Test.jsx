import React, { useEffect, useRef, useState } from 'react'
import InputField from './components/InputField'
import SelectField from './components/SelectField'
import { useUI } from './contexts/UIContext'
import { useAPI } from './contexts/APIContext'
import { API_URL } from './config'

export default function Test() {
    const { setLoading, toast } = useUI()
    const { get, getAuth } = useAPI()
    
    const [test, setTest] = useState('')

    useEffect(() => {
        setLoading(false)
        toast.success('test', '')
        get(API_URL+'/test', getAuth())
    }, [])
  
    return (
        <div>
            
        </div>
    )
}
