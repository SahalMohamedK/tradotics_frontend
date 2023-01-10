import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Listbox, Transition } from '@headlessui/react';
import React, { Component, Fragment } from 'react'
import { classNames, hasValue } from '../utils';
import Icon from './Icon';

export class SelectField extends Component {
    constructor(props){
        super(props);

        this.defaultValue = hasValue(this.props.defaultValue, hasValue(this.props.value, 0))
        this.values = hasValue(this.props.values, [])

        this.state = {
            value : this.defaultValue,
            error: '',
            focused: false
        }

        this.setValue = this.setValue.bind(this)
    }

    componentDidUpdate(){
        if(this.props.value !== undefined && this.props.value !== this.state.value){
            this.setState({
                value: this.props.value
            })
        }
    }

    reset(){
        this.setValue(this.defaultValue);
    }

    setError(error){
        this.setState({error: error});
    }

    setValue(value){
        this.setState({value: value, error: ''}, ()=>{
            if(this.props.onChange){
                this.props.onChange(value);
            }
        });
    }

    getValue(){
        let value = this.state.value;
        let error = this.props.validator ? this.props.validator(value) : '';

        if(isNaN(value) && this.props.required){
            this.setError('This field is rquired!')
        }else if(error){
            this.setError(error);
        }else{
            this.setError('');
            return value;
        }
    }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.label && <label className="mb-2 text-sm">
            {this.props.label}
        </label>}
        <div className={classNames('relative rounded-md flex items-center material bg-secondary-800 px-2 py-1.5 border duration-200', 
            this.state.focused?'border-indigo-500':'border-indigo-500/0', 
            this.props.innerClassName)}>
            <Icon className={this.state.focused?'text-indigo-500':'text-secondary-600'} icon={this.props.icon} size='sm'/>
            <Listbox className='text-sm rounded border-0 focus:ring-0 grow min-w-0' value={this.state.value} 
                onChange={this.setValue} onFocus={() => this.setState({focused: true})} 
                onBlur={() => this.setState({focused: false})} disabled={this.props.disabled}>
                <div className="w-full">
                    <Listbox.Button className="flex items-center justify-between bg-inherit w-full cursor-pointer px-1 text-left focus:outline-none">
                        {({open}) => <>
                            <span className="block truncate">
                                {this.values[this.state.value]}
                            </span>
                            <Icon className={classNames('duration-200',open?'rotate-180':'')} icon={faAngleDown} size='sm'/>
                        </>}
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="secondary-material absolute mt-3 min-w-full max-h-40 left-0 overflow-auto rounded-md bg-secondary-800 material px-2 py-1 text-base focus:outline-none z-50">
                        {this.values.map((v, i) => (
                            <Listbox.Option key={i} className={({ active }) => classNames('cursor-pointer p-1 my-1 text-sm duration-200 rounded whitespace-nowrap', active ? 'text-white bg-indigo-500' : 'text-secondary-500')}
                                value={i}>
                                {({ selected }) => (<div className='flex items-center'>
                                    <Icon className={selected?'visible':'invisible'} icon={faCheck} size='sm'/>
                                    <span className={classNames(selected ? 'font-medium' : 'font-normal')}>{v}</span>
                                </div>)}
                            </Listbox.Option>
                        ))}
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