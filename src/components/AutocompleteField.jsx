import { faAdd, faAngleDown, faCheck, faExclamationTriangle, faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Combobox, Transition } from '@headlessui/react';
import React, { Component, Fragment } from 'react'
import Field from '../core/components/Field';
import { classNames, hasValue, isEmpty, objectMap } from '../utils';
import Icon from './Icon';

export class AutocompleteField extends Field {
    init(){
        super.init()
        this.defaultValue = 0
        this.state = {
            query: ''
        }
    }

    set(value){
        if(value == -1){
            this.values[-1] = this.state.query
        }
        super.set(value)
    }

    field() {
        return (
            <Combobox
                className='text-sm rounded border-0 focus:ring-0 grow min-w-0'
                value={this.state.value}
                onChange={this.set}
                onFocus={() => this.setState({ focused: true })}
                onBlur={() => this.setState({ focused: false })}
                disabled={this.props.disabled}>
                <div className="w-full">
                    <div className='flex items-center px-1'>
                        <Combobox.Input
                            className="w-full bg-transparent border-none p-0 text-sm focus:ring-0"
                            displayValue={() => this.props.values ? this.props.values[this.state.value]: ''}
                            onChange={(event) => this.setState({ query: event.target.value })} />
                        <Combobox.Button className="cursor-pointer text-left focus:outline-none">
                            {({ open }) => <Icon className={classNames('duration-200', open ? 'rotate-180' : '')} icon={faAngleDown} size='sm' />}
                        </Combobox.Button>
                    </div>
                    <Transition as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => this.setState({ query: '' })}>
                        <Combobox.Options className="secondary-material absolute mt-3 min-w-full max-h-40 left-0 overflow-auto rounded-md px-2 py-1 text-base focus:outline-none z-50">
                            {objectMap(this.props.values, (v, i) => {
                                if (v.toLowerCase().replace(/\s+/g, '').includes(this.state.query.toLowerCase().replace(/\s+/g, ''))) {
                                    return <div key={i}>
                                        <Combobox.Option
                                            className={({ active }) => classNames(
                                                'cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap',
                                                active ? 'text-white bg-indigo-500' : 'text-secondary-500')}
                                            value={i}>
                                            {({ selected }) => (<div className='flex items-center'>
                                                <Icon
                                                    className={selected ? 'visible' : 'invisible'}
                                                    icon={faCheck}
                                                    size='sm' />
                                                <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{v}</span>
                                            </div>)}
                                        </Combobox.Option>
                                    </div>
                                }
                            })}
                            
                            {/* {this.state.query && 
                                <Combobox.Option
                                    className={({ active }) => classNames(
                                            'cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap', 
                                            active ? 'text-white bg-indigo-500' : 'text-secondary-500'
                                        )}
                                    value={-1}>
                                    {({ selected }) => (<div className='flex items-center'>
                                        <Icon
                                            className={'invisible'}
                                            icon={faCheck}
                                            size='sm' />
                                        <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{this.state.query}</span>

                                        <Icon
                                            className='ml-auto'
                                            icon={faPlus}
                                            size='sm' />
                                    </div>)}
                                </Combobox.Option>
                            } */}
                            {isEmpty(this.props.values) &&
                                <div className='m-2 text-center text-sm text-secondary-500'>No options</div>
                            }
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        )
    }
}

export default AutocompleteField