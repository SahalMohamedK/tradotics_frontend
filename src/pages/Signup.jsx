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

export default function Signup() {
    const [isSignup, setIsSignup] = useState()
    const { setIsLoading, toast } = useUI()
    const { signup } = useAPI()

    let emailInput = useRef()
    let usernameInput = useRef()
    let passwordInput = useRef()
    let rePasswordInput = useRef()

    function onClick(){
        setIsSignup(true)
        let email = emailInput.current.getValue()
        let password = passwordInput.current.getValue()
        let rePassword = rePasswordInput.current.getValue()
        if(email && password && rePassword){
            if(password === rePassword){
                signup(email, password).then(response => {
                    toast.success('Welcome to Tradotics.','You have successfully registred into Tradotics.')
                    setIsSignup(false)
                    emailInput.current.reset()
                    usernameInput.current.reset()
                    passwordInput.current.reset()
                    rePasswordInput.current.reset()
                }).catch(err => {
                    if(err.code === "ERR_NETWORK"){
                        toast.error('Server error!','Somthing went wrong. Check your internet connection.')
                    }else if(err.code === "ERR_BAD_REQUEST"){
                        toast.error('Incorrect credentials!','You are given incorrect Email/Password.')
                    }else{
                        toast.error('Somthing went wrong!','You need to try sometimes.')
                    }
                    setIsSignup(false)
                })
            }else{
                rePasswordInput.current.setError("The passwords don't match. Please re-enter the password.")
                setIsSignup(false)
            }
        }else{
            setIsSignup(false)
        }
    }
    
    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <div className='h-screen flex flex-col'>
            <header className='border-white/0 text-white font-medium px-4 md:px-8 py-3' >
                <div className='items-center flex'>
                    <img src={logoImg} alt="" width='30'/>
                    <div className='ml-5 text-lg font-bold'>Tradotics</div>
                    <Link className='ml-auto mr-10 hover:text-indigo-500' to=''>Home</Link>
                    <Link className='hover:text-indigo-500' to='#tutorial'>Tutorial</Link>
                    <Link className='ml-10 hover:text-indigo-500' to='#pricing'>Pricing</Link>
                    <Link className='secondary-btn ml-auto mr-2' to='/signup'>Signup</Link>
                    <Link className='primary-btn' to='/signin'>Signin</Link>
                </div>
            </header>
            <div className='grow relative'>
                <div className='center w-full md:w-1/2 lg:w-1/3'>
                    <Card className='mx-5 md:mx-0 text-center'>
                        <div className='my-5 md:mx-5'>
                            <div className='text-2xl font-bold'>Sign Up</div>
                            <div className='text-sm text-secondary-500'>Already have an account? <Link className='text-indigo-500' to='/signin'>Signin</Link></div>
                            <div className='text-left my-5'>
                                <InputField ref={emailInput} className='mb-2' label='Email' icon={faUser}
                                    disabled={isSignup} required/>
                                <InputField ref={usernameInput} className='mb-2' label='Username' icon={faAt}/>
                                <InputField ref={passwordInput} className='mb-2' label='Password' icon={faLock} type='password'
                                    disabled={isSignup} required/>
                                <InputField ref={rePasswordInput} label='Repeat password' icon={faLock} type='password'
                                    disabled={isSignup} required/>
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
