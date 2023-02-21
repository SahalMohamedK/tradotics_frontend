import { faX, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useRef, useState } from 'react'
import { useEffect } from 'react'
import { classNames, isEmpty } from '../utils'
import Icon from './Icon'
import IconBtn from './IconBtn'

function TagsField({ id, className, label, icon, values = [], onAdd = () => { }, onRemove = () => { }, onBlur = () =>{}, onFocus = () => {} }) {
    const [tags, setTags] = useState([])
    const [curTag, setCurTag] = useState()

    let tagInput = useRef()

    function add(tag) {
        setTags((prev) => [...prev, tag])
        onAdd(tag)
    }

    function remove(i) {
        setTags((prev) => prev.filter((tag, a) => a !== i))
        onRemove(i)
    }

    function keyHandler(e) {
        if (e.code === 'Enter') {
            e.preventDefault();
            if (curTag !== '') {
                add(curTag)
                setCurTag('')
                tagInput.current.value = ''
            }
        } else if (e.code === 'Backspace') {
            if (curTag === '' && tags.length !== 0) {
                remove(tags.length - 1)
            }
        }
    }

    useEffect(() => {
        if(!isEmpty(values)){
            setTags(values)
        }
    }, [values])
    return (
        <Menu as="div" className={classNames("relative", className)}>
            {({ open }) => (<>
                <div>
                    {label && <label htmlFor={id} className="mb-2 text-sm">
                        {label}
                    </label>}
                    <Menu.Button className={classNames(
                        'material rounded-lg flex items-center w-full border px-2 py-1 duration-200 bg-secondary-800',
                        open ? 'border-indigo-500' : 'border-indigo-500/0')} 
                        onBlur={(e) => {
                            onBlur(e)
                            if (tagInput.current){
                                tagInput.current.focus()
                            }
                        }} 
                        onFocus={onFocus}>
                        <Icon className={open ? 'text-indigo-500' : 'text-secondary-600'} icon={icon} size='sm' />
                        {tags.slice(0, 2).map((tag, i) =>
                            <div key={i} className='bg-secondary-700 px-2 py-1 text-sm rounded mr-1 flex items-center'>
                                {tag}
                                <div className='ml-1'>
                                    <IconBtn icon={faXmarkCircle} size='sm' onClick={() => remove(i)} />
                                </div>
                            </div>
                        )}
                        {tags.length > 2 &&
                            <div className='bg-secondary-700 px-2 whitespace-nowrap py-1 text-sm rounded mr-1 flex items-center'>View more</div>
                        }
                        <div className='font-bold ml-auto'>{tags.length}</div>
                    </Menu.Button>
                </div>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="material absolute z-10 min-w-full  mt-1 origin-top-right rounded overflow-hidden bg-secondary-800 focus:outline-none">
                        <div className='p-2 w-full'>
                            <div className='flex flex-wrap w-full'>
                                {tags.map((tag, i) =>
                                    <div key={i} className='bg-secondary-700 px-2 py-1 text-sm rounded mb-1 mr-1 flex items-center'>
                                        {tag}
                                        <div className='ml-1'>
                                            <IconBtn icon={faXmarkCircle} size='sm' onClick={() => remove(i)} />
                                        </div>
                                    </div>
                                )}
                                <input ref={tagInput} className='bg-secondary-800 text-sm focus:outline-none px-1 rounded' placeholder='Add tags'
                                    onKeyDown={keyHandler} onChange={(e) => setCurTag(e.target.value)} />
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </>)}
        </Menu>
    )
}

export default TagsField

