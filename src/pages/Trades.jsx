import { faCoins, faPercentage, faSackDollar, faSackXmark, faZap } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import ProgressCard from '../elements/ProgressCard'
import RateCard from '../elements/RateCard'
import ValueCard from '../elements/ValueCard'
import Card from '../components/Card'
import Table from '../components/Table'
import { dashboardTableAdapter } from '../adapters/table'

export default function Trades() {
    const [executionsNumber, setExecutionsNumber] = useState(0)

    return (
        <div className='pt-16 h-[96vh]'> 
            <div className='mt-5 lg:mt-0 flex flex-col h-full'>
                <div className='flex flex-wrap'>
                    <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
                        label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                    <ValueCard className='w-full md:w-1/5' icon={faSackXmark}
                        label='Highest profitable trade' value={<div className='text-red-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                    <ValueCard className='w-full md:w-1/5' icon={faCoins}
                        label='Gross P&L' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                    <RateCard className='w-full md:w-1/5' icon={faPercentage}
                        label='win ratio' value={50} positiveValue={75} negativeValue={35}/>
                    <ProgressCard className='w-full md:w-1/5' icon={faZap} 
                        label='Tradotics scrore' value={8}/>
                </div>
                <Card className='grow min-h-0' innerClassName='flex flex-col'>
                    <div className='overflow-auto grow'>
                        <Table headers ={['Status', 'Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Setup', 'Entry time', 'Entry price', 'Exit time', 'Exit price']} 
                            onChange={(data) => setExecutionsNumber(data.length)} adapter={dashboardTableAdapter}
                            data = {[
                                [1, 'Aug 08 2022', 'RELIANCE', 510, 0.93, 0, 40, 'Fib', '09:41:54', 1203,'09:41:54', 1204],
                            ]}/>
                    </div>
                    <div className='mt-2 text-xs text-center text-secondary-500'>Showing {executionsNumber} execution{executionsNumber>1?'s':''}. <a className='text-indigo-500' href="/trades">View all</a></div>
                </Card>
            </div>
        </div>
    )
}
