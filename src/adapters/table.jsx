import { faDownload, faEdit, faPenToSquare, faPersonWalkingArrowRight, faSliders, faTrash } from "@fortawesome/free-solid-svg-icons";
import IconBtn from "../components/IconBtn";
import { classNames, hasValue, round} from "../utils";
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
    return <div className={classNames('text-xs font-bold rounded py-0.5 px-1', data?'bg-green-500/25 text-green-500':'bg-red-500/25 text-red-500')}>
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

export function addTradeHistoryTableAdapter(table, data){
    return [
        data.brocker ? data.brocker.name: '-', 
        data.portfolio ? data.portfolio.name: '-', 
        ['Import', 'Sync', 'Manual'][data.type], 
        dateTime(data.created), 
        data.no_executions, 
        data.no_trades, 
        iconBtn(faDownload, () => table.props.onDownload(data.pk)), 
        iconBtn(faTrash, () => table.props.onDelete(data.pk))
    ]
}

export function dashboardTableAdapter(table, n, trade){
    return [
        n,
        dual(trade.status, 'Win', 'Loss'), 
        trade.entryDate, 
        trade.symbol, 
        currency(trade.netPnl), 
        percentage(trade.roi), 
        dual(trade.tradeType, 'Long', 'Short'), 
        trade.quantity, 
        trade.entryTime, 
        currency(trade.entryPrice, false), 
        trade.exitTime, 
        currency(trade.exitPrice, false)
    ]
}

export function dashboardOpenPositionsTableAdapter(table, entryData, symbol, side, volume){
    return [entryData, symbol, dual(side, 'Buy', 'Sell'), currency(volume)]
}

export function detailedJournelTableAdapter(table,n, trade){
    return [
        n,
        dual(trade.status, 'Win', 'Loss'), 
        trade.entryDate, 
        trade.symbol, 
        currency(trade.netPnl), 
        percentage(trade.roi), 
        dual(self.tradeType == 'buy', 'Long', 'Short')
    ]
}

export function detailedJournelOptionsTableAdapter(table, type, netPL, no, cost, winrate){
    return [
        type, 
        currency(netPL), 
        no, 
        currency(cost), 
        <RatioBar 
            value={0} 
            positiveValue={100*winrate[0]/(winrate[0]+winrate[1])} 
            negativeValue={100*winrate[1]/(winrate[0]+winrate[1])} />
    ]
}

export function journalDialogTableAdapter(table, trade){
    return [
        trade.entryTime, 
        trade.exitTime, 
        trade.symbol, 
        dual(trade.tradeType, 'Long', 'Short'), 
        trade.quantity, 
        currency(trade.netPnl), 
        percentage(trade.roi), 
        '0R'
    ]
}

export function executionsTableAdapter(table, n, order){
    return [
        n,
        order.tradeDate, 
        order.executionTime, 
        dual(order.tradeType == 'buy', 'Buy', 'Sell'), 
        currency(order.price, false), 
        order.quantity, 
        round(order.price * order.quantity, 2), 
        currency(0, false), 
        currency(0), 
        iconBtn(faTrash, () => table.props.onDelete(order)), 
        iconBtn(faEdit, () => table.props.onEdit(order))
    ]
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

export function savedCompareTableAdapter(table, data){
    return [data.name, secondaryBtn('Edit', () => table.props.editDialog.current.show()), data.desc, secondaryBtn('View'), secondaryBtn('View'), primarybtn('Apply')]
}

export function popularCompareTableAdapter(table, data){
    return [data.name, data.desc, secondaryBtn('View'), secondaryBtn('View'), primarybtn('Apply')]
}

export function portfolioSettingsTableAdapter(table, portfolio){
    return [
        portfolio.name, 
        currency(portfolio.value), 
        percentage(0), 
        0, 
        currency(portfolio.lastValue), 
        iconBtn(faSliders, () => table.props.onAdjustment(portfolio)), 
        iconBtn(faEdit, () => table.props.onEdit(portfolio)),
        iconBtn(faTrash, () => table.props.onDelete(portfolio))]
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

export function adjustmentsDialogTableAdapter(table, entry){
    return [
        ['Deposit'][entry.type],
        entry.value,
        dateTime(entry.date),
        entry.desc,
        iconBtn(faTrash)
    ]
}

export function instituteSettingsTableAdapter(table, institute, group){
    return [institute, group, iconBtn(faPersonWalkingArrowRight)]
}