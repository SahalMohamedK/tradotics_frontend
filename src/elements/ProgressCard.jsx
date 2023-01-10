import React from 'react'
import Card from '../components/Card'
import Icon from '../components/Icon'
import ProgressBar from '../components/ProgressBar'

export default function ProgressCard({className, icon, label, value, max=10}) {
  return (
    <Card className={className}>
      <div className='flex flex-col h-full'>
        <div className='flex items-center mb-2 space-x-2'>
          <Icon className='primary-material' icon={icon} size='sm'/>
          <div className='font-bold text-sm'>{label}</div>
        </div>
        <div className='flex items-center mt-auto'>
            <ProgressBar value={value} max={max}/>
            <div className='ml-auto font-bold'><span className='text-indigo-500'>{value}</span>/{max}</div>
        </div>
      </div>
    </Card>
  )
}
