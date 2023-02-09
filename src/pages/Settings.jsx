import React, { useRef } from 'react'
import { iconTabAdapter } from '../adapters/tabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tab, TabBar, TabView } from '../components/Tab'
import { fa1, fa2, faClock, faCode, faCoins, faCommentDollar, faCopy, faDollar, faEnvelope, faHandHoldingDollar, faLock, faMoneyBill, faPersonWalkingArrowRight, faPhone, faPlus, faPlusCircle, faSliders, faSuitcase, faTrash, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Icon from '../components/Icon'
import Card from '../components/Card'
import Table from '../components/Table'
import Dialog from '../components/Dialog'
import IconBtn from '../components/IconBtn'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import { adjustmentsDialogTableAdapter, commissionSettingsTableAdapter, instituteSettingsTableAdapter, portfolioSettingsTableAdapter, referSettingsTableAdapter, withdrawalsSettingsTableAdapter } from '../adapters/table'
import { useAPI } from '../contexts/APIContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUI } from '../contexts/UIContext'
import Button from '../components/Button'
import { Form } from '../utils'

function Settings() {
    const [isUpdateUser, setIsUpdateUser] = useState(false)
    const { isSigned, isFirstSigned, user, updateUser } = useAPI()
    const { setLoading, toast } = useUI()
    const navigate = useNavigate()

    let tabView = useRef()
    let adjustmentsDialog = useRef()
    let commissionsDialog = useRef()
    let pictureInput = useRef()

    let userForm = new Form()
    let profileForm = new Form()
    let securityForm = new Form()
    userForm.sub('profile', profileForm)

    function uploadPicture(){
        pictureInput.current.click();
    }

    function saveAccount() {
        setIsUpdateUser(true)
        if (userForm.isValid()) {
            updateUser(userForm.get(true)).then(() => {
                toast.success('Profile updated', 'Your profile is updated successfully.')
                setIsUpdateUser(false)
            }).catch(err => {
                if (err.code === "ERR_BAD_RESPONSE") {
                    toast.error('Somthing went wrong!', 'Inernel server error')
                }
                setIsUpdateUser(false)
            })
        } else {
            setIsUpdateUser(false)
        }
    }

    useEffect(() => {
        if (isSigned === false) {
            navigate('/signin')
        } else {
            setLoading(false)
        }
        userForm.set(user)
    }, [isSigned, isFirstSigned, user])

    return (
        <div className='h-full py-16 lg:pb-0'>
            <Dialog className='' ref={commissionsDialog} title='Edit'>
                <div>Brocker: Zerodha</div>
                <div>Asset type: Forex</div>
                <div className='flex space-x-10'>
                    <div className='w-1/2 whitespace-nowrap'>
                        <div className='mt-4 mb-2 font-bold'>Commission:</div>
                        <div className='mb-2 text-sm'>How to apply commission</div>
                        <div className='flex space-x-2'>
                            <SelectField values={['Apply commission per share', 'Apply commission per order']} />
                            <InputField className='w-24' icon={faDollar} type='number' />
                        </div>
                        <div className='my-2 pl-1 flex items-center'>
                            <input type="checkbox" className='checkbox !bg-secondary-800' />
                            <div className='ml-2 text-sm'>Apply this to your previous trades</div>
                        </div>
                        <div className='my-2 pl-1 flex items-center'>
                            <input type="checkbox" className='checkbox !bg-secondary-800' />
                            <div className='ml-2 text-sm'>Apply this to your next trades</div>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <div className='mt-4 mb-2 font-bold'>Fee:</div>
                        <div className='mb-2 text-sm'>How to apply fee</div>
                        <div className='flex space-x-2'>
                            <SelectField values={['Apply fee per share', 'Apply fee per order']} />
                            <InputField className='w-24' icon={faDollar} type='number' />
                        </div>
                        <div className='my-2 pl-1 flex items-center'>
                            <input type="checkbox" className='checkbox !bg-secondary-800' />
                            <div className='ml-2 text-sm'>Apply this to your previous trades</div>
                        </div>
                        <div className='my-2 pl-1 flex items-center'>
                            <input type="checkbox" className='checkbox !bg-secondary-800' />
                            <div className='ml-2 text-sm'>Apply this to your next trades</div>
                        </div>
                    </div>
                </div>
                <div className='flex space-x-2 justify-end mt-5'>
                    <div className='secondary-btn'>Cancel</div>
                    <div className='primary-btn'>Save</div>
                </div>
            </Dialog>
            <Dialog className='w-1/2' ref={adjustmentsDialog} title='Adjustments'>
                <div>Portfolio - Test 1</div>
                <Table headers={['Type', 'Value', 'Date', 'Description', '']}
                    adapter={adjustmentsDialogTableAdapter}
                    data={[
                        ['Deposit', 1200, '19 Oct 2022', 'Saving balance deposited']
                    ]} />
                <div className='flex space-x-2 mt-5'>
                    <SelectField className='w-1/3' label='Type' values={['RELIANCE', 'ASSIANPAINTS']} />
                    <InputField className='w-1/3' label='Value' type='number' />
                    <InputField className='w-1/3' label='Date' type='date' />
                </div>
                <div className='flex items-end space-x-2'>
                    <InputField className='w-full' label='Description' />
                    <div className='primary-btn !py-2'>Add</div>
                </div>
            </Dialog>
            <div className='md:flex md:space-x-2 pt-5 h-full'>
                <TabBar className='flex w-full overflow-auto md:overflow-visible whitespace-nowrap md:block mb-2 md:mb-0 mx-2 md:w-1/4 lg:w-1/5' view={tabView} adapter={iconTabAdapter}>
                    <Tab id='account' icon={faUser} label='Account' active />
                    <Tab id='security' icon={faLock} label='Security' />
                    <Tab id='billing' icon={faMoneyBill} label='Billing & Plans' />
                    <Tab id='refer' icon={faCommentDollar} label='Refer and earn' />
                    <Tab id='portfolio' icon={faSuitcase} label='Portfolio' />
                    <Tab id='commisions' icon={faHandHoldingDollar} label='Commisions' />
                    <Tab id='institute' icon={faUsers} label='Institute group' />
                </TabBar>
                <TabView ref={tabView} className=' md:w-3/4 lg:w-4/5 h-full'>
                    <Tab id='account'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faUser} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Account settings</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-xs font-bold mb-2'>Profile picture</div>
                                <div className='flex items-center'>
                                    <div className='circle bg-secondary-800 !w-16 !h-16'>
                                        <FontAwesomeIcon className='center text-secondary-600' icon={faUser} size='xl' />
                                    </div>
                                    <div className='ml-5 flex flex-col space-y-2'>
                                        <input ref={pictureInput} type="file" style={{ display: 'none' }} accept='image/jpeg,image/png' />
                                        <button href="#" className="primary-btn text-xs mb-1 mr-1" onClick={uploadPicture}>Upload</button>
                                        <button href="#" className="secondary-btn text-xs mb-1 mr-1">Remove</button>
                                    </div>
                                </div>
                            </div>
                            <div className='md:flex md:space-x-2'>
                                <InputField ref={userForm.ref} className='w-full mb-3' label='First name' icon={fa1}
                                    disabled={isUpdateUser} required subLabel />
                                <InputField ref={userForm.ref} className='w-full mb-3' label='Last name' icon={fa2}
                                    disabled={isUpdateUser} required subLabel />
                            </div>
                            <div className='md:flex md:space-x-2'>
                                <InputField ref={userForm.ref} className='w-full mb-3' label='Username' icon={faUser}
                                    readOnly subLabel />
                                <InputField ref={userForm.ref} className='w-full mb-3' label='Email' icon={faEnvelope}
                                    readOnly subLabel />
                            </div>
                            <div className='md:flex flex-wrap'>
                                <InputField ref={profileForm.ref} name='phoneNumber' className='w-full md:w-1/3 mb-3 pr-2' label='Phone number' icon={faPhone}
                                    disabled={isUpdateUser} required />
                                <SelectField ref={userForm.ref} className='w-full md:w-1/3 mb-3 pr-2' label='Time zone' icon={faClock} values={['Asia/Calcutta']} />
                                <SelectField ref={userForm.ref} className='w-full md:w-1/3 mb-3 lg:pr-0 md:pr-2' label='Currency' icon={faCoins} values={['INR - Indian rupees']} />
                            </div>
                            <div className='flex space-x-2'>
                                <Button className="primary-btn mb-1" onClick={saveAccount} loading={isUpdateUser}>Save</Button>
                                <Button className="secondary-btn mb-1" onClick={saveAccount} disabled>Reset</Button>
                            </div>
                        </Card>
                    </Tab>
                    <Tab id='security'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faLock} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Security settings</div>
                            </div>
                            <InputField ref={securityForm.ref} className='md:w-1/2 mb-3' label='Old password' type='password' icon={faLock} />
                            <div className='md:flex md:space-x-2'>
                                <InputField ref={securityForm.ref} className='w-full mb-3' label='New password' type='password' icon={faLock} />
                                <InputField ref={securityForm.ref} className='w-full mb-3' label='Confirm new password' type='password' icon={faLock} />
                            </div>
                            <button href="#" className="duration-200 bg-indigo-500 text-white px-4 py-1 rounded active:bg-indigo-900 hover:bg-indigo-700 mb-1 mr-1">Save</button>

                        </Card>
                    </Tab>
                    <Tab id='billing'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faMoneyBill} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Billing settings</div>
                            </div>
                            <div className='mb-3'>Current plane: Free</div>
                            <button href="#" className="duration-200 bg-indigo-500 text-white px-4 py-1 rounded active:bg-indigo-900 hover:bg-indigo-700 mb-1 mr-1">Upgrade</button>

                        </Card>
                    </Tab>
                    <Tab id='refer'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faCommentDollar} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Refer and earn</div>
                            </div>
                            <div className='md:flex md:space-x-10'>
                                <div className='w-full md:w-2/5'>
                                    <div className='flex items-center mb-2'>
                                        <div className='circle bg-secondary-800 !w-16 !h-16'>
                                            <FontAwesomeIcon className='center text-secondary-600' icon={faUser} size='xl' />
                                        </div>
                                        <div className='ml-5 font-bold'>Sahal Mohamed</div>
                                    </div>
                                    <InputField className='w-1/2 mb-4' label='Referal code' icon={faCode} addons={[
                                        <IconBtn className='text-secondary-600 mx-1' icon={faCopy} />
                                    ]} />
                                    <div className='flex space-x-2 mb-2'>
                                        <div className='w-1/2 bg-secondary-800 rounded-lg material text-center p-3'>
                                            Total referal
                                            <div className='text-4xl font-bold mt-3'>3</div>
                                        </div>
                                        <div className='w-1/2 bg-secondary-800 rounded-lg material text-center p-3'>
                                            Total earnings
                                            <div className='text-4xl font-bold mt-3'>$300</div>
                                        </div>
                                    </div>
                                    <InputField label='Amount' icon={faDollar} type='number' addons={[
                                        <div className='border-l-2 border-secondary-700 pl-2 whitespace-nowrap'>Balance: $500</div>
                                    ]} />
                                    <div className='primary-btn w-fit my-2 ml-auto'>Withdraw</div>
                                </div>
                                <div className='w-full md:w-3/5'>
                                    <div className='mb-2'>
                                        <div>Your referals</div>
                                        <Table headers={['No.', 'Name', 'Status', 'Referal earned', 'Expiration date', 'Remind']}
                                            adapter={referSettingsTableAdapter}
                                            data={[
                                                [1, 'Sahal Mohamed', 'Subscribed', 150, '25/10/23'],
                                                [2, 'Sahal Mohamed', 'Subscribed', 150, '25/10/23'],
                                                [3, 'Sahal Mohamed', 'Subscribed', 150, '25/10/23'],
                                            ]}
                                        />
                                        <div className='mt-4'>Withdrawal history</div>
                                        <Table headers={['No.', 'Date', 'Time', 'Amount']}
                                            adapter={withdrawalsSettingsTableAdapter}
                                            data={[
                                                [1, '25/10/23', '05:45 pm', 150],
                                                [2, '25/10/23', '05:45 pm', 150],
                                                [3, '25/10/23', '05:45 pm', 150],
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Tab>
                    <Tab id='portfolio'>
                        <Card className='h-full'>
                            <div className='flex mb-2 items-center'>
                                <Icon className='primary-material mr-2' icon={faSuitcase} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Portfolio</div>
                            </div>
                            <div className='md:flex md:space-x-5'>
                                <div className='w-full md:w-3/4'>
                                    <div className=' overflow-auto'>
                                        <Table headers={['Name', 'Value', 'Change', 'Trade', 'Last adjustment', 'Adjustments', '']}
                                            adapter={portfolioSettingsTableAdapter} adjustmentsDialog={adjustmentsDialog}
                                            data={[
                                                ['Swing equity', 6013.50, 0.93, 40, 2000, 4, 4],
                                                ['Intraday', 3013, 0.43, 40, -300, 4, 10]
                                            ]} />
                                    </div>
                                </div>
                                <div className='w-full md:w-1/4'>
                                    <div className='bg-secondary-800 rounded-lg material p-3 mt-3'>
                                        <div className='font-bold'>Portfolios subscribed</div>
                                        <div className='flex items-center mt-3 '>
                                            <div className='text-4xl font-bold w-full text-center'>3</div>
                                            <div className=' w-full'>
                                                <div className='flex'>
                                                    <IconBtn icon={faPlusCircle} />
                                                    <div className='text-xs ml-4'>Add portfolio subscription</div>
                                                </div>
                                                <div className='text-xs mt-2'>$10 per portfolio</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <InputField className='w-full' label='Name' />
                                        <InputField className='w-full' label='Value' type='number' />
                                        <div className='secondary-btn mt-4 w-fit ml-auto'>
                                            <Icon className='mr-1' icon={faPlus} />
                                            Add portfolio
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Tab>
                    <Tab id='commisions'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faHandHoldingDollar} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Commisions</div>
                            </div>
                            <div className='flex space-x-5'>
                                <div className='w-2/3'>
                                    <Table headers={['Broker', 'Segment', '']}
                                        adapter={commissionSettingsTableAdapter} commissionsDialog={commissionsDialog}
                                        data={[
                                            ['Zerodha', 'Forex'],
                                            ['Zerodha', 'Equity'],
                                            ['Zerodha', 'Options'],
                                            ['Upstock', 'Futures'],
                                        ]}
                                    />
                                </div>
                                <div className='w-1/3'>
                                    <SelectField label='Brocker' values={['Zerodha', 'Upstock']} />
                                    <SelectField label='Segment' values={['Forex', 'Equity', 'Options', 'Futures']} />
                                    <div className='secondary-btn mt-4 w-fit ml-auto'>
                                        <Icon className='mr-1' icon={faPlus} />
                                        Add brocker
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Tab>
                    <Tab id='institute'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faUsers} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Institute group</div>
                            </div>
                            <div className='flex space-x-5'>
                                <div className='w-2/3'>
                                    <Table headers={['Institute', 'Group name', 'Leave']}
                                        adapter={instituteSettingsTableAdapter}
                                        data={[
                                            ['Tradotics', 'March 2022'],
                                            ['Stock class', 'Masters'],
                                        ]}
                                    />
                                </div>
                                <div className='w-1/3'>
                                    <InputField label='Group code' icon={faCode} />
                                    <div className='secondary-btn mt-4 w-fit ml-auto'>
                                        <Icon className='mr-1' icon={faPlus} />
                                        Join group
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Tab>
                </TabView>
            </div>
        </div>
    )
}

export default Settings