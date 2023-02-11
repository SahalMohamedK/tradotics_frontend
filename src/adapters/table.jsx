import { faDownload, faEdit, faPenToSquare, faPersonWalkingArrowRight, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconBtn from "../components/IconBtn";
import { classNames} from "../utils";
import RatioBar from "../components/RatioBar";
import SwitchBtn from "../components/SwitchBtn";

function currency(data, color = true,  type = 'USD'){
    let formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: type})
    return <div className={classNames(color? data>=0?'text-green-500':'text-red-500':'')}>{formatter.format(Math.abs(data))}</div>
}

function percentage(data){
    return <div className={classNames(data>=0?'text-green-500':'text-red-500')}>{Math.abs(data)}%</div>
}

function iconBtn(icon, onClick){
    return <IconBtn icon={icon} onClick={onClick}/>
}

function dual(data, positive, negative){
    return <div className={classNames('text-xs font-bold rounded px-2 py-0.5', data?'bg-green-500/25 text-green-500':'bg-red-500/25 text-red-500')}>
            {data?positive:negative}
        </div>
}

function secondaryBtn(text, onClick){
    return <div className='secondary-btn btn-secondary-700' onClick={onClick}>{text}</div>
}

function primarybtn(text, onClick){
    return <div className='primary-btn' onClick={onClick}>{text}</div>
}

function checkbox(text, onChange){
    if(text){
        return <div className="flex items-center space-x-2"><input type="checkbox" className="checkbox" onChange={onChange}/><div>{text}</div></div>
    }
    return <input type="checkbox" className="checkbox" onChange={onChange}/>
}

function dateTime(d){
    return (new Date(d)).toUTCString()
}

export var simpleTableAdapter = (table, ...items) => items

export function addTradeHistoryTableAdapter(table, brocker, portfolio, type, created, executions, trades, id ){
    return [brocker, portfolio, ['Import', 'Sync', 'manula'][type], dateTime(created), executions, trades, iconBtn(faDownload, () => table.props.onDownload(id)), iconBtn(faTrash, () => table.props.onDelete(id))]
}

export function dashboardTableAdapter(table, status, date, symbol, netPL, ROI, side, volume, setup, entryTime, entryPrice, exitTime, exitPrice){
    return [dual(status, 'Win', 'Loss'), date, symbol, currency(netPL), percentage(ROI), dual(side == 'buy', 'Long', 'Short'), volume, setup, entryTime, currency(entryPrice, false), exitTime, currency(exitPrice, false)]
}

export function dashboardOpenPositionsTableAdapter(table, entryData, symbol, side, volume){
    return [entryData, symbol, dual(side, 'Buy', 'Sell'), currency(volume)]
}

export function detailedJournelTableAdapter(table, status, date, symbol, netPL, ROI, side){
    return [dual(status, 'Win', 'Loss'), date, symbol, currency(netPL), percentage(ROI), dual(side == 'buy', 'Long', 'Short')]
}

export function detailedJournelOptionsTableAdapter(table, type, netPL, no, cost, winrate){
    return [type, currency(netPL), no, currency(cost), <RatioBar value={winrate} positiveValue={68} negativeValue={32} />]
}

export function journalDialogTableAdapter(table, entryTime, exitTime, symbol, side, volume,netPL, ROI, RR){
    return [ entryTime, exitTime, symbol, dual(side, 'Buy', 'Sell'), volume, currency(netPL), percentage(ROI), RR+'R']
}

export function executionsTableAdapter(table, date, time, side, price, quantity, position, value, PL, editOnClick){
    return [date, time, dual(side == 'buy', 'Buy', 'Sell'), currency(price, false), quantity, position, currency(value, false), currency(PL), iconBtn(faTrash, () => table.remove(key)), iconBtn(faEdit, editOnClick)]
}

export function instituteGroupTable(table, sNo, name, winrate, profitFactor){
    return [sNo, name, percentage(winrate), profitFactor+'R']
}

export function instituteAdminTableAdapter(table, sNo, name, score, profitFactor,  winrate, maxProfit, maxLoss, winrate2, totalPL){
    return [sNo, name, score, profitFactor+'R', percentage(winrate), currency(maxProfit), currency(maxLoss), percentage(winrate2), currency(totalPL)]
}

export function institutePage1TableAdapter(table, sNo, name, rules){
    return [sNo, name, 
        <div className={classNames("px-2 py-1 flex rounded justify-between w-28", rules>0?'bg-green-500/25':'bg-red-500/25')}>
            <div>{rules} applied</div>
            <IconBtn icon={faEdit}/>
        </div>
    ]
}

export function instituteRuelsTableAdapter(table, sNo, rule, value){
    return [sNo, rule, value, 
        <div className='flex space-x-4 justify-center'>
            <IconBtn icon={faTrash}/>
            <IconBtn icon={faEdit}/>
        </div>
    ]
}

export function savedCompareTableAdapter(table, name, desc){
    return [ name, secondaryBtn('Edit', ()=>table.props.editDialog.current.show()), desc, secondaryBtn('View'), secondaryBtn('View'), primarybtn('Apply')]
}

export function popularCompareTableAdapter(table, name, desc){
    return [name, desc, secondaryBtn('View'), secondaryBtn('View'), primarybtn('Apply')]
}

export function portfolioSettingsTableAdapter(table, name, value, change, trades, lastAdjustment, adjustment){
    return [name, currency(value), percentage(change), trades, currency(lastAdjustment), iconBtn(faSliders, () => table.props.adjustmentsDialog.current.show()), iconBtn(faTrash)]
}

export function referSettingsTableAdapter(table, no, name, status, referal, expiration){
    return [no, name, status, currency(referal), expiration, checkbox('')]
}

export function withdrawalsSettingsTableAdapter(table, no, date, time, amount){
    return [no, date, time, currency(amount)]
}

export function commissionSettingsTableAdapter(table, brocker, segment){
    return [brocker, segment, 
        <div className="flex space-x-2 items-center">
            <div>Maunal commisions & fees</div>
            <IconBtn icon={faPenToSquare} onClick={()=>table.props.commissionsDialog.current.show()}/>
            <SwitchBtn toggle/>
            <div>Auto detect</div>
        </div>
        ]
}

export function adjustmentsDialogTableAdapter(table, ...items){
    return [...items, iconBtn(faTrash)]
}

export function instituteSettingsTableAdapter(table, institute, group){
    return [institute, group, iconBtn(faPersonWalkingArrowRight)]
}