import React, { useRef, useState } from 'react'
import { iconTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { faArrowRightArrowLeft, faBullseye, faCalendar, faClock, faClockRotateLeft, faDollar, faDownload, faFile, faFilePen, faLayerGroup, faPlusCircle, faPuzzlePiece, faRotate, faSackDollar, faStopCircle, faSuitcase, faTrash, faUpload, faUserTie } from '@fortawesome/free-solid-svg-icons'
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
import { addItem, classNames, Form, hasValue, pop, removeByIndex } from '../utils'
import Spinner from '../components/Spinner'
import { ASSET_TYPES } from '../libs/consts'
import { API_URL } from '../config'
import { badRequestError } from '../libs/errors'

function AddTrades() {
    const [brockers, setBrockers] = useState([])
    const [portfolios, setPortfolios] = useState([])
    const [symbols, setSymbols] = useState([])
    const [isImportTradeUpload, setIsImportTradeUpload] = useState(false)
    const [isManualTradeUpload, setIsManualTradeUpload] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)
    const [entries, setEntries] = useState([{
        date: '',
        time: '',
        volume: '',
        price: ''
    }])
    const [exits, setExits] = useState([{
        date: '',
        time: '',
        volume: '',
        price: ''
    }])

    const { 
        getBrockers, 
        uploadImportTrade, 
        getTradeHistories, 
        deleteTradeHistory, 
        downloadTradeHistory,
        post,
        getAuth,
        get
    } = useAPI()

    const { setLoading, toast, dialog } = useUI()

    let mainTV = useRef()
    let tradeHistoryTable = useRef()
    let manualTabView = useRef()
    
    let importTradeForm = new Form()
    let manualTradeForm = new Form()

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
                tradeHistoryTable.current.add(tradeHistory)
            })
        }).catch(err => {

        }).finally(() => {
            setDataLoading(false)
        })
    }

    function deleteHistory(id){
        dialog.confirm('Confirm delete', faTrash, 'Are you sure to delete this trade history?', 'Delete', () => {
            deleteTradeHistory(id).then(response => {
                toast.success('Deleted successfully', 'Your trade history is deleted successfully')
                showTradeHistories()
            }).catch(err => {
                toast.error('Deleted failed', 'Somthing went wrong')
            })
        })
    }

    function addManualTrade(){
        setIsManualTradeUpload(true)
        if (manualTradeForm.isValid()){
            let data = manualTradeForm.get(true)
            data.entries = []
            data.exits = []
            let error = false 
            for(var i in entries){
                let entry = entries[i]
                if (entry.form.isValid()){
                    data.entries.push(entry.form.get(true))
                }else{
                    error = true
                }
            }
            for (var i in exits) {
                let exit = exits[i]
                if (exit.form.isValid()) {
                    data.exits.push(exit.form.get(true))
                } else {
                    error = true
                }
            }
            if(!error){
                post(API_URL+'/trades/manual', data, getAuth()).then(response => {
                    toast.success("Upload successfully", "Your trade details is uploaded successfully")
                    showTradeHistories()
                }).catch(err => {
                    if(badRequestError(err)){
                        toast.error('Upload failed', 'Invalid details are given')
                        manualTradeForm.error(err.response.data)
                    }else{
                        
                        toast.error('Somthing went wrong')
                    }
                }).finally(() => {
                    setIsManualTradeUpload(false)
                })
            }else{
                setIsManualTradeUpload(false)
            }
        }else{
            setIsManualTradeUpload(false)
        }
    }

    function resetManualTrade(){
        manualTradeForm.reset()
        
        for (var i in entries) {
            entries[i].form.reset()
        }
        
        for (var i in exits) {
            exits[i].form.reset()
        }

        setEntries([{
            date: '',
            time: '',
            volume: '',
            price: ''
        }])

        setExits([{
            date: '',
            time: '',
            volume: '',
            price: ''
        }])
    }

    useEffect(() => {
        get(API_URL+'/portfolio/get', getAuth()).then(response => {
            let portfolios = {}
            response.data.forEach(portfolio => {
                portfolios[portfolio.pk] = portfolio.name
            })
            setPortfolios(portfolios)
        })

        get(API_URL + '/symbols', getAuth()).then(response => {
            let symbols = {}
            response.data.forEach(symbol => {
                symbols[symbol] = symbol
            })
            setSymbols(symbols)
        })
        getBrockers().then(response => {
            let brockers = {}
            response.data.forEach(brocker => {
                brockers[brocker.pk] = brocker.name
            })
            setBrockers(brockers)
        }).catch(err => {

        }).finally(() => {
            setLoading(false)
            showTradeHistories()
        })
    }, [])

    return (
        <div className='p-3 h-screen overflow-y-auto'>
            {dataLoading &&
                <div className='h-full pt-16 relative'>
                    <div className='center'>
                        <Spinner className='w-10 h-10 mx-auto' />
                        <div>Loading data...</div>
                    </div>
                </div>
            }
            <div className={classNames('h-full pt-16 mb-16 md:mb-0', dataLoading ? 'hidden' : '')}>
                <div className='md:flex md:space-x-2  h-full'>
                    <TabBar className='flex flex-wrap md:block mb-2 md:mb-0 mx-2 md:w-1/4 lg:w-1/5' view={mainTV} 
                        adapter={iconTabAdapter} defaultTab='sync'>
                        <Tab id='sync' icon={faRotate} label='Sync brocker'/>
                        <Tab id='import' icon={faUpload} label='Import trades' />
                        <Tab id='manual' icon={faFilePen} label='Manual entry' />
                        <Tab id='history' icon={faClockRotateLeft} label='History' />
                    </TabBar>
                    <TabView ref={mainTV} className=' md:w-3/4 lg:w-4/5 h-full'>
                        <Tab id='sync'>
                            <Card className='md:h-full'>
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
                            <Card className='md:h-full'>
                                <div className='flex mb-5 items-center'>
                                    <Icon className='primary-material mr-2' icon={faUpload} size='sm' />
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
                                    <AutocompleteField
                                        className='w-full mb-3'
                                        ref={importTradeForm.ref}
                                        name="portfolio"
                                        label='Select portfolio'
                                        icon={faSuitcase}
                                        values={portfolios}
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
                                        Upload
                                </Button>
                            </Card>
                        </Tab>
                        <Tab id='manual'>
                            <Card className='md:h-full' innerClassName='overflow-auto'>
                                <div className='flex mb-5 items-center'>
                                    <Icon 
                                        className='primary-material mr-2' 
                                        icon={faFilePen} 
                                        size='sm' />
                                    <div className='text-lg font-bold mr-auto'>Manual entry</div>
                                </div>
                                <TabBar 
                                    className='flex' 
                                    adapter={simpleTabAdapter} 
                                    view={manualTabView} 
                                    defaultTab='trade'>
                                    <Tab id='trade' label='Add a trade' />
                                    <Tab id='execution' label='Add an execution' />
                                </TabBar>
                                <TabView ref={manualTabView}>
                                    <Tab id='trade'>
                                        <div className='md:flex mt-2 md:space-x-2'>
                                            <AutocompleteField
                                                ref={manualTradeForm.ref}
                                                className='w-full mb-2 md:mb-0'
                                                icon={faSuitcase}
                                                label='Portfolio'
                                                values={portfolios} />
                                            <SelectField 
                                                ref={manualTradeForm.ref}
                                                className='w-full mb-2 md:mb-0'
                                                icon={faSackDollar}
                                                label='Asset type' 
                                                values={ASSET_TYPES} />
                                            <AutocompleteField 
                                                ref={manualTradeForm.ref}
                                                className='w-full mb-2 md:mb-0'
                                                icon={faPuzzlePiece}
                                                label='Symbol' 
                                                values={symbols} />
                                            <SelectField 
                                                ref={manualTradeForm.ref}
                                                className='w-full mb-2 md:mb-0'
                                                icon={faArrowRightArrowLeft} 
                                                label='Entry type' 
                                                values={ENTRY_TYPES} />
                                        </div>
                                        <div className='mt-4 font-bold'>Entries</div>
                                        {entries.map((entry, i) => {
                                            let entryForm = new Form()
                                            entry.form = entryForm
                                            return <div key={i} className='md:flex mb-2 items-start md:space-x-2'>
                                                <InputField
                                                    ref={entryForm.ref}
                                                    className='w-full'
                                                    value={entry.date}
                                                    onChange={(v) => entry.date = v}
                                                    icon={faCalendar}
                                                    label='Date'
                                                    type='date' 
                                                    required/>
                                                <InputField
                                                    ref={entryForm.ref}
                                                    className='w-full'
                                                    value={entry.time}
                                                    onChange={(v) => entry.time = v}
                                                    icon={faClock}
                                                    type='time'
                                                    label='Time' 
                                                    required/>
                                                <InputField
                                                    ref={entryForm.ref}
                                                    className='w-full'
                                                    value={entry.volume}
                                                    onChange={(v) => entry.volume = v}
                                                    icon={faLayerGroup}
                                                    type='number'
                                                    label='Volume'
                                                    required/>
                                                <InputField
                                                    ref={entryForm.ref}
                                                    className='w-full'
                                                    value={entry.price}
                                                    onChange={(v) => entry.price = v}
                                                    icon={faDollar}
                                                    type='number'
                                                    label='Price' 
                                                    required/>
                                                <IconBtn 
                                                    className='w-fit mt-4 md:mt-8'
                                                    icon={faTrash}
                                                    size='sm'
                                                    disabled={entries.length == 1 && i == 0}
                                                    onClick={() => setEntries(removeByIndex(entries, i))}/>                                                
                                            </div>
                                        }
                                        )}
                                        <IconBtn 
                                            className='mt-4 w-fit ml-auto' 
                                            icon={faPlusCircle} 
                                            onClick={() => setEntries(addItem(entries, 
                                                {
                                                    date: '',
                                                    time: '',
                                                    volume: '',
                                                    price: ''
                                                }
                                            ))} />
                                        <div className='font-bold'>Exits</div>
                                        {exits.map((exit, i) => {
                                            let exitForm = new Form()
                                            exit.form = exitForm
                                            return <div key={i} className='md:flex mb-2 items-start md:space-x-2'>
                                                <InputField
                                                    ref={exitForm.ref}
                                                    className='w-full'
                                                    value={exit.date}
                                                    onChange={(v) => exit.date = v}
                                                    icon={faCalendar}
                                                    label='Date'
                                                    type='date'
                                                    required />
                                                <InputField
                                                    ref={exitForm.ref}
                                                    className='w-full'
                                                    value={exit.time}
                                                    onChange={(v) => exit.time = v}
                                                    icon={faClock}
                                                    type='time'
                                                    label='Time'
                                                    required />
                                                <InputField
                                                    ref={exitForm.ref}
                                                    className='w-full'
                                                    value={exit.volume}
                                                    onChange={(v) => exit.volume = v}
                                                    icon={faLayerGroup}
                                                    type='number'
                                                    label='Volume'
                                                    required />
                                                <InputField
                                                    ref={exitForm.ref}
                                                    className='w-full'
                                                    value={exit.price}
                                                    onChange={(v) => exit.price = v}
                                                    icon={faDollar}
                                                    type='number'
                                                    label='Price'
                                                    required />
                                                <IconBtn
                                                    className='mt-8'
                                                    icon={faTrash}
                                                    size='sm'
                                                    disabled={exits.length == 1 && i == 0}
                                                    onClick={() => setExits(removeByIndex(exits, i))} />
                                            </div>
                                        }
                                        )}
                                        <IconBtn
                                            className='mt-4 w-fit ml-auto'
                                            icon={faPlusCircle}
                                            onClick={() => setExits(addItem(exits,
                                                {
                                                    date: '',
                                                    time: '',
                                                    volume: '',
                                                    price: ''
                                                }
                                            ))} />
                                        <div className='flex mt-4'>
                                            <InputField 
                                                ref={manualTradeForm.ref}
                                                className='w-1/4 mr-2' 
                                                type='number'
                                                icon={faStopCircle}
                                                label='Stoploss' 
                                                subLabel/>
                                            <InputField 
                                                ref={manualTradeForm.ref}
                                                className='w-1/4 mr-2' 
                                                type='number'
                                                icon={faBullseye}
                                                label='Target' 
                                                subLabel/>
                                        </div>
                                        <div className='flex mt-4'>
                                            <Button 
                                                className='primary-btn mb-1 mr-1'
                                                onClick={addManualTrade}
                                                loading={isManualTradeUpload}>Add</Button>
                                            <Button 
                                                className='secondary-btn mb-1 mr-1'
                                                onClick={resetManualTrade}>Reset</Button>
                                        </div>
                                    </Tab>
                                    <Tab id='execution'>
                                        <div className='md:flex mt-2 md:space-x-2'>
                                            <SelectField 
                                                className='w-full' 
                                                label='Asset type' 
                                                values={ASSET_TYPES} />
                                            <InputField 
                                                className='w-full' 
                                                label='Date' />
                                            <InputField 
                                                className='w-full' 
                                                label='Time' />
                                        </div>
                                        <div className='md:flex mt-2 md:space-x-2'>
                                            <SelectField
                                                className='w-full'
                                                label='Entry type'
                                                values={ENTRY_TYPES} />
                                            <InputField
                                                className='w-full'
                                                label='Volume' />
                                            <InputField
                                                className='w-full'
                                                label='Price' />
                                        </div>
                                        <div className='flex mt-2 mx-1'>
                                            <button className='primary-btn mb-1 mr-1'>Save</button>
                                            <button className='secondary-btn mb-1 mr-1'>Disacard</button>
                                        </div>
                                    </Tab>
                                </TabView>
                            </Card>
                        </Tab>
                        <Tab id='history'>
                            <Card className='md:h-full' innerClassName='overflow-auto'>
                                <div className='flex mb-5 items-center'>
                                    <Icon className='primary-material mr-2' icon={faClockRotateLeft} size='sm' />
                                    <div className='text-lg font-bold mr-auto'>History</div>
                                </div>
                                <Table 
                                    ref={tradeHistoryTable} 
                                    headers={['Brocker', 'Portfolio', 'Type', 'Created', 'Executions', 'Trades', '', '']} 
                                    adapter={addTradeHistoryTableAdapter} 
                                    onDelete = {deleteHistory} 
                                    onDownload = {downloadHistory}/>
                            </Card>
                        </Tab>
                    </TabView>
                </div>
            </div>
        </div>
    )
}

export default AddTrades