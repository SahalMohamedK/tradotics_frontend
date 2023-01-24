import { faCoins, faPercentage, faSackDollar, faSackXmark, faUsers, faZap } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import ProgressCard from '../elements/ProgressCard'
import RateCard from '../elements/RateCard'
import ValueCard from '../elements/ValueCard'
import { FORMAT } from '../libs/consts'
import Card from '../components/Card'
import { instituteAdminTableAdapter } from '../adapters/table'
import Table from '../components/Table'
import SelectField from '../components/SelectField'
import { useUI } from '../contexts/UIContext'

export default function InstituteAdmin() {

  const [tableNumber, setTableNumber] = useState()
  let table = useRef()

  const { setIsLoading } = useUI()

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <div className='pt-16 h-full flex flex-col'>
      <Card innerClassName='flex items-center mb-2'>
        <div className='circle !w-16 !h-16 bg-secondary-900'>
          <div className='center text-lg font-bold text-secondary-500'>SA</div>
        </div>
        <div className='ml-2 text-xl font-bold'>Institute</div>
        <SelectField className='ml-auto' label='Groups' icon={faUsers} values={[
          'Group 1',  'Group 2', 'Group 3', 'Group 4', 
        ]}/>
      </Card>
      <div className='flex flex-wrap'>
          <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
              label='Highest profitable trade' value={FORMAT.CURRENCY(6013.50)} trade='TATAMOTOR' date='03 Aug 2022'/>
          <ValueCard className='w-full md:w-1/5' icon={faSackXmark}
              label='Highest profitable trade' value={FORMAT.CURRENCY(-6013.50)} trade='TATAMOTOR' date='03 Aug 2022'/>
          <ValueCard className='w-full md:w-1/5' icon={faCoins}
              label='Gross P&L' value={FORMAT.CURRENCY(6013.50)} trade='TATAMOTOR' date='03 Aug 2022'/>
          <RateCard className='w-full md:w-1/5' icon={faPercentage}
              label='win ratio' value={50} positiveValue={75} negativeValue={35}/>
          <ProgressCard className='w-full md:w-1/5' icon={faZap} label='Tradotics scrore' value={8}/>
      </div>
      <div className='flex flex-wrap'>
          <ValueCard className='w-full md:w-1/5' icon={faSackDollar}
              label='Highest profitable trade' value={FORMAT.CURRENCY(6013.50)} trade='TATAMOTOR' date='03 Aug 2022'/>
          <ValueCard className='w-full md:w-1/5' icon={faSackXmark}
              label='Highest profitable trade' value={FORMAT.CURRENCY(-6013.50)} trade='TATAMOTOR' date='03 Aug 2022'/>
          <ValueCard className='w-full md:w-1/5' icon={faCoins}
              label='Gross P&L' value={FORMAT.CURRENCY(6013.50)} trade='TATAMOTOR' date='03 Aug 2022'/>
          <RateCard className='w-full md:w-1/5' icon={faPercentage}
              label='win ratio' value={50} positiveValue={75} negativeValue={35}/>
          <ProgressCard className='w-full md:w-1/5' icon={faZap} label='Tradotics scrore' value={8}/>
      </div>
      <Card className='grow'>
        <Table ref={table} headers={['S.No:','Name', 'Tradotics score', 'Profit factor', 'winrate', 'Max profit', 'Max loss', 'Winrate', 'Total P&L']}
              adapter={instituteAdminTableAdapter} onChange={(data) => setTableNumber(data.length)}
              data = {[
                  [1, 'Sahal Mohamed', 7.8, 3.2, 65, 'Short', 40, 4058.50, 1203.00, 65, 1204.00 ],
                  [1, 'Sahal Mohamed', 7.8, 3.2, 65, 'Short', 40, 4058.50, 1203.00, 65, 1204.00 ],
                  [1, 'Sahal Mohamed', 7.8, 3.2, 65, 'Short', 40, 4058.50, 1203.00, 65, 1204.00 ],
              ]}/>
      </Card>
    </div>
  )
}
