export const eq = (a, b) => a == b
export const lt = (a, b) => a < b
export const gt = (a, b) => a > b
export const lt_eq = (a, b) => a <= b
export const gt_eq = (a, b) => a >= b

export function customMessageValidator(validator, message) {
    return function (value) {
        return validator(value, message)
    }
}

export function requiredValidator(empty = (v) => v == '', message = "This field is required.") {
    return (value) => {
        if (empty(value)) {
            return message
        }
    }
}

export function opValidator(op, message, ...values) {
    return function (value2) {
        if (!op(...values, value2)) {
            return message
        }
    }
}

export function lengthValidator(length, op = eq, message = (length) => `This field must be ${length} charactors.`) {
    return opValidator((a, b) => op(a, b.length), message(length), length)
}

export function emailValidator(value, message = 'Invalied email, please enter a valied email.') {
    return (value) => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))) {
            return message
        }
    }
}

export function phoneValidator(value) {
    if (value[0] != '+') {
        return 'Country code is required';
    } else if (value.substring(0, 3) != '+91' && value.substring(0, 4) != '+965') {
        return 'Only +91 (India) & +965 (Kuwait) allowed';
    } else if (!(/^\d+$/.test(value.substring(1))) || value.length < 11 || value.length > 15) {
        return 'Invalied phone number';
    }
}