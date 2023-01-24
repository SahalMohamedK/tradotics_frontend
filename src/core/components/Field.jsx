import React, { Component} from 'react'
import { classNames, hasValue } from '../utils';
import Icon from '../../components/Icon';
import { requiredValidator } from '../validators';

export class Field extends Component {
    constructor(props) {
        super(props);

        this.init()

        this.defaultValue = hasValue(this.props.defaultValue, this.defaultValue)

        this.state = {
            value: hasValue(this.props.value, this.defaultValue),
            errors: [],
            focused: false,
        }

        this.set = this.set.bind(this)
        this.get = this.get.bind(this)
        this.reset = this.reset.bind(this)
        this.error = this.error.bind(this)
        this.validate = this.validate.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({value: this.props.value})
        }
    }

    init(){
        this.defaultValue = null
        this.validators = [requiredValidator]
    }

    reset() {
        this.setValue(this.defaultValue);
    }

    error(err) {
        err = typeof err === 'object' ? err : [err]
        this.setState({ errors: err });
    }

    set(value) {
        this.setState({ value: value, errors: [] }, () => {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    }

    get() {
        let value = this.state.value;
        let errors = this.validate();
        if (errors.length > 0) {
            this.error(errors);
        } else {
            return value;
        }
    }

    validate() {
        this.error([]);
        let errors = []

        let validators = this.validators
        if(this.props.validators){
            validators = [...this.validators, ...this.props.validators]
        }


        for(var i in validators){
            let validator = validators[i]
            let error = validator(this.state.value, this)
            if(error){
                errors.push(error)
            }
        }
        return errors
    }

    field(){

    }

    render() {
        let addons = hasValue(this.props.addons, [])
        let subLabel = this.props.subLabel
        if (subLabel === true) {
            subLabel = this.props.readOnly ? 'read only' : !this.props.required ? 'optional' : 'required'
        }
        return (
            <div className={classNames('relative', this.props.className)}>
                {this.props.label && <label htmlFor={this.props.id} className="flex items-baseline text-sm">
                    <div>{this.props.label}</div>
                    {subLabel && <div className='text-xs ml-1 text-secondary-500'>({subLabel})</div>}
                </label>}
                <div className={classNames(
                    'relative rounded-md flex items-center material bg-secondary-800 px-2 py-1.5 border duration-200',
                    this.props.disabled ? 
                        'bg-secondary-700 text-secondary-600' : 
                        'bg-secondary-800',
                    this.state.focused ? 
                        'border-indigo-500' : 
                        this.state.errors.length>0 ? 
                            'border-red-500' : 
                            'border-indigo-500/0',
                    this.props.innerClassName)}>
                    <Icon 
                        className={
                            this.state.focused ? 
                                'text-indigo-500' : 
                                this.state.errors.length>0 ? 
                                    'text-red-500' : 
                                    'text-secondary-600'
                            }
                        icon={this.props.icon} 
                        size='sm' />
                    {this.field()}
                    {addons.map((addon, i) => <div key={i}>{addon}</div>)}
                </div>
                {this.state.errors.length > 0 && <div>
                    {this.state.errors.map((error, i) => 
                        <p key={i} className='text-red-500 text-xs mt-1' >{error}</p>
                    )}    
                </div>}
                <div className={this.props.disabled ? 'absolute top-0 bottom-0 left-0 right-0' : ''}></div>
            </div>
        )
    }
}

export default Field