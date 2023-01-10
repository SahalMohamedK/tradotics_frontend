import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { classNames } from '../utils'
import Icon from './Icon'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

export default function Collapse({children, className, label, icon}) {
  return (
    <Disclosure>
      {({open}) => (<>
        <Disclosure.Button className={classNames('text-left material text-sm rounded-lg w-96 flex items-center px-2 py-1 border duration-200 bg-secondary-800', open?'border-indigo-500':'border-indigo-500/0', className)}>
            <Icon className={open?'text-indigo-500':'text-secondary-600'} icon={icon} size='sm'/>
            {label}
            <Icon className={classNames('duration-200 ml-auto',open?'rotate-180':'')} icon={faAngleDown} size='sm'/>
        </Disclosure.Button>
        <Transition enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0">
            <Disclosure.Panel>
                {children}
            </Disclosure.Panel>
        </Transition>
      </>)}
    </Disclosure>
  )
}
