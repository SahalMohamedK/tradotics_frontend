import React, { useState } from 'react'
import { classNames } from '../utils'
import {Transition} from '@headlessui/react'

export default function Carousel({className, imgs=[]}) {
    const [curImg, setCurImg] = useState(0)

    return (<>
        <div className={className}>
            {imgs.map((src, i) => 
                <Transition key={i} enter='duration-200' enterFrom='opacity-0' enterTo='opacity-100'
                    leave='duration-200' leaveFrom='opacity-100' leaveTo='opacity-0' show={curImg === i}>
                        <img src={src} alt={"Carousel image "+i} />
                    </Transition>
            )}
        </div>
        <div className='flex justify-center mt-4 space-x-2'>
            {imgs.map((_, i) => 
                <div key={i} className={classNames('circle cursor-pointer !h-3 !w-3', curImg === i? 'primary-material': 'bg-secondary-700 material')} 
                    onClick={() => setCurImg(i)}></div>
            )}
        </div>
    </>)
}
