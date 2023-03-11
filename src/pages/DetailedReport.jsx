import React, { useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { FORMAT, DAYS, DURATIONS } from '../libs/consts'
import { iconTabAdapter, simpleTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { barGraphData, barGraphOptions } from '../libs'
import { detailedJournelOptionsTableAdapter, detailedJournelTableAdapter } from '../adapters/table'
import { fa1, faChartPie, faList, faMoneyBillTransfer, faPercentage, faSackDollar, faSackXmark } from '@fortawesome/free-solid-svg-icons'
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
import TradesTable from '../elements/TradesTable';

export default function DetailedJournal() {
    const [data, setData] = useState({
        costDistribution: [[], [], [], [], []],
        counts: [0, 0, 0],
        dataByExpiryDate: [[], [], [], [], []],
        dateWise: [0, 0, 0, 0, 0],
        dayDistribution: [[], [], [], []],
        durationDistribution: [[], [], [], []],
        highestPnlTrade: {},
        holdTimes: [],
        hourDistribution: [[], [], [], []],
        lowestPnlTrade: {},
        maxConsec: [0, 0],
        openAndClose: [0, 0],
        pnlByStatus: [0, 0],
        pnlByTradeTypes: [0, 0],
        priceDistribution: [[], [], [], [], []],
        countsByRoi: [0, 0, 0, 0, 0],
        setupDistribution: [[], [], [], [], []],
        tagsDistribution: [[], [], [], [], []],
        mistakesDistribution: [[], [], [], [], []],
        symbolDistribution: [[], [], [], [], []],
        totalQuantity: 0,
    })
    const [dataLoading, setDataLoading] = useState(true)

    let overViewData = [
        ["Return", [
            ["Return on winners", FORMAT.CURRENCY, data.pnlByStatus[0]],
            ["Return on lossers", FORMAT.CURRENCY, data.pnlByStatus[1]],
            ["Return on long", FORMAT.CURRENCY, data.pnlByTradeTypes[0]],
            ["Return on shorts", FORMAT.CURRENCY, data.pnlByTradeTypes[1]],
            ["Acc balance", FORMAT.CURRENCY, (data.pnlByStatus[0] + data.pnlByStatus[1]) ],
            ["Avg return / share", FORMAT.CURRENCY, (data.pnlByStatus[0] + data.pnlByStatus[1])/data.totalQuantity],
        ]
        ],
        ["Summary", [
            ["Total PnL", FORMAT.CURRENCY, (data.pnlByStatus[0] + data.pnlByStatus[1])],
            ["Profit factor", FORMAT.NUMBER, Math.abs(round(data.pnlByStatus[0]/data.pnlByStatus[1], 2))],
            ["Daily volume", FORMAT.CURRENCY, data.totalQuantity/data.dateWise[0]],
            ["Avg winners", FORMAT.CURRENCY, data.pnlByStatus[0]/data.counts[1]],
            ["Avg Lossers", FORMAT.CURRENCY, data.pnlByStatus[1] / data.counts[2]],
            ["Average dialy return", FORMAT.CURRENCY, (data.pnlByStatus[0] + data.pnlByStatus[1])/data.dateWise[0]],
        ]
        ],
        ["Trades", [
            ["Winning trades", FORMAT.NUMBER, data.counts[1]],
            ["Losing trades", FORMAT.NUMBER, data.counts[2]],
            ["Break Even trades", FORMAT.NUMBER, data.counts[0]-(data.counts[1]+data.counts[2])],
            ["Total num of trades", FORMAT.NUMBER, data.counts[0]],
            ["Max consec win trades", FORMAT.NUMBER, data.maxConsec[0]],
            ["Max consec loss trades", FORMAT.NUMBER, data.maxConsec[1]],
            ["Open trades", FORMAT.NUMBER, data.openAndClose[0]],
            ["Closed trades", FORMAT.NUMBER, data.openAndClose[1]],
            ["Avg trades per day", FORMAT.NUMBER, round(data.counts[0]/data.dateWise[0], 2)],
            ["No of short trades", FORMAT.NUMBER, data.counts[3]],
            ["No of long trades", FORMAT.NUMBER, data.counts[4]],
        ]
        ],
        ["Return %", [
            ["Avg % return", FORMAT.PERCENTAGE, round(data.countsByRoi[0]/data.counts[0], 2)],
            ["Avg % on winners", FORMAT.PERCENTAGE, round(data.countsByRoi[1] / data.counts[1], 2)],
            ["Avg % on losses", FORMAT.PERCENTAGE, round(data.countsByRoi[2] / data.counts[2], 2)],
            ["Avg % on long", FORMAT.PERCENTAGE, round(data.countsByRoi[3] / data.counts[3], 2)],
            ["Avg % on short", FORMAT.PERCENTAGE, round(data.countsByRoi[4] / data.counts[4], 2)],
        ]
        ],
        ["Days", [
            ["Total trading days", FORMAT.NUMBER, data.dateWise[0]],
            ["Winning days", FORMAT.NUMBER, data.dateWise[1]],
            ["Lossing days", FORMAT.NUMBER, data.dateWise[2]],
            ["Break Even days", FORMAT.NUMBER, data.dateWise[0] - (data.dateWise[1].winners + data.dateWise[2])],
            ["Max consec win days", FORMAT.NUMBER, data.dateWise[3]],
            ["Max consec loss days", FORMAT.NUMBER, data.dateWise[4]],
        ]
        ],
        ["Hold time", [
            ["Avg hold time", FORMAT.TIME, data.holdTimes[0]],
            ["Avg winners hold time", FORMAT.TIME, data.holdTimes[1]],
            ["Avg lossers hold time", FORMAT.TIME, data.holdTimes[2]],
            ["Avg time on long", FORMAT.TIME, data.holdTimes[3]],
            ["Avg time on short", FORMAT.TIME, data.holdTimes[4]],
            ["Duration of Highest profit", FORMAT.TIME, data.holdTimes[5]],
        ]
        ],
        // ["risk", [
        //     ["Avg planned RR", FORMAT.NUMBER, 19],
        //     ["Avg realized RR", FORMAT.NUMBER, 19],
        //     ["Trade expectancy", FORMAT.NUMBER, 19],
        // ]
        // ],
    ]
    
    let performanceData = barGraphData(DAYS, [200, 100,300,400,370,150,500])
    let distributionData = barGraphData(DAYS, [150, 300,200,500,330,100,460])

    let tabView = useRef()
    let tabView2 = useRef()
    let tabView3 = useRef()
    let optionsTable = useRef()
    let dataByExpiryDateTable = useRef()
    let dayDistributionTable = useRef()
    let hourDistributionTable = useRef()
    let setupDistributionTable = useRef()
    let tagsDistributionTable = useRef()
    let mistakesDistributionTable = useRef()
    let durationDistributionTable = useRef()
    let costDistributionTable = useRef()
    let priceDistributionTable = useRef()
    let symbolDistributionTable = useRef()

    const { setLoading } = useUI()
    const { filters } = useFilter()
    const { isSigned, isFirstSigned, post, getAuth, getTradeTable } = useAPI() 
    const navigate = useNavigate()

    function showData() {
        dataByExpiryDateTable.current.removeAll()
        dayDistributionTable.current.removeAll()
        hourDistributionTable.current.removeAll()
        setupDistributionTable.current.removeAll()
        tagsDistributionTable.current.removeAll()
        mistakesDistributionTable.current.removeAll()
        durationDistributionTable.current.removeAll()
        costDistributionTable.current.removeAll()
        priceDistributionTable.current.removeAll()
        symbolDistributionTable.current.removeAll()
        post(API_URL + '/detailed-report', filters, getAuth()).then(response => {
            let data = response.data
            setData(data)
            
            for (var i = 0; i < data.dataByExpiryDate[0].length; i++) {
                if (data.dataByExpiryDate[2][i] > 0){
                    dataByExpiryDateTable.current.add(
                        data.dataByExpiryDate[0][i], 
                        data.dataByExpiryDate[1][i], 
                        data.dataByExpiryDate[2][i], 
                        data.dataByExpiryDate[3][i],
                        data.dataByExpiryDate[4][i])
                }
            }

            for (var i = 0; i < DAYS.length; i++) {
                if (data.dayDistribution[1][i] > 0){
                    dayDistributionTable.current.add(
                        DAYS[i], 
                        data.dayDistribution[0][i], 
                        data.dayDistribution[1][i], 
                        data.dayDistribution[2][i] / data.dayDistribution[1][i],
                        data.dayDistribution[3][i]
                    )
                }
            }

            for (var i = 0; i < data.hourDistribution[0].length; i++) {
                hourDistributionTable.current.add(
                    data.hourDistribution[0][i], 
                    data.hourDistribution[1][i], 
                    data.hourDistribution[2][i], 
                    data.hourDistribution[3][i] / data.hourDistribution[2][i],
                    data.hourDistribution[4][i], 
                )
            }


            for (var i = 0; i < data.setupDistribution[0].length; i++) {
                if (data.setupDistribution[1][i] > 0) {
                    setupDistributionTable.current.add(
                        data.setupDistribution[0][i],
                        data.setupDistribution[1][i],
                        data.setupDistribution[2][i],
                        data.setupDistribution[3][i] / data.setupDistribution[2][i],
                        data.setupDistribution[4][i]
                        
                    )
                }
            }

            for (var i = 0; i < data.tagsDistribution[0].length; i++) {
                if (data.tagsDistribution[1][i] > 0) {
                    tagsDistributionTable.current.add(
                        data.tagsDistribution[0][i],
                        data.tagsDistribution[1][i],
                        data.tagsDistribution[2][i],
                        data.tagsDistribution[3][i] / data.tagsDistribution[2][i],
                        data.tagsDistribution[4][i]

                    )
                }
            }

            for (var i = 0; i < data.mistakesDistribution[0].length; i++) {
                if (data.mistakesDistribution[1][i] > 0) {
                    mistakesDistributionTable.current.add(
                        data.mistakesDistribution[0][i],
                        data.mistakesDistribution[1][i],
                        data.mistakesDistribution[2][i],
                        data.mistakesDistribution[3][i] / data.mistakesDistribution[2][i],
                        data.mistakesDistribution[4][i]

                    )
                }
            }

            for (var i = 0; i < DURATIONS.length; i++) {
                if (data.durationDistribution[1][i] > 0) {
                    durationDistributionTable.current.add(
                        DURATIONS[i], 
                        data.durationDistribution[0][i], 
                        data.durationDistribution[1][i], 
                        data.durationDistribution[2][i]/ data.durationDistribution[1][i],
                        data.durationDistribution[3][i] 
                    )
                }
            }

            for (var i = 0; i < data.costDistribution[0].length; i++) {
                if (data.costDistribution[2][i] > 0) {
                    costDistributionTable.current.add(
                        data.costDistribution[0][i], 
                        data.costDistribution[1][i], 
                        data.costDistribution[2][i], 
                        data.costDistribution[3][i] / data.costDistribution[2][i],
                        data.costDistribution[4][i])
                }
            }

            for (var i = 0; i < data.priceDistribution[0].length; i++) {
                if (data.priceDistribution[2][i] > 0) {
                    priceDistributionTable.current.add(
                        data.priceDistribution[0][i], 
                        data.priceDistribution[1][i], 
                        data.priceDistribution[2][i], 
                        data.priceDistribution[3][i] / data.priceDistribution[2][i],
                        data.priceDistribution[4][i])
                }
            }

            for (var i = 0; i < data.symbolDistribution[0].length; i++) {
                if (data.symbolDistribution[2][i] > 0) {
                    symbolDistributionTable.current.add(
                        data.symbolDistribution[0][i], 
                        data.symbolDistribution[1][i], 
                        data.symbolDistribution[2][i], 
                        data.symbolDistribution[3][i] / data.symbolDistribution[2][i],
                        data.symbolDistribution[4][i])
                }
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
        <div className='p-3 h-screen overflow-y-auto mb-16 md:mb-0'>
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
                            <Tab className='bg-secondary-800 material' id='overview' label='Overview' icon={faChartPie} />
                            <Tab className='bg-secondary-800 material' id='options' label='Options' icon={faList} />
                            <Tab className='bg-secondary-800 material' id='trade-distribution' label='Trade distribution' icon={faMoneyBillTransfer} />
                            {/* <Tab className='bg-secondary-800 material' id='risk' label='Risk' icon={fa1} /> */}
                        </TabBar>
                        <TabView ref={tabView} className='w-full'>
                            <Tab id='overview'>
                                <div className='flex flex-wrap'>
                                    <ValueCard className='w-full md:w-1/3' icon={faSackDollar}
                                        label='Highest profitable trade' value={<div className='text-green-500'>${round(data.highestPnlTrade.netPnl, 2)}</div>} trade={data.highestPnlTrade.symbol} date={data.highestPnlTrade.entryDate} />
                                    <ValueCard className='w-full md:w-1/3' icon={faSackXmark}
                                        label='Highest profitable trade' value={<div className='text-red-500'>${round(Math.abs(data.lowestPnlTrade.netPnl), 2)}</div>} trade={data.lowestPnlTrade.symbol} date={data.lowestPnlTrade.entryDate} />
                                    <RateCard 
                                        className='w-full md:w-1/3' 
                                        icon={faPercentage}
                                        label='win ratio' 
                                        value={round(100 * data.counts[1] / data.counts[0], 2)} 
                                        positiveValue={100 * data.counts[1] / data.counts[0]} 
                                        negativeValue={100 * data.counts[2] / data.counts[0]} />

                                </div>
                                {overViewData.map((item, i) => <div key={i}>
                                    <div className='text-lg font-bold px-2 pt-3 pb-1'>{item[0]}</div>
                                    <div className='md:grid grid-cols-3'>
                                        {item[1].map(([label, format, value], j) =>
                                            <Card key={j}>
                                                <div className='flex justify-between font-bold text-xs'>
                                                    <div>{label}</div>
                                                    {format(value)}
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                                </div>)}
                            </Tab>
                            <Tab id='options'>
                                <TabBar className='flex' view={tabView2} adapter={simpleTabAdapter} defaultTab='type'>
                                    <Tab id='type' label='Type' />
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
                                                    adapter={detailedJournelOptionsTableAdapter} />
                                            </div>
                                        </Card>
                                    </Tab>
                                    <Tab id='date'>
                                        <div className='md:flex'>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Trade distribution by date</div>
                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} 
                                                        data={barGraphData(data.dataByExpiryDate[0], data.dataByExpiryDate[2], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by date</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} 
                                                        data={barGraphData(data.dataByExpiryDate[0], data.dataByExpiryDate[1])} />
                                                </div>
                                            </Card>
                                        </div>
                                        <Card>
                                            <div className='overflow-x-auto'>
                                                <Table 
                                                    ref={dataByExpiryDateTable} 
                                                    headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                    adapter={detailedJournelOptionsTableAdapter} />
                                            </div>
                                        </Card>
                                    </Tab>
                                </TabView>
                            </Tab>
                            <Tab id='trade-distribution'>
                                <TabBar className='flex' view={tabView3} adapter={simpleTabAdapter} defaultTab='day'>
                                    <Tab id='day' label='Day' />
                                    <Tab id='hour' label='Hour' />
                                    <Tab id='setup' label='Setup' />
                                    <Tab id='duration' label='Duration' />
                                    <Tab id='cost' label='Cost' />
                                    <Tab id='price' label='Price' />
                                    <Tab id='symbol' label='Symbol' />
                                    <Tab id='tags' label='Tags' />
                                    <Tab id='mistakes' label='Mistakes' />
                                </TabBar>
                                <TabView ref={tabView3}>
                                    <Tab id='day'>
                                        <div className='md:flex'>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Trade distribution by Day</div>
                                                <div className='h-80'>
                                                    <Bar options={barGraphOptions} 
                                                    data={barGraphData(DAYS, data.dayDistribution[1], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by Day</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(DAYS, data.dayDistribution[0])} />
                                                </div>
                                            </Card>
                                        </div>
                                        <Card>
                                            <div className='overflow-x-auto'>
                                                <Table ref={dayDistributionTable} headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                    adapter={detailedJournelOptionsTableAdapter} />
                                            </div>
                                        </Card>
                                    </Tab>
                                    <Tab id='hour'>
                                        <div className='md:flex'>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Trade distribution by hour</div>
                                                <div className='h-80'>
                                                    <Bar options={barGraphOptions} data={barGraphData(data.hourDistribution[0], data.hourDistribution[2], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by hour</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(data.hourDistribution[0], data.hourDistribution[1])} />
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
                                                    <Bar options={barGraphOptions} data={barGraphData(data.setupDistribution[0], data.setupDistribution[2], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by setup</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(data.setupDistribution[0], data.setupDistribution[1])} />
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
                                                    <Bar options={barGraphOptions} data={barGraphData(DURATIONS, data.durationDistribution[1], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by duration</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(DURATIONS, data.durationDistribution[0])} />
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
                                                    <Bar options={barGraphOptions} data={barGraphData(data.costDistribution[0], data.costDistribution[2], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by cost</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(data.costDistribution[0], data.costDistribution[1])} />
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
                                                    <Bar options={barGraphOptions} data={barGraphData(data.priceDistribution[0], data.priceDistribution[2], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by price</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(data.priceDistribution[0], data.priceDistribution[1])} />
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
                                                    <Bar options={barGraphOptions} data={barGraphData(data.symbolDistribution[0], data.symbolDistribution[2], primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by symbol</div>

                                                <div className='h-80'>

                                                    <Bar options={barGraphOptions} data={barGraphData(data.symbolDistribution[0], data.symbolDistribution[1])} />
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
                                    <Tab id='tags'>
                                        <div className='md:flex'>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Trade distribution by tags</div>
                                                <div className='h-80'>
                                                    <Bar 
                                                        options={barGraphOptions} 
                                                        data={barGraphData(
                                                            data.tagsDistribution[0], 
                                                            data.tagsDistribution[2], 
                                                            primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by tags</div>
                                                <div className='h-80'>
                                                    <Bar 
                                                        options={barGraphOptions} 
                                                        data={barGraphData(
                                                            data.tagsDistribution[0], 
                                                            data.tagsDistribution[1])} />
                                                </div>
                                            </Card>
                                        </div>
                                        <Card>
                                            <div className='overflow-x-auto'>
                                                <Table 
                                                    ref={tagsDistributionTable} 
                                                    headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                    adapter={detailedJournelOptionsTableAdapter} />
                                            </div>
                                        </Card>
                                    </Tab>
                                    <Tab id='mistakes'>
                                        <div className='md:flex'>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Trade distribution by mistakes</div>
                                                <div className='h-80'>
                                                    <Bar 
                                                        options={barGraphOptions} 
                                                        data={barGraphData(
                                                            data.mistakesDistribution[0], 
                                                            data.mistakesDistribution[2], 
                                                            primaryColor)} />
                                                </div>
                                            </Card>
                                            <Card className='w-full md:w-1/2'>
                                                <div className='text-lg font-bold'>Performance by mistakes</div>

                                                <div className='h-80'>

                                                    <Bar 
                                                        options={barGraphOptions} 
                                                        data={barGraphData(
                                                            data.mistakesDistribution[0], 
                                                            data.mistakesDistribution[1])} />
                                                </div>
                                            </Card>
                                        </div>
                                        <Card>
                                            <div className='overflow-x-auto'>
                                                <Table 
                                                    ref={mistakesDistributionTable} 
                                                    headers={['Type', 'Net P&L', 'No of trades', 'Cost', 'Winrate']}
                                                    adapter={detailedJournelOptionsTableAdapter} />
                                            </div>
                                        </Card>
                                    </Tab>
                                </TabView>
                            </Tab>
                            {/* <Tab id='risk'></Tab> */}
                        </TabView>
                    </div>
                    <TradesTable 
                        className ='w-full lg:w-2/5 h-full '
                        headers={['Si/No', 'Status', 'Data', 'Symbol', 'Net P&L', 'ROI', 'Side']}
                        adapter={detailedJournelTableAdapter}
                        total={data.counts[0]} />
                </div>
            </div>
        </div>
    </>)
}
