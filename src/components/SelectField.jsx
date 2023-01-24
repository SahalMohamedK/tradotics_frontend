import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Listbox, Transition } from '@headlessui/react';
import React, { Component, Fragment } from 'react'
import { classNames, hasValue, objectMap } from '../utils';
import Icon from './Icon';

export class SelectField extends Component {
    constructor(props) {
        super(props);

        this.defaultValue = hasValue(this.props.defaultValue, hasValue(this.props.value, 0))

        this.state = {
            value: this.defaultValue,
            error: '',
            focused: false
        }

        this.set = this.set.bind(this)
    }

    componentDidUpdate() {
        if (this.props.value !== undefined && this.props.value !== this.state.value) {
            this.setState({
                value: this.props.value
            })
        }
    }

    reset() {
        this.set(this.defaultValue);
    }

    error(error) {
        this.setState({ error: error });
    }

    set(value) {
        this.setState({ value: value, error: '' }, () => {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    }

    get() {
        let value = this.state.value;
        let error = this.props.validator ? this.props.validator(value) : '';

        if (isNaN(value) && this.props.required) {
            this.set('This field is rquired!')
        } else if (error) {
            this.set(error);
        } else {
            this.set('');
            return value;
        }
    }

    render() {
        let subLabel = this.props.subLabel
        if (subLabel === true) {
            subLabel = this.props.readOnly ? 'read only' : !this.props.required ? 'optional' : 'required'
        }
        let values = hasValue(this.props.values, [])

        return (
            <div className={this.props.className}>
                {this.props.label && <label htmlFor={this.props.id} className="flex items-baseline text-sm">
                    <div>{this.props.label}</div>
                    {subLabel && <div className='text-xs ml-1 text-secondary-500'>({subLabel})</div>}
                </label>}
                <div className={classNames('relative rounded-md flex items-center material bg-secondary-800 px-2 py-1.5 border duration-200',
                    this.state.focused ? 'border-indigo-500' : 'border-indigo-500/0',
                    this.props.innerClassName)}>
                    <Icon className={this.state.focused ? 'text-indigo-500' : 'text-secondary-600'} icon={this.props.icon} size='sm' />
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
                </div>
                {this.state.error && <p className='text-red-500 text-xs mt-1' >{this.state.error}</p>}
            </div>
        )
    }
}

export default SelectField