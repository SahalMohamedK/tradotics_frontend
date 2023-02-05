import React, { useContext, useRef } from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../config";

export const APIContext = React.createContext()

export function useAPI() {
    return useContext(APIContext)
}

export default function APIProvider({ children }) {
    const [isSigned, setIsSigned] = useState()
    const [isFirstSigned, setIsSFirstSigned] = useState()
    const [user, setUser] = useState({})

    useEffect(() => {
        getUser().then((response) => {
            let data = response.data
            setUser(data)
            setIsSigned(true)
            if (data.firstName == '' || data.firstName == '') {
                setIsSFirstSigned(true)
            } else {
                setIsSFirstSigned(false)
            }
        }).catch((err) => {
            setIsSFirstSigned(false)
            setIsSigned(false)
            setUser({})
        })
    }, [])

    function post(url, ...args){
        return axios.post(url, ...args)
    }

    function get(url, ...args){
        return axios.get(url, ...args)
    }

    function put(url, ...args){
        return axios.put(url, ...args)
    }

    function getToken() {
        return localStorage.getItem('auth_token')
    }

    function getAuth(headers) {
        return {
            "headers": {
                Authorization: `Token ${getToken()}`,
                'content-type': 'application/json',
                ...headers
            }
        }
    }

    function signup(data) {
        return post(API_URL + '/account/signup', data)
    }

    function signin(data) {
        return new Promise((resolver, reject) => {
            post(API_URL + '/account/signin', data).then((response) => {
                if (response.data.token) {
                    localStorage.setItem('auth_token', response.data.token)
                    getUser().then((response) => {
                        setIsSigned(true)
                        setUser(response.data)
                        setIsSFirstSigned(false)
                    }).catch((err) => {
                        if (err.response && err.response.status === 404) {
                            setIsSFirstSigned(true)
                            setIsSigned(true)
                            setUser({})
                        } else {
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

    function signout() {
        return new Promise((resolver, reject) => {
            get(API_URL + '/account/signout', getAuth()).then(response => {
                localStorage.removeItem('auth_token')
                setUser({})
                setIsSigned(false)
                resolver(response)
            }).catch(err => {
                reject(err)
            })
        })
    }

    function getUser() {
        return get(API_URL + '/account/profile', getAuth())
    }

    function updateUser(data) {
        return new Promise((resolver, reject) => {
            put(API_URL + '/account/profile', data, getAuth()).then(response => {
                setUser({ ...user, ...data })
                resolver(response)
            }).catch(reject)
        })
    }

    function getBrockers() {
        return get(API_URL + '/brockers')
    }

    function getBrockerDetails(id) {
        return get(API_URL + '/brocker/' + id)
    }

    function addEarlyAccessUser(data) {
        return post(API_URL + '/account/early-access', data, { headers: { 'content-type': 'multipart/form-data' } })
    }

    function uploadImportTrade(data) {
        return post(API_URL + '/trades/import', data, getAuth({ 'content-type': 'multipart/form-data' }))
    }

    function getFilters(){
        return post(API_URL + '/trades/filters', {}, getAuth())
    }

    function getTradeHistories(){
        return get(API_URL+'/trades/histories', getAuth())
    }

    function deleteTradeHistory(id){
        return axios.post(API_URL +'/trades/delete/histories', {'id': id}, getAuth())
    }

    function downloadTradeHistory(id){
        return new Promise((resolver, reject) => {
            get(API_URL + '/trades/history/' + id, getAuth()).then(response => {
                let filedata = response.data.file
                let filename = response.data.filename
                const url = URL.createObjectURL(new Blob([filedata], { type: 'text/plain;charset=utf-8' }))
                const link = document.createElement('a')
                link.href = url
                link.download = filename
                document.body.appendChild(link)
                link.click()
                link.remove()

                setTimeout(() => URL.revokeObjectURL(link.href), 7000);
                resolver(response)
            }).catch(err => {
                reject(err)
            })
        })
    }

    function updateTrade(trade){
        return post(API_URL+'/trade/update', {trade}, getAuth())
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
        uploadImportTrade,
        deleteTradeHistory,
        downloadTradeHistory,
        updateTrade,
        getFilters,
        getTradeHistories, 
        getAuth,
        post,
        get,
        put,
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

