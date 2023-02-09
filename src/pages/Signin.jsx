import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import InputField from '../components/InputField'
import { useState } from 'react'
import { useUI } from '../contexts/UIContext'
import { useAPI } from '../contexts/APIContext'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import Header from '../elements/Header'
import { Form } from '../utils'

export default function Signin() {
    const [isSignin, setIsSignin] = useState(false)


    const { signin, isSigned, isFirstSigned } = useAPI()
    const { toast, setLoading } = useUI()
    const navigate = useNavigate()

    let emailRef = useRef()
    let passwordRef = useRef()

    let form = new Form()

    function onClick() {
        setIsSignin(true)
        if (form.isValid()) {
            signin(form.get()).then((response) => {
                toast.success('Welcome back!', 'You have successfully logged into Tradotics.')
                setIsSignin(false)
            }).catch((err) => {
                if (err.code === "ERR_NETWORK") {
                    toast.error('Server error!', 'Somthing went wrong. Check your internet connection.')
                } else if (err.code === "ERR_BAD_REQUEST") {
                    toast.error('Incorrect credentials!', err.message)
                    form.error(err.response.data)
                } else {
                    toast.error('Somthing went wrong!', 'You need to try sometimes.')
                }
                setIsSignin(false)
            })
        } else {
            setIsSignin(false)
        }
    }

    useEffect(() => {
        if (isSigned) {
            if (isFirstSigned) {
                navigate('/settings')
                toast.info('Setup your profile', 'First you need to setup user user profile details.')
            }else{
                toast.success('Signin successfully', 'You are already signed in.')
                navigate('/dashboard');
            }
        } else if (isSigned === false) {
            setLoading(false)
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
                            {/* <div className='text-sm text-secondary-500'>Don't have an account? <Link className='text-indigo-500' to='/signup'>Signup</Link></div> */}
                            <div className='text-sm text-secondary-500'>Don't have an account? <Link className='text-indigo-500' to='/early-access'>Apply for early access</Link></div>
                            <div className='text-left my-5'>
                                <InputField ref={form.ref} className='mb-2' label='Email' icon={faUser}
                                    disabled={isSignin} onEnter={onClick} required />
                                <InputField ref={form.ref} label='Password' icon={faLock} type='password'
                                    disabled={isSignin} onEnter={onClick} required />
                            </div>
                            <div className='w-fit mx-auto pt-3'>
                                <Button className='w-full primary-btn' onClick={onClick} loading={isSignin}>Signin</Button>
                                {/* <div className='my-2 text-xs font-bold text-secondary-500'>OR</div>
                                <button className='secondary-btn w-full'>Signin with Google</button> */}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
