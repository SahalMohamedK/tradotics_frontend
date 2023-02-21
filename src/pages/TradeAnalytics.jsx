import { faArrowTrendUp, faCircleChevronLeft, faCircleChevronRight, faEdit, faTrash, faCirclePlus, faUpRightAndDownLeftFromCenter, faNoteSticky, faPlay, faTag, faX, faWrench, faTriangleExclamation, faPlus } from '@fortawesome/free-solid-svg-icons'
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
import ExecutionsTable from '../elements/ExecutionsTable';


let savedTrade = ''
export default function TradeAnalytics() {
    const { setLoading, toast, dialog } = useUI()
    const { id } = useParams();
    const { isSigned, isFirstSigned, post, getAuth, updateTrade, deleteTrade } = useAPI()
    const navigate = useNavigate()

    const [data, setData] = useState({
        trade: {
            assetType: "N/A", 
            avgBuyPrice: 0,
            avgSellPrice: 0, 
            breakeven: 0, 
            charge: 0, 
            dateToExpiry: "N/A",
            entryDate: "N/A",
            entryPrice: 0,
            entryTime: "N/A",
            exchange: "N/A",
            exitDate: "N/A",
            exitPrice: 0,
            exitTime: "N/A",
            expiryDate: "N/A",
            id: id,
            isOpen: 0,
            mistakes: [],
            netPnl: 0,
            note: "",
            optionsType: "",
            quantity: 0,
            roi: 0,
            setup: [],
            status: 0,
            stoploss: 0,
            strikePrice: "",
            symbol: "N/A",
            tags: [],
            target: 0,
            tradeHistory: 0,
            tradeId: "",
            tradeType: "N/A",

        }
    })
    
    // const [trade, setTrade] = useState({})
    const [note, setNote] = useState('')

    let tabView = useRef()
    let chartsDialog = useRef()
    let noteDialog = useRef()

    function addSetup(tag){
        setData((prev) => {
            if(prev.trade.setup){
                prev.trade.setup = [...prev.trade.setup, tag]
            }else{
                prev.trade.setup = [tag]
            }
            return structuredClone(prev)
        })
    }

    function removeSetup(i){
        setData((prev) => {
            prev.trade.setup = prev.trade.setup.filter((tag, a) => a !== i)
            return structuredClone(prev)
        })
    }

    function addMistakes(tag) {
        setData((prev) => {
            if (prev.trade.mistakes) {
                prev.trade.mistakes = [...prev.trade.mistakes, tag]
            } else {
                prev.trade.mistakes = [tag]
            }
            return structuredClone(prev)
        })
    }

    function removeMistakes(i) {
        setData((prev) => {
            prev.trade.mistakes = prev.trade.mistakes.filter((tag, a) => a !== i)
            return structuredClone(prev)
        })
    }

    function addTags(tag) {
        setData((prev) => {
            if (prev.trade.tags) {
                prev.trade.tags = [...prev.trade.tags, tag]
            } else {
                prev.trade.tags = [tag]
            }
            return structuredClone(prev)
        })
    }

    function removeTags(i) {
        setData((prev) => {
            prev.trade.tags = prev.trade.tags.filter((tag, a) => a !== i)
            return structuredClone(prev)
        })
    }

    function showData() {
        post(API_URL + '/trade/get/'+id, {}, getAuth()).then(response => {
            let data = response.data
            setData(data)
            setNote(data.trade.note)
            savedTrade = JSON.stringify(data.trade)
            setLoading(false)
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
        if(savedTrade != JSON.stringify(data.trade)){
            updateTrade(data.trade).then(response => {
                toast.success('Updated successfully', 'This trade is updated successfully')
                savedTrade = JSON.stringify(data.trade)
            }).catch(err => {
                toast.error('Updation failed', 'Somthing went wrong')
            })
        }
    }

    function saveNote(){
        noteDialog.current.hide()
        data.trade['note'] = note
        setData(structuredClone(data))
    }

    function deleteOrder(){
        dialog.confirm('Confirm delete', faTrash, 'Are you sure to delete this execution?', 'Delete', () => {
            
        })
    }

    function _deleteTrade() {
        dialog.confirm('Confirm delete', faTrash, 'Are you sure to delete this trade?', 'Delete', () => {
            deleteTrade(id).then(response => {
                toast.success('Deleted successfully', 'The trade is deleted successfully')
            }).catch(err => {
                toast.error('Deletion failed', 'The trade is not deleted')
            })
        })
    }

    useEffect(() => {
        savedTrade = ''
    }, [])

    useEffect(() => {
        if (savedTrade != '' && savedTrade != JSON.stringify(data.trade)) {
            updateData()
        }
    }, [data])

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
                            <div className='text-lg font-bold'>{data.trade.symbol}</div>
                                <div className={classNames('text-xs rounded px-2 mx-3', 
                                    data.trade.tradeType == 'sell' ? 'bg-red-500/25 text-red-500' : 'bg-green-500/25 text-green-500')}>
                                        {data.trade.tradeType == 'sell'? 'Short': 'Long'}</div>
                        </div>
                        <div className='text-sm text-secondary-500'>{data.trade.entryDate}</div>
                    </div>
                    <Icon className='bg-green-500 text-white' icon={faArrowTrendUp} boxSize='2.5rem' box/>
                </div>
                <div className='ml-auto flex items-center justify-between space-x-6'>
                    <IconBtn icon={faTrash} size='lg' onClick={_deleteTrade}/>
                    <IconBtn icon={faCircleChevronLeft} size='lg'/>
                    <IconBtn icon={faCircleChevronRight} size='lg'/>
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
                        <div className='ml-auto font-bold'>{FORMAT.CURRENCY(data.trade.netPnl)}</div>
                    </div>
                    <div className='pt-5'>
                        <div className='flex items-center mb-2'>
                            <div>Profit target</div>
                            <InputField type='number' className='ml-auto w-2/5' innerClassName='!py-0.5'
                                value={data.trade.target}
                                onChange={(v) => {
                                    data.trade['target'] = v
                                    setData(data)
                                }} 
                                onBlur={updateData}/>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Stop loss</div>
                            <InputField type='number' className='ml-auto w-2/5' innerClassName='!py-0.5'
                                value={data.trade.stoploss}
                                onChange={(v) => {
                                    data.trade['stoploss'] = v
                                    setTrade(data)
                                }}
                                onBlur={updateData}/>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Volume traded</div>
                            <div className='ml-auto'>{data.trade.quantity}</div>
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
                            <div className='ml-auto'>{FORMAT.CURRENCY(data.trade.entryPrice*data.trade.quantity)}</div>
                        </div>
                        <div className='flex items-center mb-2'>
                            <div>Duration</div>
                            <div className='ml-auto'>{data.trade.duration}</div>
                        </div>
                        <TagsField className='w-full' label='Setup' icon={faWrench} onAdd={addSetup} onRemove={removeSetup} values={data.trade.setup}/>
                        <TagsField className='w-full' label='Mistakes' icon={faX} onAdd={addMistakes} onRemove={removeMistakes} values={data.trade.mistakes}/>
                        <TagsField className='w-full' label='Custom Tags' icon={faTag}  onAdd={addTags} onRemove={removeTags} values={data.trade.tags}/>
                    </div>
                </Card>
                <Card className='md:w-1/2'>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Average Entry Price</div>
                        <div className='ml-auto'>{FORMAT.CURRENCY(data.trade.entryPrice, false)}</div>
                    </div>
                    <div className='flex items-center mb-1'>
                        <div className='mr-5'>Average Exit Price</div>
                            <div className='ml-auto'>{FORMAT.CURRENCY(data.trade.exitPrice, false)}</div>
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
                            <Line options={areaGraphOptions} data={areaGraphData(['09:24', '', '', '', '10:07'], [200, 800, 620, 690, 390])} />
                        </div> 
                    </div>
                </Card>
                <div className='w-full md:w-1/2 lg:w-full'>
                    <Card className='md:h-full lg:h-auto'>
                        <div className='flex mb-2 items-center'>
                            <Icon className='primary-material mr-2' icon={faNoteSticky} size='sm'/>
                            <div className='text-lg font-bold mr-auto'>Notes</div>
                            <IconBtn 
                                icon={data.trade.note ? faEdit : faPlus} 
                                onClick={() => noteDialog.current.show(
                                    data.trade.note?'Edit note':'Add note',
                                    data.trade.note?faEdit:faPlus
                                )}/>
                        </div>
                        {!data.trade.note && 
                            <div className='text-red-500 py-5'>
                                <Icon className='mx-auto' icon={faTriangleExclamation} />
                                <div className='text-sm whitespace-nowrap text-center'>No note available</div>
                            </div>
                        }
                        <div className='text-sm'>{data.trade.note}</div>
                    </Card>
                </div>
            </div>
            <ExecutionsTable
                headers={['si/No', 'Date', 'Time', 'Side', 'Price', 'Quantity', 'Position', 'Value', 'P&L', '', '']}
                adapter={executionsTableAdapter} 
                tradeId={id}
                total={data.ordersCount}/>
        </div>
    </div>
  )
}
