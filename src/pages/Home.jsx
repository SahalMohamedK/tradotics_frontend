import React, { useEffect, useRef } from 'react'
import dashboardImg from '../media/dashboard_2.png'
import compareImg from '../media/compare.png'
import { faCheckSquare, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Icon from '../components/Icon'
import Carousel from '../elements/Carousel'
import { useState } from 'react'
import Collapse from '../components/Collapse'
import { useUI } from '../contexts/UIContext'
import FeaturesTabs from '../elements/FeaturesTabs'
import Header from '../elements/Header'
import Footer from '../elements/Footer'

export default function Home() {
    const { setIsLoading } = useUI();
    let pricingSection = useRef()

    useEffect(() => {        
        setIsLoading(false)
    }, [])

    return (
        <div className='relative'>
            <div className='h-screen overflow-y-auto mb-16 md:mb-0'>
                <Header/>
                <section className='mt-16 md:mt-8 h-[65vh] md:h-[80vh] relative'>
                    <div className='center px-5 w-full text-center font-bold'>
                        <div className='text-4xl lg:text-6xl'>The Best and Most Affordable <br/> All in one Journaling tool</div>
                        <div className='my-4 text-indigo-500'>Find your edge and optimize your trades</div>
                        <Link to='/early-access' className='primary-btn shadow-xl shadow-primary-300/25 mx-auto w-fit !text-lg'>Apply for early access</Link>
                    </div>
                </section>
                <section >
                    <Carousel className='mx-7 lg:mx-28 h-auto lg:h-[500px] rounded-lg overflow-y-scroll shadow-xl shadow-indigo-900/25 border border-secondary-900'
                        imgs={[dashboardImg, compareImg]}/>
                </section>
                <section className='mx-10 lg:mx-28 mt-16 lg:mt-32 md:h-[75vh]'>
                    <FeaturesTabs/>
                </section>
                <section ref={pricingSection} className='mx-10 lg:mx-0 pt-16 lg:pt-32' id='pricing'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold'>Pricing Plans</div>
                        <div>We assure you, we are the best deal at the best price</div>
                    </div>
                    <div className='md:flex justify-center mt-10 md:space-x-5'>
                        <Card className='md:w-1/2 lg:w-1/4 text-center'>
                            <div className='flex flex-col h-full'>
                                <div className='circle !h-20 !w-20 mx-auto bg-primary-900/75 my-5'>
                                    <div className='text-xl font-bold center'>Free</div>
                                </div>
                                <div className='flex space-x-1 justify-center font-bold'>
                                    <div className='text-2xl'>0</div>
                                    <div className='text-sm'>&#8377;</div>
                                </div>
                                <div className='text-xs mt-5 mx-10'>Try out all the basic feature to improve your trading</div>
                                <div className='my-5 mx-5 text-left'>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-indigo-500' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Import 100 executions per month</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-indigo-500' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Stocks, crypto, forex, commodity, futures options</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-indigo-500' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Trade analysis</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-indigo-500' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Basic AI suggestions and analytics</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-indigo-500' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Running PnL for trades and day</div>
                                    </div>
                                </div>
                                <Link className='mt-auto primary-btn' to='/early-access'>Select this plan</Link>
                            </div>
                        </Card>
                        <Card className='md:w-1/2 lg:w-1/4 text-center mt-10 md:mt-0' innerClassName='primary-material'>
                            <div className='flex flex-col h-full'>
                                <div className='circle !h-20 !w-20 mx-auto bg-primary-900/75 my-5'>
                                    <div className='text-xl font-bold center'>Pro</div>
                                </div>
                                <div className='flex justify-center space-x-10'>
                                    <div>
                                        <div className='text-xs mb-2'>Monthly</div>
                                        <div className='flex space-x-1 justify-center font-bold text-red-600'>
                                            <s className='text-2xl'>18.8</s>
                                            <div className='text-sm'>&#8377;/month</div>
                                        </div>
                                        <div className='flex space-x-1 justify-center font-bold'>
                                            <div className='text-2xl'>1.88</div>
                                            <div className='text-sm'>&#8377;/month</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-xs mb-2'>Yearly</div>
                                        <div className='flex space-x-1 justify-center font-bold text-red-600'>
                                            <s className='text-2xl'>225</s>
                                            <div className='text-sm'>&#8377;/month</div>
                                        </div>
                                        <div className='flex space-x-1 justify-center font-bold'>
                                            <div className='text-2xl'>19.5</div>
                                            <div className='text-sm'>&#8377;/month</div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className='text-xs mt-5 mx-10'>Get access to all our features</div>
                                <div className='my-5 mx-5 text-left'>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-secondary-900' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Import unlimited executions</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-secondary-900' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Stocks, crypto, forex, commodity, futures options</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-secondary-900' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Trade analysis</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-secondary-900' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Running PnL for trades and day</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-secondary-900' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Advanced AI insights and analytics</div>
                                    </div>
                                    <div className='flex space-x-1 my-1'>
                                        <Icon className='text-secondary-900' icon={faCheckSquare}/>
                                        <div className='mt-0.5 text-sm'>Stop loss and Target optimizer</div>
                                    </div>
                                </div>
                                <Link className='mt-auto secondary-btn'to='/early-access'>Select this plan</Link>
                            </div>
                        </Card>
                    </div>
                </section>
                {/* <section className='mt-16 lg:mt-32 mx-10 lg:mx-28 '>
                    <div className='text-center text-2xl font-bold'>User review</div>
                    <div className='lg:flex mt-10'>
                        <div className='lg:w-1/3'>
                            <Card innerClassName='!p-5'>
                                <div className='flex items-center mb-3'>
                                    <div className='circle border border-secondary-800 !h-14 !w-14 bg-secondary-900 mr-3'></div>
                                    <div>
                                        <div className='font-bold'>Sahal Mohamed</div>
                                        <div className='text-sm text-secondary-500'>CEO of Ink Signature</div>
                                    </div>
                                    <IconBtn className='ml-auto text-secondary-500' icon={faFacebook} />
                                </div>
                                <div className='text-secondary-400'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </div>
                            </Card>
                        </div>
                        <div className='lg:w-1/3'>
                            <Card innerClassName='!p-5'>
                                <div className='flex items-center mb-3'>
                                    <div className='circle border border-secondary-800 !h-14 !w-14 bg-secondary-900 mr-3'></div>
                                    <div>
                                        <div className='font-bold'>Sahal Mohamed</div>
                                        <div className='text-sm text-secondary-500'>CEO of Ink Signature</div>
                                    </div>
                                    <IconBtn className='ml-auto text-secondary-500' icon={faFacebook} />
                                </div>
                                <div className='text-secondary-400'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </div>
                            </Card>
                            <Card innerClassName='!p-5'>
                                <div className='flex items-center mb-3'>
                                    <div className='circle border border-secondary-800 !h-14 !w-14 bg-secondary-900 mr-3'></div>
                                    <div>
                                        <div className='font-bold'>Sahal Mohamed</div>
                                        <div className='text-sm text-secondary-500'>CEO of Ink Signature</div>
                                    </div>
                                    <IconBtn className='ml-auto text-secondary-500' icon={faFacebook} />
                                </div>
                                <div className='text-secondary-400'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </div>
                            </Card>
                        </div>
                        <div className='lg:w-1/3'>
                            <Card innerClassName='!p-5'>
                                <div className='flex items-center mb-3'>
                                    <div className='circle border border-secondary-800 !h-14 !w-14 bg-secondary-900 mr-3'></div>
                                    <div>
                                        <div className='font-bold'>Sahal Mohamed</div>
                                        <div className='text-sm text-secondary-500'>CEO of Ink Signature</div>
                                    </div>
                                    <IconBtn className='ml-auto text-secondary-500' icon={faTwitter} />
                                </div>
                                <div className='text-secondary-400'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </div>
                            </Card>
                        </div>
                    </div>
                </section> */}
                <section className='mx-10 lg:mx-0 mt-16 lg:mt-32'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold'>FAQs</div>
                        <div>Frequently Asked Questions</div>
                    </div>
                    <Collapse className='md:mx-auto bg-secondary-900 mt-10 md:text-lg !py-3 !px-3 !w-full md:!w-2/3 lg:!w-1/2 ' label='What is a trading journal?'>
                        <Card className='w-full md:w-2/3 lg:w-1/2 mx-auto'>
                            A trading journal is a record of a trader's trades, including details such as the trade setup, entry and exit points, and the reasoning behind the trade. Trading journals can be used to track performance, identify strengths and weaknesses, and improve overall trading strategy.
                        </Card>
                    </Collapse>
                    <Collapse className='md:mx-auto bg-secondary-900 mt-2 md:text-lg !py-3 !px-3 !w-full md:!w-2/3 lg:!w-1/2 ' label='What Brokers/Countries do you support?'>
                        <Card className='w-full md:w-2/3 lg:w-1/2 mx-auto'>
                            We are constantly bringing new brokers from around the world into our platform. If your broker is missing. To add your broker, <Link to='/early-access' className='hover:text-indigo-500 duration-200 inline-flex items-center'>click here. <Icon icon={faUpRightFromSquare} size='sm'/></Link>
                        </Card>
                    </Collapse>
                    <Collapse className='md:mx-auto bg-secondary-900 mt-2 md:text-lg !py-3 !px-3 !w-full md:!w-2/3 lg:!w-1/2 ' label='What assets and brokers do you support?'>
                        <Card className='w-full md:w-2/3 lg:w-1/2 mx-auto'>
                            <ul className='ml-5 list-disc'>
                                <li>Stock & Stock options</li>
                                <li>Future & Future options</li>
                                <li>Index options</li>
                                <li>Commodity</li>
                                <li>Cryptocurrency</li>
                                <li>Forex</li>
                            </ul>
                        </Card>
                    </Collapse>
                    <Collapse className='md:mx-auto bg-secondary-900 mt-2 md:text-lg !py-3 !px-3 !w-full md:!w-2/3 lg:!w-1/2 ' label='How can I improve my trading performance by using your stoploss and target optimizer?'>
                        <Card className='w-full md:w-2/3 lg:w-1/2 mx-auto'>
                            One way to improve your trading performance using our Tradotics Trading Journal is by utilizing our prime feature, the Stoploss and Target Optimizer. This feature will suggest the best risk/reward ratios to take in future trades in order to achieve maximum profit.
                        </Card>
                    </Collapse>
                </section>
                <section className='mt-20  text-center'>
                    {/* <div className='w-1/2 mx-auto'>
                        <div className='text-2xl font-bold'>Still needs help?</div>
                        <div className='mt-5'>Click on the chat button at the bottom right corner of this page. Are you interested in seeing how a sample of the dashboard  looks like? Here is a public dashboard which contains just few of the 100+ elements you will have access to when you register!</div>
                        <div className='my-5'>You can also email our support team at support com for any help!</div>
                        <div className='primary-btn mx-auto w-fit font-bold !text-lg'>Contact us</div>
                    </div> */}
                    <Link to='/early-access' className='primary-btn shadow-xl shadow-primary-300/25 mx-auto w-fit !text-lg'>Apply for early access</Link>
                </section>
                <Footer />
            </div>
        </div>
    )
}
