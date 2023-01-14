import { faCalendar, faChartSimple, faCheckCircle, faClipboard, faCoins, faColumns, faLightbulb, faLineChart, faUpRightAndDownLeftFromCenter, faZap } from '@fortawesome/free-solid-svg-icons'
import React, { useRef } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import { detailedJournelTableAdapter } from '../adapters/table'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { iconTabAdapter } from '../adapters/tabs'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { Tab, TabBar, TabView } from '../components/Tab'
import Table from '../components/Table'
import TagsField from '../components/TagsField'
import { areaGraphData, areaGraphOptions, doughnutChartData, doughnutChartOptions, doughnutChartTextPlugin } from '../libs'
import { DAYS, MONTHS } from '../libs/consts'
import BarGraphCard from './BarGraphCard'
import Calendar from './Calendar'
import Insightes from './Insightes'
import ProgressCard from './ProgressCard'
import IconBtn from '../components/IconBtn';
import ProgressBar from '../components/ProgressBar';

const tabData = [
    {   
        id: 'advance',
        title: 'Comprehensible Reports',
        desc: 'Advanced yet easy to understand reports',
        labels: ['Track your setup', 'Tag your trades', 'Risk analysis', 'Advanced Filtering', 'Running PnL for each trades',
            'Trade distribution analysis', 'Options - Types analysis', 'Running PnL For day'],
        widget: <div className='mx-auto max-w-[20rem] lg:max-w-none h-[75vh] md:h-full relative'>
            <Card className='w-52 lg:w-60 top-16 lg:top-4 lg:left-10 absolute'>
                <div className='flex items-center mb-2 space-x-2'>
                    <Icon className='primary-material' icon={faCoins} size='sm' box/>
                    <div className='font-bold text-sm'>Winrate by trades</div>
                </div>
                <div style={{height:'100px'}}>
                    <Doughnut data={doughnutChartData(['53 Wins', '15 Losses'],[300, 60])} 
                    options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('50%', '#22c55e')]}/>
                </div>
            </Card>
            <BarGraphCard className='hidden lg:block w-80 absolute left-64 top-16' icon={faCalendar} options={[
                ['Performance by day', DAYS, [-150, 300,200,-500,330,100,460]],
                ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
            ]}/>
            <ProgressCard className='w-60 absolute right-0' icon={faZap} label='Tradotics scrore' value={5}/>
            <Card className='w-60 lg:w-80 absolute top-52 left-10 lg:left-0'>
                    <div className='md:h-full lg:h-auto'>
                        <div className='text-lg font-bold'>Running P&L</div>   
                        <div className='pt-5'>
                            <Line options={areaGraphOptions} data={areaGraphData(['09:24','','','','10:07'],[200,800,620,690,390])}/>
                        </div> 
                    </div>
            </Card>
        </div>
    },
    {   
        id: 'insights',
        title: 'Advanced Insights',
        desc: <>Skip surfing through tons of datas, use insights and find out your underlying factors. <br/>We go through all aspects of your trading to provide you the most relevant yet advanced insights</>,
        labels: ['Special insights for option traders', 'Insight to improve your trades','Insight on compared trades', 'Insights for each day'],
        widget: <div className='h-[75vh] md:h-full relative'>
            <Insightes className='hidden md:block w-72 h-80 lg:left-5 top-20 absolute' items={[
                'Most of your profits are from in the money option strike',
                'Gap up is the most traded setup generating 18%(800₹) of your profit',
                'An average of 600₹ profit per trade is left at the table.',
                'You spend an average of 3 Hours and 5 minutes per day for trading.',
                'Early entry is covering 44% of your mistakes losing 3150₹.',
                'You can make more profit(22% more) using a stoploss of 1% and a target of 2.5% for your strategy',
                'Your average daily profit has increased 16% compared to last month.'
            ]}/>
            <Insightes className='w-full md:w-96 h-96 md:h-80 right-0 lg:right-5 absolute' items={[
                'Most of your profits are from in the money option strike',
                'Gap up is the most traded setup generating 18%(800₹) of your profit',
                'An average of 600₹ profit per trade is left at the table.',
                'You spend an average of 3 Hours and 5 minutes per day for trading.',
                'Early entry is covering 44% of your mistakes losing 3150₹.',
                'You can make more profit(22% more) using a stoploss of 1% and a target of 2.5% for your strategy',
                'Your average daily profit has increased 16% compared to last month.'                    
            ]}/>
        </div>
    },
    {   
        id: 'journal',
        title: 'Trading journal',
        desc: 'Compete at your highest possible level through jounraling',
        labels: ['Track your habits', 'Tradotics score',  'Trade filtering',
            'Trade filtering', 'Easy to add trades', 'Add notes', 'Identify setups and mistakes', 'Improvement Suggestions', 'Track entries and exit', 
              'Risk management'],
        widget: <Card className='h-full'>
            <div className='overflow-x-auto'>
                <Table headers={['Status','Data','Symbol','Net P&L','ROI','Side']} adapter={detailedJournelTableAdapter} onClick = {()=>{}}
                    data = {[
                        [1, 'Aug 08 2022', 'ASIANPAINTS', 6013.6, 0.93, 0 ],
                        [0, 'Aug 08 2022', 'RELIANCE', 6013.6, 0.93, 0 ],
                        [0, 'Aug 08 2022', 'ASIANPAINTS', 6013.6, 0.93, 1],
                    ]}/>
            </div>
        </Card>
    },
    {   
        id: 'analytics',
        title: 'Analytics',
        desc: 'View your trades in a relevant and stylish manner',
        labels: ['Trades table', 'Calender View', 'Calender View', 'Day view', 'Chart View'],
        widget: <div className='h-[75vh] md:h-96 relative'>
            <Card className='hidden md:block w-3/4 right-40 absolute -bottom-10'>
                    <div className='flex items-center justify-between md:justify-start'>
                        <div className='font-bold'>Wed, Aug 11 2022</div>
                        <div className='md:ml-5 text-xs text-green-500 font-bold bg-green-500/25 rounded-full px-2 py-1'>Net P&L $4036.00</div>
                        <div className='ml-auto'>
                            <IconBtn icon={faUpRightAndDownLeftFromCenter} size='sm'/>
                        </div>
                    </div>
                    <div className='w-full md:flex mt-1 md:space-x-5 items-center'>
                        <div className='w-full md:w-1/3 h-36'>
                            <Line options={areaGraphOptions} data={areaGraphData(['09:24', '', '', '', '10:07'], [0,100,400,100,300])} />
                        </div>
                        <div className='w-full md:w-1/3 mt-3 md:mt-0'>
                            <div className='flex'><div>Winrate</div><div className='ml-auto'>75%</div></div>
                            <div className='flex'><div>Total trades</div><div className='ml-auto'>4</div></div>
                            <div className='flex'><div>Volume</div><div className='ml-auto'>255</div></div>
                        </div>
                        <div className='w-full md:w-1/3'>
                            <div className='flex'><div>Profit factor</div><div className='ml-auto'>2.55</div></div>
                            <div className='flex'><div>Winners</div><div className='ml-auto'>3</div></div>
                            <div className='flex'><div>Losers</div><div className='ml-auto'>1</div></div>
                        </div>
                    </div>
                </Card>
            <Card className='absolute md:right-0 w-full md:w-96 h-80 md:h-96'>
                <Calendar markers={{'16-1-2023':[40,5],'22-1-2023':[40,5],'19-1-2023':[-40,5], '1-1-2023':[-50,2]}}/>
            </Card>

        </div>
    },
    {   
        id: 'compare',
        title: 'Compare strategies',
        desc: 'Select any two set of trades and compare with each other ',
        labels: [],
        widget: <Card className='h-full'>
            <div className='w-full flex'>
                <div className='w-1/2 md:w-1/3 py-2 border-l border-b border-t border-secondary-800 text-secondary-500 text-lg text-center font-bold'>Filter 1</div>
                <div className='w-1/2 md:w-1/3 py-2 border-l border-r md:border-r-0 border-b border-t border-secondary-800 text-secondary-500 text-lg text-center font-bold'>Filter 2</div>
                <div className='hidden md:block w-1/3 py-2 border border-secondary-800 text-secondary-500 text-lg text-center font-bold'>Difference</div>
            </div>
            <div className='md:flex items-center'>
                <div className='w-full flex flex-wrap'>
                    <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10'>
                        <div className='flex items-center mt-auto'>
                            <ProgressBar value={5} max={10}/>
                            <div className='ml-auto font-bold'><span className='text-indigo-500'>{5}</span>/{10}</div>
                        </div>
                    </div>
                    <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10'>
                        <div className='flex items-center mt-auto'>
                            <ProgressBar value={2} max={10}/>
                            <div className='ml-auto font-bold'><span className='text-indigo-500'>{2}</span>/{10}</div>
                        </div>
                    </div>
                    <div className='w-full md:w-1/3 border-l border-b border-r border-secondary-800 p-2 md:py-5 md:px-10'>
                        <div className='flex justify-between items-center h-full'>
                            <div>Filter 1</div> 
                            <div className='text-indigo-500'>2.1</div>
                            <div className='text-indigo-500'>(22%)</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='md:flex items-center'>
                <div className='w-full flex flex-wrap'>
                    <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2'>                        
                            <Line options={areaGraphOptions} data={areaGraphData(['01/08/22','10/08/22','20/08/22','30/08/22'],[10,-40,150,130])} />
                    </div>
                    <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2'>
                            <Line options={areaGraphOptions} data={areaGraphData(['01/08/22','10/08/22','20/08/22','30/08/22'],[40,20,-50,120])} />
                    </div>
                    <div className='w-full md:w-1/3 border-l border-b border-r border-secondary-800 p-2 md:py-5 md:px-10'>
                        <div>Net P&L</div>
                        <div className='flex justify-between items-center'>
                            <div>Filter 2</div> 
                            <div className='text-indigo-500'>2.1</div>
                            <div className='text-indigo-500'>(22%)</div>
                        </div>
                        <div>Max profit</div>
                        <div className='flex justify-between items-center'>
                            <div>Filter 1</div> 
                            <div className='text-indigo-500'>2.1</div>
                            <div className='text-indigo-500'>(22%)</div>
                        </div>
                        <div>Max loss</div>
                        <div className='flex justify-between items-center'>
                            <div>Filter 1</div> 
                            <div className='text-indigo-500'>2.1</div>
                            <div className='text-indigo-500'>(22%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    },
]

export default function FeaturesTabs() {
    let tabView = useRef()
    return (
        <div className='h-full'>
            <Card className='-m-2 lg:m-0'>
                <TabBar className='md:flex justify-items-stretch justify-between' tabClassName='w-full mx-1' 
                    view={tabView} adapter={iconTabAdapter}>
                    <Tab className='secondary-material bg-secondary-800' id='advance' icon={faClipboard} label='Advance Reports'active />
                    <Tab className='secondary-material bg-secondary-800' id='insights' icon={faLightbulb} label='Automated Insights'/>
                    <Tab className='secondary-material bg-secondary-800' id='journal' icon={faChartSimple} label='Journal'/>
                    <Tab className='secondary-material bg-secondary-800' id='analytics' icon={faLineChart} label='Analytics' />
                    <Tab className='secondary-material bg-secondary-800' id='compare' icon={faColumns} label='Compare Strategies'/>
                </TabBar>
            </Card>
            <TabView className='mt-10' ref={tabView}>
                {tabData.map((data, i) => 
                    <Tab key={i} id={data.id}>
                        <div className='md:flex md:m-10 md:space-x-5 mt-10 lg:mt-0'>
                            <div className='md:w-1/3 '>
                                <div className='text-2xl font-bold mr-auto'>{data.title}</div>
                                <div className='text-sm md:text-base text-secondary-500'>{data.desc}</div>
                                <div className='flex flex-wrap mt-5'>
                                    {data.labels.map((label, j) => 
                                        <div key={j} className='bg-indigo-500 rounded-full text-white pl-2 md:pl-4  pr-1 md:pr-2 py-1 flex items-center text-xs md:text-sm font-bold mb-2 mr-2'>
                                            {label} <Icon className='ml-1 md:ml-2' icon={faCheckCircle}/>
                                        </div>    
                                    )}
                                </div>
                            </div>
                            <div className='md:w-2/3 mt-10 md:mt-0'>{data.widget}</div>
                        </div>
                    </Tab>
                )}
            </TabView>
        </div>
    )
}
