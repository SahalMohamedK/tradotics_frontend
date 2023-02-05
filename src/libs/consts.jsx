import { classNames, range } from "../utils"

export const DAYS = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MONTHS = ['January', 'February', 'March', 'April','May', 'June', 'July', 'Augest', 'Septemer', 'October', 'November', 'December']
export const YEARS = range(1990, 2030, 1)
export const HOURS = ['12am - 1am', '1am - 2am', '2am - 3am', '3am - 4am', '4am - 5am', '5am - 6am', '6am - 7am', '7am - 8am', '8am - 9am',
    '9am - 10am', '10am - 11am', '11am - 12pm', '12pm - 1pm', '1pm - 2pm', '2pm - 3pm', '3pm - 4pm', '4pm - 5pm', '5pm - 6pm', '6pm - 7pm', '7pm - 8pm', '8pm - 9pm',
    '9pm - 10pm', '10pm - 11pm', '11pm - 12am']
export const SETUPS = ['No tag', 'Gap', 'Morning star', 'Dodge', 'Gap down', 'Fib', 'RSI']
export const DURATIONS = ['1 - 5 min', '5 - 10 min', '10 - 20 min', '20 - 40 min', '40+ min']

export const CURRENCY = {
    USD: '$',
    INR: 'rs'
}

export const FORMAT = {
    CURRENCY: (data, color) => {
        let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'})
        return <div className={classNames(color? data>=0?'text-green-500':'text-red-500': '')}>{formatter.format(Math.abs(data))}</div>
    },  
    PERCENTAGE: (data) => <div className={classNames(data>=0?'text-green-500':'text-red-500')}>{Math.abs(data)}%</div>,
    NUMBER: (data) => data,
    TIME: (data) => data
}