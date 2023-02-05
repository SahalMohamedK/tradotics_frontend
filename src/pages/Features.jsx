import React, { useEffect } from 'react'
import {  faChartBar, faChartPie, faColumns, faCommentDollar, faFileInvoiceDollar, faFilter, faGear, faLineChart, faNoteSticky, faTag, faWrench} from '@fortawesome/free-solid-svg-icons'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { useState } from 'react'
import featuresHeroImg from '../media/features_hero.png'
import { useUI } from '../contexts/UIContext'
import FeaturesTabs from '../elements/FeaturesTabs'
import Footer from '../elements/Footer'
import Header from '../elements/Header'
import { Link } from 'react-router-dom'

const boxes6Data = [
    ['Easy to journal', faTag, 'Journal your trades by importing trade history from your trading platform.'],
    ['Structured trade Analysis', faTag, "Using statistics helps to clearly show the progress of your trades"],
    ['Optimized Stoploss and Target', faTag, "Improve your future trades with our algorithm's suggested stoploss and target for maximum profits."],
    ['Risk management', faTag, "By understanding the right strategies for limiting your losses, you will be able to decide how much money you should be willing to risk on each trade."],
    ['Mentorship', faTag, "Allows mentors to track the progress of their students, helping them to provide more targeted guidance and support."],
    ['Discover the trends in your trades', faTag, "By using our trading journal, you can uncover the trends in your trades, and use this information to see what is and isn't effective for you."],
]

const boxes12Data = [
    ['Price charts for each trades', faFileInvoiceDollar, "When you add trades in your journal, you are given charts for review with your buy and sell points marked on charts."],
    ['Add notes', faNoteSticky, "Make notes about your trade, or your trading day as a whole. The notes tab makes it convenient for you to review your notes."],
    ['Tagging', faTag, "Tag your trades with any tags you want, You can filter your trades by these tags and review those trades."],
    ['Filtering', faFilter, "Use the filtering to narrow down the trades you want to look at. You can filter your trades by symbol, side, setups, and many others."],
    ['Running PnL', faTag, "View your trade's profits and losses over time. Also, for intraday trades, view your running combined P&L for the entire trading day."],
    ['Charges and commissions',faCommentDollar, "Manually track commissions and fees by setting per-share or per-order charges. Automatic tracking is also available for specific brokers/platforms."],
    ['Reports', faChartPie, "View Overvall reports that are simple to understand, such as P&L, Winrate, volume, and many more. You can drill down into your performance using detailed reports."],
    ['Compare trades', faColumns, "Compare any two sets of trades you want, such as winning days vs losing days, morning vs afternoon (using hour), this month vs last month, Pivot vs breakouts (using setups), and so on."],
    ['Setup analysis', faWrench, "Explore your setups further to assess which is the most profitable setup. Also, determine how it performs under different conditions, such as which days the setup is most rewarding, what duration is best suited for the setup, and so on."],
    ['Mistake analysis', faLineChart, "Explore your mistakes further to determine which is the most costly. Determine how it worsens under different conditions, such as which days the mistake occurs most frequently, and what hour of the day the mistake occurs most frequently."],
    ['Risk Analysis', faChartBar, "Analyze your trades in terms of risk, and determine how much you profit for every dollar you risk. Insights tells you what risk level you perform best in."],
    ['Risk management', faGear, "Manage your risk by setting rules such as maximum loss per trade, maximum number of trades per day, no trades after 12 p.m., and many others."],]

export default function Features() {
    const [scroll, setScroll] = useState(false)
    const { setLoading } = useUI()

    useEffect(() => {
        setLoading(false)
    })

    return (
        <div className='relative'>
            <div className='mt-16 md:mt-0 md:h-screen overflow-y-auto mb-16 md:mb-0' onScroll={(e) => setScroll(e.target.scrollTop > 50)}>
                <Header />
                <section className='mx-10 lg:mx-28 md:mt-8 h-screen flex flex-col md:flex-row items-center'>
                    <div className='mt-auto mb-10 md:mb-0 md:mt-0 md:w-2/3 md:order-2 md:ml-10'>
                        <img src={featuresHeroImg} alt="Feature hero image" />
                    </div>
                    <div className='mb-auto md:mb-0 md:w-1/3 md:order-1 md:mr-10'>
                        <div className='text-5xl font-bold'>TAKE IT TO THE NEXT LEVEL</div>
                        <div className='text-indigo-500 font-bold my-5'>JOURNAL . ANALYSE . IMPROVE</div>
                        <Link to='/early-access' className='primary-btn !text-lg font-bold'>Apply for early access</Link>
                    </div>
                </section>                
                <section className='mx-10 lg:mx-28'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold'>How we help you?</div>
                    </div>
                    <div className='md:flex flex-wrap mt-5'>
                        {boxes6Data.map(([title, icon, desc], i) => 
                            <Card key={i} className='md:w-1/3'>
                                <div className='flex items-center mb-2 space-x-2'>
                                    <Icon className='primary-material !w-8 !h-8' icon={icon} box/>
                                    <div className='font-bold text-lg'>{title}</div>
                                </div>
                                <div>{desc}</div>
                            </Card>
                        )}
                    </div>
                </section>
                <section className='mx-10 lg:mx-28 mt-32 md:h-[75vh]'>
                    <FeaturesTabs/>
                </section>
                          
                <section className='mx-10 lg:mx-28  mt-16 lg:mt-32'>
                    <div className='md:flex flex-wrap mt-5'>
                        {boxes12Data.map(([title, icon, desc], i) => 
                            <Card key={i} className='md:w-1/3'>
                                <div className='flex items-center mb-2 space-x-2'>
                                    <Icon className='primary-material !w-8 !h-8' icon={icon} box/>
                                    <div className='font-bold text-lg'>{title}</div>
                                </div>
                                <div>{desc}</div>
                            </Card>
                        )}
                    </div>
                </section>
                <section className='mt-40  text-center'>
                    <div className='w-1/2 mx-auto'>
                        <div className='text-2xl font-bold'>Are you a mentor or a member of a teaching institute?</div>
                        <div className='mt-5 text-secondary-500'>Then join Tradotics for institute, where our mentoring feature allows mentors to track and guide their students' progress.</div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    )
}
