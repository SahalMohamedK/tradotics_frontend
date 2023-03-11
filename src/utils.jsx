import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { API_URL } from "./config"

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function objectMap(object, func) {
    let result = []
    let i = 0
    for (let key in object) {
        result.push(func(object[key], key, i))
        i+=1
    }
    return result
}

export function hasValue(value, otherwise) {
    return value !== undefined ? value : otherwise
}

export function listify(value) {
    return Array.isArray(value) ? value : [value]
}

export function curDate() {
    let date = new Date();
    return strDate(date);
}

export function strDate(date, formatString = '{DAY} {month} {YEAR}, {day}') {
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'Septemer', 'October', 'November', 'December']

    args = {
        DAY: date.getDate(),
        MONTH: date.getMonth() + 1,
        YEAR: date.getFullYear(),
        day: DAYS[date.getDay()],
        month: MONTHS[date.getMonth()],
    }

    return format(formatString, args);
}

export function filename(path) {
    return path.split('\\').pop()
}

export function fileFormat(path) {
    return path.split('.').pop()
}

export function fileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

export function hexToRgba(hex, opacity = 1) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

export function equal(a, b) {
    if (typeof (a) === 'object' && typeof (b) === 'object') {
        if (Object.keys(a).length == Object.keys(b).length) {
            for (let i in a) {
                if (a[i] !== b[i]) return false
            }
            return true
        }
        return false
    }
    return a === b
}

export function nthValue(obj, n) {
    return obj[Object.keys(obj)[n]]
}

export function nthKey(obj, n) {
    return Object.keys(obj)[n]
}

export function removeItem(array, item) {
    return array.filter(prevItem => !equal(prevItem, item))
}

export function removeByIndex(array, index){
    return array.filter((value, i) => i !== index)
}

export function addItem(array, item) {
    return [...array, item]
}

export function pop(object, propertyName) {
    let temp = object[propertyName];
    delete object[propertyName];
    return temp;
}

export function range(start, end, step) {
    let a = []
    for (var i = start; i < end; i += step) {
        a.push(i)
    }
    return a
}

export function isEmpty(obj) {
    return obj && Object.keys(obj).length === 0;
}

export function format(string, args) {
    return string.replace(/{([a-zA-Z_][0-9a-zA-Z_]+)}/g, (m, i) => hasValue(args[i], m))
}

export function toVar(s) {
    let symbols = "[ `!@#$%^&*()+\-=\[\]{};':\"\\|,.<>\/?~]"
    let varStr = ""
    let isSymbol = false
    for (var i in s) {
        let c = isSymbol ? s[i].toUpperCase() : s[i].toLowerCase()
        if (!symbols.includes(c)) {
            varStr += c;
            isSymbol = false
        } else {
            isSymbol = true
        }
    }
    return varStr
}

export function round(num, digits = 0){
    return Math.round(num* Math.pow(10, digits)) / Math.pow(10, digits)
}

export function zFill(num, size) {
    var s = "000000000" + num;
    return s.substring(s.length - size);
}

export function len(obj){
    return obj.size | obj.length | Object.keys(obj).length
}

export function safeNumber(n, otherwise=0){
    if(isNaN(n) || n == Infinity){
        return otherwise
    }
    return n
}

export function mergeGraphDatas(data1, data2){
    let labels = [...data1[0]]
    let values1 = []
    let values2 = []
    data2[0].map(label => {
        if (!labels.includes(label)) {
            labels.push(label)
        }
    })

    labels.map(label => {
        if(data1[0].includes(label)){
            values1.push(data1[1][data1[0].indexOf(label)])
        }else {
            values1.push(0)
        }
        if (data2[0].includes(label)) {
            values2.push(data2[1][data2[0].indexOf(label)])
        }else {
            values2.push(0)
        }   
    })
    return [labels, values1, values2]
}

export function mergeCumulativeDatas(data1, data2){
    let labels = [...data1[0]]
    let values1 = []
    let values2 = []
    data2[0].map(label => {
        if (!labels.includes(label)) {
            labels.push(label)
        }
    })

    labels.map(label => {
        if (data1[0].includes(label)) {
            values1.push(data1[1][data1[0].indexOf(label)])
        } else {
            if(isEmpty(values1)){
                values1.push(0)
            }else{
                values1.push(values1[values1.length-1])
            }
        }
        if (data2[0].includes(label)) {
            values2.push(data2[1][data2[0].indexOf(label)])
        } else {
            if (isEmpty(values2)) {
                values2.push(0)
            } else {
                values2.push(values2[values2.length - 1])
            }
        }
    })
    return [labels, values1, values2]
}

export function all(obj, func = (a, b) => a){
    for(var i in obj){
        if (!func(obj[i], i)){
            return false
        }
    }
    return isEmpty(obj) ? false : true
}

export function any(obj, func = (a, b) => a) {
    for (var i in obj) {
        if (func(obj[i], i)) {
            return true
        }
    }
    return false
}

export function lge(a,b, r1, r2, r3){
    if(a==b){
        return r3
    }else if(a>b){
        return r1
    }
    return r2
}

export class Form {
    constructor() {
        this.fields = {}
        this.ref = this.ref.bind(this)
    }

    ref(r) {
        if (r) {
            if (r.props.name) {
                this.fields[r.props.name] = r
            } else if (r.props.label) {
                this.fields[toVar(r.props.label)] = r
            }
        }
    }

    isValid(keys = undefined) {
        let valid = true
        keys = hasValue(keys, Object.keys(this.fields))
        for (var key in keys) {
            if (this.fields[keys[key]].get() === undefined) {
                valid = false
            }
        }
        return valid
    }

    get(pure = false, keys = undefined) {
        keys = hasValue(keys, Object.keys(this.fields))
        if (pure) {
            let data = {}
            for (var key in keys) {
                let field = this.fields[keys[key]]
                let value
                if (field instanceof Form) {
                    value = field.get(pure)
                } else {
                    value = field.get()
                }
                if (value != undefined) {
                    data[keys[key]] = value
                }
            }
            return data
        }

        let data = new FormData()
        for (var key in keys) {
            let field = this.fields[keys[key]]
            let value = field.get()
            if (value) {
                data.append(keys[key], value)
            }
        }
        return data
    }

    error(err) {
        for (var key in err) {
            let field = this.fields[key]
            if (field) {
                field.error(err[key])
            }
        }
    }

    reset() {
        for (var key in this.fields) {
            this.fields[key].reset()
        }
    }

    set(data) {
        for (var key in data) {
            let field = this.fields[key]
            if (field) {
                field.set(data[key])
            }
        }
    }

    sub(key, form) {
        this.fields[key] = form
    }

    contains(key) {
        return this.fields[key] !== undefined
    }
}

export class Curd {
    constructor(url, name = '', toast = {}, dialog = {}) {
        this.url = API_URL + url
        this.name = name
        this.toast = toast
        this.dialog = dialog
    }

    getHeaders(headers = {}){
        return {
            headers: {
                Authorization: `Token ${localStorage.getItem('auth_token')}`,
                    'content-type': 'application/json',
                ...headers
            }
        }
    }

    create(data, headers = {}) {
        return new Promise((resolver, reject) => {
            axios.post(this.url, data, this.getHeaders( headers)).then(response => {
                this.toast.success('Created successfully', `${this.name} created successfully`)
                resolver(response)
            }).catch(err => {
                this.toast.error('Creation failed', `${this.name} creation failed`)
                reject(err)
            })
        })
    }

    update(data, headers = {}) {
        return new Promise((resolver, reject) => {
            axios.put(this.url, data, this.getHeaders(headers)).then(response => {
                this.toast.success('Updated successfully', `${this.name} updated successfully`)
                resolver(response)
            }).catch(err => {
                this.toast.error('Updation failed', `${this.name} updation failed`)
                reject(err)
            })
        })
    }

    read(url = '', headers = {}) {
        return new Promise((resolver, reject) => {
            axios.get(this.url + url, this.getHeaders(headers)).then(response => {
                // this.toast.success('Read successfully', `${this.name} read successfully`)
                resolver(response)
            }).catch(err => {
                // this.toast.error('Read failed', `${this.name} read failed`)
                reject(err)
            })
        })
    }

    delete(data) {
        return new Promise((resolver, reject) => {
            this.dialog.confirm(`Delete ${this.name}?`, faTrash, `Do you want to delete the ${this.name}`, 'Delete', () => { 
                axios.delete(this.url, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('auth_token')}`,
                        'content-type': 'application/json',
                    },
                    data
                }).then(response => {
                    this.toast.success('Deleted successfully', `${this.name} deleted successfully`)
                    resolver(response)
                }).catch(err => {
                    this.toast.error('Deletion failed', `${this.name} deletion failed`)
                    reject(err)
                })
            })
        })
    }
}