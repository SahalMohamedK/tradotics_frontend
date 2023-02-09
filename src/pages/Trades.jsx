import { faCoins, faPercentage, faSackDollar, faSackXmark, faZap } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import ProgressCard from '../elements/ProgressCard'
import RateCard from '../elements/RateCard'
import ValueCard from '../elements/ValueCard'
import Card from '../components/Card'
import Table from '../components/Table'
import { dashboardTableAdapter } from '../adapters/table'
import { useUI } from '../contexts/UIContext'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../contexts/FilterContext'
import { useAPI } from '../contexts/APIContext'
import { API_URL } from '../config'
import { round } from '../utils'
import Pagination from '../elements/Pagination'

export default function Trades() {
    const [executionsNumber, setExecutionsNumber] = useState(0)
    const [winners, setWinners] = useState(0)
    const [losers, setLosers] = useState(0)
    const [totalTrades, setTotalTrades] = useState(0)

    const [highestPnl, setHighestPnl] = useState(0)
    const [lowestPnl, setLowestPnl] = useState(0)
    const [limit, setLimit] = useState(0)
    const [tradesLoading, setTradesLoading] = useState(false)

    const { setLoading } = useUI()
    const { filters } = useFilter()
    const { isSigned, isFirstSigned, post, getAuth, getTradeTable } = useAPI()
    const navigate = useNavigate()

    let tradeTable = useRef()

    function showTradeTable(start = 0, size = 25) {
        if (isSigned && !isFirstSigned) {
            setTradesLoading(true)
            tradeTable.current.loading(true)
            tradeTable.current.removeAll()
            getTradeTable(filters, start, size).then(response => {
                for (var i in response.data) {
                    let trade = response.data[i]
                    tradeTable.current.add(trade.status, trade.entryDate, trade.symbol, trade.netPnl, trade.roi, trade.tradeType, trade.quantity, 'Fib', trade.entryTime, trade.entryPrice, trade.exitTime, trade.exitPrice, trade.id)
                }
            }).catch(err => {
                toast.error("Somthing went wrong", "Trade table is not loaded.")
            }).finally(() => {
                tradeTable.current.loading(false)
                setTradesLoading(false)
            })
        }
    }

    function showData() {
        post(API_URL + '/detailed-report', filters, getAuth()).then(response => {
            let data = response.data
            setWinners(data.winners)
            setLosers(data.losers)
            setLimit(data.totalTrades)
            setTotalTrades(data.totalTrades)
            setHighestPnl(data.highestPnl)
            setLowestPnl(data.lowestPnl)
            setLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        console.log();
        if (isSigned && !isFirstSigned) {
            showTradeTable()
            showData()
            setLoading(false)
        }
    }, [filters, isSigned, !isFirstSigned])

    useEffect(() => {
        setLoading(true)
        if (isSigned === false) {
            navigate('/signin')
        } else if (isSigned && isFirstSigned) {
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        } else if (isSigned) {
            setLoading(false)
        }
    }, [isSigned, isFirstSigned])

    return (
        <div className='pt-16 h-[96vh]'> 
            <div className='mt-5 lg:mt-0 flex flex-col h-full'>
                <div className='flex flex-wrap'>
                    <ValueCard className='w-full md:w-1/4' icon={faSackDollar}
                        label='Highest profitable trade' value={<div className='text-green-500'>${round(highestPnl.netPnl, 2)}</div>} trade={highestPnl.symbol} date={highestPnl.entryDate}/>
                    <ValueCard className='w-full md:w-1/4' icon={faSackXmark}
                        label='Highest profitable trade' value={<div className='text-red-500'>${round(Math.abs(lowestPnl.netPnl), 2)}</div>} trade={lowestPnl.symbol} date={lowestPnl.entryDate}/>
                    {/* <ValueCard className='w-full md:w-1/5' icon={faCoins}
                        label='Gross P&L' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/> */}
                    <RateCard className='w-full md:w-1/4' icon={faPercentage}
                        label='win ratio' value={round(100 * winners / totalTrades,2 )} positiveValue={100*winners/totalTrades} negativeValue={100*losers/totalTrades}/>
                    <ProgressCard className='w-full md:w-1/4' icon={faZap} 
                        label='Tradotics scrore' value={8}/>
                </div>
                <Card className='grow min-h-0' innerClassName='flex flex-col'>
                    <div className='overflow-auto grow'>
                        <Table ref={tradeTable} headers={['Status', 'Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Setup', 'Entry time', 'Entry price', 'Exit time', 'Exit price']}
                            adapter={dashboardTableAdapter} onChange={(data) => setExecutionsNumber(data.length)}
                            onClick={(items) => { navigate('/trade-analytics/' + items[items.length - 1]) }} />
                    </div>
                    <div className='mt-2'>
                        <Pagination className='w-fit mx-auto' limit={limit} onChange={showTradeTable} loading={tradesLoading} />
                    </div>
                </Card>
            </div>
        </div>
    )
}
