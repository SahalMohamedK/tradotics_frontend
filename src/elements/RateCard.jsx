import React from 'react'
import Card from '../components/Card'
import Icon from '../components/Icon'
import RatioBar from '../components/RatioBar'

export default function RateCard({className, icon, label, positiveValue = 0, negativeValue = 0, value = 0}) {
  return (
    <Card className={className}>
      <div className='flex flex-col h-full'>
        <div className='flex items-center mb-2 space-x-2'>
          <Icon className='primary-material' icon={icon} size='sm' box/>
          <div className='font-bold text-sm'>{label}</div>
        </div>
        <div className='mt-auto mx-auto font-bold text-sm'>{value}%</div>
        <RatioBar positiveValue={positiveValue} negativeValue={negativeValue} />
      </div>
    </Card>
  )
}
