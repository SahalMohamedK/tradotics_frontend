import { faAngleDown, faCheck, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Combobox, Transition } from '@headlessui/react';
import React, { Component, Fragment } from 'react'
import { classNames, hasValue, isEmpty, objectMap } from '../utils';
import Icon from './Icon';

export class AutocompleteField extends Component {
    constructor(props) {
        super(props);

        this.defaultValue = hasValue(this.props.defaultValue, hasValue(this.props.value, null))

        this.state = {
            value: this.defaultValue,
            error: '',
            focused: false,
            query: ''
        }

        this.set = this.set.bind(this)
    }


    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                value: this.props.value
            })
        }
    }

    reset() {
        this.set(this.defaultValue);
    }

    error(err) {
        this.setState({ error: err });
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

        if (value === null && this.props.required) {
            this.error('This field is rquired!')
        } else if (this.props.values && value !== null && !this.props.values.hasOwnProperty(value)) {
            this.error('Invalied option are selected!')
        } else if (error) {
            this.error(error);
        } else {
            this.error('');
            return value;
        }
    }

    render() {
        let addons = hasValue(this.props.addons, [])
        return (
            <div className={classNames('relative', this.props.className)}>
                {this.props.label && <label htmlFor={this.props.id} className="flex items-baseline text-sm">
                    <div>{this.props.label}</div>
                    {!this.props.required && <div className='text-xs ml-1 text-secondary-500'>(optional)</div>}
                </label>}
                <div className={classNames('relative rounded-md flex items-center material bg-secondary-800 px-2 py-1.5 border duration-200',
                    this.props.disabled ? 'bg-secondary-700 text-secondary-600' : 'bg-secondary-800',
                    this.state.focused ? 'border-indigo-500' : this.state.error ? 'border-red-500' : 'border-indigo-500/0',
                    this.props.innerClassName)}>
                    <Icon className={this.state.focused ? 'text-indigo-500' : this.state.error ? 'text-red-500' : 'text-secondary-600'} icon={this.props.icon} size='sm' />
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
                                    displayValue={() => this.props.values ? this.props.values[this.state.value] : ''}
                                    onChange={(event) => this.setState({ query: event.target.value })} />
                                <Combobox.Button className="cursor-pointer text-left focus:outline-none">
                                    {({ open }) => <Icon className={classNames('duration-200', open ? 'rotate-180' : '')} icon={faAngleDown} size='sm' />}
                                </Combobox.Button>
                                {addons.map((addon, i) => <div key={i}>{addon}</div>)}
                            </div>
                            <Transition as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => this.setState({ query: '' })}>
                                <Combobox.Options className="secondary-material absolute mt-3 min-w-full max-h-40 left-0 overflow-auto rounded-md px-2 py-1 text-base focus:outline-none z-50">
                                    {objectMap(this.props.values, (v, i) => {
                                        if (this.state.query === '' || v.toLowerCase().replace(/\s+/g, '').includes(this.state.query.toLowerCase().replace(/\s+/g, ''))) {
                                            return <Combobox.Option
                                                key={i}
                                                className={({ active }) => classNames('cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap', active ? 'text-white bg-indigo-500' : 'text-secondary-500')}
                                                value={i}>
                                                {({ selected }) => (<div className='flex items-center'>
                                                    <Icon
                                                        className={selected ? 'visible' : 'invisible'}
                                                        icon={faCheck}
                                                        size='sm' />
                                                    <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{v}</span>
                                                </div>)}
                                            </Combobox.Option>
                                        }
                                    })}
                                    {isEmpty(this.props.values) &&
                                        <div className='m-2 text-center text-sm text-secondary-500'>No options</div>
                                    }
                                </Combobox.Options>
                            </Transition>
                        </div>
                    </Combobox>
                </div>
                {this.state.error && <p className='text-red-500 text-xs mt-1' >{this.state.error}</p>}
                <div className={this.props.disabled ? 'absolute top-0 bottom-0 left-0 right-0' : ''}></div>
            </div>
        )
    }
}

export default AutocompleteField