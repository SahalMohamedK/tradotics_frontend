import React, { useRef, useState } from 'react'
import { iconTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { faClockRotateLeft, faDownload, faFile, faFilePen, faPlus, faPlusCircle, faRotate, faUserTie } from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import IconBtn from '../components/IconBtn'
import Collapse from '../components/Collapse'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import AutocompleteField from '../components/AutocompleteField'
import Icon from '../components/Icon'
import { addTradeHistoryTableAdapter } from '../adapters/table'
import Table from '../components/Table'
import { useEffect } from 'react'
import { useUI } from '../contexts/UIContext'
import FileField from '../components/FileField'
import { useAPI } from '../contexts/APIContext'
import Button from '../components/Button'
import { Form } from '../utils'

function AddTrades() {
    const [brockers, setBrockers] = useState([])
    const [isImportTradeUpload, setIsImportTradeUpload] = useState(false)
    const { getBrockers, uploadImportTrade } = useAPI()
    const { setIsLoading, toast } = useUI()

    let mainTV = useRef()
    let importTradeForm = new Form()

    let ENTRY_TYPES = ['Buy', 'Sell']

    function _uploadImportTrade() {
        setIsImportTradeUpload(true)
        if (importTradeForm.isValid()) {
            let data = importTradeForm.get()
            uploadImportTrade(data).then(response => {
                toast.success("Upload successfully", "Your trade details is uploaded successfully.")
                setIsImportTradeUpload(false)
            }).catch(err => {
                toast.error("Upload failed", "Your trade details is not uploaded.")
                setIsImportTradeUpload(false)
                importTradeForm.error(err.response.data)
            })
        } else {
            setIsImportTradeUpload(false) 
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
            setIsLoading(false)
        })
    }, [])

    return (
        <div className='h-full pt-16'>
            <div className='md:flex md:space-x-2  h-full'>
                <TabBar className='flex flex-wrap md:block mb-2 md:mb-0 mx-2 md:w-1/4 lg:w-1/5' view={mainTV} adapter={iconTabAdapter}>
                    <Tab id='sync' icon={faRotate} label='Sync brocker' />
                    <Tab id='import' icon={faDownload} label='Import trades' />
                    <Tab id='manual' icon={faFilePen} label='Manual entry' />
                    <Tab id='history' icon={faClockRotateLeft} label='History' />
                </TabBar>
                <TabView ref={mainTV} className=' md:w-3/4 lg:w-4/5 h-full'>
                    <Tab id='sync'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faRotate} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Sync brocker</div>
                            </div>
                            <SelectField className='w-1/2 mb-3' label='Select your brocker / trading platform' icon={faUserTie} values={[
                                'Binance - Crypto currency'
                            ]} />
                            <button href="#" className="primary-btn mb-1 mr-1">Save</button>
                        </Card>
                    </Tab>
                    <Tab id='import'>
                        <Card className='h-full'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faDownload} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Import trades</div>
                            </div>
                            <div className='md:flex md:space-x-2'>
                                <AutocompleteField 
                                    className='w-full mb-3' 
                                    ref={importTradeForm.ref} 
                                    name="brocker" 
                                    label='Select your brocker / trading platform'
                                    icon={faUserTie} 
                                    values={brockers} 
                                    disabled={isImportTradeUpload} 
                                    required />
                                <FileField 
                                    className='w-full mb-3' 
                                    ref={importTradeForm.ref} 
                                    name="file" 
                                    label='Import from file'
                                    icon={faFile} 
                                    disabled={isImportTradeUpload}
                                    accept='.csv'
                                    required />
                            </div>
                            <Button 
                                className="primary-btn mb-1 mr-1" 
                                onClick={_uploadImportTrade}
                                isLoading={isImportTradeUpload}>
                                    Save
                            </Button>
                        </Card>
                    </Tab>
                    <Tab id='manual'>
                        <Card className='h-full' innerClassName='overflow-auto'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faFilePen} size='sm' />
                                <div className='text-lg font-bold mr-auto'>Manual entry</div>
                            </div>
                            <div className='mb-4'>
                                <Collapse label='Add a trades' icon={faPlus}>
                                    <Card className='mx-2 mt-2'>
                                        <div className='flex'>
                                            <SelectField className='w-1/3 mr-2' label='Asset type' values={['Type 1', 'Type 2']} />
                                            <SelectField className='w-1/3 mr-2' label='Symbbol' values={['ASIANPAITS', 'RELIANCE']} />
                                            <SelectField className='w-1/3 mr-2' label='Entry type' values={ENTRY_TYPES} />
                                        </div>
                                    </Card>
                                    <div className='mx-3 mt-2 font-bold'>Entries</div>
                                    <Card className='mx-2'>
                                        <div className='flex'>
                                            <InputField className='w-1/4 mr-2' label='Date' />
                                            <InputField className='w-1/4 mr-2' label='Time' />
                                            <InputField className='w-1/4 mr-2' label='Volume' />
                                            <InputField className='w-1/4' label='Price' />
                                        </div>
                                        <IconBtn className='mt-2' icon={faPlusCircle} />
                                    </Card>
                                    <div className='mx-3 mt-2 font-bold'>Exits</div>
                                    <Card className='mx-2 '>
                                        <div className='flex'>
                                            <InputField className='w-1/4 mr-2' label='Date' />
                                            <InputField className='w-1/4 mr-2' label='Time' />
                                            <InputField className='w-1/4 mr-2' label='Volume' />
                                            <InputField className='w-1/4' label='Price' />
                                        </div>
                                        <IconBtn className='mt-2' icon={faPlusCircle} />
                                    </Card>
                                    <Card className='mx-2 mt-2'>
                                        <div className='flex'>
                                            <InputField className='w-1/4 mr-2' label='Stopless (optional)' />
                                            <InputField className='w-1/4 mr-2' label='Target (optional)' />
                                        </div>
                                    </Card>
                                    <div className='flex mt-2 mx-3'>
                                        <button className='primary-btn mb-1 mr-1'>Save</button>
                                        <button className='secondary-btn mb-1 mr-1'>Disacard</button>
                                    </div>
                                </Collapse>
                            </div>
                            <Collapse label='Add an execution' icon={faPlus}>
                                <Card className='mx-2 mt-2 '>
                                    <div className='flex flex-wrap'>
                                        <div className='w-1/6'><SelectField className='mr-2' label='Asset type' values={['Type 1', 'Type 2']} /></div>
                                        <div className='w-1/6'><InputField className='mr-2' label='Date' /></div>
                                        <div className='w-1/6'><InputField className='mr-2' label='Time' /></div>
                                        <div className='w-1/6'><SelectField className='mr-2' label='Entry type' values={ENTRY_TYPES} /></div>
                                        <div className='w-1/6'><InputField className='mr-2' label='Volume' /></div>
                                        <div className='w-1/6'><InputField className='mr-2' label='Price' /></div>
                                    </div>
                                </Card>
                                <div className='flex mt-2 mx-3'>
                                    <button className='primary-btn mb-1 mr-1'>Save</button>
                                    <button className='secondary-btn mb-1 mr-1'>Disacard</button>
                                </div>
                            </Collapse>
                        </Card>
                    </Tab>
                    <Tab id='history'>
                        <Card className='h-full' innerClassName='overflow-auto'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faClockRotateLeft} size='sm' />
                                <div className='text-lg font-bold mr-auto'>History</div>
                            </div>
                            <Table headers={['Brocker', 'Portfolio', 'Type', 'Upload date', 'Time', 'Executions', 'Trades', 'File']} adapter={addTradeHistoryTableAdapter}
                                data={[
                                    ['Zerodha', 'Zerodha', 'Sync', '12/12/22', '09:44:33', 42, 18, false],
                                    ['Zerodha', 'Zerodha', 'Imported', '12/12/22', '09:44:33', 42, 18, true],
                                    ['Zerodha', 'Zerodha', 'Manual', '12/12/22', '09:44:33', 42, 18, false],
                                ]} />
                        </Card>
                    </Tab>
                </TabView>
            </div>
        </div>
    )
}

export default AddTrades