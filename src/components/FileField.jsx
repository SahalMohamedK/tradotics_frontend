import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import React, { Component, createRef } from 'react'
import { classNames, hasValue } from '../utils';
import Icon from './Icon';
import IconBtn from './IconBtn';

export class FileField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: [],
            error: '',
            focused: false
        }

        this.input = createRef()

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    reset() {
        this.set([]);
        this.input.current.value = ''
    }

    error(err) {
        this.setState({ error: err });
    }

    isValid() {
        let value = this.get()
        return value !== undefined
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
        let error = this.props.validator ? this.props.validator(value) : ''
        if (value.length === 0 && this.props.required) {
            this.error('This field is rquired!')
        }else if (error) {
            this.error(error)
        } else {
            this.error('')
            if (!this.props.multiple) {
                return hasValue(value[0], null)
            }
            return value;
        }
    }

    onKeyPress(e) {
        if (e.key == 'Enter' && this.props.onEnter) {
            this.props.onEnter();
        }
    }

    onClick() {
        this.input.current.focus()
    }

    render() {
        let addons = hasValue(this.props.addons, [])
        return (
            <div className={this.props.className}>
                {this.props.label && <label htmlFor={this.props.id} className="flex items-baseline text-sm">
                    <div>{this.props.label}</div>
                    {!this.props.required && <div className='text-xs ml-1 text-secondary-500'>(optional)</div>}
                </label>}
                <div className={classNames('material rounded-lg flex items-center px-2 py-1 border duration-200 w-full',
                    this.props.disabled ? 'bg-secondary-700' : 'bg-secondary-800',
                    this.state.focused ? 'border-indigo-500' : this.state.error ? 'border-red-500' : 'border-indigo-500/0',
                    this.props.innerClassName)} onClick={this.onClick}>
                    <Icon className={this.state.focused ? 'text-indigo-500' : this.state.error ? 'text-red-500' : 'text-secondary-600'} icon={this.props.icon} size='sm' />
                    <input
                        ref={this.input}
                        type='file'
                        id={this.props.id}
                        disabled={this.props.disabled}
                        className="hidden"
                        onChange={(e) => this.set(e.target.files)}
                        placeholder={this.props.placeholder}
                        onFocus={() => this.setState({ focused: true })}
                        onBlur={() => this.setState({ focused: false })}
                        readOnly={this.props.readOnly}
                        onKeyPress={this.onKeyPress}
                        accept={this.props.accept}
                        multiple={this.props.multiple} />
                    <input className={classNames('bg-inherit text-sm rounded border-0 p-1 focus:ring-0 w-full',
                        this.props.disabled ? 'text-secondary-500' : '')} value={this.state.value.length ? this.state.value[0].name : 'No file chosen'} disabled />
                    {addons.map((addon, i) => <div key={i}>{addon}</div>)}
                    <IconBtn className={classNames(this.props.disabled ? 'text-secodary-500' : '', 'ml-1')} icon={faUpload} size='sm' onClick={() => this.input.current.click()} />
                    <IconBtn className={classNames(this.state.value.length !== 0 ? 'block ml-2' : 'hidden')} icon={faTrash} size='sm' onClick={() => this.reset()} />
                </div>
                {this.state.error && <p className='text-red-500 text-xs mt-1' >{this.state.error}</p>}
            </div>
        )
    }
}

export default FileField