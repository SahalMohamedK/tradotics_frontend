import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import InputField from '../components/InputField'
import { useState } from 'react'
import { useUI } from '../contexts/UIContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import Header from '../elements/Header'

export default function Signin() {
    const [isSignin, setIsSignin] = useState(false)

    let emailRef = useRef()
    let passwordRef = useRef()

    const {signin, isSigned, getUser} = useAuth()
    const { toast, setIsLoading} = useUI()
    const navigate = useNavigate()

    function onClick(){
        setIsSignin(true)
        let email = emailRef.current.getValue()
        let password = passwordRef.current.getValue()

        if(email && password){
            signin(email, password).then((response) => {
                toast.success('Welcome back!','You have successfully logged into Tradotics.')
                setIsSignin(false)
            }).catch((err) => {
                if(err.code === "ERR_NETWORK"){
                    toast.error('Server error!','Somthing went wrong. Check your internet connection.')
                }else if(err.code === "ERR_BAD_REQUEST"){
                    toast.error('Incorrect credentials!','You are given incorrect Email/Password.')
                }else{
                    toast.error('Somthing went wrong!','You need to try sometimes.')
                }
                setIsSignin(false)
            })
        }else{
            setIsSignin(false)
        }
    }

    useEffect(() => {
        if(isSigned){
            navigate('/dashboard');
        }else if(isSigned === false){
            setIsLoading(false)
        }
    }, [isSigned])

    return (
        <div className='h-screen flex flex-col'>
            <Header />
            <div className='grow relative'>
                <div className='center w-full md:w-1/2 lg:w-1/3'>
                    <Card className='mx-5 md:mx-0 text-center'>
                        <div className='my-5 md:mx-5'>
                            <div className='text-2xl font-bold'>Sign In</div>
                            <div className='text-sm text-secondary-500'>Don't have an account? <Link className='text-indigo-500' to='/signup'>Signup</Link></div>
                            <div className='text-left my-5'>
                                <InputField ref={emailRef} className='mb-2' label='Email' icon={faUser} 
                                    disabled={isSignin} onEnter={onClick} required/>
                                <InputField ref={passwordRef} label='Password' icon={faLock} type='password' 
                                    disabled={isSignin} onEnter={onClick} required/>
                            </div>
                            <div className='w-fit mx-auto pt-3'>
                                <Button className='w-full primary-btn' onClick={onClick} loading={isSignin}>Signin</Button>
                                <div className='my-2 text-xs font-bold text-secondary-500'>OR</div>
                                <button className='secondary-btn w-full'>Signin with Google</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
