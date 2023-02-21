import React, { useRef, useState } from 'react'
import { DAYS, DURATIONS, MONTHS } from '../libs/consts'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { iconTabAdapter, simpleTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { popularCompareTableAdapter, savedCompareTableAdapter } from '../adapters/table'
import { faCalendar, faSave, faSliders, faStar, faStopwatch, faUser } from '@fortawesome/free-solid-svg-icons'
import { areaGraphData, areaGraphDoubleData, areaGraphOptions, barGraphDoubleData, barGraphOptions, doughnutChartData, doughnutChartOptions, doughnutChartTextPlugin } from '../libs'
import Card from '../components/Card'
import Icon from '../components/Icon'
import Table from '../components/Table'
import Dialog from '../components/Dialog'
import Insightes from '../elements/Insightes'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import ProgressBar from '../components/ProgressBar'
import BarGraphCard from '../elements/BarGraphCard'
import { Filter } from '../elements/Filter'
import { useEffect } from 'react'
import { useUI } from '../contexts/UIContext'
import { useAPI } from '../contexts/APIContext'
import { API_URL } from '../config'
import { classNames, Form, mergeCumulativeDatas, mergeGraphDatas, round, safeNumber } from '../utils'

export default function Compare() {
    let dummyData = {
        counts: [0, 0, 0, 0, 0],
        cumulativePnl: [[], []],
        highestPnlTrade: { },
        lowestPnlTrade: { },
        pnlByDays: [],
        pnlByDuration: [[], []],
        pnlByMonths: [],
        pnlByStatus: [],
        pnlBySetup: [[], []],
        pnlByHours: [[], []],
        profitFactor: 0,
        holdTimes: [],
        dialyPnl: [[], []]
    }

    const [dataLoading, setDataLoading] = useState(true)
    const [data1, setData1] = useState(dummyData)
    const [data2, setData2] = useState(dummyData)
    const [filters1, setFilters1] = useState({})
    const [filters2, setFilters2] = useState({})
    const [comparisonData, setComparisonData] = useState([])
    
    const { isSigned, isFirstSigned, post, get, getAuth } = useAPI()
    const { setLoading, toast } = useUI()
    
    let tabView = useRef()
    let tabView1 = useRef()
    let saveComparisonDialog = useRef()
    let savedComparisonTable = useRef()
    let popularComparisonTable = useRef()
    
    let saveComparisonForm = new Form()

    function showData() {
        post(API_URL + '/compare', {filters1, filters2}, getAuth()).then(response => {
            setData1(response.data.data1)
            setData2(response.data.data2)
            setDataLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    function saveComparison(){
        if (saveComparisonForm.isValid()){
            let data = saveComparisonForm.get(true)
            post(API_URL+'/comparison/create', {filters1, filters2, ...data}, getAuth()).then(response => {
                toast.success('Saved successfully', 'Comparison saved successfully')
            }).catch(err => {
                saveComparisonForm.error(err.response.data)
                toast.error('Saving failed', 'Comparison saving is failed')
            })
        }
    }

    function getComparison() {
        savedComparisonTable.current.removeAll()
        popularComparisonTable.current.removeAll()
        get(API_URL + '/comparison/get', getAuth()).then(response => {
            response.data.forEach(data => {
                if (data.is_popular){
                    popularComparisonTable.current.add(data)
                }else{
                    savedComparisonTable.current.add(data)
                }
            })
        }).catch(err => {
            saveComparisonForm.error(err.response.data)
            toast.error('Saving failed', 'Comparison saving is failed')
        })
    }

    useEffect(() => {
        if (isSigned && !isFirstSigned) {
            setDataLoading(true)
            showData()
            getComparison()
        }
    }, [filters1, filters2, isSigned, isFirstSigned])

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

    let avgWinners1 = round(safeNumber(data1.pnlByStatus[0] / data1.counts[1]), 2)
    let avgLossers1 = round(safeNumber(Math.abs(data1.pnlByStatus[1]) / data1.counts[2]), 2)
    let avgWinners2 = round(safeNumber(data2.pnlByStatus[0] / data2.counts[1]), 2)
    let avgLossers2 = round(safeNumber(Math.abs(data2.pnlByStatus[1]) / data2.counts[2]), 2)

    return (
        <div className='pt-16 -my-4 h-screen'>
            <Dialog className='w-1/2' ref={saveComparisonDialog} title='Comparison'>
                <InputField className='mb-2' ref={saveComparisonForm.ref} label='Name' required/>
                <InputField className='mb-2' ref={saveComparisonForm.ref} name='desc' label='Description' required />
                <div className='flex space-x-2'>
                    <SelectField ref={saveComparisonForm.ref} className='w-full' label='Group 1' values={['View', 'Edit']} defaultValue={0}/>
                    <SelectField ref={saveComparisonForm.ref} className='w-full' label='Group 2' values={['View', 'Edit']} defaultValue={0}/>
                </div>
                <div className='flex space-x-2 justify-end mt-5'>
                    <div className='secondary-btn' onClick={() => saveComparisonDialog.current.hide()}>Cancel</div>
                    <div className='primary-btn' onClick={saveComparison}>Save</div>
                </div>
            </Dialog>
            <div className='pt-5 md:flex md:space-x-2 h-full'>
                <TabBar className='flex flex-wrap md:block md:mb-0 mx-2 md:w-1/4 lg:w-1/5' view={tabView} adapter={iconTabAdapter}>
                    <Tab id='compare' icon={faUser} label='Compare' active/>
                    <Tab id='saved' icon={faSave} label='Saved comparison'/>
                </TabBar>
                <TabView className='md:w-3/4 lg:w-4/5 h-full ' ref={tabView}>
                    <Tab id='compare'>
                        <div className='flex flex-col h-full'>
                            <Card innerClassName='flex space-x-2 items-end !mr-4'>
                                <div className='ml-auto w-4/5 flex'>
                                    <div className='w-1/3'>
                                        <Filter className='w-fit mx-auto' label='Filter 1' onFilterSet={setFilters1}/>
                                    </div>
                                    <div className='w-1/3'>
                                        <Filter className='w-fit mx-auto' label='Filter 2' onFilterSet={setFilters2}/>
                                    </div>
                                    <div className='w-1/3 flex justify-center space-x-2'>
                                        <div className='primary-btn' onClick={() => saveComparisonDialog.current.show()}>Save comparison</div>
                                    </div>
                                </div>
                            </Card>
                            <div className='grow h-0 overflow-y-scroll'>
                                <Card>
                                    <div className='flex'>
                                        <div className='md:ml-auto w-full md:w-4/5 flex'>
                                            <div className='w-1/2 md:w-1/3 py-2 border-l border-b border-t border-secondary-800 text-secondary-500 text-lg text-center font-bold'>Filter 1</div>
                                            <div className='w-1/2 md:w-1/3 py-2 border-l border-r md:border-r-0 border-b border-t border-secondary-800 text-secondary-500 text-lg text-center font-bold'>Filter 2</div>
                                            <div className='hidden md:block w-1/3 py-2 border border-secondary-800 text-secondary-500 text-lg text-center font-bold'>Difference</div>
                                        </div>
                                    </div>
                                    <div className='md:flex items-center'>
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Score</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
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
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Cumulative P&L</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2'>                        
                                                <Line options={areaGraphOptions} data={areaGraphData(...data1.cumulativePnl)} />
                                            </div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2'>
                                                <Line options={areaGraphOptions} data={areaGraphData(...data2.cumulativePnl)} />
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
                                    <div className='md:flex items-center'>
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Winrate</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10'>
                                                <div style={{height:'100px'}}>
                                                    <Doughnut 
                                                        data={doughnutChartData(
                                                            [`${data1.counts[1]} Wins`, `${data1.counts[2]} Losses`],
                                                            [data1.counts[1], data1.counts[2]]
                                                        )}
                                                        options={doughnutChartOptions}
                                                        plugins={[doughnutChartTextPlugin('#22c55e')]} />
                                                </div>
                                            </div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10'>
                                                <div style={{height:'100px'}}>
                                                    <Doughnut
                                                        data={doughnutChartData(
                                                            [`${data2.counts[1]} Wins`, `${data2.counts[2]} Losses`],
                                                            [data2.counts[1], data2.counts[2]]
                                                        )}
                                                        options={doughnutChartOptions}
                                                        plugins={[doughnutChartTextPlugin('#22c55e')]} />
                                                </div>
                                            </div>
                                            <div className='w-full md:w-1/3 border-l border-b border-r border-secondary-800 p-2 md:py-5 md:px-10'>
                                                <div>Filter 1</div>
                                                <div className='flex justify-between items-center'>
                                                    <div>
                                                        <div>Winrate</div>
                                                        <div>Wins</div>
                                                        <div>Loss</div>
                                                    </div>
                                                    <div className='text-indigo-500'>
                                                        <div>6% (46%)</div>
                                                        <div>6% (46%)</div>
                                                        <div>6% (46%)</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='md:flex items-center'>
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Highest profitable trade</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10 text-center', 
                                                data1.highestPnlTrade.netPnl > data2.highestPnlTrade.netPnl ? 'text-green-500': '')}>
                                                    ${data1.highestPnlTrade.netPnl}
                                            </div>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10 text-center', 
                                                data2.highestPnlTrade.netPnl > data1.highestPnlTrade.netPnl ? 'text-green-500': '')}>
                                                    ${data2.highestPnlTrade.netPnl}
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
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Highest lossing trade</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                data1.lowestPnlTrade.netPnl<data2.lowestPnlTrade.netPnl ? 'text-red-500': '')}>
                                                    ${Math.abs(data1.lowestPnlTrade.netPnl)}
                                            </div>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                data2.lowestPnlTrade.netPnl<data1.lowestPnlTrade.netPnl ? 'text-red-500': '')}>
                                                    ${Math.abs(data2.lowestPnlTrade.netPnl)}
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
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Gross P&L</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>N/A</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>N/A</div>
                                            <div className='w-full md:w-1/3 border-l border-b border-r border-secondary-800 p-2 md:py-5 md:px-10'>
                                                <div className='flex justify-between items-center h-full'>
                                                    <div>Filter 1</div> 
                                                    <div className='text-indigo-500'>N/A</div>
                                                    <div className='text-indigo-500'>N/A</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='md:flex items-center'>
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Profit factor</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                 data1.profitFactor>data2.profitFactor?'text-green-500':'')}>
                                                    {data1.profitFactor}
                                            </div>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                data2.profitFactor>data1.profitFactor?'text-green-500':'')}>
                                                    {data2.profitFactor}
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
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Avarage profit</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                avgWinners1>avgWinners2?'text-green-500':'')}>
                                                    {avgWinners1}
                                                </div>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                avgWinners2>avgWinners1?'text-green-500':'')}>
                                                    {avgWinners2}
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
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Avarage loss</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className={classNames(
                                                'w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', 
                                                avgLossers1>avgLossers2?'text-green-500':'')}>{avgLossers1}</div>
                                            <div className={classNames('w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center', avgLossers2>avgLossers1?'text-green-500':'')}>{avgLossers2}</div>
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
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Avarage duration</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>
                                                {data1.holdTimes[0]}
                                            </div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>
                                                {data2.holdTimes[0]}
                                            </div>
                                            <div className='w-full md:w-1/3 border-l border-r border-b border-secondary-800 p-2 md:py-5 md:px-10'>
                                                <div className='flex justify-between items-center h-full'>
                                                    <div>Filter 1</div> 
                                                    <div className='text-indigo-500'>2.1</div>
                                                    <div className='text-indigo-500'>(22%)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <div className='flex flex-wrap'>
                                    <Insightes className='w-full md:w-1/3' items={[
                                        'Profit is maximum at 0.6% stopless and 1.4% target.',
                                        'There will be an increase of 22% in your P&L if optimum level were applied',
                                        'There is 20% increase(67%)  in winrate of trades at optimum level ,compared to winrate of your current level trades (59%)',
                                        'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                                        'There are 4 trades(14% of trades) which do not meet neither stoploss nor target'                    
                                    ]}/>
                                    <Card className='w-full md:w-2/3 h-96'>
                                        <div className='flex flex-col h-full'>
                                            <div className='flex mb-5'>
                                                <TabBar className='flex' view={tabView1} adapter={simpleTabAdapter}>
                                                    <Tab id='cumulative-pl' label='Cumulative P&L' active/>
                                                    <Tab id='dialy-pl' label='Dialy P&L'/>
                                                </TabBar>
                                            </div>
                                            <div className='grow'>
                                                <TabView ref={tabView1} className='lg:!h-full w-full' style={{height: '40vh'}}>
                                                    <Tab id='cumulative-pl'>
                                                        <Line 
                                                            className='mb-3 h-full w-full' 
                                                            data={areaGraphDoubleData(...mergeCumulativeDatas(data1.cumulativePnl, data2.cumulativePnl))} 
                                                            options={areaGraphOptions}/>
                                                    </Tab>
                                                    <Tab id='dialy-pl'>
                                                        <Bar 
                                                            className='mb-3 h-full w-full' 
                                                            data={barGraphDoubleData(...mergeGraphDatas(data1.dialyPnl, data2.dialyPnl))} 
                                                            options={{ ...barGraphOptions, indexAxis: 'x' }} />
                                                    </Tab>
                                                </TabView>
                                            </div>
                                        </div>
                                    </Card>
                                    <BarGraphCard className='w-full md:w-1/3' icon={faCalendar} options={[
                                        ['Performance by day', DAYS, data1.pnlByDays, data2.pnlByDays],
                                        ['Performance by Month', MONTHS, data1.pnlByMonths, data2.pnlByMonths]
                                    ]}/>
                                    <BarGraphCard className='w-full md:w-1/3' icon={faSliders} options={[
                                        ['Performance by setup', ...mergeGraphDatas(data1.pnlBySetup, data2.pnlBySetup)]
                                    ]}/>
                                    <BarGraphCard className='w-full md:w-1/3' icon={faStopwatch} options={[
                                        ['Performance by duration', DURATIONS ,data1.pnlByDuration, data2.pnlByDuration],
                                        ['Performance by hours', ...mergeGraphDatas(data1.pnlByHours, data2.pnlByHours)]
                                    ]}/>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab id='saved'>
                        <Card>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faSave} size='sm'/>
                                <div className='font-bold text-lg'>Saved comparison</div>
                            </div>
                            <Table ref={savedComparisonTable} headers={['Name', '', 'Description', 'Group 1', 'Group 2', '']} adapter={savedCompareTableAdapter}
                                saveComparisonDialog = {saveComparisonDialog}
                                />
                        </Card>
                        <Card>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faStar} size='sm'/>
                                <div className='font-bold text-lg'>Popular comparison</div>
                            </div>
                            <Table ref={popularComparisonTable} headers={['Name', 'Description', 'Group 1', 'Group 2', '']} adapter={popularCompareTableAdapter}
                                saveComparisonDialog = {saveComparisonDialog}
                                />

                        </Card>
                    </Tab>
                </TabView>
            </div>
        </div>
    )
}
