import { faCircle, faLightbulb, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import Card from '../components/Card'
import Icon from '../components/Icon'
import { isEmpty } from '../utils'

function Insightes({className, items=[]}) {
  return (
    <Card className={className} innerClassName='flex flex-col'>
        <div className='flex items-center mb-2 space-x-2'>
            <Icon className='primary-material' icon={faLightbulb} size='sm'/>
            <div className='font-bold text-lg'>Insightes</div>
        </div>
        <div className='grow overflow-y-auto overflow-x-clip md:h-0 px-2 relative'>
          {items.map((item, i) => <div key={i} className='bg-secondary-800 rounded py-2 px-3 my-2 mx-auto flex duration-200 hover:bg-secondary-700 hover:scale-105'>
                    <Icon icon={faCircle} size='sm'/>
                    <div className='ml-3 text-xs'>{item}</div>
                </div>
            )}
          {isEmpty(items) && 
            <div className='center text-red-500'>
              <Icon className='mx-auto' icon={faTriangleExclamation} />
              <div className='text-sm whitespace-nowrap'>No insights are available</div>
            </div>
          }
        </div>
    </Card>
  )
}

export default Insightes