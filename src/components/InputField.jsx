import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { Fragment } from 'react'
import Field from '../core/components/Field';
import { classNames } from '../utils';
import IconBtn from './IconBtn';

class InputField extends Field {
    init(){
        super.init()
        this.defaultValue = ''
        this.state = {
            type: this.props.type
        }

        this.onKeyPress = this.onKeyPress.bind(this)
    }

    onKeyPress(e) {
        if (e.key == 'Enter' && this.props.onEnter) {
            this.props.onEnter();
        }
    }

    field(){
        return (
            <Fragment>
                <input 
                    ref={this.input} 
                    type={this.state.type} 
                    id={this.props.id} 
                    disabled={this.props.disabled}
                    className={
                        classNames("bg-inherit text-sm rounded border-0 p-1 focus:ring-0 outline-none grow min-w-0",
                        this.props.disabled ? 'text-secondary-500' : '', this.props.inputClassName)
                    }
                    onChange={(e) => this.set(e.target.value)} 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    readOnly={this.props.readOnly} 
                    onKeyPress={this.onKeyPress} />
                {this.props.type == 'password' && 
                 this.state.type == 'password' &&
                    <IconBtn 
                        className='ml-1' 
                        icon={faEye} 
                        size='sm' 
                        onClick={() => this.setState({ type: 'text' })} />
                }
                {this.props.type == 'password' && 
                 this.state.type == 'text' &&
                    <IconBtn 
                        className='ml-1' 
                        icon={faEyeSlash} 
                        size='sm' 
                        onClick={() => this.setState({ type: 'password' })} />
                }
            </Fragment>
        )
    }
}

export default InputField