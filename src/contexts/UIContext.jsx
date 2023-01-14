import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../components/Spinner";
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
                    <Spinner className='h-10 w-10 mx-auto'/>
                    <div className='mt-2 font-bold text-lg'>Loading...</div>
                </div>
            }
            <div className={classNames("h-full", isLoading?'hidden':'')}>{children}</div>
        </div>
    </UIContext.Provider>
  )
}

