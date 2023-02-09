import React, { Fragment } from 'react'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { Bar} from 'react-chartjs-2'
import { Listbox, Transition } from '@headlessui/react'
import { barGraphData, barGraphDoubleData, barGraphOptions } from '../libs'
import { faAngleDown, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { classNames } from '../utils'

export default function BarGraphCard({className,icon, options = []}) {
    const [curOption, setCurOption] = useState(0)
    
    return (
        <Card className={className}>
            <div className='flex items-center space-x-2'>
                <Icon className='primary-material' icon={icon} size='sm' box/>
                <Listbox className='relative' as='div' value={curOption} onChange={(value)=>setCurOption(value)}>
                    <Listbox.Button className="flex items-center cursor-pointer">
                        {({open}) => <>
                            <div className='font-bold text-lg'>{options[curOption][0]}</div>
                            <Icon className={classNames('duration-200 mt-1',open?'rotate-180':'')} icon={faAngleDown} size='sm'/>
                        </>}
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute w-full max-h-60 left-0 overflow-auto rounded-md bg-secondary-800 py-1 text-base focus:outline-none">
                            {options.map((v, i) => (
                                <Listbox.Option key={i} className={({ active }) => classNames('relative cursor-pointer px-2 py-1 text-sm', active ? 'text-white bg-indigo-900' : 'text-secondary-500')}
                                    value={i}>
                                    {({ selected }) => (<div className='flex items-center'>
                                        <Icon className={selected?'visible':'invisible'} icon={faCheck} size='sm'/>
                                        <span className={classNames('block truncate', selected ? 'font-medium' : 'font-normal')}>{v[0]}</span>
                                    </div>)}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>
            <div className='h-64'>
                {options[curOption].length == 3 &&
                    <Bar options={barGraphOptions} data={barGraphData(options[curOption][1], options[curOption][2])} />
                }
                {options[curOption].length == 4 && 
                    <Bar options={barGraphOptions} data={barGraphDoubleData(options[curOption][1], options[curOption][2], options[curOption][3])} />
                }
            </div>
        </Card>
    )
}
