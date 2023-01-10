import { faCircleArrowLeft, faCircleArrowRight, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useState } from 'react'
import Card from '../components/Card'
import IconBtn from '../components/IconBtn'
import { DAYS, MONTHS } from '../libs/consts'
import { classNames } from '../utils'

function SmallCalendar({year, month, markers = {}}){
  function getCalender(m, y){
        let msd = new Date(y, m, 1).getDay();
        let med = new Date(y, m+1, 0).getDate();
        let pmed = new Date(y, m,0).getDate()-msd;
        let rows = [];
        for(let i = 0 ; i<6; i++){
            let cols = [];
            for(let j = 0; j<7; j++){
                let n = i*7+j+1;
                let t = n;
                let nm = m;
                let ny = y;
                let _class = 'bg-secondary-700';
                if(n<=msd){
                    n = pmed+n;
                    if(m == 0){
                        nm = 11;
                        ny = y-1;
                    }else{
                        nm = m-1;
                    }
                    _class = 'bg-secondary-800';
                    t = ''
                }else if(n>msd && (n-msd)<=med){
                  n = n-msd;
                  t = n;
                }else{
                    if(m == 1){
                        nm = 0;
                        ny = y+1;
                    }else{
                        nm = m+1;
                    }
                    n = n-(med+msd);
                    _class = 'bg-secondary-800'
                    t = ''
                }

                let marker = markers[`${n}-${nm+1}-${ny}`]
                let amount = 0
                let trades = 0
                if(marker && t!=''){
                    amount = marker[0]
                    trades = marker[1]
                    if(amount>=0){
                        _class =  'text-white green-material z-10'
                    }else{
                        _class =  'text-white red-material z-10'
                    }
                }
                cols.push(<div key={j} className={classNames('rounded-lg relative cursor-pointer h-7 md:w-full md:min-w-12 duration-200', _class)} 
                    onClick={() => this.setDate(new Date(ny, nm, n))}>
                    <span className='center duration-200'>{t}</span>
                </div>);
            }
            rows.push(<div key={i} className='flex justify-between space-x-1 my-1 text-sm'>{cols}</div>)
        }
        return rows;

    }

  return (
    <Card>
      <div className='flex items-center font-bold justify-between'>
        <div>{MONTHS[month]}</div>
        <IconBtn icon={faUpRightAndDownLeftFromCenter} size='sm'/>
      </div>
      <div className='flex justify-between my-4 text-sm text-secondary-500'>
        {DAYS.map((day, i) => 
          <div key={i} className='relative' style={{width:50}}><span className='center'>{day.slice(0,2)}</span></div>
        )}
      </div>
      <div>
        {getCalender(month, year)}
      </div>
    </Card>
  )
}

export default function CalendarViews() {
  const [year, setYear] = useState((new Date()).getFullYear())

  return (
    <div className='mt-16'>
        <Card>
            <div className='w-fit mx-auto flex items-center space-x-5'>
                <IconBtn icon={faCircleArrowLeft}/>
                <div>2022</div>
                <IconBtn icon={faCircleArrowRight}/>
            </div>
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          {MONTHS.map((_, month) => 
            <SmallCalendar key={month} year={year} month={month} markers={{'30-1-2022': [40, 3], '12-12-2022':[-90, 9]}}/>
          )}
        </div>
    </div>
  )
}
