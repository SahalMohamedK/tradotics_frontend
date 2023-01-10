import {  faTableColumns, faClipboard, faChartSimple, faTableCellsLarge, faGear, faPlus, faAngleUp, faScaleBalanced, faCrosshairs, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import React, {  useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { classNames } from '../utils'
import Icon from '../components/Icon'
import { Disclosure, Transition } from '@headlessui/react'

export default function Sidebar() {
    const [collapsed, setCollaps] = useState(false)

    const location = useLocation();

    let items = [
        ['/dashboard','Dashboard', faTableCellsLarge], 
        ['/detailed-report','Detailed Report', faClipboard],
        [[
            ['/day-views', 'Day Views'],
            ['/chart-views', 'Chart Views'],
            ['/calendar-views', 'Calender Views'],
            ['/trades', 'Trades'],
        ],'Views', faChartSimple],
        ['/compare','Compare', faTableColumns], 
        ['/stopless-and-target','Stoploss & Target', faCrosshairs], 
        ['/rules','Rules', faScaleBalanced],
        ['/settings', 'Settings', faGear],
        ['/add-trades', 'Add Trades', faPlus]
    ]

    let row = [
            ['/dashboard', faTableCellsLarge], 
            ['/detailed-journal', faClipboard],
            ['/journal', faChartSimple],
            ['/compare', faTableColumns],
        ]

    return (
    <div className='group border-t border-white/10 md:border-r bg-primary-900/30 backdrop-blur-lg w-full md:h-full  md:max-w-[57px] md:hover:max-w-[200px] duration-100 fixed bottom-0 md:bottom-auto z-40'>
        <div className='md:m-2'>
            <div className={classNames(collapsed?'grid grid-cols-2 mx-3 my-2':'hidden mt-24 md:block')}>
                {items.map(([path, label, icon], i) => {
                        if(typeof(path) === 'object'){
                            return <Disclosure as='div' className='overflow-hidden'>
                                    {({open}) => (<>
                                        <Disclosure.Button className='text-secondary-500 duration-200 flex items-center my-2 md:my-0 px-2 py-2 rounded-lg overflow-hidden whitespace-nowrap cursor-pointer w-full'>
                                            <Icon icon={icon}/>
                                            <div className='ml-1 font-bold text-sm md:ml-5 group-hover:ml-1 duration-100'>{label}</div>                                            
                                            <Icon className={classNames('duration-200 ml-auto',open?'rotate-180':'')} icon={faAngleDown} size='sm'/>
                                        </Disclosure.Button>
                                        <Transition enter="transition duration-100 ease-out"
                                            enterFrom="transform scale-95 opacity-0"
                                            enterTo="transform scale-100 opacity-100"
                                            leave="transition duration-75 ease-out"
                                            leaveFrom="transform scale-100 opacity-100"
                                            leaveTo="transform scale-95 opacity-0">
                                            <Disclosure.Panel>
                                                {path.map(([p, l], j) => 
                                                    <Link to={p} key={j} className={classNames('hidden group-hover:flex items-center duration-200 ml-4 px-2 rounded-lg overflow-hidden whitespace-nowrap cursor-pointer',
                                                        location.pathname === path?'active-primary-material':'text-white md:text-secondary-500 hover:text-white')}
                                                        onClick={() => setCollaps(false)}>
                                                            <div className='h-6 w-2 border-l border-secondary-500'>
                                                                <div className='h-3 border-b border-secondary-500'></div>
                                                            </div>
                                                        <div className='ml-1 font-bold text-xs duration-100'>{l}</div>
                                                    </Link>
                                                )}
                                            </Disclosure.Panel>
                                        </Transition>
                                    </>)}
                                </Disclosure>                            
                        }
                        return <Link to={path} key={i} className={classNames('duration-200 flex items-center my-2 md:my-3 px-2 py-2 rounded-lg overflow-hidden whitespace-nowrap cursor-pointer',
                        location.pathname === path?'active-primary-material':'text-white md:text-secondary-500 hover:text-white')}
                        onClick={() => setCollaps(false)}>
                        <Icon icon={icon}/>
                        <div className='ml-1 font-bold text-sm md:ml-5 group-hover:ml-1 duration-100'>{label}</div>
                    </Link>
                    }
                )}
            </div>
            <div className={classNames('md:hidden p-3', collapsed?'border-t border-white/10':'')}>
                <div className='flex justify-between'>
                    {row.map(([path, icon, onClick], i) => 
                        <Link to={path} key={i} onClick={onClick} className={classNames('h-10 w-10 relative rounded-lg duration-500 cursor-pointer',
                            location.pathname === path?'active-primary-material':'text-white')}>
                            <Icon className='center' icon={icon}/>
                        </Link>
                    )}
                    <div className={classNames('h-10 w-10 relative rounded-lg duration-200 cursor-pointer text-white', 
                        collapsed?'rotate-180':'rotate-0')}
                        onClick={() => setCollaps(!collapsed)}>
                        <Icon className='center' icon={faAngleUp}/> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
