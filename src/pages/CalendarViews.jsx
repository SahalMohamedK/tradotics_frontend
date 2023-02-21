import { faCircleArrowLeft, faCircleArrowRight, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import IconBtn from '../components/IconBtn'
import Spinner from '../components/Spinner'
import { API_URL } from '../config'
import { useAPI } from '../contexts/APIContext'
import { useFilter } from '../contexts/FilterContext'
import { useUI } from '../contexts/UIContext'
import { DAYS, MONTHS } from '../libs/consts'
import { classNames, round, zFill } from '../utils'

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
                let _class = 'bg-secondary-700 material';
                if(n<=msd){
                    n = pmed+n;
                    if(m == 0){
                        nm = 11;
                        ny = y-1;
                    }else{
                        nm = m-1;
                    }
                    _class = 'bg-secondary-800 material';
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
                    _class = 'bg-secondary-800 material'
                    t = ''
                }
              let marker = markers[`${ny}-${zFill(nm + 1, 2)}-${zFill(n, 2)}`]
              let trades = 0
              let amount = 0
                if(marker && t != ''){
                  trades = marker[1]
                  amount = marker[0]
                  if(amount>=0){
                      _class =  'text-white green-material z-10 group'
                  }else{
                      _class =  'text-white red-material z-10 group'
                  }
                }
                cols.push(<div key={j} className={classNames('rounded-lg relative cursor-pointer h-7 md:w-full md:min-w-12 duration-200', _class)} >
                    <div className={classNames('scale-0 group-hover:scale-100 duration-200 absolute bottom-[calc(100%+0.5rem)] h-center rounded-lg p-2',
                      amount >= 0 ? 'green-material' : 'red-material')}>
                      <div className={classNames('absolute h-2 w-2 rotate-45 h-center bottom-[0.75rem] translate-y-[200%]',
                        amount >= 0 ? 'bg-green-800' : 'bg-red-800')}></div>
                      <div>${round(Math.abs(amount), 2)}</div>
                      <div className='whitespace-nowrap'> {trades} Trade{trades > 1 ? 's' : ''}</div>
                    </div>
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
  const [dataLoading, setDataLoading] = useState(true)
  const [markers, setMarkers] = useState({})

  const { setLoading } = useUI()
  const { isSigned, isFirstSigned, post, getAuth } = useAPI()
  const navigate = useNavigate()
  const { filters } = useFilter()

  function showData(){
    post(API_URL + '/views/calenders', filters, getAuth()).then(response => {
      let data = response.data
      setMarkers(data.pnlByDates)
      setDataLoading(false)
      setYear(parseInt(Object.keys(data.pnlByDates)[0].substring(0, 4)))
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (isSigned && !isFirstSigned) {
      setDataLoading(true)
      showData()
    }
  }, [filters, isSigned, isFirstSigned])

  useEffect(() => {
    setLoading(true)
    if (isSigned === false) {
      navigate('/signin')
    } else if (isSigned && isFirstSigned) {
      navigate('/settings')
      toast.info('Setup your profile', 'First you need to setup user user profile details.')
    } else if (isSigned && isFirstSigned === false) {
      setLoading(false)
    }
  }, [isSigned, isFirstSigned])

  return (
    <>
      { dataLoading &&
          <div className='h-full pt-16 relative'>
              <div className='center'>
                  <Spinner className='w-10 h-10 mx-auto'/>
                  <div>Loading data...</div>
              </div>
          </div>
      }
    <div className='mt-16'>
        <Card>
            <div className='w-fit mx-auto flex items-center space-x-5'>
              <IconBtn icon={faCircleArrowLeft} onClick={() => setYear(year-1)}/>
              <div>{year}</div>
              <IconBtn icon={faCircleArrowRight} onClick={() => setYear(year + 1)} />
            </div>
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          {MONTHS.map((_, month) => 
            <SmallCalendar key={month} year={year} month={month} markers={markers}/>
          )}
        </div>
    </div>
    </>
  )
}
