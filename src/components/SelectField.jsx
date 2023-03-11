import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react'
import { classNames, equal, hasValue, objectMap } from '../utils';
import FieldWraper from './FieldWraper';
import Icon from './Icon';

export class SelectField extends FieldWraper {
    init(){
        super.init()
        let values = hasValue(this.props.values, [])
        this.defaultValue = Object.keys(values)[0]
    }

    componentDidUpdate(prev) {
        if (!equal(prev.values, this.props.values)) {
            this.set(nthKey(this.props.values, 0))
        }
    }

    field() {
        let values = hasValue(this.props.values, [])

        return (<>
            <Listbox className='text-sm rounded border-0 focus:ring-0 grow min-w-0' value={this.state.value}
                onChange={this.set} onFocus={() => this.setState({ focused: true })}
                onBlur={() => this.setState({ focused: false })} disabled={this.props.disabled}>
                <div className="w-full">
                    <Listbox.Button className="flex items-center justify-between bg-inherit w-full cursor-pointer px-1 text-left focus:outline-none">
                        {({ open }) => <>
                            <span className="block truncate">
                                {values[this.state.value]}
                            </span>
                            <Icon className={classNames('duration-200', open ? 'rotate-180' : '')} icon={faAngleDown} size='sm' />
                        </>}
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="secondary-material absolute mt-3 min-w-full max-h-40 left-0 overflow-auto rounded-md bg-secondary-800 material px-2 py-1 text-base focus:outline-none z-50">
                            {objectMap(values, (v, i) => (
                                <Listbox.Option key={i} className={({ active }) => classNames('cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap', active ? 'text-white bg-indigo-500' : 'text-secondary-500')}
                                    value={i}>
                                    {({ selected }) => (<div className='flex items-center'>
                                        <Icon className={selected ? 'visible' : 'invisible'} icon={faCheck} size='sm' />
                                        <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{v}</span>
                                    </div>)}
                                </Listbox.Option>
                            ))}

                            {values.length === 0 &&
                                <div className='m-2 text-center text-sm text-secondary-500'>No options</div>
                            }
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </>)
    }
}

export default SelectField