import { faCoins, faPercentage, faSackDollar, faSackXmark, faZap } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import ProgressCard from '../elements/ProgressCard'
import RateCard from '../elements/RateCard'
import ValueCard from '../elements/ValueCard'
import TradesTable from '../elements/TradesTable'
import { dashboardTableAdapter } from '../adapters/table'
import { useUI } from '../contexts/UIContext'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../contexts/FilterContext'
import { useAPI } from '../contexts/APIContext'
import { API_URL } from '../config'
import { classNames, round, safeNumber } from '../utils'
import Spinner from '../components/Spinner'
import ComingSoon from '../elements/ComingSoon'

export default function Trades() {
    const [ data, setData ] = useState({
        highestPnlTrade: {},
        lowestPnlTrade: {},
        counts: [0, 0, 0, 0, 0]
    })

    const [dataLoading, setDataLoading] = useState(true)

    const { setLoading } = useUI()
    const { filters } = useFilter()
    const { isSigned, isFirstSigned, post, getAuth } = useAPI()
    const navigate = useNavigate()

    function showData() {
        post(API_URL + '/views/trades', filters, getAuth()).then(response => {
            setData(response.data)           
            setDataLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (isSigned && !isFirstSigned) {
            setDataLoading(true)
            showData()
        }
    }, [filters, isSigned, isFirstSigned])

    useEffect(() => {
        setLoading(true)
        if (isSigned === false) {
            navigate('/signin')
        } else if (isSigned && isFirstSigned) {
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        } else if (isSigned && isFirstSigned === false) {
            setLoading(false)
        }
    }, [isSigned, isFirstSigned])

    return (<>
        <div className='p-3 h-screen overflow-y-auto mb-16 md:mb-0'>
            { dataLoading &&
                <div className='h-full pt-16 relative'>
                    <div className='center'>
                        <Spinner className='w-10 h-10 mx-auto'/>
                        <div>Loading data...</div>
                    </div>
                </div>
            }
            <div className={classNames('pt-16 h-[96vh]', dataLoading ? 'hidden' : '')}> 
                <div className='mt-5 lg:mt-0 flex flex-col h-full'>
                    <div className='flex flex-wrap'>
                        <ValueCard 
                            className='w-full md:w-1/4' 
                            icon={faSackDollar}
                            label='Highest profitable trade' 
                            value={<div className='text-green-500'>${round(data.highestPnlTrade.netPnl, 2)}</div>} 
                            trade={data.highestPnlTrade.symbol} date={data.highestPnlTrade.entryDate}/>
                        <ValueCard 
                            className='w-full md:w-1/4' 
                            icon={faSackXmark}
                            label='Lowest profitable trade' 
                            value={<div className='text-red-500'>${round(Math.abs(data.lowestPnlTrade.netPnl), 2)}</div>} 
                            trade={data.lowestPnlTrade.symbol} date={data.lowestPnlTrade.entryDate}/>
                        <RateCard 
                            className='w-full md:w-1/4' 
                            icon={faPercentage}
                            label='win ratio' 
                            value={round(100 * safeNumber(data.counts[1] / data.counts[0]), 2)} 
                            positiveValue={100 * safeNumber(data.counts[1] / data.counts[0])} 
                            negativeValue={100 * safeNumber(data.counts[2] / data.counts[0])}/>
                        <ComingSoon className='w-full md:w-1/4'>
                            <ProgressCard
                                className='w-full'
                                icon={faZap}
                                label='Tradotics scrore'
                                value={8} />
                        </ComingSoon>
                    </div>
                    <TradesTable
                        className='h-0 grow'
                        headers={['Si/No', 'Status', 'Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Entry time', 'Entry price', 'Exit time', 'Exit price']}
                        adapter={dashboardTableAdapter}
                        total={data.counts[0]} />
                </div>
            </div>
        </div>
    </>)
}
