import { faAt, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import logoImg from '../media/logo.png'
import InputField from '../components/InputField'
import { useUI } from '../contexts/UIContext'
import Button from '../components/Button'
import { useRef } from 'react'
import { useState } from 'react'
import { useAPI } from '../contexts/APIContext'
import { Form } from '../utils'
import Header from '../elements/Header'

export default function Signup() {
    const [isSignup, setIsSignup] = useState()
    const { setLoading, toast } = useUI()
    const { signup } = useAPI()

    let form = new Form()

    function onClick() {
        setIsSignup(true)
        if (form.isValid()) {
            let data = form.get()
            signup(data).then(response => {
                toast.success('Welcome to Tradotics.', 'You have successfully registred into Tradotics.')
                setIsSignup(false)
                form.reset()
            }).catch(err => {
                if (err.code === "ERR_NETWORK") {
                    toast.error('Server error!', 'Somthing went wrong. Check your internet connection.')
                } else if (err.code === "ERR_BAD_REQUEST") {
                    toast.error('Incorrect credentials!', 'You are given incorrect Email/Password.')
                    console.log(err.response.data);
                    form.error(err.response.data)
                } else {
                    toast.error('Somthing went wrong!', 'You need to try sometimes.')
                    console.log(err);
                }
                setIsSignup(false)
            })
        } else {
            setIsSignup(false)
        }
    }

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <div className='h-screen flex flex-col'>
            <Header />

            <div className='grow relative'>
                <div className='center w-full md:w-1/2 lg:w-1/3'>
                    <Card className='mx-5 md:mx-0 text-center'>
                        <div className='my-5 md:mx-5'>
                            <div className='text-2xl font-bold'>Sign Up</div>
                            <div className='text-sm text-secondary-500'>Already have an account? <Link className='text-indigo-500' to='/signin'>Signin</Link></div>
                            <div className='text-left my-5'>
                                <InputField ref={form.ref} className='mb-2' label='Email' icon={faUser}
                                    disabled={isSignup} required />
                                <InputField ref={form.ref} className='mb-2' label='Username' icon={faAt}
                                    disabled={isSignup} required />
                                <InputField ref={form.ref} className='mb-2' label='Password' icon={faLock} type='password'
                                    disabled={isSignup} required />
                                <InputField ref={form.ref} label='Repeat password' name='rePassword' icon={faLock} type='password'
                                    disabled={isSignup} required />
                            </div>
                            <div className='w-fit mx-auto pt-3'>
                                <Button className='primary-btn w-full' onClick={onClick} loading={isSignup}>Signup</Button>
                                <div className='my-2 text-xs font-bold text-secondary-500'>OR</div>
                                <button className='secondary-btn w-full'>Signup with Google</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
