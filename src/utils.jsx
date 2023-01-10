
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function objectMap(object, func) {
  let result = []
  for(let key in object){
    result.push(func(object[key], key))
  }
  return result
}

export function hasValue(value, otherwise){
    return value !== undefined? value: otherwise
}

export function listify(value){
    return Array.isArray(value)?value:[value]
}

export function curDate(){
    let date = new Date();
    return strDate(date);
}

export function strDate(date, formatString = '{DAY} {month} {YEAR}, {day}'){
    const DAYS = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const MONTHS = ['January', 'February', 'March', 'April','May', 'June', 'July', 'Augest', 'Septemer', 'October', 'November', 'December']

    args = {
        DAY: date.getDate(),
        MONTH: date.getMonth()+1,
        YEAR: date.getFullYear(),
        day: DAYS[date.getDay()],
        month: MONTHS[date.getMonth()],
    }

    return format(formatString, args);
}

export function filename(path){
    return path.split( '\\' ).pop()
}

export function hexToRgba(hex, opacity=1){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
    }
    throw new Error('Bad Hex');
}

export function equal(a,b){
    if(typeof(a) === 'object' && typeof(b) === 'object'){
        for(let i in a){
            if(a[i] !== b[i]) return false
        }
        return true
    }
    return a === b
}

export function removeItem(array, item){
    return array.filter(prevItem => !equal(prevItem,item))
}

export function addItem(array, item){
    return [...array, item]
}

export function incrementValue(obj, key){
    if(obj.hasOwnProperty(key)){
        obj[key]+=1
    }else{
        obj[key]=1
    }
    return obj
}

export function decrementValue(obj, key){
    if(obj.hasOwnProperty(key)){
        obj[key]-=1
    }else{
        obj[key]=0
    }
    return obj
}

export function range(start, end, step){
    let  a = []
    for(var i =start ; i<end; i+=step){
        a.push(i)
    }
    return a
}

export function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function format(string, args){
    return string.replace(/{([a-zA-Z_][0-9a-zA-Z_]+)}/g, (m, i) => hasValue(args[i], m))
}