
export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function objectMap(object, func) {
    let result = []
    for (let key in object) {
        result.push(func(object[key], key))
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
        for (let i in a) {
            if (a[i] !== b[i]) return false
        }
        return true
    }
    return a === b
}

export function removeItem(array, item) {
    return array.filter(prevItem => !equal(prevItem, item))
}

export function addItem(array, item) {
    return [...array, item]
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

    isValid() {
        let valid = true
        for (var key in this.fields) {
            if (this.fields[key].get() === undefined) {
                valid = false
            }
        }
        return valid
    }

    get(keys) {
        let data = new FormData()
        keys = hasValue(keys, Object.keys(this.fields))
        for (var key in keys) {
            let value = this.fields[keys[key]].get()
            if (value) {
                data.append(keys[key], value)
            }
        }
        return data
    }

    error(err) {
        console.log(err);
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
}