import React from 'react'
import Card from '../components/Card'
import Icon from '../components/Icon'

export default function ValueCard({className, icon, label, value, trade, date}) {
  return (
    <Card className={className}>
      <div className='group h-full flex flex-col'>
          <div className='flex items-center space-x-2 mb-2'>
            <Icon className='primary-material' icon={icon} size='sm' box/>
            <div className='font-bold text-sm'>{label}</div>
          </div>
          <div className='flex justify-between items-end mt-auto'>
            <div className='text-sm font-bold duration-200'>{value}</div>
            <div className='flex md:block md:scale-0 md:group-hover:scale-100 duration-200 text-xs text-secondary-500'>
              <div className='md:mb-1 mr-2 md:mr-0'>{trade}</div>
              <div>{date}</div>
            </div>
          </div>
      </div>
    </Card>
  )
}
