import React, { useRef, useState } from 'react'
import { iconTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { faClockRotateLeft, faDownload, faFile, faFilePen, faPlusCircle, faRotate, faUserTie } from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import IconBtn from '../components/IconBtn'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import AutocompleteField from '../components/AutocompleteField'
import Icon from '../components/Icon'
import { addTradeHistoryTableAdapter } from '../adapters/table'
import { simpleTabAdapter } from '../adapters/tabs'
import Table from '../components/Table'
import { useEffect } from 'react'
import { useUI } from '../contexts/UIContext'
import FileField from '../components/FileField'
import { useAPI } from '../contexts/APIContext'
import Button from '../components/Button'
import { Form, hasValue } from '../utils'

function AddTrades() {
    const [brockers, setBrockers] = useState([])
    const [isImportTradeUpload, setIsImportTradeUpload] = useState(false)
    const { getBrockers, uploadImportTrade, getTradeHistories, deleteTradeHistory, downloadTradeHistory } = useAPI()
    const { setLoading, toast, dialog } = useUI()

    let mainTV = useRef()
    let tradeHistoryTable = useRef()
    let manualTabView = useRef()
    let importTradeForm = new Form()

    let ENTRY_TYPES = ['Buy', 'Sell']

    function _uploadImportTrade() {
        setIsImportTradeUpload(true)
        if (importTradeForm.isValid()) {
            let data = importTradeForm.get()
            uploadImportTrade(data).then(response => {
                toast.success("Upload successfully", "Your trade details is uploaded successfully.")
                showTradeHistories()
                setIsImportTradeUpload(false)
            }).catch(err => {
                let error = 'Your trade details is not uploaded.'
                let type = 'error'
                let title = 'Upload failed'
                if (err.response){
                    error = hasValue(err.response.data.message, error)
                    type = hasValue(err.response.data.type, type)
                    title = hasValue(err.response.data.title, title)
                }
                if(type === 'warning'){
                    toast.warning(title, error)
                }else{
                    toast.error(title, error)
                }
                setIsImportTradeUpload(false)
                importTradeForm.error(err.response.data)
            })
        } else {
            setIsImportTradeUpload(false) 
        }
    }

    function downloadHistory(id){
        downloadTradeHistory(id).then(response => {
            toast.success('Download successfully', 'Your trade history is downloaded successfully.')
        }).catch(err => {
            toast.error('Download failed', 'Somthing went wrong')
        })
    }

    function showTradeHistories() {
        tradeHistoryTable.current.removeAll()
        getTradeHistories().then(response => {
            let tradeHistories = response.data
            tradeHistories.forEach((tradeHistory) => {
                tradeHistoryTable.current.add(tradeHistory.brocker.name, '-', tradeHistory.type, tradeHistory.created, tradeHistory.no_executions, tradeHistory.no_trades, tradeHistory.pk)
            })
        }).catch(err => {

        }).finally(() => {
            setLoading(false)
        })
    }

    function deleteHistory(id){
        dialog.confirm('Confirm delete', 'Are you sure to delete this trade history?', 'Delete', () => {
            deleteTradeHistory(id).then(response => {
                toast.success('Deleted successfully', 'Your trade history is deleted successfully')
                showTradeHistories()
            }).catch(err => {
                toast.error('Deleted failed', 'Somthing went wrong')
            })
        })
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
            showTradeHistories()
        })
    }, [])

    return (
        <div className='h-full pt-16'>
            <div className='md:flex md:space-x-2  h-full'>
                <TabBar className='flex flex-wrap md:block mb-2 md:mb-0 mx-2 md:w-1/4 lg:w-1/5' view={mainTV} 
                    adapter={iconTabAdapter} defaultTab='sync'>
                    <Tab id='sync' icon={faRotate} label='Sync brocker'/>
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
                                loading={isImportTradeUpload}>
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
                            <TabBar className='flex' adapter={simpleTabAdapter} view={manualTabView}>
                                <Tab id='trade' label='Add a trade' />
                                <Tab id='execution' label='Add an execution' />
                            </TabBar>
                            <TabView ref={manualTabView}>
                                <Tab id='trade'>
                                    <div className='flex mt-2'>
                                        <SelectField className='w-1/3 mr-2' label='Asset type' values={['Type 1', 'Type 2']} />
                                        <SelectField className='w-1/3 mr-2' label='Symbbol' values={['ASIANPAITS', 'RELIANCE']} />
                                        <SelectField className='w-1/3 mr-2' label='Entry type' values={ENTRY_TYPES} />
                                    </div>
                                    <div className='mt-4 font-bold'>Entries</div>
                                    <div className='flex'>
                                        <InputField className='w-1/4 mr-2' label='Date' />
                                        <InputField className='w-1/4 mr-2' label='Time' />
                                        <InputField className='w-1/4 mr-2' label='Volume' />
                                        <InputField className='w-1/4' label='Price' />
                                    </div>
                                    <IconBtn className='mt-2' icon={faPlusCircle} />
                                    <div className='mt-4 font-bold'>Exits</div>
                                    <div className='flex'>
                                        <InputField className='w-1/4 mr-2' label='Date' />
                                        <InputField className='w-1/4 mr-2' label='Time' />
                                        <InputField className='w-1/4 mr-2' label='Volume' />
                                        <InputField className='w-1/4' label='Price' />
                                    </div>
                                    <IconBtn className='mt-2' icon={faPlusCircle} />
                                    <div className='flex mt-4'>
                                        <InputField className='w-1/4 mr-2' label='Stopless (optional)' />
                                        <InputField className='w-1/4 mr-2' label='Target (optional)' />
                                    </div>
                                    <div className='flex mt-4'>
                                        <button className='primary-btn mb-1 mr-1'>Save</button>
                                        <button className='secondary-btn mb-1 mr-1'>Disacard</button>
                                    </div>
                                </Tab>
                                <Tab id='execution'>
                                    <Card className='mt-2 '>
                                        <div className='flex flex-wrap'>
                                            <div className='w-1/6'><SelectField className='mr-2' label='Asset type' values={['Type 1', 'Type 2']} /></div>
                                            <div className='w-1/6'><InputField className='mr-2' label='Date' /></div>
                                            <div className='w-1/6'><InputField className='mr-2' label='Time' /></div>
                                            <div className='w-1/6'><SelectField className='mr-2' label='Entry type' values={ENTRY_TYPES} /></div>
                                            <div className='w-1/6'><InputField className='mr-2' label='Volume' /></div>
                                            <div className='w-1/6'><InputField className='mr-2' label='Price' /></div>
                                        </div>
                                    </Card>
                                    <div className='flex mt-2 mx-1'>
                                        <button className='primary-btn mb-1 mr-1'>Save</button>
                                        <button className='secondary-btn mb-1 mr-1'>Disacard</button>
                                    </div>
                                </Tab>
                            </TabView>
                        </Card>
                    </Tab>
                    <Tab id='history'>
                        <Card className='h-full' innerClassName='overflow-auto'>
                            <div className='flex mb-5 items-center'>
                                <Icon className='primary-material mr-2' icon={faClockRotateLeft} size='sm' />
                                <div className='text-lg font-bold mr-auto'>History</div>
                            </div>
                            <Table ref={tradeHistoryTable} headers={['Brocker', 'Portfolio', 'Type', 'Created', 'Executions', 'Trades', '', '']} 
                                adapter={addTradeHistoryTableAdapter} onDelete = {deleteHistory} onDownload = {downloadHistory}/>
                        </Card>
                    </Tab>
                </TabView>
            </div>
        </div>
    )
}

export default AddTrades