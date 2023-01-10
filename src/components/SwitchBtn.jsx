import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '../utils'
import { useEffect } from 'react'

export default function SwitchBtn({srText = '', toggle = false, onChange = () => {}}) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    onChange(enabled)
  }, [enabled])
  
  return (
    <Switch checked={enabled} onChange={setEnabled} 
        className={classNames(enabled && !toggle ? 'bg-indigo-600' : 'bg-secondary-900', 'relative inline-flex h-5 w-10 items-center rounded-full')}>
      <span className="sr-only">{srText}</span>
      <span className={classNames(enabled ? 'translate-x-6' : 'translate-x-1', 'inline-block h-3 w-3 transform rounded-full bg-white transition')}/>
    </Switch>
  )
}
