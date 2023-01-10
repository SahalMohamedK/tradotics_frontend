import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Toast from '../components/Toast'
import { classNames } from "../utils";

export const UIContext = React.createContext()

export function useUI(){
    return useContext(UIContext)
}

export default function UIProvider({children}) {
    const [isLoading, setIsLoading] = useState(true)

    let toastRef = useRef()

    const value = {
        setIsLoading,
        isLoading,
        toast: {
            success: (...args) => toastRef.current.success(...args),
            info: (...args) => toastRef.current.info(...args),
            error: (...args) => toastRef.current.error(...args),
            warning: (...args) => toastRef.current.warning(...args),
            hide: (...args) => toastRef.current.hide(...args)
        }
    }

  return (
    <UIContext.Provider value={value}>
        <div className='h-screen relative'>
            <Toast ref={toastRef}/>
            {isLoading && 
                <div className='center'>
                    <svg className="animate-spin mx-auto h-10 w-10 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className='mt-2 font-bold text-lg'>Loading...</div>
                </div>
            }
            <div className={classNames("h-full", isLoading?'hidden':'')}>{children}</div>
        </div>
    </UIContext.Provider>
  )
}

