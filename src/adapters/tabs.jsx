import { classNames } from "../utils"
import Icon from "../components/Icon";

export function iconTabAdapter(selected, {label, icon, className}){
    return <div className={classNames('px-3 py-2 duration-200 rounded-lg flex items-center font-medium my-1 cursor-pointer mr-1 md:mr-0', 
        selected?'active-primary-material':'text-secondary-500 hover:text-white', className)}>
        <Icon className='mr-2' icon={icon}/>
        <div className="whitespace-nowrap">{label}</div>
    </div>
}

export function simpleTabAdapter(selected, {label, className}){
    return <div className={classNames('px-2 py-1 duration-200 rounded-lg font-bold my-1 text-sm cursor-pointer mr-1', 
        selected?'active-primary-material':'text-secondary-400 hover:text-white material bg-secondary-800', className)}>
        {label}
    </div>
}

export function filterTabAdapter(selected, {label, number = 0}){
    return <div className={classNames('flex items-center justify-between px-3 py-1 rounded duration-200 cursor-pointer text-sm my-1', 
        selected?'text-white bg-secondary-700':'text-secondary-500 hover:text-white')}>
        <div>{label}</div>
        <div className={classNames("!h-5 !w-5 circle text-sm", selected?"bg-secondary-800":"bg-secondary-700")}>
            <div className="center">{number}</div>
        </div>
    </div>
}