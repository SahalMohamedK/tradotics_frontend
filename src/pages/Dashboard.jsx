import React, { useEffect, useRef, useState } from 'react'
import { DAYS, MONTHS } from '../libs/consts';
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { simpleTabAdapter } from '../adapters/tabs';
import { Tab, TabBar, TabView } from '../components/Tab';
import { dashboardOpenPositionsTableAdapter, dashboardTableAdapter, simpleTableAdapter } from '../adapters/table';
import { faCalendar, faClipboardList, faCoins, faSliders, faStopwatch, faZap } from '@fortawesome/free-solid-svg-icons';
import { doughnutChartOptions, doughnutChartData, areaGraphOptions, areaGraphData, doughnutChartTextPlugin, barGraphOptions, barGraphData } from '../libs'
import Icon from '../components/Icon';
import Card from '../components/Card'
import Table from '../components/Table';
import CountUp from 'react-countup';
import Calendar from '../elements/Calendar';
import Insightes from '../elements/Insightes';
import ProgressCard from '../elements/ProgressCard'
import BarGraphCard from '../elements/BarGraphCard'
import { useAPI } from '../contexts/APIContext';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
 
function Dashboard() {  
    let data2 = doughnutChartData(['53 Wins', '15 Losses'],[300, 60])

    const [winrateData, setWinrateData] = useState(data2)
    const [executionsNumber, setExecutionsNumber] = useState(0)
    const [dialyPLData, setDialyPLData] = useState(barGraphData(['09 Aug 22', '09 Aug 22', '09 Aug 22','09 Aug 22', '09 Aug 22','09 Aug 22', '09 Aug 22'], [50,-300,300,600,400, 500, -200]))
    const [cumulativePLData, setCumulativePLData] = useState(areaGraphData(['09:24', '', '', '', '10:07'], [0,100,400,100,300]))

    let tabView = useRef()

    const { isSigned, isFirstSigned, user } = useAPI()
    const { toast, setIsLoading} = useUI()
    const navigate = useNavigate()

    useEffect(() => {
        if(isSigned === false){
            navigate('/signin')
        }else if (isSigned && isFirstSigned){
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        }else if(isSigned){
            setIsLoading(false)
        }
        setIsLoading(false)
    }, [isSigned, isFirstSigned])

    return (
        <div className='md:flex flex-wrap mt-16'>
            <div className='w-full lg:w-2/3 flex flex-col order-1'>
                <div className='md:flex'>
                    <ProgressCard className='w-full md:w-1/4' icon={faZap} label='Tradotics scrore' value={5}/>
                    <Card className='w-full md:w-3/4'>
                        <div className='md:flex items-center justify-between h-full text-center'>
                            <div className='text-lg font-bold pb-2 md:pb-2'>Total net P&L</div>
                            <div className='py-2 md:py-0 md:px-2 border-secondary-700'>
                                <div className='text-xs'>In 68 trades</div>
                                <div className='text-lg font-bold text-green-500'>$<CountUp delay={1} end={25683} separator=',' useEasing/></div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:px-2 border-secondary-800'>
                                <div className='text-xs'>Profit factor</div>
                                <div className='text-lg font-bold'>2.55</div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:px-2 border-secondary-800'>
                                <div className='text-xs'>Avarage winners</div>
                                <div className='text-lg font-bold text-green-500'>$<CountUp delay={1} end={25683} separator=',' useEasing/></div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:pl-2 border-secondary-800'>
                                <div className='text-xs'>Avarage losers</div>
                                <div className='text-lg font-bold text-red-500'>$<CountUp delay={1} end={25683} separator=',' useEasing/></div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='md:flex grow'>
                    <div className='w-full md:w-1/4'>
                        <Card className='h-1/2'>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faCoins} size='sm' box/>
                                <div className='font-bold text-sm'>Winrate by trades</div>
                            </div>
                            <div style={{height:'100px'}}>
                                <Doughnut data={winrateData} options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('50%', '#22c55e')]}/>
                            </div>
                        </Card>
                        <Card className='h-1/2'>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faCalendar} size='sm' box/>
                                <div className='font-bold text-sm'>Winrate by days</div>
                            </div>
                            <div style={{height:'100px'}}>
                                <Doughnut data={winrateData} options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('80%', '#22c55e')]}/>
                            </div>
                        </Card>
                    </div>
                    <Card className='w-full md:w-3/4'>
                        <div className='flex flex-col h-full'>
                            <div className='flex mb-5'>
                                <TabBar className='flex' view={tabView} adapter={simpleTabAdapter}>
                                    <Tab id='cumulative-pl' label='Cumulative P&L' active/>
                                    <Tab id='dialy-pl' label='Dialy P&L'/>
                                </TabBar>
                            </div>
                            <div className='grow'>
                                <TabView ref={tabView} className='lg:!h-full w-full' style={{height: '40vh'}}>
                                    <Tab id='cumulative-pl'>
                                        <Line className='mb-3 h-full w-full' data={cumulativePLData} options={areaGraphOptions}/>
                                    </Tab>
                                    <Tab id='dialy-pl'>
                                        <Bar className='mb-3 h-full w-full' data={dialyPLData} options={{...barGraphOptions, indexAxis:'x'}}/>
                                    </Tab>
                                </TabView>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Card className='w-full md:w-1/2 lg:w-1/3 order-2 md:order-3 lg:order-2'>
                <Calendar markers={{'16-12-2022':[40,5],'22-12-2022':[40,5],'19-12-2022':[-40,5], '1-12-2022':[-50,2]}}/>
            </Card>
            <Card className='w-full lg:w-3/4 order-3 md:order-4 lg:order-3'>
                <div className='overflow-auto h-96'>
                    <Table headers={['Status','Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Setup', 'Entry time', 'Entry price', 'Exit time', 'Exit price']}
                            adapter={dashboardTableAdapter} onChange={(data) => setExecutionsNumber(data.length)}
                            onClick={()=>{}}
                            data={[
                                [1, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 0, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1204.00],
                                [0, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 1, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1203.00],
                                [1, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 0, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1204.00],
                                [0, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 1, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1203.00],
                                [1, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 0, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1204.00],
                                [0, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 1, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1203.00],
                                [1, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 0, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1204.00],
                                [0, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 1, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1203.00],
                                [1, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 0, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1204.00],
                                [0, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 1, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1203.00],
                                [1, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 0, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1204.00],
                                [0, 'Aug 08 2022', 'RELIANCE', 510.00, '0.93%', 1, 40, 'Fib', '09:41:54', 1203.00,'09:41:54', 1203.00],
                            ]}/>
                </div>
                <div className='mt-2 text-xs text-center text-secondary-500'>Showing {executionsNumber} execution{executionsNumber>1?'s':''}. <a className='text-indigo-500' href="/trades">View all</a></div>
            </Card>
            <Insightes className='w-full md:w-1/2 lg:w-1/4 order-4 md:order-2 lg:order-4' items={[
                'Profit is maximum at 0.6% stopless and 1.4% target.',
                'There will be an increase of 22% in your P&L if optimum level were applied',
                'There is 20% increase(67%)  in winrate of trades at optimum level ,compared to winrate of your current level trades (59%)',
                'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                'There are 4 trades(14% of trades) which do not meet neither stoploss nor target'                    
            ]}/>
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-5' icon={faCalendar} options={[
                ['Performance by day', DAYS, [-150, 300,200,-500,330,100,460]],
                ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
            ]}/>
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-6' icon={faSliders} options={[
                ['Performance by setup', DAYS, [-150, 300,200,-500,330,100,460]],
                ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
            ]}/>
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-7' icon={faStopwatch} options={[
                ['Performance by duration', DAYS, [-150, 300,200,-500,330,100,460]],
                ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
            ]}/>
            <Card className='w-full lg:w-1/4 order-8'>
                <div className='flex items-center space-x-2'>
                    <Icon className='primary-material' icon={faClipboardList} size='sm'/>
                    <div className='font-bold text-lg'>Open positions</div>
                </div>
                <Table headers={['Entry date', 'Symbol', 'Side', 'Volume']} adapter={dashboardOpenPositionsTableAdapter}
                    data={[
                        ['30 Aug 2022', 'ASIANPAINTS', 'Sell', 34],
                        ['30 Aug 2022', 'ASIANPAINTS', 'Sell', 34],
                        ['30 Aug 2022', 'ASIANPAINTS', 'Sell', 34],
                        ['30 Aug 2022', 'ASIANPAINTS', 'Sell', 34],
                    ]}/>
            </Card>
        </div>
    )
}

export default Dashboard