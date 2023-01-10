import React from 'react'
import Spinner from './Spinner'

export default function Button({children, className, onClick, disabled, loading = false}) {
  return (
    <button type='button' className={className} onClick={onClick} 
        disabled={disabled || loading}>
        <Spinner className='mr-2' show={loading}/> {children}
    </button>
  )
}
