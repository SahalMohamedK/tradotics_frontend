import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { Fragment } from 'react'
import Field from '../core/components/Field';
import { classNames } from '../utils';
import IconBtn from './IconBtn';

export class InputFieldTest extends Field {
    init(){
        super.init()
        this.defaultValue = ''
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
                        this.props.disabled ? 'text-secondary-500' : '')
                    }
                    onChange={(e) => this.set(e.target.value)} 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    onFocus={() => this.setState({ focused: true })} 
                    onBlur={() => this.setState({ focused: false })}
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

export default InputFieldTest