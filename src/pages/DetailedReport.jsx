import React, { useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { FORMAT, DAYS } from '../libs/consts'
import { iconTabAdapter, simpleTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { barGraphData, barGraphOptions } from '../libs'
import { detailedJournelOptionsTableAdapter, detailedJournelTableAdapter } from '../adapters/table'
import { faChartPie,  faCoins, faList, faMoneyBillTransfer, faPercentage, faSackDollar, faSackXmark } from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import Table from '../components/Table'
import RateCard from '../elements/RateCard'
import ValueCard from '../elements/ValueCard'

export default function DetailedJournal() {
    let data = [
        ["Return", [
                ["Return on winners", FORMAT.CURRENCY, 20556],
                ["Return on lossers", FORMAT.CURRENCY, -20556],
                ["Return on long", FORMAT.CURRENCY, 20556],
                ["Return on shorts", FORMAT.CURRENCY, 20556],
                ["Acc balance", FORMAT.CURRENCY, 20556],
                ["Avg return / share", FORMAT.CURRENCY, 20556],
            ]
        ],
        ["Summary", [
                ["Total PL", FORMAT.CURRENCY, 20556],
                ["Profit factor", FORMAT.NUMBER, 2],
                ["Daily volume", FORMAT.CURRENCY, 20556],
                ["Avg winners", FORMAT.CURRENCY, 20556],
                ["Avg Lossers", FORMAT.CURRENCY, 20556],
                ["Average dialy return", FORMAT.CURRENCY, 20556],
            ]
        ],
        ["Trades", [
                ["Winning trades", FORMAT.NUMBER, 19],
                ["Losing trades", FORMAT.NUMBER, 19],
                ["Break Even trades", FORMAT.NUMBER, 19],
                ["Total num of trades", FORMAT.NUMBER, 19],
                ["Winning trades", FORMAT.NUMBER, 19],
                ["Max consec win trades", FORMAT.NUMBER, 19],
                ["Max consec loss trades", FORMAT.NUMBER, 19],
                ["Closed trades", FORMAT.NUMBER, 19],
                ["Open trades", FORMAT.NUMBER, 19],
                ["Avg trades per day", FORMAT.NUMBER, 19],
                ["No of short trades", FORMAT.NUMBER, 19],
                ["No of long trades", FORMAT.NUMBER, 19],
            ]
        ],
        ["Return %", [
                ["Avg % return", FORMAT.PERCENTAGE, 19],
                ["Avg % on winners", FORMAT.PERCENTAGE, 19],
                ["Avg % on losses", FORMAT.PERCENTAGE, 19],
                ["Avg % on long", FORMAT.PERCENTAGE, 19],
                ["Avg % on short", FORMAT.PERCENTAGE, 19],
            ]
        ],
        ["Days", [
                ["Total trading days", FORMAT.NUMBER, 19],
                ["Winning days", FORMAT.NUMBER, 19],
                ["Lossing days", FORMAT.NUMBER, 19],
                ["Break Even days", FORMAT.NUMBER, 19],
                ["Max consec win days", FORMAT.NUMBER, 19],
                ["Max consec loss days", FORMAT.NUMBER, 19],
            ]
        ],
        ["Hold time", [
                ["Avg hold time", FORMAT.TIME, 19],
                ["Avg winners hold time", FORMAT.TIME, 19],
                ["Avg lossers hold time", FORMAT.TIME, 19],
                ["Avg time on long", FORMAT.TIME, 19],
                ["Avg time on short", FORMAT.TIME, 19],
                ["Duration of Highest profit", FORMAT.TIME, 19],
            ]
        ],
        ["risk", [
                ["Avg planned RR", FORMAT.NUMBER, 19],
                ["Avg realized RR", FORMAT.NUMBER, 19],
                ["Trade expectancy", FORMAT.NUMBER, 19],
            ]
        ],
    ]

    const [tableNumber, setTableNumber] = useState(0)
    
    let performanceData = barGraphData(DAYS, [200, 100,300,400,370,150,500])
    let distributionData = barGraphData(DAYS, [150, 300,200,500,330,100,460])

    let tabView = useRef()
    let tabView2 = useRef()
    let tabView3 = useRef()
    let optionsTable = useRef()

    return (
        <div className='pt-16 h-full'>
            <div className='lg:flex mt-5 lg:mt-0 h-full'>
                <div className='w-full lg:w-3/5 h-full overflow-auto'>
                    <TabBar className='flex mb-2 mx-2' view={tabView} adapter={iconTabAdapter}>
                        <Tab id='overview' label='Overview' icon={faChartPie} active/>
                        <Tab id='options' label='Options' icon={faList} />
                        <Tab id='trade-distribution' label='Trade distribution' icon={faMoneyBillTransfer}/>
                    </TabBar>
                    <TabView ref={tabView} className='w-full'>
                        <Tab id='overview'>
                            <div className='flex flex-wrap'>
                                <ValueCard className='w-full md:w-1/4' icon={faSackDollar}
                                    label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                                <ValueCard className='w-full md:w-1/4' icon={faSackXmark}
                                    label='Highest profitable trade' value={<div className='text-red-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                                <ValueCard className='w-full md:w-1/4' icon={faCoins}
                                    label='Gross P&L' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                                <RateCard className='w-full md:w-1/4' icon={faPercentage}
                                    label='win ratio' value={50} positiveValue={75} negativeValue={35}/>
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
                            <TabBar className='flex' view={tabView2} adapter={simpleTabAdapter}>
                                <Tab id='type' label='Type' active/>
                                <Tab id='date' label='Date to expiry' />
                            </TabBar>
                            <TabView ref={tabView2}></TabView>
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
                                    <Table ref={optionsTable} headers={['Type', 'Net P&L', 'No of trades', 'Volume', 'Winrate']}
                                    adapter={detailedJournelOptionsTableAdapter} data={[
                                        ['In the money', 1058.6, 12, 50],
                                        ['Out the money', 1058.6, 25, 50],
                                    ]}/>
                                </div>
                            </Card>
                        </Tab>
                        <Tab id='trade-distribution'>
                            <TabBar className='flex' view={tabView3} adapter={simpleTabAdapter}>
                                <Tab id='day' label='Day' active/>
                                <Tab id='hourse' label='Hour'/>
                                <Tab id='setup' label='Setup'/>
                                <Tab id='duration' label='Duration'/>
                                <Tab id='cost' label='Cost'/>
                                <Tab id='price' label='Price'/>
                                <Tab id='symbol' label='Symbol'/>
                                <Tab id='tags' label='Tags'/>
                            </TabBar>
                            <TabView ref={tabView3}></TabView>
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
                                    <Table ref={optionsTable} headers={['Type', 'Net P&L', 'No of trades', 'Volume', 'Winrate']}
                                    adapter={detailedJournelOptionsTableAdapter} data={[
                                        ['In the money', 1058.6, 12, 50],
                                        ['Out the money', 1058.6, 25, 50],
                                    ]}/>
                                </div>
                            </Card>
                        </Tab>
                    </TabView>
                </div>
                <Card className='w-full lg:w-2/5 h-full' innerClassName='flex flex-col'>
                    <div className='overflow-auto grow '>
                        <Table headers={['Status','Data','Symbol','Net P&L','ROI','Side']} adapter={detailedJournelTableAdapter}
                            onChange={(data) => setTableNumber(data.length)}
                            data = {[
                                [1, 'Aug 08 2022', 'ASIANPAINTS', 6013.6, 0.93, 0 ],
                                [0, 'Aug 08 2022', 'RELIANCE', 6013.6, 0.93, 0 ],
                                [0, 'Aug 08 2022', 'ASIANPAINTS', 6013.6, 0.93, 1],
                            ]}
                            />
                    </div>
                    <div className='mt-2 text-xs text-center text-secondary-500'>Showing {tableNumber} trades{tableNumber>1?'s':''}. <a className='text-indigo-500' href="/trades">View all</a></div>
                </Card>
            </div>
        </div>
    )
}
