export const eq = (a, b) => a == b
export const lt = (a, b) => a < b
export const gt = (a, b) => a > b
export const lt_eq = (a, b) => a <= b
export const gt_eq = (a, b) => a >= b

export function customError(validator, message){
    return function (value, field){
        return validator(value, field, message)
    }
}

export function requiredValidator(value, field, message = "This field is required."){
    if(field.props.required && value.length == 0){
        return message
    }
}

export function opValidator(op, message, ...values){
    return function (value2){
        if(!op(...values, value2)){
            return message
        }
    }
}

export function lengthValidator(length, op = eq, message = "This field must be {length} charactors."){
    return opValidator((a, b) => op(a, b.length), message, length)
}