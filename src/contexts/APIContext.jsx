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

    function getToken() {
        return localStorage.getItem('auth_token')
    }

    function getConfig(headers) {
        return {
            "headers": {
                Authorization: `Token ${getToken()}`,
                'content-type': 'application/json',
                ...headers
            }
        }
    }

    function signup(data) {
        return axios.post(API_URL + '/account/signup', data)
    }

    function signin(data) {
        return new Promise((resolver, reject) => {
            axios.post(API_URL + '/account/signin', data).then((response) => {
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
            axios.get(API_URL + '/account/signout', getConfig()).then(response => {
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
        return axios.get(API_URL + '/account/profile', getConfig())
    }

    function updateUser(data) {
        return new Promise((resolver, reject) => {
            axios.put(API_URL + '/account/profile', data, getConfig()).then(response => {
                setUser({ ...user, ...data })
                resolver(response)
            }).catch(reject)
        })
    }

    function getBrockers() {
        return axios.get(API_URL + '/brockers')
    }

    function getBrockerDetails(id) {
        return axios.get(API_URL + '/brocker/' + id)
    }

    function addEarlyAccessUser(data) {
        return axios.post(API_URL + '/account/early-access', data, { headers: { 'content-type': 'multipart/form-data' } })
    }

    function uploadImportTrade(data) {
        return axios.post(API_URL + '/trades/import', data, getConfig({ 'content-type': 'multipart/form-data' }))
    }

    function getOutputTrades(data){
        return axios.post(API_URL + '/trades/output', data, getConfig())
    }

    function getFilters(){
        return axios.post(API_URL + '/trades/filters', {}, getConfig())
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
        getOutputTrades,
        getFilters,
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

