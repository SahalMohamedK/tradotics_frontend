import { faAt, faCheckCircle, faDiamond, faFile, faPhone, faTrash, faUpload, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react'
import Card from '../components/Card'
import InputField from '../components/InputField'
import { useUI } from '../contexts/UIContext'
import Button from '../components/Button'
import { useRef } from 'react'
import { useState } from 'react'
import Header from '../elements/Header'
import SelectField from '../components/SelectField'
import AutocompleteField from '../components/AutocompleteField'
import IconBtn from '../components/IconBtn'
import Dialog from '../components/Dialog'
import CheckboxField from '../components/CheckboxField'
import { useAPI } from '../contexts/APIContext'
import { classNames, Form } from '../utils'
import FileField from '../components/FileField'
import { fileSizeValidator } from '../libs/validators'
import Icon from '../components/Icon'
import { useNavigate } from 'react-router-dom'

export default function EarlyAccess() {
    const [isApply, setIsApply] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [brockers, setBrockers] = useState([])
    const [brocker, setBrocker] = useState({})
    const { setLoading, toast } = useUI()
    const { getBrockers, getBrockerDetails, addEarlyAccessUser } = useAPI()
    let navigate = useNavigate()

    let brockerDialog = useRef()
    let successDialog = useRef()

    let form = new Form()

    function onClick() {
        setIsApply(true)
        if (form.isValid()) {
            let data = form.get()
            addEarlyAccessUser(data).then(response => {
                if (response.status === 201) {
                    toast.success('Applied successfull.', 'Your data is submitted successfully.')
                    successDialog.current.show()
                }
            }).catch(err => {
                if (err.code === 'ERR_NETWORK') {
                    toast.error('Server error!', 'Somthing went wrong. Check your internet connection.')
                } else if (err.code === 'ERR_BAD_REQUEST') {
                    toast.error('Invalied data', 'You are entered invalied data. Please enter valied data.')
                    form.error(err.response.data)
                } else {
                    toast.error('Somthing went wrong!', 'Inernel server error.')
                }
            }).finally(() => {
                setIsApply(false)
            })
        } else {
            setIsApply(false)
        }
    }

    function showBrockerDialog() {
        let brocker = form.fields.brocker.get()
        if (brocker !== null) {
            brockerDialog.current.show()
            brockerDialog.current.showLoading()
            getBrockerDetails(brocker).then(response => {
                setBrocker(response.data)
            }).catch(err => {

            }).finally(() => {
                brockerDialog.current.hideLoading()
            })
        } else {
            form.fields.brocker.setError('Select an option.')
        }
    }

    useEffect(() => {
        getBrockers().then(response => {
            let brockers = {}
            response.data.forEach(brocker => {
                brockers[brocker.pk] = brocker.name
            })
            setBrockers(brockers)
        }).catch(err => {

        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div className='h-screen flex flex-col'>
            <Dialog className='w-full md:w-1/2' ref={successDialog} onHide={() => navigate('/')}>
                <Icon className='text-green-500 mx-auto mb-2' size='2xl' icon={faCheckCircle} />
                <div className='text-2xl font-bold text-center mb-5'>Application submitted!</div>
                <div className=' p-3 rounded-lg m-2 green-material text-center'>Thank you for submitting your details. We will notify you as soon as the product becomes available.</div>
            </Dialog>
            <Dialog className='w-full md:w-1/2' ref={brockerDialog} title='Brocker informations' icon={faUserTie}>
                <div className='mx-2'>
                    <div className='text-4xl'>{brocker.name}</div>
                    <div className='mt-5'>Upload trade history file from your brocker platform by following these steps to integrate your brocker with Tradotics.</div>
                    <div className='m-5' dangerouslySetInnerHTML={{ __html: brocker.desc }}></div>
                    <div className='flex justify-between items-end mt-5 w-full'>
                        <FileField ref={form.ref} name='file' label="Upload file" icon={faFile} className='w-1/2' validator={fileSizeValidator(1048576 * 5)}
                            onChange={(value) => { setUploaded(value.length !== 0) }} accept= '.csv'
                            addons={[
                                <IconBtn className={classNames(uploaded ? 'block' : 'hidden')} icon={faTrash} size='sm' onClick={() => form.fields.file.reset()} />
                            ]} />
                        <div className='primary-btn w-fit' onClick={() => {
                            if (form.fields.file.isValid()) {
                                brockerDialog.current.hide()
                            }
                        }}>Ok</div>
                    </div>
                </div>
            </Dialog>
            <Header />
            <div className='grow relative'>
                <div className='center w-full md:w-1/2 lg:w-1/3'>
                    <Card className='mx-5 md:mx-0 text-center'>
                        <div className='my-5 md:mx-5'>
                            <div className='text-2xl font-bold'>Apply for early access</div>
                            <div className='text-left my-5'>
                                <InputField ref={form.ref} className='mb-2' label='Name' icon={faUser}
                                    disabled={isApply} required />
                                <InputField ref={form.ref} className='mb-2' label='Email' icon={faAt}
                                    disabled={isApply} required />
                                <InputField ref={form.ref} className='mb-2' label='Whatsapp' icon={faPhone}
                                    disabled={isApply} />
                                <AutocompleteField ref={form.ref} className='mb-2' label='Brocker' icon={faUserTie}
                                    values={brockers} disabled={isApply} addons={[
                                        <IconBtn className='ml-2' icon={faUpload} onClick={showBrockerDialog} disabled />
                                    ]} />
                                <CheckboxField ref={form.ref} className='mb-2' label='Segment' icon={faDiamond} convertor={JSON.stringify}
                                    values={['Stock', 'Forex', 'Commodity', 'Crypto', 'Options', 'Futures']} disabled={isApply} />

                            </div>
                            <div className='w-fit mx-auto pt-3'>
                                <Button className='primary-btn w-full' onClick={onClick} loading={isApply}>Apply</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
