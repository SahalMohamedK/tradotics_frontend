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

export default function Trades() {
    const [executionsNumber, setExecutionsNumber] = useState(0)
    const [winners, setWinners] = useState(0)
    const [losers, setLosers] = useState(0)
    const [totalTrades, setTotalTrades] = useState(0)

    const [highestPnl, setHighestPnl] = useState(0)
    const [lowestPnl, setLowestPnl] = useState(0)

    const { setLoading } = useUI()
    const { filters } = useFilter()
    const { isSigned, isFirstSigned, post, getAuth } = useAPI()
    const navigate = useNavigate()

    let tradeTable = useRef()

    function showData() {
        tradeTable.current.removeAll()
        post(API_URL + '/detailed-report', filters, getAuth()).then(response => {
            let data = response.data
            let trades = data.tradesTable
            for (var i in trades) {
                let trade = trades[i]
                tradeTable.current.add(trade.status, trade.entryDate, trade.symbol, trade.netPnl, trade.roi, trade.tradeType, trade.quantity, 'Fib', trade.entryTime, trade.entryPrice, trade.exitTime, trade.exitPrice)

            }
            setWinners(data.winners)
            setLosers(data.losers)
            setTotalTrades(data.totalTrades)
            setHighestPnl(data.highestPnl)
            setLowestPnl(data.lowestPnl)
            setLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        showData()
    }, [filters])

    useEffect(() => {
        setLoading(true)
        if (isSigned === false) {
            navigate('/signin')
        } else if (isSigned && isFirstSigned) {
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
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
                        <Table ref={tradeTable} headers ={['Status', 'Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Setup', 'Entry time', 'Entry price', 'Exit time', 'Exit price']} 
                            onChange={(data) => setExecutionsNumber(data.length)} adapter={dashboardTableAdapter}/>
                    </div>
                    <div className='mt-2 text-xs text-center text-secondary-500'>Showing {executionsNumber} execution{executionsNumber>1?'s':''}. <a className='text-indigo-500' href="/trades">View all</a></div>
                </Card>
            </div>
        </div>
    )
}
