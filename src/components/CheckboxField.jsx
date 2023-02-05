import { faAngleDown, faCheck, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Popover, Transition } from '@headlessui/react';
import React, { Component, Fragment } from 'react'
import Field from '../core/components/Field';
import { addItem, classNames, hasValue, removeItem } from '../utils';
import Icon from './Icon';
import IconBtn from './IconBtn';

export class CheckboxField extends Field {
    init(){
        super.init()
        this.defaultValue = []

    }

    add(value) {
        this.setState(prevState => ({ value: addItem(prevState.value, value) }), () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.value);
            }
        })
    }

    remove(value) {
        this.setState(prevState => ({ value: removeItem(prevState.value, value) }), () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.value);
            }
        })
    }

    field() {
        return (
            <Popover
                className='text-sm rounded border-0 focus:ring-0 grow min-w-0'
                onFocus={() => this.setState({ focused: true })}
                onBlur={() => this.setState({ focused: false })} >
                <div className="w-full">
                    <div className='flex items-center px-1'>
                        <Popover.Button className="flex items-center justify-between bg-inherit w-full cursor-pointer px-1 text-left focus:outline-none">
                            {({ open }) => <>
                                <div className='flex w-full overflow-x-auto'>
                                    {this.state.value.map((v, i) =>
                                        <div key={i} className='bg-secondary-700 px-2 py-0.5 text-sm rounded mr-1 flex items-center'>
                                            {this.props.values[v]}
                                            <div className='ml-1'>
                                                <IconBtn icon={faXmarkCircle} size='sm' onClick={(e) => {
                                                    this.removeValue(v)
                                                    e.stopPropagation()
                                                }} />
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <Icon className={classNames('duration-200', open ? 'rotate-180' : '')} icon={faAngleDown} size='sm' />
                            </>}
                        </Popover.Button>
                    </div>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Popover.Panel className="secondary-material absolute mt-3 min-w-full max-h-40 left-0 overflow-auto rounded-md bg-secondary-800 material px-2 py-1 text-base focus:outline-none z-50">
                            {this.props.values.map((value, i) => {
                                let selected = this.state.value.includes(i)
                                return <div key={i} className={classNames('cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap hover:text-white hover:bg-indigo-500',
                                    selected ? 'text-white bg-indigo-500' : 'text-secondary-500')}
                                    onClick={() => selected ? this.remove(i) : this.add(i)}>
                                    <div className='flex items-center'>
                                        <Icon className={selected ? 'visible' : 'invisible'} icon={faCheck} size='sm' />
                                        <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{value}</span>
                                    </div>
                                </div>
                            })}

                            {this.state.value.length === 0 &&
                                <div className='m-2 text-center text-sm text-secondary-500'>No options</div>
                            }
                        </Popover.Panel>
                    </Transition>
                </div>
            </Popover>
        )
    }
}

export default CheckboxField