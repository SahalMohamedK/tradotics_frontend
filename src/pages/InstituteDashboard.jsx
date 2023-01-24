import React, { useEffect, useRef, useState } from 'react'
import { DAYS, MONTHS } from '../libs/consts';
import { Doughnut, Line } from 'react-chartjs-2'
import { simpleTabAdapter } from '../adapters/tabs';
import { Tab, TabBar, TabView } from '../components/Tab';
import { faArrowTrendUp, faCalendar, faCircleChevronLeft, faCircleChevronRight, faClipboardList, faCoins, faEdit, faSliders, faStopwatch, faTrash, faZap } from '@fortawesome/free-solid-svg-icons';
import { doughnutChartOptions, doughnutChartData, areaGraphOptions, areaGraphData, doughnutChartTextPlugin } from '../libs'
import Icon from '../components/Icon';
import Card from '../components/Card'
import Table from '../components/Table';
import CountUp from 'react-countup';
import Calendar from '../elements/Calendar';
import Insightes from '../elements/Insightes';
import ProgressCard from '../elements/ProgressCard'
import BarGraphCard from '../elements/BarGraphCard'
import IconBtn from '../components/IconBtn';
import { dashboardTableAdapter } from '../adapters/table';
import { useUI } from '../contexts/UIContext';
 
function InstituteDashboard() {  
    let data2 = doughnutChartData(['53 Wins', '15 Losses'],[300, 60])

    const [winrateData, setWinrateData] = useState(data2)
    const [executionsNumber, setExecutionsNumber] = useState(0)
    const [dialyPLData, setDialyPLData] = useState(areaGraphData(['09:24', '', '', '', '10:07'], [0,100,400,100,300]))
    const [cumulativePLData, setCumulativePLData] = useState(areaGraphData(['09:24', '', '', '', '10:07'], [0,-300,300,600,400]))

    let table = useRef()
    let tabView = useRef()

    const { setIsLoading } = useUI()

    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <div className='md:flex flex-wrap mt-16'>
            
            <Card className='mt-5 lg:mt-0 w-full'>
                <div className='md:flex md:items-center'>
                    <div className='circle !w-16 !h-16 bg-secondary-900'>
                        <div className='center text-lg font-bold text-secondary-500'>SM</div>
                    </div>
                    <div className='ml-2'>
                        <div className='text-xl font-bold'>Sahal Mohamed</div>
                        <div className='text-sm text-secondary-500'>Group 1</div>
                    </div>
                    <div className='ml-auto flex items-center justify-between'>
                        <IconBtn icon={faCircleChevronLeft} size='lg' box/>
                        <IconBtn icon={faEdit} size='lg' box/>
                        <IconBtn icon={faTrash} size='lg' box/>
                        <IconBtn icon={faCircleChevronRight} size='lg' box/>
                    </div>
                </div>
            </Card>
            <div className='w-full lg:w-2/3 flex flex-col order-1'>
                <div className='md:flex'>
                    <ProgressCard className='w-full md:w-1/4' icon={faZap} label='Tradotics scrore' value={8}/>
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
                                        <Line className='mb-3 h-full w-full' data={dialyPLData} options={areaGraphOptions}/>
                                    </Tab>
                                </TabView>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Card className='w-full md:w-1/2 lg:w-1/3 order-2 md:order-3 lg:order-2'>
                <Calendar markers={{'16-11-2022':[40,5], '1-11-2022':[-50,2]}}/>
            </Card>
            <Card className='w-full lg:w-3/4 order-3 md:order-4 lg:order-3'>
                <div className='overflow-auto h-96'>
                    <Table ref={table} headers={['Status','Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Setup', 'Entry time', 'Entry price', 'Exit time', 'Exit price']}
                            adapter={dashboardTableAdapter} onChange={(data) => setExecutionsNumber(data.length)}
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
        </div>
    )
}

export default InstituteDashboard