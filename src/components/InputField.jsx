import { faEye, faEyeSlash, faUpload } from '@fortawesome/free-solid-svg-icons';
import React, { Component, createRef } from 'react'
import { classNames, filename, hasValue } from '../utils';
import Icon from './Icon';
import IconBtn from './IconBtn';

export class InputField extends Component {
    constructor(props){
        super(props);

        this.defaultValue = this.props.defaultValue != undefined?this.props.defaultValue:this.props.type == 'number'?0:'';
        this.addons = hasValue(this.props.addons, [])

        this.state = {
            value : this.defaultValue,
            error: '',
            type: this.props.type?this.props.type: 'text',
            focused: false
        }

        this.input = createRef()

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
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

    getValue(trim = true){
        let value = this.state.value;
        let error = this.props.validator ? this.props.validator(value) : '';
        if(this.state.type == 'text' && trim){
            value = value.trim();
        }
        if(value === '' && this.props.required){
            this.setError('This field is rquired!')
        }else if(error){
            this.setError(error);
        }else{
            this.setError('');
            if(this.state.type == 'number'){
                return Number(value);
            }
            return value;
        }
    }

    onKeyPress(e){
        if(e.key == 'Enter' && this.props.onEnter){
            this.props.onEnter();
        }
    }

    onClick(){
        this.input.current.focus()
        if(this.props.type == 'date'){
            this.input.current.showPicker()
        }
    }

  render() {
    return (
        <div className={this.props.className}>
            {this.props.label && <label htmlFor={this.props.id} className="flex items-baseline text-sm">
                <div>{this.props.label}</div>
                {!this.props.required && <div className='text-xs ml-1 text-secondary-500'>(optional)</div>}
            </label>}
            <div className={classNames('material rounded-lg flex items-center px-2 py-1 border duration-200',
                    this.props.disabled?'bg-secondary-700':'bg-secondary-800',
                    this.state.focused?'border-indigo-500':this.state.error?'border-red-500':'border-indigo-500/0',
                    this.props.innerClassName)} onClick={this.onClick}>
                <Icon className={this.state.focused?'text-indigo-500':this.state.error?'text-red-500':'text-secondary-600'} icon={this.props.icon} size='sm'/>
                <input ref={this.input} type={this.state.type} id={this.props.id} disabled={this.props.disabled}
                className={classNames("bg-inherit text-sm rounded border-0 p-1 focus:ring-0 grow min-w-0",
                    this.props.disabled?'text-secondary-500':'')}  
                onChange={(e) => this.setValue(e.target.value)} placeholder={this.props.placeholder} value={this.state.value} 
                onFocus={() => this.setState({focused: true})} onBlur={() => this.setState({focused: false})}
                readOnly={this.props.readOnly} onKeyPress={this.onKeyPress}/>
                {this.addons.map((addon, i) => <div key={i}>{addon}</div>)}
                {this.props.type == 'password' && this.state.type == 'password' &&
                    <IconBtn icon={faEye} size='sm' className='ml-1' onClick={() => this.setState({type:'text'})}/>
                }
                {this.props.type == 'password' && this.state.type == 'text' &&
                    <IconBtn icon={faEyeSlash} size='sm' className='ml-1' onClick={() => this.setState({type:'password'})}/>
                }
            </div>            
            {this.state.error && <p className='text-red-500 text-xs mt-1' >{this.state.error}</p>}
        </div>
    )
  }
}

export default InputField