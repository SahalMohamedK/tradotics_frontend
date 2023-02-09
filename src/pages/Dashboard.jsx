import React, { useEffect, useRef, useState } from 'react'
import { DAYS, DURATIONS, MONTHS, SETUPS } from '../libs/consts';
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
import { useFilter } from '../contexts/FilterContext';
import { API_URL } from '../config';
import { classNames, round, safeNumber } from '../utils';
import Pagination from '../elements/Pagination';
import axios from 'axios';
 
function Dashboard() {  
    let data2 = doughnutChartData(['0 Wins', '0 Losses'],[50, 50])

    const [winrateData, setWinrateData] = useState(data2)
    const [winrateByDayData, setWinrateByDayData] = useState(data2)
    const [executionsNumber, setExecutionsNumber] = useState(0)
    const [winners, setWinners] = useState(0)
    const [winnersByDays, setWinnersByDays] = useState(0)
    const [dialyPLData, setDialyPLData] = useState(barGraphData([], []))
    const [cumulativePLData, setCumulativePLData] = useState(areaGraphData([], []))
    const [totalNetPnl, setTotalNetPnl] = useState(0)
    const [totalTrades, setTotalTrades] = useState(0)
    const [profitFactor, setprofitFactor] = useState(0)
    const [avgWinners, setAvgWinners] = useState(0)
    const [avgLossers, setAvgLosers] = useState(0)
    const [insights, setInsights] = useState([])
    const [pnlByDays, setPnlByDays] = useState([0, 0, 0, 0, 0, 0, 0])
    const [pnlByMonths, setPnlByMonths] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [pnlBySetup, setPnlBySetup] = useState([0, 0, 0, 0, 0, 0, 0])
    const [pnlByDuration, setPnlByDuration] = useState([0, 0, 0, 0, 0])
    
    // const [dataLoading, ]

    const [limit, setLimit] = useState(0)
    const [tradesLoading, setTradesLoading] = useState(false)

    let tabView = useRef()
    let tradeTable = useRef()
    let calendar = useRef()
    let openTable = useRef()

    const { isSigned, isFirstSigned, post, getAuth, getTradeTable } = useAPI()
    const { toast, setLoading } = useUI()
    const { filters } = useFilter()
    const navigate = useNavigate()

    function showTradeTable(start = 0, size = 25){
        if (isSigned && !isFirstSigned){

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

    function showData(){
        openTable.current.removeAll()
        post(API_URL+'/dashboard', filters , getAuth()).then(response => {
            let data = response.data
            let openTrades = data.openTrades
            setLimit(data.totalTrades)
            setCumulativePLData(areaGraphData(...data.cumulativePnl))
            setTotalNetPnl(data.totalNetPnl)
            setAvgLosers(data.returns.losers / data.losers)
            setAvgWinners(data.returns.winners / data.winners)
            setTotalTrades(data.totalTrades)
            setprofitFactor(data.totalProfitFactor)
            calendar.current.setMarkers(data.tradesByDays)
            setWinners(data.winners)
            setWinnersByDays(data.winnersByDays)
            setWinrateData(doughnutChartData([`${data.winners} Wins`, `${data.losers} Losses`], [data.winners, data.losers]))
            setWinrateByDayData(doughnutChartData([`${data.winnersByDays} Wins`, `${data.losersByDays} Losses`], [data.winnersByDays, data.losersByDays]))
            setInsights(data.insights)
            for(var i in openTrades){
                let trade = openTrades[i]
                openTable.current.add(trade.entryDate, trade.symbol, trade.tradeType, trade.quantity)
            }
            setPnlByDays(data.pnlByDays)
            setPnlByMonths(data.pnlByMonths)
            setPnlBySetup(data.pnlBySetup)
            setPnlByDuration(data.pnlByDuration)
            setDialyPLData(barGraphData(...data.dialyPnl))
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
        if(isSigned === false){
            navigate('/signin')
        }else if (isSigned && isFirstSigned){
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        }else if(isSigned){
            setLoading(false)
        }
    }, [isSigned, isFirstSigned])
    return (
        <div className='md:flex flex-wrap mt-16'>
            <div className='w-full lg:w-2/3 flex flex-col order-1'>
                <div className='md:flex'>
                    <ProgressCard className='w-full md:w-1/4' icon={faZap} label='Tradotics scrore' value={5}/>
                    <Card className='w-full md:w-3/4'>
                        <div className='md:flex items-center justify-between h-full text-center'>
                            <div className='py-2 md:py-0 md:px-2 border-secondary-700'>
                                <div className='text-xs'>In {totalTrades} trades</div>
                                <div className={classNames('text-lg font-bold', totalNetPnl>0?'text-green-500':'text-red-500')}>
                                    $<CountUp delay={1} end={Math.abs(totalNetPnl)} separator=',' useEasing/>
                                </div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:px-2 border-secondary-800'>
                                <div className='text-xs'>Profit factor</div>
                                <div className='text-lg font-bold'>{profitFactor}</div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:px-2 border-secondary-800'>
                                <div className='text-xs'>Avarage winners</div>
                                <div className='text-lg font-bold text-green-500'>$<CountUp delay={1} end={avgWinners} separator=',' useEasing/></div>
                            </div>
                            <div className='border-t py-2 md:py-0 md:border-t-0 md:border-l md:pl-2 border-secondary-800'>
                                <div className='text-xs'>Avarage losers</div>
                                <div className='text-lg font-bold text-red-500'>$<CountUp delay={1} end={Math.abs(avgLossers)} separator=',' useEasing/></div>
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
                                <Doughnut data={winrateData} options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('#22c55e')]}/>
                            </div>
                        </Card>
                        <Card className='h-1/2'>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faCalendar} size='sm' box/>
                                <div className='font-bold text-sm'>Winrate by days</div>
                            </div>
                            <div style={{height:'100px'}}>
                                <Doughnut data={winrateByDayData} options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('#22c55e')]}/>
                            </div>
                        </Card>
                    </div>
                    <Card className='w-full md:w-3/4'>
                        <div className='flex flex-col h-full'>
                            <div className='flex mb-5'>
                                <TabBar className='flex' view={tabView} adapter={simpleTabAdapter}>
                                    <Tab id='cumulative-pl' label='Cumulative P&L' active />
                                    <Tab id='dialy-pl' label='Dialy P&L'  />
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
                <Calendar ref={calendar}/>
            </Card>
            <Card className='w-full lg:w-3/4 order-3 md:order-4 lg:order-3'>
                <div className='overflow-auto h-96'>
                    <Table ref={tradeTable} headers={['Status','Date', 'Symbol', 'Net P&L', 'ROI', 'Side', 'Volume', 'Setup', 'Entry time', 'Entry price', 'Exit time', 'Exit price']}
                            adapter={dashboardTableAdapter} onChange={(data) => setExecutionsNumber(data.length)}
                        onClick={(items) => { navigate('/trade-analytics/'+items[items.length-1])}}/>
                </div>
                <div className='mt-2'>
                    <Pagination className='w-fit mx-auto' limit={limit} onChange={showTradeTable} loading ={tradesLoading}/>
                </div>
            </Card>
            <Insightes className='w-full md:w-1/2 lg:w-1/4 order-4 md:order-2 lg:order-4' items={insights}/>
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-5' icon={faCalendar} options={[
                ['Performance by day', DAYS, pnlByDays],
                ['Performance by Month', MONTHS, pnlByMonths]
            ]}/>
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-6' icon={faSliders} options={[
                ['Performance by setup', SETUPS, pnlBySetup]
            ]}/>
            <BarGraphCard className='w-full md:w-1/3 lg:w-1/4 order-7' icon={faStopwatch} options={[
                ['Performance by duration', DURATIONS, pnlByDuration],
                ['Performance by hour', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
            ]}/>
            <Card className='w-full lg:w-1/4 order-8' innerClassName='flex flex-col'>
                <div className='flex items-center space-x-2'>
                    <Icon className='primary-material' icon={faClipboardList} size='sm'/>
                    <div className='font-bold text-lg'>Open positions</div>
                </div>
                <div className='overflow-auto grow h-0'>
                    <Table ref={openTable} headers={['Date', 'Symbol', 'Side', 'Volume']} adapter={dashboardOpenPositionsTableAdapter} />
                </div>
            </Card>
        </div>
    )
}

export default Dashboard