import { faArrowTrendUp, faCircleChevronLeft, faCircleChevronRight, faEdit, faTrash, faCirclePlus, faUpRightAndDownLeftFromCenter, faNoteSticky, faPlay, faTag, faX, faWrench } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { areaGraphData, areaGraphOptions } from '../libs';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { Tab, TabBar, TabView } from '../components/Tab'
import IconBtn from '../components/IconBtn';
import Table from '../components/Table';
import { executionsTableAdapter } from '../adapters/table';
import TagsField from '../components/TagsField';
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import Card from '../components/Card'
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import { useEffect } from 'react';
import { useUI } from '../contexts/UIContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAPI } from '../contexts/APIContext';
import { API_URL } from '../config';
import { classNames, round } from '../utils';
import { noTradeError, noTradeHistoriesError } from '../libs/errors';
import { FORMAT } from '../libs/consts'


let savedTrade = ''
export default function TradeAnalytics() {

    let  data = areaGraphData(['09:24','','','','10:07'],[200,800,620,690,390]);
    
    const [executionsNumber, setExecutionsNumber] = useState(0)
    const [trade, setTrade] = useState({})
    const [execution, setExecution] = useState({})
    const [duration, setDuration] = useState()
    const [note, setNote] = useState('')

    const { setLoading, toast } = useUI()
    const { id } = useParams();
    const { isSigned, isFirstSigned, post, getAuth, updateTrade } = useAPI()
    const navigate = useNavigate()

    let tabView = useRef()
    let executionsTable = useRef()
    let chartsDialog = useRef()
    let executionEditDialog = useRef()
    let noteDialog = useRef()

    function addSetup(tag){
        setTrade((prev) => {
            if(prev['setup']){
                prev['setup'] = [...prev['setup'], tag]
            }else{
                prev['setup'] = [tag]
            }
            return structuredClone(prev)
        })
    }

    function removeSetup(i){
        setTrade((prev) => {
            prev['setup'] = prev['setup'].filter((tag, a) => a !== i)
            return structuredClone(prev)
        })
    }

    function showData() {
        executionsTable.current.removeAll()
        executionsTable.current.loading(true)
        post(API_URL + '/trade/get/'+id, {}, getAuth()).then(response => {
            let data = response.data
            savedTrade = JSON.stringify(data.trade)
            setTrade(data.trade)
            setDuration(data.duration)
            setNote(data.trade.note)
            var quantity = 0
            data.orders.forEach((order) => {
                if(order.tradeType == 'sell'){
                    quantity -= order.quantity
                }else{
                    quantity += order.quantity
                }
                executionsTable.current.add(
                    order.tradeDate, 
                    order.executionTime, 
                    order.tradeType, 
                    order.price, 
                    order.quantity, 
                    quantity,
                    order.price*order.quantity, 
                    0,
                    () => {
                        executionEditDialog.current.show()
                        setExecution(order)
                    }
                )
            })
            setLoading(false)
            executionsTable.current.loading(false)
        }).catch(err => {
            if (noTradeError(err)) {
                navigate('/no-trade-error')
            } else if (noTradeHistoriesError(err)) {
                navigate('/add-trades')
                toast.info('Add trades', 'There is no trades in your account')
            }
            console.log(err)
        })
    }

    function updateData(){
        if(savedTrade != JSON.stringify(trade)){
            updateTrade(trade).then(response => {
                toast.success('Updated successfully', 'This trade is updated successfully')
                savedTrade = JSON.stringify(trade)
            }).catch(err => {
                toast.error('Updation failed', 'Somthing went wrong')
            })
        }
    }

    function saveNote(){
        noteDialog.current.hide()
        trade['note'] = note
        updateData()
        let newTrade = structuredClone(trade)
        setTrade(newTrade)
    }

    useEffect(() => {
        console.log( savedTrade != '' , savedTrade != JSON.stringify(trade))
        if (savedTrade != '' && savedTrade != JSON.stringify(trade)) {
            updateData()
        }

    }, [trade])

    useEffect(() => {
        setLoading(true)
        if (isSigned === false) {
            navigate('/signin')
        } else if (isSigned && isFirstSigned) {
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        }else if(isSigned){
            showData()
        }
    }, [isSigned, isFirstSigned])

    return (
    <div className='mt-16'>    
        <Dialog className='h-full w-full' ref={chartsDialog} title='Charts'>
            <div className='flex flex-col space-x-0 space-y-2 md:space-y-0 md:flex-row md:space-x-2 h-full'>
                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
            </div>
        </Dialog>
        <Dialog className='w-1/2' ref={executionEditDialog} title='Execution edit'>
            <div className='flex space-x-2'>
                <InputField className='w-1/3' type='date' label='Date' value={execution.tradeDate}/>
                <InputField className='w-1/3' type='time' label='Time' value={execution.executionTime} />
                <SelectField className='w-1/3' label='Side' values={['Buy', 'Sell']}/>
            </div>       
            <div className='flex space-x-2 mt-2'>
                <InputField className='w-1/3' type='number' label='Price' value={parseFloat(execution.price)}/>
                <InputField className='w-1/3' type='number' label='Quantity' value={execution.quantity}/>
            </div> 
            <div className='flex space-x-2 mt-2'>
                <InputField className='w-1/3' type='number' label='Value'/>
                <InputField className='w-1/3' type='number' label='P$L'/>
            </div>   
            <div className='mt-5 flex'>
                <div className='secondary-btn ml-auto'>Cancel</div>
                <div className='primary-btn ml-2'>Save</div>
            </div>         
        </Dialog>
        <Dialog className='w-1/2' ref={noteDialog} title='Note' icon={faEdit}>
            <textarea className='w-full h-80 bg-secondary-800 rounded-lg border-0 focus:ring-indigo-500' 
                placeholder='Type note here...'
                value={note}
                onChange={(e) => setNote(e.target.value)}>
            </textarea>
              
            <div className='mt-5 flex'>
                <div className='primary-btn ml-auto' onClick={saveNote}>Save</div>
                <div className='secondary-btn ml-2' onClick={() => noteDialog.current.hide()}>Cancel</div>
            </div>
        </Dialog>
        <Card className='mt-5 lg:mt-0'>
            <div className='md:flex md:items-center'>
                <div className='flex items-center justify-between mb-3 md:mb-0'>
                    <div>
                        <div className='flex items-center'>
                            <div className='text-lg font-bold'>{trade.symbol}</div>
                                <div className={classNames('text-xs rounded px-2 mx-3', trade.tradeType == 'sell' ? 'bg-red-500/25 text-red-500' : 'bg-green-500/25 text-green-500')}>{trade.tradeType == 'sell'? 'Short': 'Long'}</div>
                        </div>
                        <div className='text-sm text-secondary-500'>{trade.entryDate}</div>
                    </div>
                    <Icon className='bg-green-500 text-white' icon={faArrowTrendUp} boxSize='2.5rem' box/>
                </div>
                <div className='ml-auto flex items-center justify-between'>
                    <IconBtn icon={faCircleChevronLeft} size='lg' box/>
                    <IconBtn icon={faEdit} size='lg' box/>
                    <IconBtn icon={faTrash} size='lg' box/>
                    <IconBtn icon={faCircleChevronRight} size='lg' box/>
                </div>
            </div>
        </Card>
        <div className='lg:flex'>
            <Card className='lg:order-2 lg:w-1/2'>
                <div className='flex flex-col h-full'>
                    <div className='flex items-center justify-between mb-2'>
                        <TabBar view={tabView}>
                            <Tab id='premium-chart' label='Premium chart' active/>
                            <Tab id='stock-chart'label='Stock chart'/>
                        </TabBar>
                        <IconBtn icon={faUpRightAndDownLeftFromCenter} onClick={() => {chartsDialog.current.show()}}/>
                    </div>
                    <div className='grow'>
                        <TabView ref={tabView} className='lg:!h-full w-full' style={{height: '40vh'}}>
                            <Tab id='premium-chart'>
                                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                            </Tab>
                            <Tab id='stock-chart'>
                                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                            </Tab>
                        </TabView>
                    </div>
                </div>
            </Card>
            <div className='lg:w-1/2 md:flex'>
                <Card className='md:w-1/2'>
                    <div className='flex items-center'>
                        <div className='text-lg font-bold'>Net P&L</div>    
                        <div className='ml-auto font-bold'>{FORMAT.CURRENCY(trade.netPnl)}</div>
                    </div>
                    <div className='pt-5'>
                        <div className='flex items-center mb-2'>
                            <div>Profit target</div>
                            <InputField type='number' className='ml-auto w-2/5' innerClassName='!py-0.5'
                                value={trade.target}
                                onChange={(v) => {
                                    trade['target'] = v
                                    setTrade(trade)
                                }} 
                                onBlur={updateData}/>
                            {/* <input type="number" className="ml-auto rounded-md text-secondary-500 material bg-secondary-800 w-2/5 px-2 py-1 border-0 focus:outline-none"/> */}
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Stop loss</div>
                            <InputField type='number' className='ml-auto w-2/5' innerClassName='!py-0.5'
                                value={trade.stoploss}
                                onChange={(v) => {
                                    trade['stoploss'] = v
                                    setTrade(trade)
                                }}
                                onBlur={updateData}/>
                            {/* <input type="number" className="ml-auto rounded-md text-secondary-500 material bg-secondary-800 w-2/5 px-2 py-1 border-0 focus:outline-none"/> */}
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Volume traded</div>
                            <div className='ml-auto'>{trade.quantity}</div>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Commessions & Fees</div>
                            <div className='ml-auto'>$52.5</div>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Gross P&L</div>
                            <div className='ml-auto'>$24,655.00</div>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Cost</div>
                            <div className='ml-auto'>{FORMAT.CURRENCY(trade.entryPrice*trade.quantity)}</div>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Duration</div>
                            <div className='ml-auto'>{duration}</div>
                        </div>
                            <TagsField className='w-full' label='Setup' icon={faWrench} onAdd={addSetup} onRemove={removeSetup} values={trade.setup}/>
                        <TagsField className='w-full' label='Mistake' icon={faX}/>
                        <TagsField className='w-full' label='Custom Tags' icon={faTag} />
                    </div>
                </Card>
                <Card className='md:w-1/2'>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Average Entry Price</div>
                        <div className='ml-auto'>{FORMAT.CURRENCY(trade.entryPrice, false)}</div>
                    </div>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Average Exit Price</div>
                            <div className='ml-auto'>{FORMAT.CURRENCY(trade.exitPrice, false)}</div>
                    </div>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Trade risk</div>
                        <div className='ml-auto'>N/A</div>
                    </div>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Max profit</div>
                        <div className='ml-auto'>N/A</div>
                    </div>
                    <div className='flex items-center mb-3'>
                        <div className='mr-5'>Max loss</div>
                        <div className='ml-auto'>N/A</div>
                    </div>
                    <div className='text-lg font-bold mb-1'>Distances</div>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Stop distance</div>
                        <div className='ml-auto'>0.6%</div>
                    </div>
                    <div className='flex items-center mb-3'>
                        <div className='mr-5'>Profit distance</div>
                        <div className='ml-auto'>1.2%</div>
                    </div>
                    <div className='text-lg font-bold mb-1'>Reward to risk ratio</div>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Planned RR</div>
                        <div className='ml-auto'>3.2R</div>
                    </div>
                    <div className='flex items-center'>
                        <div className='mr-5'>Realized RR</div>
                        <div className='ml-auto'>2.4R</div>
                    </div>
                </Card>
            </div>        
        </div>
        <div className='lg:flex'>
            <div className='lg:w-1/3 block md:flex lg:block'>
                <Card className='w-full md:w-1/2 lg:w-full'>
                    <div className='md:h-full lg:h-auto'>
                        <div className='text-lg font-bold'>Running P&L</div>   
                        <div className='pt-5'>
                            <Line options={areaGraphOptions} data={data} />
                        </div> 
                    </div>
                </Card>
                <div className='w-full md:w-1/2 lg:w-full'>
                    <Card className='md:h-full lg:h-auto'>
                        <div className='flex mb-2 items-center'>
                            <Icon className='primary-material mr-2' icon={faNoteSticky} size='sm'/>
                            <div className='text-lg font-bold mr-auto'>Notes</div>
                            <IconBtn icon={faEdit} onClick={() => noteDialog.current.show()}/>
                        </div>
                        <div className='text-sm'>{trade.note}</div>
                    </Card>
                </div>
            </div>
            <Card className='lg:w-2/3'>
                <div className='flex flex-col h-full'>
                    <div className='flex mb-2 items-center'>
                        <Icon className='primary-material mr-2' icon={faPlay} size='sm'/>
                        <div className='text-lg font-bold mr-auto'>Executions</div>
                    </div>
                    <div className='overflow-x-auto'>
                        <Table ref={executionsTable} headers={['Date', 'Time', 'Side', 'Price', 'Quantity', 'Position', 'Value', 'P&L', '', '']}
                            adapter={executionsTableAdapter} onChange={(data) => setExecutionsNumber(data.length)}/>
                    </div>
                    <div className='flex items-center'>
                        <div className='ml-auto mr-1 text-sm'>Add an order</div>
                        <IconBtn icon={faCirclePlus} box/>
                    </div>
                    <div className='mt-auto text-xs text-center mb-1 text-secondary-500'>Showing {executionsNumber} execution{executionsNumber>1?'s':''}</div>
                </div>
            </Card>
        </div>
    </div>
  )
}
