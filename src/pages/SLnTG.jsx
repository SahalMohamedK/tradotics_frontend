import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line, Doughnut  } from 'react-chartjs-2';
import { lineChartData, lineChartOptions, doughnutChartOptions, doughnutChartData, doughnutChartTextPlugin } from '../libs';
import { faDollar, faArrowUp, faCalendar, faZap, faSackDollar, faClipboardCheck, faFilter, faDumbbell, faSackXmark, faCoins } from '@fortawesome/free-solid-svg-icons';
import Icon from '../components/Icon';
import Card from '../components/Card';
import Slider from '../components/Slider';
import Insightes from '../elements/Insightes';
import ValueCard from '../elements/ValueCard';
import ProgressCard from '../elements/ProgressCard';

function SLnTG() {
    let data1 = lineChartData();
    let data2 = doughnutChartData(['42 Wins', '22 Losses'],[300, 50]);

    let [cumulativePLData, setCumulativePLData] = useState(data1);
    let [winrateData, setWinrateData] = useState(data2);
    let [stopless, setStopless] = useState();
    let [target, setTarget] = useState();
    let [risk, setRisk] = useState(0);
    let [riskInputValue, setRiskInputValue] = useState(0);
    let [score, setScore] = useState(5.4);

    let stoplessSlider = useRef()
    let targetSlider = useRef()

    return (
        <div className='mt-16'>
            <div className='font-bold px-2 mt-5 mb-2 text-xl lg:mt-0'>SL And TG</div>
            <div className='lg:flex '>
                <div className='w-full lg:w-3/4'>
                    <div className='md:flex'>
                        <Card className='w-full md:order-2 md:w-3/5 lg:w-2/3'>
                            <div className='h-full flex flex-col'>
                                <div className='flex items-center font-bold mb-2'>
                                    <div className='text-lg'>
                                        Cumulative P&L
                                    </div>
                                    <div className='border-green-500 border text-green-500 px-3 ml-3 text-sm rounded-xl'>
                                        22% <FontAwesomeIcon className='mr-2' icon={faArrowUp}/> P&L
                                    </div>
                                </div>
                                
                                <div className='w-full md:!h-auto grow' style={{height:'30vh'}}>
                                    <Line className='mb-3 h-full w-full' data={cumulativePLData} options={lineChartOptions}/>
                                </div>
                            </div>
                        </Card>
                        <div className='w-full md:order-1 md:w-2/5 lg:w-1/3 flex flex-col'>
                            <Card className=''>
                                <div className='text-lg font-bold flex items-center mb-2'>
                                    <Icon className='primary-material' icon={faClipboardCheck} size='sm' box/>
                                    <div className='font-bold text-lg ml-2'>Optimum levels</div>
                                    <button className='primary-btn ml-auto'>
                                        Apply
                                    </button>
                                </div>
                                <div className='flex text-xs mt-3'>
                                    <div>Stopless: 0.6%</div>
                                    <div className='ml-auto'>Target: 1.4%</div>
                                </div>
                            </Card>
                            <Card className='grow'>
                                <div className='flex items-center mb-2 space-x-2'>
                                    <Icon className='primary-material' icon={faFilter} size='sm' box/>
                                    <div className='font-bold text-lg'>Set your Stopless and Target</div>
                                </div>
                                <div className='text-xs flex my-3 justify-between'>
                                    <div>
                                        <div>Stopless (%)</div>
                                        <input type="number" className='input-field text-xs mt-1' style={{width: 50}}
                                            min={0} max={2} step={0.1} onChange={(e) => stoplessSlider.current.setValue(e.target.value)} value={stopless}
                                        />
                                    </div>
                                    <div className='text-right'>
                                        <div>Target (%)</div>
                                        <input type="number" className='input-field text-xs mt-1' style={{width: 50}}
                                            min={0} max={2} step={0.1} onChange={(e) => targetSlider.current.setValue(e.target.value)} value={target}
                                        />
                                    </div>
                                </div>
                                <div className='flex mb-3'>
                                    <Slider ref={stoplessSlider} className='slider-red w-1/2 dir-rtl' onChange={setStopless} max={2} step={0.1}/>
                                    <Slider ref={targetSlider} className='slider-green w-1/2' onChange={setTarget}  max={2} step={0.1}/>
                                </div>
                                <div className='flex justify-between text-secondary-500' style={{fontSize:10}}>
                                    {['2%', '1.5%', '1%', '0.5%', '0%', '0.5%', '1%', '1.5%', '2%'].map((label, i) => {
                                        return <div key={i}>{label}</div>
                                    })}
                                </div>
                            </Card>
                            <Card className='grow'>
                                <div className='text-lg font-bold flex items-center mb-2'>
                                <Icon className='primary-material' icon={faDumbbell} size='sm' box/>
                                <div className='font-bold text-lg ml-2'>Risk</div>
                                    <button className='primary-btn ml-auto'
                                        onClick={() => setRisk(riskInputValue)}>
                                        Apply
                                    </button>
                                </div>
                                <div className='flex items-center mt-3'>
                                    <FontAwesomeIcon icon={faDollar} />
                                    <input type="number" className="input-field ml-2 mr-4 w-2/5"
                                        onChange={(e) => setRiskInputValue(e.target.value)} defaultValue={risk}/>
                                    <div className='ml-auto text-xs'>Current avg risk: ${risk}</div>
                                </div>
                                <div className='flex items-center mt-3'>
                                <div className='mr-2'> Use same risk for all trades</div>
                                    <input type='checkbox' className='checkbox' />
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className='md:hidden lg:flex'>
                        <ProgressCard className='w-full md:w-1/5' icon={faZap} label='Tradotics scrore' value={8}/>
                        <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
                            label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                        <ValueCard className='w-full md:w-1/5' icon={faSackXmark}
                            label='Highest profitable trade' value={<div className='text-red-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                        <ValueCard className='w-full md:w-1/5' icon={faCoins}
                            label='Gross P&L' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                        <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
                            label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                    </div>
                    <div className='md:hidden lg:flex'>
                        <ProgressCard className='w-full md:w-1/5' icon={faZap}label='Tradotics scrore' value={8}/>
                        <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
                            label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                        <ValueCard className='w-full md:w-1/5' icon={faSackXmark}
                            label='Highest profitable trade' value={<div className='text-red-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                        <ValueCard className='w-full md:w-1/5' icon={faCoins}
                            label='Gross P&L' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                        <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
                            label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                    </div>
                </div>
                <div className='lg:w-1/4 md:flex lg:flex-col'>
                    <div className='md:w-3/5 lg:w-full'>
                        <div className='md:flex lg:block'>
                            <div className='md:w-2/3 lg:w-full'>
                                <Card className='h-full'>
                                    <div className='flex items-center mb-2 space-x-2'>
                                        <Icon className='primary-material' icon={faCalendar} size='sm' box/>
                                        <div className='font-bold text-sm'>Winrate by days</div>
                                    </div>
                                    <div className='h-auto'>
                                        <Doughnut data={winrateData} options={doughnutChartOptions}  plugins={[doughnutChartTextPlugin('50%', '#22c55e')]}/>
                                    </div>
                                </Card>
                            </div>
                            <div className='hidden md:block lg:hidden md:w-1/3 lg:w-full'>
                                <ValueCard icon={faSackDollar} label='Highest profitable trade' 
                                    value={<div className='text-green-500'>$6013.50</div>} 
                                    trade='TATAMOTOR' date='03 Aug 2022'/>
                                <ValueCard icon={faSackDollar} label='Highest profitable trade' 
                                    value={<div className='text-green-500'>$6013.50</div>} 
                                    trade='TATAMOTOR' date='03 Aug 2022'/>
                            </div>
                        </div>
                        <div className='hidden md:block lg:hidden'>
                            <div className='w-full flex'>
                                <ProgressCard className='w-full md:w-1/3' icon={faZap}
                                    label='Tradotics scrore' value={8}/>
                                <ValueCard className='w-1/3' icon={faSackDollar}
                                    label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                                <ValueCard className='w-1/3' icon={faSackDollar}
                                    label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                            </div>
                            <div className='w-full flex'>
                                <ValueCard className='w-1/3' icon={faSackDollar}
                                    label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                                <ValueCard className='w-1/3' icon={faSackDollar}
                                    label='Highest profitable trade' value={<div className='text-green-500'>$6013.50</div>} trade='TATAMOTOR' date='03 Aug 2022'/>
                                <ProgressCard className='w-full md:w-1/3' icon={faZap}
                                    label='Tradotics scrore' value={8}/>
                            </div>
                        </div>
                    </div>
                    <Insightes className='md:w-2/5 lg:w-full lg:grow' items={[
                        'Profit is maximum at 0.6% stopless and 1.4% target.',
                        'There will be an increase of 22% in your P&L if optimum level were applied',
                        'There is 20% increase(67%)  in winrate of trades at optimum level ,compared to winrate of your current level trades (59%)',
                        'Filter 1 has produce 200$ (12%) more profit than filter 2  produce 200$ (12%) more profit than filter 2',
                        'There are 4 trades(14% of trades) which do not meet neither stoploss nor target'                    
                    ]}/>
                </div>
            </div>
        </div>
    )
}

export default SLnTG
