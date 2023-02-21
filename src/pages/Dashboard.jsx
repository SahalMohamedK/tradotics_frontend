import React, { useEffect, useRef, useState } from 'react'
import { DAYS, DURATIONS, MONTHS, SETUPS } from '../libs/consts';
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { simpleTabAdapter } from '../adapters/tabs';
import { Tab, TabBar, TabView } from '../components/Tab';
import { dashboardOpenPositionsTableAdapter, dashboardTableAdapter} from '../adapters/table';
import { faArrowsRotate, faCalendar, faClipboardList, faCoins, faSliders, faStopwatch, faZap } from '@fortawesome/free-solid-svg-icons';
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
import { useFilter } from '../contexts/FilterContext';
import { API_URL } from '../config';
import { classNames, round, safeNumber } from '../utils';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import IconBtn from '../components/IconBtn';
import TradesTable from '../elements/TradesTable';
 
function Dashboard() {
    const [data, setData] = useState({
        isDemo: false,
        cumulativePnl: [[] , []],
        totalPnl: 0,
        counts: { 
            total: 0, 
            winners: 0, 
            lossers: 0 
        },
        countsByDay: {},
        pnlByDates: {},
        pnlByTradeTypes: { 
            long: 0, 
            short: 0 
        },
        pnlByStatus: { 
            winners: 0, 
            lossers: 0 
        },
        pnlByDays: [],
        pnlByMonths: [],
        pnlBySetup: [],
        pnlByDuration: [],
        pnlByHours: [[], []],
        dialyPnl: [[], []],
        insights: []
    })
    const [dataLoading, setDataLoading] = useState(true)

    let tabView = useRef()
    let calendar = useRef()
    let openTable = useRef()
    let cumulativePnlGraph = useRef()

    const { isSigned, isFirstSigned, post, getAuth } = useAPI()
    const { toast, setLoading } = useUI()
    const { filters } = useFilter()
    const navigate = useNavigate()

    function showData(){
        openTable.current.removeAll()
        post(API_URL+'/dashboard', filters , getAuth()).then(response => {
            setData(response.data)
            calendar.current.setMarkers(response.data.pnlByDates)
            for(var i in response.data.openTrades){
                let trade = response.data.openTrades[i]
                openTable.current.add(trade.entryDate, trade.symbol, trade.tradeType, trade.quantity)
            }
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
        if(isSigned === false){
            navigate('/signin')
        }else if (isSigned && isFirstSigned){
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        } else if (isSigned && isFirstSigned === false){
            setLoading(false)
        }
    }, [isSigned, isFirstSigned])
    
    return (<>
        { dataLoading &&
            <div className='h-full pt-16 relative'>
                <div className='center'>
                    <Spinner className='w-10 h-10 mx-auto'/>
                    <div>Loading data...</div>
                </div>
            </div>
        }
        <div className={classNames('md:flex flex-wrap mt-16', dataLoading?'hidden':'')}>
            {data.isDemo && 
                <Card className='w-full' innerClassName='flex items-center !py-10'>
                    <div className='ml-10'>
                        <div className='text-xl font-bold text-indigo-500'>Welcome! Sahal Mohamed</div>
                        <div className=''>
                            We give you a demo trade data to understand how Tradotics work.
                        </div>
                    </div>
                    <Button className='primary-btn h-fit ml-auto mr-10' to='/add-trades'>Add trades</Button>
                </Card>
            }
            <div className='w-full lg:w-2/3 flex flex-col order-1'>
                <div className='md:flex'>
                    <ProgressCard className='w-full md:w-1/4' icon={faZap} label='Tradotics scrore' value={5} />
                    <Card className='w-full md:w-3/4'>
                        <div className='md:flex items-center justify-between h-full text-center'>
                            <div className='py-2 md:py-0 md:px-2 border-secondary-700'>
                                <div className='text-xs'>In {data.counts[0]} trades</div>
                                <div className={classNames('text-lg font-bold', data.totalPnl > 0 ? 'text-green-500' : 'text-red-500')}>
                                    $<CountUp delay={1} end={Math.abs(data.totalPnl)} separator=',' useEasing />
                                </div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:px-2 border-secondary-800'>
                                <div className='text-xs'>Profit factor</div>
                                <div className='text-lg font-bold'>{round(safeNumber(data.pnlByStatus[0] / data.pnlByStatus[1]), 2)}</div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:px-2 border-secondary-800'>
                                <div className='text-xs'>Avarage winners</div>
                                <div className='text-lg font-bold text-green-500'>$<CountUp delay={1} end={data.pnlByStatus[0] / data.counts[1]} separator=',' useEasing /></div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:pl-2 border-secondary-800'>
                                <div className='text-xs'>Avarage losers</div>
                                <div className='text-lg font-bold text-red-500'>$<CountUp delay={1} end={Math.abs(data.pnlByStatus[1] / data.counts[2])} separator=',' useEasing /></div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='md:flex grow'>
                    <div className='w-full md:w-1/4'>
                        <Card className='h-1/2'>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faCoins} size='sm' box />
                                <div className='font-bold text-sm'>Winrate by trades</div>
                            </div>
                            <div style={{ height: '100px' }}>
                                <Doughnut
                                    data={doughnutChartData(
                                        [`${data.counts[1]} Wins`, `${data.counts[2]} Losses`],
                                        [data.counts[1], data.counts[2]]
                                    )}
                                    options={doughnutChartOptions}
                                    plugins={[doughnutChartTextPlugin('#22c55e')]} />
                            </div>
                        </Card>
                        <Card className='h-1/2'>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faCalendar} size='sm' box />
                                <div className='font-bold text-sm'>Winrate by days</div>
                            </div>
                            <div style={{ height: '100px' }}>
                                <Doughnut
                                    data={doughnutChartData(
                                        [`${data.countsByDay[0]} Wins`, `${data.countsByDay[1]} Losses`],
                                        [data.countsByDay[0], data.countsByDay[1]]
                                    )}
                                    options={doughnutChartOptions}
                                    plugins={[doughnutChartTextPlugin('#22c55e')]} />
                            </div>
                        </Card>
                    </div>
                    <Card className='w-full md:w-3/4'>
                        <div className='flex flex-col h-full'>
                            <div className='flex items-center justify-between'>
                                <TabBar className='flex' view={tabView} adapter={simpleTabAdapter}>
                                    <Tab id='cumulative-pl' label='Cumulative P&L' active />
                                    <Tab id='dialy-pl' label='Dialy P&L' />
                                </TabBar>
                            </div>
                            <div className='grow'>
                                <TabView ref={tabView} className='lg:!h-full w-full relative' style={{ height: '40vh' }}>
                                    <Tab id='cumulative-pl'>
                                        <IconBtn className='secondary-btn !w-7 !h-7 !absolute -top-8 right-0' icon={faArrowsRotate} onClick={() => cumulativePnlGraph.current.resetZoom()} box />
                                        <Line
                                            ref={cumulativePnlGraph}
                                            className='h-full w-full'
                                            data={areaGraphData(...data.cumulativePnl)}
                                            options={areaGraphOptions} />
                                    </Tab>
                                    <Tab id='dialy-pl'>
                                        <Bar
                                            className='mb-3 h-full w-full'
                                            data={barGraphData(...data.dialyPnl)}
                                            options={{ ...barGraphOptions, indexAxis: 'x' }} />
                                    </Tab>
                                </TabView>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Card className='w-full md:w-1/2 lg:w-1/3 order-2 md:order-3 lg:order-2'>
                <Calendar ref={calendar} />
            </Card>
            
            <TradesTable 
                className='w-full lg:w-3/4 order-3 md:order-4 lg:order-3 h-96'
                headers={['Si/No','Status', 'Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Entry time', 'Entry price', 'Exit time', 'Exit price']}
                adapter={dashboardTableAdapter}
                total={data.counts[0]} />

            <Insightes className='w-full md:w-1/2 lg:w-1/4 order-4 md:order-2 lg:order-4' items={data.insights} />

            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-5' icon={faCalendar} options={[
                ['Performance by day', DAYS, data.pnlByDays],
                ['Performance by Month', MONTHS, data.pnlByMonths]
            ]} />
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-6' icon={faSliders} options={[
                ['Performance by setup', ...data.pnlBySetup]
            ]} />
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-7' icon={faStopwatch} options={[
                ['Performance by duration', DURATIONS, data.pnlByDuration],
                ['Performance by hour', ...data.pnlByHours]
            ]} />
            <Card className='w-full lg:w-1/4 order-8' innerClassName='flex flex-col'>
                <div className='flex items-center space-x-2'>
                    <Icon className='primary-material' icon={faClipboardList} size='sm' />
                    <div className='font-bold text-lg'>Open positions</div>
                </div>
                <div className='overflow-auto grow h-0'>
                    <Table
                        ref={openTable}
                        headers={['Date', 'Symbol', 'Side', 'Volume']}
                        adapter={dashboardOpenPositionsTableAdapter}
                        emptyMessage='There is no open trades' />
                </div>
            </Card>
        </div>
        
    </>)
}

export default Dashboard