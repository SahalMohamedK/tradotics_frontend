import { faUser } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState} from 'react'
import InputField from './components/InputField'
import { useUI } from './contexts/UIContext'
import { customMessageValidator, emailValidator } from './core/validators'
import { DUMMY_TRADE } from './libs/consts'
import { Form } from './utils'

export default function Test() {
    const [trade1, setTrade1] = useState(DUMMY_TRADE)
    const [trade2, setTrade2] = useState(DUMMY_TRADE)
    let { setLoading } = useUI()

    let form = new Form()
    let form1 = new Form()
    form.sub('values', form1)

    function validate(){
        if(form.isValid()){
            let data = form.get(true)
        }
    }

    useEffect(() => {
        setLoading(false)
    })
  
    return (
        <div>
            <InputField 
            ref={form.ref}
            icon={faUser}
            label='Name'
            validators={[emailValidator()]}/>
            <button onClick={validate} >Test</button>
        </div>
    )
}
