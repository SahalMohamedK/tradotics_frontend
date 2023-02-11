import React, { useEffect, useRef, useState } from 'react'
import InputField from './components/InputField'
import SelectField from './components/SelectField'
import { useUI } from './contexts/UIContext'

export default function Test() {
    const { setLoading } = useUI()
    
    const [test, setTest] = useState('')

    useEffect(() => {
        setLoading(false)
    }, [])
  
    return (
        <div>
            <InputField onChange={setTest} value={test}/>
            <button onClick={() => setTest('')}>Reset</button>
            <div>{test}</div>
        </div>
    )
}
