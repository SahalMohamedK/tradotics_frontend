import { faPlusCircle, faUsers } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect } from 'react'
import { institutePage1TableAdapter, instituteRuelsTableAdapter, simpleTableAdapter } from '../adapters/table'
import Card from '../components/Card'
import IconBtn from '../components/IconBtn'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import { useUI } from '../contexts/UIContext'

export default function InstitutePage1() {
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
      <div className='md:flex grow'>
        <Card className='w-full md:w-1/2'>
            <Table adapter={institutePage1TableAdapter} headers={['S.No', 'Name', 'Rules']} data={[
                [1, 'Sahal Mohamed', 3],
                [2, 'Sahal Mohamed', 0],
                [3, 'Sahal Mohamed', 3],
                [4, 'Sahal Mohamed', 3],
            ]}/>
        </Card>
        <Card className='w-full md:w-1/2 '>
            <div className='flex items-center'>
                <div className='text-lg font-bold'>Sahal Mohamed</div>
                <div className='bg-green-500/25 rounded-lg px-2 py-1 text-sm ml-auto'>3 applied</div>
            </div>
            <Table adapter={instituteRuelsTableAdapter} headers={['S.No', 'Rule', 'Value', '']} data={[
                [1, 'Max no of trades per day', 5],
                [2, 'Max loss per trade', '$2500'],
                [3, 'Min no of trades per month', 30],
            ]}/>
            <div className='flex justify-end items-center'>
                <div className='text-xs mr-1'>Add Rule</div>
                <IconBtn icon={faPlusCircle} box/>
            </div>
        </Card>
      </div>
    </div>
  )
}
