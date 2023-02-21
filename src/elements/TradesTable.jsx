import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardTableAdapter } from '../adapters/table'
import Card from '../components/Card'
import Table from '../components/Table'
import { useAPI } from '../contexts/APIContext'
import { useFilter } from '../contexts/FilterContext'
import { useUI } from '../contexts/UIContext'
import Pagination from './Pagination'

export default function TradesTable({total = 0, headers, adapter, className}) {
    const [loading, setLoading] = useState(false)
    
    let table = useRef()

    const { isSigned, isFirstSigned, getTradeTable } = useAPI()
    const { filters } = useFilter()
    const { toast } = useUI()
    const navigate = useNavigate()

    function showTrades(start = 0, size = 25) {
        if (isSigned && !isFirstSigned) {
            setLoading(true)
            table.current.loading(true)
            table.current.removeAll()
            let j = 0
            getTradeTable(filters, start, size).then(response => {
                for (var i in response.data.trades) {
                    j+=1
                    let trade = response.data.trades[i]
                    table.current.add(start+j, trade)
                }
            }).catch(err => {
                toast.error("Somthing went wrong", "Trade table is not loaded.")
            }).finally(() => {
                table.current.loading(false)
                setLoading(false)
            })
        }
    }

    useEffect(() => {
        if (isSigned && !isFirstSigned) {
            showTrades()
        }
    }, [filters, isSigned, isFirstSigned])

    return (
        <Card className={className}>
            <div className='flex flex-col h-full'>
                <div className='overflow-auto grow'>
                    <Table
                        ref={table}
                        headers={headers}
                        adapter={adapter}
                        onClick={(items) => { navigate('/trade-analytics/' + items[1].id)}}/>
                </div>
                <div className='mt-2'>
                    <Pagination 
                        className='w-fit mx-auto' 
                        limit={total} 
                        onChange={showTrades} 
                        loading={loading} />
                </div>
            </div>
        </Card>
    )
}
