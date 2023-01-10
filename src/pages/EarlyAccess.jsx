import { faAt, faDiamond, faInfoCircle, faPhone, faUpload, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'
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

export default function EarlyAccess() {
    const [isApply, setIsApply] = useState(false)
    const { setIsLoading, toast } = useUI()

    let nameInput = useRef()
    let brockerDialog = useRef()
    let emailInput = useRef()
    let whatsappInput = useRef()
    let brockerInput = useRef()
    let segmentInput = useRef()

    function onClick(){
        setIsApply(true)
        let name = nameInput.current.getValue()
        let email = emailInput.current.getValue()
        let whatsapp = emailInput.current.getValue()
        let brocker = brockerInput.current.getValue()
        let segment = segmentInput.current.getValue()
        if(name && email && whatsapp && !isNaN(brocker) && !isNaN(segment)){
            
        }else{
            setIsApply(false)
        }
    }

    function showBrockerDialog(){
        brockerDialog.current.show()
    }
    
    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <div className='h-screen flex flex-col'>
            <Dialog className='w-full md:w-1/2' ref={brockerDialog} title='Brocker informations' icon={faUserTie}>
                <div className='mx-2'>
                    <div className='text-4xl'>Zerodha</div>
                    <ul className='list-decimal ml-5 mt-5'>
                        <li>Log in to console.zerodha.com and click on "Reports" and select "Tradebook"</li>
                        <li>Select the filters for date and segment according to your preference and click on "View"</li>
                        <li>Once the list of executions loads, click on "Download" on the top right corner of the executions table to download the CSV of these executions</li>
                        <li>Upload this file</li>
                    </ul>
                    <div className='primary-btn mx-auto w-fit mt-5'>Upload File</div>
                </div>
            </Dialog>
            <Header />
            <div className='grow relative'>
                <div className='center w-full md:w-1/2 lg:w-1/3'>
                    <Card className='mx-5 md:mx-0 text-center'>
                        <div className='my-5 md:mx-5'>
                            <div className='text-2xl font-bold'>Apply for early access</div>
                            <div className='text-left my-5'>
                                <InputField ref={nameInput} className='mb-2' label='Name' icon={faUser}
                                    disabled={isApply} required/>
                                <InputField ref={emailInput} className='mb-2' label='Email' icon={faAt}
                                    disabled={isApply} required/>
                                <InputField ref={whatsappInput} className='mb-2' label='Whatsapp' icon={faPhone}
                                    disabled={isApply} required/>
                                <AutocompleteField ref={brockerInput} className='mb-2' label='Brocker' icon={faUserTie}
                                    values={['ZERODA', 'CRYPTO']} disabled={isApply}  addons={[
                                        <IconBtn className='ml-2' icon={faUpload} onClick={showBrockerDialog}/>
                                    ]}/>
                                <CheckboxField ref={segmentInput} className='mb-2' label='Segment' icon={faDiamond} 
                                    values={['Stock', 'Forex', 'Commodity', 'Crypto', 'Options', 'Futures']} disabled={isApply} />
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
