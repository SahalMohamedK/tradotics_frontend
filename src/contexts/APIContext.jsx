import React, { useContext, useRef } from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../config";

export const APIContext = React.createContext()

export function useAPI(){
    return useContext(APIContext)
}

export default function APIProvider({children}) {
    const [isSigned, setIsSigned] = useState()
    const [isFirstSigned, setIsSFirstSigned] = useState()
    const [user, setUser] = useState({})

    useEffect(() => {
        getUser().then((response) => {
            setIsSigned(true)
            setUser(response.data)
            setIsSFirstSigned(false)
        }).catch((err) => {
            if(err.response && err.response.status === 404){
                setIsSFirstSigned(true)
                setIsSigned(true)
                setUser({})
            }else{
                setIsSFirstSigned(false)
                setIsSigned(false)
                setUser({})
            }
        })
    }, [])
    
    function getToken(){
        return localStorage.getItem('auth_token')
    }

    function getConfig(){
        return {headers: { Authorization: `Basic ${getToken()}` }}
    }

    function signup(email, password){
        return axios.post(API_URL+'/account/register/', {email, password})
    }

    function signin(email, password){
        return new Promise((resolver, reject) => {
            axios.post(API_URL+'/account/login/', {email, password}).then((response) => {
                if(response.data.token){
                    localStorage.setItem('auth_token', btoa(email + ':' + password))
                    getUser().then((response) => {
                        setIsSigned(true)
                        setUser(response.data)
                        setIsSFirstSigned(false)
                    }).catch((err) => {
                        if(err.response && err.response.status === 404){
                            setIsSFirstSigned(true)
                            setIsSigned(true)
                            setUser({})
                        }else{
                            setIsSFirstSigned(false)
                            setIsSigned(false)
                            setUser({})
                        }
                    })
                    resolver(response)
                }
            }).catch((err) => {
                setIsSigned(false)
                reject(err)
            })
        })
    }

    function signout(){
        localStorage.removeItem('auth_token')
        setUser({})
        setIsSigned(false)
    }

    function getUser(){
        return axios.get(API_URL+'/account/profile/', getConfig())
    }

    function updateUser(data){
        let body = new URLSearchParams(data)
        return new Promise((resolver, reject) => {
            axios.post(API_URL+'/account/profile/', body, getConfig()).then(response => {
                setUser({...user, ...data})
                resolver(response)
            }).catch(reject)
        })
    }

    function getBrockers(){
        return axios.get(API_URL+'/brockers')
    }

    function getBrockerDetails(id){
        return axios.get(API_URL+'/brocker/'+id)
    }

    function addEarlyAccessUser(data){
        return axios.post(API_URL+'/early-access', data, {headers: {'Content-Type': 'multipart/form-data'}})
    }
    
    const value = {
        signup,
        signin,
        signout,
        getUser,
        updateUser,
        getBrockers,
        getBrockerDetails,
        addEarlyAccessUser,
        user,
        isFirstSigned,
        isSigned
    }

  return (
    <APIContext.Provider value={value}>
        {children}
    </APIContext.Provider>
  )
}

