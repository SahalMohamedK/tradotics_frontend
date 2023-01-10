import React from 'react'
import { useRef } from 'react'
import { simpleTabAdapter } from '../adapters/tabs'
import Card from '../components/Card'
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { Tab, TabBar, TabView } from '../components/Tab'
import IconBtn from '../components/IconBtn';
import { faEdit, faTrash, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';

export default function ChartView() {
    let tabView = useRef()
    let data = [1,2,3,4,5]

    return (
        <div className='mt-16'>
            <TabBar className='flex mb-2 mx-2' view={tabView} adapter={simpleTabAdapter}>
                <Tab id='all' label='View all' active/>
                <Tab id='day' label='Day wise' />
            </TabBar>
            <TabView ref={tabView} className='w-full'>
                <Tab id='all'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                        {data.map((d, i) => 
                            <Card className='h-80' innerClassName='flex space-x-4'>
                                <TradingViewWidget className='w-full' symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                                <div>
                                    <IconBtn icon={faUpRightAndDownLeftFromCenter}/>
                                    <IconBtn className='my-4' icon={faEdit}/>
                                    <IconBtn icon={faTrash}/>
                                </div>
                            </Card>
                        )}
                    </div>
                </Tab>
                <Tab id='day'>
                    <Card innerClassName='flex space-x-2'>
                        <div className='w-[10%] h-60 flex flex-col'>
                            <div className='font-bold text-lg'>22 Oct 2022</div>
                            <div className='font-bold'>Tuesday</div>
                            <div className='mt-auto'>3 Trades</div>
                            <div>PnL: $2005</div>
                            <div>55% winrate</div>
                        </div>
                        <div className='w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                            <div className='m-4 h-60 flex space-x-4'>
                                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                                <div>
                                    <IconBtn icon={faUpRightAndDownLeftFromCenter}/>
                                    <IconBtn className='my-5' icon={faEdit}/>
                                    <IconBtn icon={faTrash}/>
                                </div>
                            </div>
                            <div className='m-4 h-60 flex space-x-4'>
                                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                                <div>
                                    <IconBtn icon={faUpRightAndDownLeftFromCenter}/>
                                    <IconBtn className='my-5' icon={faEdit}/>
                                    <IconBtn icon={faTrash}/>
                                </div>
                            </div>
                            <div className='m-4 h-60 flex space-x-4'>
                                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                                <div>
                                    <IconBtn icon={faUpRightAndDownLeftFromCenter}/>
                                    <IconBtn className='my-5' icon={faEdit}/>
                                    <IconBtn icon={faTrash}/>
                                </div>
                            </div>
                        </div>
                    </Card>            
                </Tab>
            </TabView>
        </div>
    )
}
