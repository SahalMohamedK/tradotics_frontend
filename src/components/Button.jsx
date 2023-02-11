import React from 'react'
import { Link } from 'react-router-dom'
import Spinner from './Spinner'

export default function Button({children, className, to, onClick, disabled, loading = false}) {
  return (<>
    {to && 
      <Link to={to} className={className} onClick={onClick}
        disabled={disabled || loading}>
        <Spinner className='h-4 w-4 mr-2' show={loading} /> {children}
      </Link>
    }
    {!to && 
      <button type='button' className={className} onClick={onClick} 
          disabled={disabled || loading}>
          <Spinner className='h-4 w-4 mr-2' show={loading}/> {children}
      </button>
    }
  </>)
}
