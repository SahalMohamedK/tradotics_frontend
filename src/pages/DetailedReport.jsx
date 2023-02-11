import React, { useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { FORMAT, DAYS, HOURS, DURATIONS, SETUPS } from '../libs/consts'
import { iconTabAdapter, simpleTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { barGraphData, barGraphOptions } from '../libs'
import { detailedJournelOptionsTableAdapter, detailedJournelTableAdapter } from '../adapters/table'
import { fa1, faChartPie,  faCoins, faList, faMoneyBillTransfer, faPercentage, faSackDollar, faSackXmark } from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import Table from '../components/Table'
import RateCard from '../elements/RateCard'
import ValueCard from '../elements/ValueCard'
import { useEffect } from 'react';
import { useUI } from '../contexts/UIContext';
import { useFilter } from '../contexts/FilterContext';
import { useAPI } from '../contexts/APIContext';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { classNames, round } from '../utils';
import { primaryColor } from '../core/consts/colors'
import Pagination from '../elements/Pagination';
import Spinner from '../components/Spinner';

export default function DetailedJournal() {
    const [tableNumber, setTableNumber] = useState(0)
    const [winners, setWinners] = useState(0)
    const [losers, setLosers] = useState(0)
    const [totalTrades, setTotalTrades] = useState(0)
    const [returns, setReturns] = useState({})
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [days, setDays] = useState({})
    const [consec, setConsec] = useState([])
    const [counts, setCounts] = useState({})
    const [rois, setRois] = useState({})
    const [openAndClose, setOpenAndClose] = useState([0, 0])
    const [highestPnl, setHighestPnl] = useState(0)
    const [lowestPnl, setLowestPnl] = useState(0)
    const [holdTimes, setHoldTimes] = useState([])
    const [dateToExpiryDistribution, setDateToExpiryDistribution] = useState(barGraphData([], []))
    const [dateToExpiryPerformance, setDateToExpiryPerformance] = useState(barGraphData([], []))
    const [dayDistribution, setDayDistribution] = useState([[], []])
    const [hourDistribution, setHourDistribution] = useState([[], [], []])
    const [setupDistribution, setSetupDistribution] = useState([[], []])
    const [durationDistribution, setDurationDistribution] = useState([[], []])
    const [costDistribution, setCostDistribution] = useState([[], [], []])
    const [priceDistribution, setPriceDistribution] = useState([[], [], []])
    const [symbolDistribution, setSymbolDistribution] = useState([[], [], []])

    let data = [
        ["Return", [
            ["Return on winners", FORMAT.CURRENCY, returns.winners],
            ["Return on lossers", FORMAT.CURRENCY, returns.losers],
            ["Return on long", FORMAT.CURRENCY, returns.long],
            ["Return on shorts", FORMAT.CURRENCY, returns.short],
            ["Acc balance", FORMAT.CURRENCY, (returns.winners + returns.losers) ],
            ["Avg return / share", FORMAT.CURRENCY, (returns.winners + returns.losers)/totalQuantity],
        ]
        ],
        ["Summary", [
            ["Total PnL", FORMAT.CURRENCY, (returns.winners + returns.losers)],
            ["Profit factor", FORMAT.NUMBER, Math.abs(round(returns.winners/returns.losers, 2))],
            ["Daily volume", FORMAT.CURRENCY, totalQuantity/days.total],
            ["Avg winners", FORMAT.CURRENCY, returns.winners/winners],
            ["Avg Lossers", FORMAT.CURRENCY, returns.losers / losers],
            ["Average dialy return", FORMAT.CURRENCY, (returns.winners + returns.losers)/days.total],
        ]
        ],
        ["Trades", [
            ["Winning trades", FORMAT.NUMBER, winners],
            ["Losing trades", FORMAT.NUMBER, losers],
            ["Break Even trades", FORMAT.NUMBER, totalTrades-(winners+losers)],
            ["Total num of trades", FORMAT.NUMBER, totalTrades],
            ["Max consec win trades", FORMAT.NUMBER, consec[0]],
            ["Max consec loss trades", FORMAT.NUMBER, consec[1]],
            ["Closed trades", FORMAT.NUMBER, openAndClose[0]],
            ["Open trades", FORMAT.NUMBER, openAndClose[1]],
            ["Avg trades per day", FORMAT.NUMBER, round(totalTrades/days.total, 2)],
            ["No of short trades", FORMAT.NUMBER, counts.short],
            ["No of long trades", FORMAT.NUMBER, counts.long],
        ]
        ],
        ["Return %", [
            ["Avg % return", FORMAT.PERCENTAGE, round(rois.total/totalTrades, 2)],
            ["Avg % on winners", FORMAT.PERCENTAGE, round(rois.winners / counts.winners, 2)],
            ["Avg % on losses", FORMAT.PERCENTAGE, round(rois.losers / counts.losers, 2)],
            ["Avg % on long", FORMAT.PERCENTAGE, round(rois.long / counts.long, 2)],
            ["Avg % on short", FORMAT.PERCENTAGE, round(rois.short / counts.short, 2)],
        ]
        ],
        ["Days", [
            ["Total trading days", FORMAT.NUMBER, days.total],
            ["Winning days", FORMAT.NUMBER, days.winners],
            ["Lossing days", FORMAT.NUMBER, days.losers],
            ["Break Even days", FORMAT.NUMBER, days.total - (days.winners + days.losers)],
            ["Max consec win days", FORMAT.NUMBER, days.consecWin],
            ["Max consec loss days", FORMAT.NUMBER, days.consecLoss],
        ]
        ],
        ["Hold time", [
            ["Avg hold time", FORMAT.TIME, holdTimes[0]],
            ["Avg winners hold time", FORMAT.TIME, holdTimes[1]],
            ["Avg lossers hold time", FORMAT.TIME, holdTimes[2]],
            ["Avg time on long", FORMAT.TIME, holdTimes[3]],
            ["Avg time on short", FORMAT.TIME, holdTimes[4]],
            ["Duration of Highest profit", FORMAT.TIME, holdTimes[5]],
        ]
        ],
        ["risk", [
            ["Avg planned RR", FORMAT.NUMBER, 19],
            ["Avg realized RR", FORMAT.NUMBER, 19],
            ["Trade expectancy", FORMAT.NUMBER, 19],
        ]
        ],
    ]
    
    let performanceData = barGraphData(DAYS, [200, 100,300,400,370,150,500])
    let distributionData = barGraphData(DAYS, [150, 300,200,500,330,100,460])

    let tabView = useRef()
    let tabView2 = useRef()
    let tabView3 = useRef()
    let optionsTable = useRef()
    let tradeTable = useRef()
    let dateToExpiryTable = useRef()
    let dayDistributionTable = useRef()
    let hourDistributionTable = useRef()
    let setupDistributionTable = useRef()
    let durationDistributionTable = useRef()
    let costDistributionTable = useRef()
    let priceDistributionTable = useRef()
    let symbolDistributionTable = useRef()

    const [limit, setLimit] = useState(0)
    const [tradesLoading, setTradesLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)

    const { setLoading } = useUI()
    const { filters } = useFilter()
    const { isSigned, isFirstSigned, post, getAuth, getTradeTable } = useAPI() 
    const navigate = useNavigate()

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
        tradeTable.current.removeAll()
        dateToExpiryTable.current.removeAll()
        dayDistributionTable.current.removeAll()
        hourDistributionTable.current.removeAll()
        setupDistributionTable.current.removeAll()
        durationDistributionTable.current.removeAll()
        costDistributionTable.current.removeAll()
        priceDistributionTable.current.removeAll()
        symbolDistributionTable.current.removeAll()
        post(API_URL + '/detailed-report', filters, getAuth()).then(response => {
            let data = response.data
            setWinners(data.winners)
            setLosers(data.losers)
            setTotalTrades(data.totalTrades)
            setLimit(data.totalTrades)
            setReturns(data.returns)
            setTotalQuantity(data.totalQuantity)
            setDays(data.days)
            setConsec(data.maxConsec)
            setCounts(data.counts)
            setRois(data.rois)
            setOpenAndClose(data.openAndClose)
            setHighestPnl(data.highestPnl)
            setLowestPnl(data.lowestPnl)
            setHoldTimes(data.holdTimes)
            setDateToExpiryDistribution(barGraphData(data.dateToExpiry[0], data.dateToExpiry[2], primaryColor))
            setDateToExpiryPerformance(barGraphData(data.dateToExpiry[0], data.dateToExpiry[1]))
            for (var i = 0; i < data.dateToExpiry[0].length; i++) {
                if (data.dateToExpiry[2][i] > 0){
                    dateToExpiryTable.current.add(data.dateToExpiry[0][i], data.dateToExpiry[1][i], data.dateToExpiry[2][i], data.dateToExpiry[3][i])
                }
            }

            for (var i = 0; i < DAYS.length; i++) {
                if (data.dayDistribution[1][i] > 0){
                    dayDistributionTable.current.add(DAYS[i], data.dayDistribution[0][i], data.dayDistribution[1][i], data.dayDistribution[2][i] / data.dayDistribution[1][i])
                }
            }

            for (var i = 0; i < data.hourDistribution[0].length; i++) {
                hourDistributionTable.current.add(data.hourDistribution[0][i], data.hourDistribution[1][i], data.hourDistribution[2][i], data.hourDistribution[3][i] / data.hourDistribution[2][i])
            }


            for (var i = 0; i < SETUPS.length; i++) {
                if (data.setupDistribution[1][i] > 0) {
                    setupDistributionTable.current.add(SETUPS[i], data.setupDistribution[0][i], data.setupDistribution[1][i], data.setupDistribution[2][i] / data.setupDistribution[1][i])
                }
            }


            for (var i = 0; i < DURATIONS.length; i++) {
                if (data.durationDistribution[1][i] > 0) {
                    durationDistributionTable.current.add(DURATIONS[i], data.durationDistribution[0][i], data.durationDistribution[1][i], data.durationDistribution[2][i]/ data.durationDistribution[1][i])
                }
            }

            for (var i = 0; i < data.costDistribution[0].length; i++) {
                if (data.costDistribution[2][i] > 0) {
                    costDistributionTable.current.add(data.costDistribution[0][i], data.costDistribution[1][i], data.costDistribution[2][i], data.costDistribution[3][i] / data.costDistribution[2][i])
                }
            }

            for (var i = 0; i < data.priceDistribution[0].length; i++) {
                if (data.priceDistribution[2][i] > 0) {
                    priceDistributionTable.current.add(data.priceDistribution[0][i], data.priceDistribution[1][i], data.priceDistribution[2][i], data.priceDistribution[3][i] / data.priceDistribution[2][i])
                }
            }

            for (var i = 0; i < data.symbolDistribution[0].length; i++) {
                if (data.symbolDistribution[2][i] > 0) {
                    symbolDistributionTable.current.add(data.symbolDistribution[0][i], data.symbolDistribution[1][i], data.symbolDistribution[2][i], data.symbolDistribution[3][i] / data.symbolDistribution[2][i])
                }
            }
            setDayDistribution(data.dayDistribution)
            setHourDistribution(data.hourDistribution)
            setSetupDistribution(data.setupDistribution)
            setDurationDistribution(data.durationDistribution)
            setCostDistribution(data.costDistribution)
            setPriceDistribution(data.priceDistribution)
            setSymbolDistribution(data.symbolDistribution)
            setDataLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (isSigned && !isFirstSigned) {
            setDataLoading(true)
            showTradeTable()
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
        }else if(isSigned){
            setLoading(false)
        }
    }, [isSigned, isFirstSigned])

    return (<>
        {dataLoading &&
            <div className='h-full pt-16 relative'>
                <div className='center'>
                    <Spinner className='w-10 h-10 mx-auto' />
                    <div>Loading data...</div>
                </div>
            </div>
        }
        <div className={classNames('pt-16 h-full', dataLoading ? 'hidden' : '')}>
            <div className='lg:flex mt-5 lg:mt-0 h-full'>
                <div className='w-full lg:w-3/5 h-full overflow-auto'>
                    <TabBar className='flex mb-2 mx-2 space-x-2' view={tabView} adapter={iconTabAdapter} defaultTab='overview'>
                        <Tab className='bg-secondary-800 material' id='overview' label='Overview' icon={faChartPie}/>
                        <Tab className='bg-secondary-800 material' id='options' label='Options' icon={faList} />
                        <Tab className='bg-secondary-800 material' id='trade-distribution' label='Trade distribution' icon={faMoneyBillTransfer} />
                        <Tab className='bg-secondary-800 material' id='risk' label='Risk' icon={fa1} />
                    </TabBar>
                    <TabView ref={tabView} className='w-full'>
                        <Tab id='overview'>
                            <div className='flex flex-wrap'>
                                <ValueCard className='w-full md:w-1/3' icon={faSackDollar}
                                    label='Highest profitable trade' value={<div className='text-green-500'>${round(highestPnl.netPnl, 2)}</div>} trade={highestPnl.symbol} date={highestPnl.entryDate}/>
                                <ValueCard className='w-full md:w-1/3' icon={faSackXmark}
                                    label='Highest profitable trade' value={<div className='text-red-500'>${round(Math.abs(lowestPnl.netPnl), 2)}</div>} trade={lowestPnl.symbol} date={lowestPnl.entryDate}/>
                                {/* <ValueCard className='w-full md:w-1/4' icon={faCoins}
                                    label='Gross P&L' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/> */}
                                <RateCard className='w-full md:w-1/3' icon={faPercentage}
                                    label='win ratio' value={round(100 * winners / totalTrades, 2)} positiveValue={100 * winners / totalTrades} negativeValue={100 * losers / totalTrades} />

                            </div>
                            {data.map((item, i) =><div key={i}>
                                <div className='text-lg font-bold px-2 pt-3 pb-1'>{item[0]}</div>
                                <div className='md:grid grid-cols-3'>
                                    {item[1].map(([label, format, data], j) => 
                                        <Card key={j}>
                                            <div className='flex justify-between font-bold text-xs'>
                                                <div>{label}</div>
                                                {format(data)}
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>)}
                        </Tab>
                        <Tab id='options'>
                            <TabBar className='flex' view={tabView2} adapter={simpleTabAdapter} defaultTab='type'>
                                <Tab id='type' label='Type'/>
                                <Tab id='date' label='Date to expiry' />
                            </TabBar>
                            <TabView ref={tabView2}>
                                <Tab id='type'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by Day</div>
                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={distributionData} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by Day</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={performanceData} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={optionsTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} data={[
                                                    ['In the money', 1058.6, 12, 50],
                                                    ['Out the money', 1058.6, 25, 50],
                                                ]} />
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='date'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by date</div>
                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={dateToExpiryDistribution} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by date</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={dateToExpiryPerformance} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={dateToExpiryTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter}/>
                                        </div>
                                    </Card>
                                </Tab>
                            </TabView>
                        </Tab>
                        <Tab id='trade-distribution'>
                            <TabBar className='flex' view={tabView3} adapter={simpleTabAdapter} defaultTab='day'>
                                <Tab id='day' label='Day'/>
                                <Tab id='hour' label='Hour'/>
                                <Tab id='setup' label='Setup'/>
                                <Tab id='duration' label='Duration'/>
                                <Tab id='cost' label='Cost'/>
                                <Tab id='price' label='Price'/>
                                <Tab id='symbol' label='Symbol'/>
                                <Tab id='tags' label='Tags' />
                                <Tab id='mistake' label='Mistake' />
                            </TabBar>
                            <TabView ref={tabView3}>
                                <Tab id='day'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by Day</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(DAYS,  dayDistribution[1], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by Day</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(DAYS, dayDistribution[0])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={dayDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter}/>
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='hour'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by hour</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(hourDistribution[0], hourDistribution[2], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by hour</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(hourDistribution[0], hourDistribution[1])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={hourDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} />
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='setup'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by setup</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(SETUPS, setupDistribution[1], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by setup</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(SETUPS, setupDistribution[0])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={setupDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} />
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='duration'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by duration</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(DURATIONS, durationDistribution[1], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by duration</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(DURATIONS, durationDistribution[0])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={durationDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} />
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='cost'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by cost</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(costDistribution[0], costDistribution[2], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by cost</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(costDistribution[0], costDistribution[1])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={costDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} />
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='price'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by price</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(priceDistribution[0], priceDistribution[2], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by price</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(priceDistribution[0], priceDistribution[1])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={priceDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} />
                                        </div>
                                    </Card>
                                </Tab>
                                <Tab id='symbol'>
                                    <div className='md:flex'>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Trade distribution by symbol</div>
                                            <div className='h-80'>
                                                <Bar options={barGraphOptions} data={barGraphData(symbolDistribution[0], symbolDistribution[2], primaryColor)} />
                                            </div>
                                        </Card>
                                        <Card className='w-full md:w-1/2'>
                                            <div className='text-lg font-bold'>Performance by symbol</div>

                                            <div className='h-80'>

                                                <Bar options={barGraphOptions} data={barGraphData(symbolDistribution[0], symbolDistribution[1])} />
                                            </div>
                                        </Card>
                                    </div>
                                    <Card>
                                        <div className='overflow-x-auto'>
                                            <Table ref={symbolDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                adapter={detailedJournelOptionsTableAdapter} />
                                        </div>
                                    </Card>
                                </Tab>
                            </TabView>
                        </Tab>
                        <Tab id='risk'></Tab>
                    </TabView>
                </div>
                <Card className='w-full lg:w-2/5 h-full' innerClassName='flex flex-col'>
                    <div className='overflow-auto grow'>
                        <Table
                            ref={tradeTable}
                            headers={['Status', 'Data', 'Symbol', 'Net P&L', 'ROI', 'Side']}
                            adapter={detailedJournelTableAdapter}
                            onClick={(items) => { navigate('/trade-analytics/' + items[items.length - 1]) }} />
                    </div>
                    <div className='mt-2'>
                        <Pagination className='w-fit mx-auto' limit={limit} onChange={showTradeTable} loading={tradesLoading} />
                    </div>
                    {/* <div className='overflow-auto grow '>
                        <Table ref={tradeTable} headers={['Status','Data','Symbol','Net P&L','ROI','Side']} adapter={detailedJournelTableAdapter}
                            onChange={(data) => setTableNumber(data.length)}
                            />
                    </div>
                    <div className='mt-2 text-xs text-center text-secondary-500'>Showing {tableNumber} trades{tableNumber>1?'s':''}. <a className='text-indigo-500' href="/trades">View all</a></div> */}
                </Card>
            </div>
        </div>
    </>)
}
