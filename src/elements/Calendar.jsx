import { faCalendarDay, faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react'
import IconBtn from '../components/IconBtn';
import SelectField from '../components/SelectField'
import { addItem, classNames, hasValue, strDate, zFill } from '../utils';
import { MONTHS, YEARS } from '../libs/consts'

export class Calendar extends Component {
    constructor(props){
        super(props);

        this.state = {
            showDate: new Date(),
            selectedDate: new Date(),
            markers: props.markers
        }

        this.prevMonth = this.prevMonth.bind(this)
        this.nextMonth = this.nextMonth.bind(this)
        this.setDate = this.setDate.bind(this)
        this.setMonth = this.setMonth.bind(this)
        this.setYear = this.setYear.bind(this)
    }

    setMarkers(markers){
        this.setState({markers})
        let start = Object.keys(markers)[0]
        if(start){
            this.setDate(start)
        }
        
    }

    prevMonth(){
        let date = this.state.showDate;
        let year = date.getFullYear();
        let month = date.getMonth();
        if(month == 0){
            month = 11;
            year -= 1;
        }else{
            month-=1;
        }
        this.setState({showDate: new Date(year, month)});
    }

    nextMonth(){
        let date = this.state.showDate;
        let year = date.getFullYear();
        let month = date.getMonth();
        if(month == 11){
            month = 0;
            year += 1;
        }else{
            month+=1;
        }
        this.setState({showDate: new Date(year, month)});
    }

    setDate(date){
        if(typeof date == 'string'){
            date = new Date(date)
        }
        this.setState({selectedDate: date, showDate: date});
        if(this.props.onSetDate){
            this.props.onSetDate(date);
        }
    }

    setMonth(month){
        let newDate = this.state.selectedDate;
        newDate.setMonth(month)
        this.setDate(newDate)
    }
    
    setYear(year){
        let newDate = this.state.selectedDate;
        newDate.setYear(1990+year)
        this.setDate(newDate)
    }

    getCalender(m, y){
        let cur = this.state.selectedDate;
        if(cur.getMonth() == m && cur.getFullYear() == y){
            cur = cur.getDate();
        }
        let msd = new Date(y, m, 1).getDay();
        let med = new Date(y, m+1, 0).getDate();
        let pmed = new Date(y, m,0).getDate()-msd;
        let rows = [];
        for(let i = 0 ; i<6; i++){
            let cols = [];
            for(let j = 0; j<7; j++){
                let n = i*7+j+1;
                let nm = m;
                let ny = y;
                let _class = 'material bg-secondary-700 hover:bg-secondary-600 hover:text-white';
                if(n<=msd){
                    n = pmed+n;
                    if(m == 0){
                        nm = 11;
                        ny = y-1;
                    }else{
                        nm = m-1;
                    }
                    _class = 'material bg-secondary-800 text-gray-500 hover:bg-secondary-600 hover:text-white';
                }else if(n>msd && (n-msd)<=med){
                    n = n-msd;
                    if(n == cur){
                        _class = 'primary-material'
                    }
                }else{
                    if(m == 1){
                        nm = 0;
                        ny = y+1;
                    }else{
                        nm = m+1;
                    }
                    n = n-(med+msd);
                    _class = 'material bg-secondary-800 text-gray-500 hover:bg-secondary-600 hover:text-white';
                }

                let marker = hasValue(this.state.markers, {})[`${ny}-${zFill(nm + 1, 2)}-${zFill(n, 2)}`]
                let amount = 0
                let trades = 0
                if(marker){
                    amount = marker[0]
                    trades = marker[1]
                    if(amount>=0){
                        _class =  'text-white '+ (m === nm?'green-material group':'bg-green-500/30')
                    }else{
                        _class =  'text-white '+ (m === nm?'red-material group':'bg-red-500/30')
                    }
                }
                cols.push(<div key={j} className={classNames('rounded-lg relative cursor-pointer w-full h-auto duration-200', _class)} 
                    onClick={() => this.setDate(new Date(ny, nm, n))}>
                        <div className={classNames('scale-0 group-hover:scale-100 duration-200 absolute bottom-[calc(100%+0.5rem)] h-center rounded-lg p-2', 
                                amount>=0?'green-material':'red-material')}>
                            <div className={classNames('absolute h-2 w-2 rotate-45 h-center bottom-[0.75rem] translate-y-[200%]', 
                                amount>=0?'bg-green-800':'bg-red-800')}></div>
                            <div>${amount}</div> 
                            <div className='whitespace-nowrap'> {trades} Trade{trades>1?'s':''}</div>
                        </div>
                        <span className='absolute right-2 top-1'>{n}</span>
                </div>);
            }
            rows.push(<div key={i} className='flex justify-between space-x-1 text-sm grow'>{cols}</div>)
        }
        return rows;

    }

    render() {
        return (
            <div className={classNames('h-full', this.props.className)}>
                <div className='flex flex-col font-medium h-full'>
                    <div className='flex items-center mb-2 pb-1 border-b border-secondary-700'>
                        <SelectField innerClassName='!py-0 px-1 mr-2' value={this.state.showDate.getMonth()} values={MONTHS}
                            onChange={this.setMonth}/>
                        <SelectField innerClassName='!py-0 px-1' value = {this.state.showDate.getFullYear()-1990} values={YEARS}
                            onChange={this.setYear}/>
                        <IconBtn className='ml-auto' icon={faCalendarDay} onClick={() => this.setDate(new Date())}  box/>
                        <IconBtn className='mx-1' icon={faChevronCircleLeft} onClick={this.prevMonth}  box/>
                        <IconBtn icon={faChevronCircleRight} onClick={this.nextMonth}  box/>
                    </div>
                    <div className='flex justify-between my-4 text-sm'>
                        <div className='relative' style={{width:50}}><span className='center'>Su</span></div>
                        <div className='relative' style={{width:50}}><span className='center'>Mo</span></div>
                        <div className='relative' style={{width:50}}><span className='center'>Tu</span></div>
                        <div className='relative' style={{width:50}}><span className='center'>We</span></div>
                        <div className='relative' style={{width:50}}><span className='center'>Th</span></div>
                        <div className='relative' style={{width:50}}><span className='center'>Fr</span></div>
                        <div className='relative' style={{width:50}}><span className='center'>Sa</span></div>
                    </div>
                    <div className='flex flex-col space-y-1 grow'>
                        {this.getCalender(this.state.showDate.getMonth(),this.state.showDate.getFullYear())}
                    </div>
                </div>
            </div>
        )
    }
}

export default Calendar