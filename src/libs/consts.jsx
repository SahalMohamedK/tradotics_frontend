import { classNames, range } from "../utils"

export const DAYS = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MONTHS = ['January', 'February', 'March', 'April','May', 'June', 'July', 'Augest', 'Septemer', 'October', 'November', 'December']
export const YEARS = range(1990, 2030, 1)

export const CURRENCY = {
    USD: '$',
    INR: 'rs'
}

export const FORMAT = {
    CURRENCY: (data) => {
        let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency:'USD'})
        return <div className={classNames(data>=0?'text-green-500':'text-red-500')}>{formatter.format(Math.abs(data))}</div>
    },  
    PERCENTAGE: (data) => <div className={classNames(data>=0?'text-green-500':'text-red-500')}>{Math.abs(data)}%</div>,
    NUMBER: (data) => data,
    TIME: (data) => data
}