import { Component, createRef} from 'react'
import { hasValue, uniqueID } from '../utils';
import { requiredValidator } from '../validators';

export class Field extends Component {
    constructor(props) {
        super(props);

        this.init()

        this.id = hasValue(this.props.id, uniqueID())

        this.defaultValue = hasValue(this.props.defaultValue, this.defaultValue)

        this.input = createRef()

        this.state = {
            value: hasValue(this.props.value, this.defaultValue),
            errors: [],
            focused: false,
            ...hasValue(this.state, {})
        }

        hasValue(this.props.onChange, () => { })(this.state.value)

        this.set = this.set.bind(this)
        this.get = this.get.bind(this)
        this.reset = this.reset.bind(this)
        this.error = this.error.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
        this.validate = this.validate.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== undefined && prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value })
        }
    }

    onFocus() {
        this.setState({ focused: true })
        if (this.props.onFocus) this.props.onFocus()
    }

    onBlur() {
        this.setState({ focused: false })
        if (this.props.onBlur) this.props.onBlur()
    }

    onKeyPress(e) {
        if (e.key == 'Enter' && this.props.onEnter) {
            this.props.onEnter();
        }
    }

    init() {
        this.defaultValue = null
        this.validators = []
        if(this.props.required){
            this.validators.push(requiredValidator())
        }
    }

    reset() {
        this.set(this.defaultValue);
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
        if (this.props.validators) {
            validators = [...this.validators, ...this.props.validators]
        }


        for (var i in validators) {
            let validator = validators[i]
            let error = validator(this.state.value)
            if (error) {
                errors.push(error)
            }
        }
        return errors
    }

    field(){

    }
}

export default Field