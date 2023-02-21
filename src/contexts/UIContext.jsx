import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../components/Spinner";
import Toast from '../components/Toast'
import Dialog from '../components/Dialog'
import { classNames } from "../utils";
import Button from "../components/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const UIContext = React.createContext()

export function useUI(){
    return useContext(UIContext)
}

export default function UIProvider({children}) {
    const [loading, setLoading] = useState(true)
    const [confirmData, setConfirmData] = useState({})
    const [extraData, setExtraData] = useState({})

    let confirmDialog = useRef()
    let toastRef = useRef()

    function showConfirmDialog(title, icon, sub, positiveLabel, positiveFunc){
        setConfirmData({ sub: sub, positiveLabel: positiveLabel, positiveFunc: positiveFunc })
        confirmDialog.current.show(title, icon)
    }

    const value = {
        setLoading,
        loading,
        dialog:{
            confirm: showConfirmDialog
        },
        toast: {
            success: (...args) => toastRef.current.success(...args),
            info: (...args) => toastRef.current.info(...args),
            error: (...args) => toastRef.current.error(...args),
            warning: (...args) => toastRef.current.warning(...args),
            hide: (...args) => toastRef.current.hide(...args)
        },
        setExtraData
    }

  return (
    <UIContext.Provider value={value}>
        <Dialog className='w-96' ref={confirmDialog} title='Confirmation'>
            {confirmData.sub}
              <div className='flex space-x-2 border-t border-secondary-800 pt-3 mt-3'>
                  <Button className='ml-auto primary-btn' onClick={() => {
                        confirmData.positiveFunc()
                        confirmDialog.current.hide()
                    }}>{confirmData.positiveLabel}</Button>
                  <Button className='secondary-btn' onClick={() => confirmDialog.current.hide()}>Cacel</Button>
            </div>
        </Dialog>
        <div className='h-screen relative'>
            <Toast ref={toastRef}/>
            {loading && 
                <div className='center'>
                    <Spinner className='h-10 w-10 mx-auto'/>
                    <div className='mt-2 font-bold text-lg'>Loading...</div>
                </div>
            }
            <div className={classNames("h-full", loading?'hidden':'')}>{children}</div>
        </div>
    </UIContext.Provider>
  )
}

