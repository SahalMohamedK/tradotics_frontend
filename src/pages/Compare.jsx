import React, { useRef, useState } from 'react'
import { DAYS, MONTHS } from '../libs/consts'
import { Doughnut, Line } from 'react-chartjs-2'
import { iconTabAdapter, simpleTabAdapter } from '../adapters/tabs'
import { Tab, TabBar, TabView } from '../components/Tab'
import { popularCompareTableAdapter, savedCompareTableAdapter } from '../adapters/table'
import { faCalendar, faCirclePlus, faFilter, faLock, faSave, faSliders, faStar, faStopwatch, faUser, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { areaGraphData, areaGraphOptions, doughnutChartData, doughnutChartOptions, doughnutChartTextPlugin } from '../libs'
import Card from '../components/Card'
import Icon from '../components/Icon'
import Table from '../components/Table'
import Dialog from '../components/Dialog'
import TagsField from '../components/TagsField'
import Insightes from '../elements/Insightes'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import ProgressBar from '../components/ProgressBar'
import BarGraphCard from '../elements/BarGraphCard'
import { Filter } from '../elements/Filter'
import { useEffect } from 'react'
import { useUI } from '../contexts/UIContext'


export default function Compare() {
    let data2 = doughnutChartData(['Wins', 'Losses'],[300, 60])

    const { setIsLoading } = useUI()
    
    const [winrateData, setWinrateData] = useState(data2)
    const [cumulativePLData, setCumulativePLData] = useState(areaGraphData(['09:24', '', '', '', '10:07'], [0,-300,300,600,400]))
    const [dialyPLData, setDialyPLData] = useState(areaGraphData(['09:24', '', '', '', '10:07'], [0,100,400,100,300]))

    let tabView = useRef()
    let tabView1 = useRef()
    let editDialog = useRef()

    useEffect(() => {
        setIsLoading(false);
    },[])

    return (
        <div className='pt-16 -my-4 h-screen'>
            <Dialog className='w-1/2' ref={editDialog} title='Comparison'>
                <InputField  label='Name'/>
                <InputField  label='Description'/>
                <div className='flex space-x-2'>
                    <SelectField className='w-full' label='Group 1' values={['View', 'Edit']}/>
                    <SelectField className='w-full' label='Group 2' values={['View', 'Edit']}/>
                </div>
                <div className='flex space-x-2 justify-end mt-2'>
                    <div className='secondary-btn'>Discard</div>
                    <div className='primary-btn'>Save</div>
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
                                        <Filter className='w-fit mx-auto' label='Filter 1'/>
                                    </div>
                                    <div className='w-1/3'>
                                        <Filter className='w-fit mx-auto' label='Filter 2'/>
                                    </div>
                                    <div className='w-1/3 flex justify-center space-x-2'>
                                        <div className='secondary-btn item'>Reset</div>
                                        <div className='primary-btn'>Save</div>
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
                                    <div className='md:flex items-center'>
                                        <div className='w-full md:w-1/5 pt-3 md:p-0'>
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Winrate</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10'>
                                                <div style={{height:'100px'}}>
                                                    <Doughnut data={winrateData} options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('50%', '#22c55e')]}/>
                                                </div>
                                            </div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10'>
                                                
                                                <div style={{height:'100px'}}>
                                                    <Doughnut data={winrateData} options={doughnutChartOptions} plugins={[doughnutChartTextPlugin('50%', '#22c55e')]}/>
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
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10 text-center text-green-500'>$5590</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 p-2 md:py-5 md:px-10 text-center'>$5590</div>
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
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>$5590</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center text-green-500'>$5590</div>
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
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>$5590</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center text-green-500'>$5590</div>
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
                                            <div className='text-secondary-500 text-lg font-bold h-full'>Profit factor</div>
                                        </div>
                                        <div className='w-full md:w-4/5 flex flex-wrap'>
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center text-green-500'>2.55</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>2.55</div>
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
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>$5590</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center text-green-500'>$5590</div>
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
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>$5590</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center text-green-500'>$5590</div>
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
                                            <div className='w-1/2 md:w-1/3 border border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center text-green-500'>00:24:23</div>
                                            <div className='w-1/2 md:w-1/3 border md:border-r-0 md:border-t-0 border-secondary-800 py-5 px-10 text-center'>00:24:23</div>
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
                                                        <Line className='mb-3 h-full w-full' data={cumulativePLData} options={areaGraphOptions}/>
                                                    </Tab>
                                                    <Tab id='dialy-pl'>
                                                        <Line className='mb-3 h-full w-full' data={dialyPLData} options={areaGraphOptions}/>
                                                    </Tab>
                                                </TabView>
                                            </div>
                                        </div>
                                    </Card>
                                    <BarGraphCard className='w-full md:w-1/3' icon={faCalendar} options={[
                                        ['Performance by day', DAYS, [-150, 300,200,-500,330,100,460]],
                                        ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
                                    ]}/>
                                    <BarGraphCard className='w-full md:w-1/3' icon={faSliders} options={[
                                        ['Performance by setup', DAYS, [-150, 300,200,-500,330,100,460]],
                                        ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
                                    ]}/>
                                    <BarGraphCard className='w-full md:w-1/3' icon={faStopwatch} options={[
                                        ['Performance by duration', DAYS, [-150, 300,200,-500,330,100,460]],
                                        ['Performance by Month', MONTHS, [-100,-135, 300, 450,150, -150, -100,-135, 300, 450,150, -150]]
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
                            <Table headers={['Name', '', 'Description', 'Group 1', 'Group 2', '']} adapter={savedCompareTableAdapter}
                                data={[
                                    ['Win vs Loss', 'Comparisson of win and losses trades'],
                                    ['Gap up vs morning', 'Comparison of trades in the setup of gap up str'],
                                ]}
                                editDialog = {editDialog}
                                />
                        </Card>
                        <Card>
                            <div className='flex items-center mb-2 space-x-2'>
                                <Icon className='primary-material' icon={faStar} size='sm'/>
                                <div className='font-bold text-lg'>Popular comparison</div>
                            </div>
                            <Table headers={['Name', 'Description', 'Group 1', 'Group 2', '']} adapter={popularCompareTableAdapter}
                                data={[
                                    ['Win vs Loss', 'Comparisson of win and losses trades'],
                                    ['Gap up vs morning', 'Comparison of trades in the setup of gap up str'],
                                ]}
                                editDialog = {editDialog}
                                />

                        </Card>
                    </Tab>
                </TabView>
            </div>
        </div>
    )
}
