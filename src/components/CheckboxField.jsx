import { faAngleDown, faCheck, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Popover, Transition } from '@headlessui/react';
import React, { Component, Fragment } from 'react'
import { addItem, classNames, hasValue, removeItem } from '../utils';
import Icon from './Icon';
import IconBtn from './IconBtn';

export class CheckboxField extends Component {
    constructor(props) {
        super(props);

        this.defaultValues = hasValue(this.props.defaultValues, hasValue(this.props.selectedValues, []))

        this.state = {
            values: this.defaultValues,
            error: '',
            focused: false
        }

        this.set = this.set.bind(this)
        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
    }

    componentDidUpdate() {
        if (this.props.value !== undefined && this.props.value !== this.state.value) {
            this.setState({
                value: this.props.value
            })
        }
    }

    reset() {
        this.setValue(this.defaultValue);
    }

    error(err) {
        this.setState({ error: err });
    }

    add(value) {
        this.setState(prevState => ({ values: addItem(prevState.values, value) }), () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.values);
            }
        })
    }

    remove(value) {
        this.setState(prevState => ({ values: removeItem(prevState.values, value) }), () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.values);
            }
        })
    }

    set(values) {
        this.setState({ values: values, error: '' }, () => {
            if (this.props.onChange) {
                this.props.onChange(values);
            }
        });
    }

    get() {
        let values = this.state.values;
        let error = this.props.validator ? this.props.validator(values) : '';
        if (values.length === 0 && this.props.required) {
            this.setError('This field is rquired!')
        } else if (error) {
            this.setError(error);
        } else {
            this.setError('');
            if (values.length === 0) {
                return null
            }
            if (this.props.convertor) {
                return this.props.convertor(values)
            }
            return values;
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
                    this.state.focused ? 'border-indigo-500' : 'border-indigo-500/0',
                    this.props.innerClassName)}>
                    <Icon className={this.state.focused ? 'text-indigo-500' : 'text-secondary-600'} icon={this.props.icon} size='sm' />
                    <Popover
                        className='text-sm rounded border-0 focus:ring-0 grow min-w-0'
                        onFocus={() => this.setState({ focused: true })}
                        onBlur={() => this.setState({ focused: false })} >
                        <div className="w-full">
                            <div className='flex items-center px-1'>
                                <Popover.Button className="flex items-center justify-between bg-inherit w-full cursor-pointer px-1 text-left focus:outline-none">
                                    {({ open }) => <>
                                        <div className='flex w-full overflow-x-auto'>
                                            {this.state.values.map((v, i) =>
                                                <div key={i} className='bg-secondary-700 px-2 py-0.5 text-sm rounded mr-1 flex items-center'>
                                                    {this.values[v]}
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
                                {addons.map((addon, i) => <div key={i}>{addon}</div>)}
                            </div>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Popover.Panel className="secondary-material absolute mt-3 min-w-full max-h-40 left-0 overflow-auto rounded-md bg-secondary-800 material px-2 py-1 text-base focus:outline-none z-50">
                                    {this.values.map((value, i) => {
                                        let selected = this.state.values.includes(i)
                                        return <div key={i} className={classNames('cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap hover:text-white hover:bg-indigo-500',
                                            selected ? 'text-white bg-indigo-500' : 'text-secondary-500')}
                                            onClick={() => selected ? this.removeValue(i) : this.addValue(i)}>
                                            <div className='flex items-center'>
                                                <Icon className={selected ? 'visible' : 'invisible'} icon={faCheck} size='sm' />
                                                <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{value}</span>
                                            </div>
                                        </div>
                                    })}

                                    {this.values.length === 0 &&
                                        <div className='m-2 text-center text-sm text-secondary-500'>No options</div>
                                    }
                                </Popover.Panel>
                            </Transition>
                        </div>
                    </Popover>
                </div>
                {this.state.error && <p className='text-red-500 text-xs mt-1' >{this.state.error}</p>}

                <div className={this.props.disabled ? 'absolute top-0 bottom-0 left-0 right-0' : ''}></div>
            </div>
        )
    }
}

export default CheckboxField