import { faCalendar, faClock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { classNames } from '../utils';
import FieldWraper from './FieldWraper';
import IconBtn from './IconBtn';

class InputField extends FieldWraper {
    init(){
        super.init()
        this.defaultValue = ''
        this.state = {
            type: this.props.type
        }
    }

    get(){
        let value = this.state.value;
        let errors = this.validate();
        if (errors.length > 0) {
            this.error(errors);
        } else if(this.props.type == 'number'){
            if(value == ''){
                return null;
            }
            return Number(value)
        } else {
            return value
        }
    }

    field(){
        return (<>
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
                {this.props.type == 'date' &&
                    <IconBtn
                        className='ml-1'
                        icon={faCalendar}
                        size='sm'
                        onClick={() => this.input.current.showPicker()}/>
                }

                {this.props.type == 'time' &&
                    <IconBtn
                        className='ml-1'
                        icon={faClock}
                        size='sm'
                        onClick={() => this.input.current.showPicker()} />
                }
        </>)    
    }
}

export default InputField