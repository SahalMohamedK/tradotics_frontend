import { faCirclePlus, faEdit, faPlay } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import IconBtn from '../components/IconBtn'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Table from '../components/Table'
import { API_URL } from '../config'
import { useAPI } from '../contexts/APIContext'
import { useUI } from '../contexts/UIContext'
import Pagination from './Pagination'

export default function ExecutionsTable({ className, tradeId, total = 0, headers, adapter}) {
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState({})
    const { isSigned, isFirstSigned, post, getAuth } = useAPI()
    const { toast } = useUI()

    let table = useRef()
    let orderEditDialog = useRef()

    function deleteOrder(){

    }

    function showEditOrderDialog(order){
        orderEditDialog.current.show()
        setOrder(order)
    }

    function editOrder(){
        post(API_URL + '/order/update', {order}, getAuth()).then(response => {
            toast.success('Edit success', 'Execution is edited successfully')
        }).catch(err => {
            toast.error('Edit failed', 'Execution edit is failed')
        })
    }

    function showOrders(start = 0, size = 25) {
        setLoading(true)
        table.current.loading(true)
        table.current.removeAll()
        let j = 0
        post(API_URL + '/orders/get/' + tradeId, { start, size }, getAuth()).then(response => {
            for (var i in response.data.orders) {
                j += 1
                let order = response.data.orders[i]
                table.current.add(start + j, order)
            }
        }).catch(err => {
            toast.error("Somthing went wrong", "Trade table is not loaded.")
        }).finally(() => {
            table.current.loading(false)
            setLoading(false)
        })
    }

    useEffect(() => {
        if (isSigned && !isFirstSigned) {
            showOrders()
        }
    }, [isSigned, isFirstSigned])
  return (<>
        <Dialog className='w-1/2' ref={orderEditDialog} title='Execution edit' icon={faEdit}>
            <div className='flex space-x-2'>
                <InputField className='w-1/3' type='date' label='Date' value={order.tradeDate}/>
                <InputField className='w-1/3' type='time' label='Time' value={order.executionTime} />
                <SelectField className='w-1/3' label='Side' values={['Buy', 'Sell']}/>
            </div>       
            <div className='flex space-x-2 mt-2'>
                <InputField className='w-1/3' type='number' label='Price' value={order.price}/>
                <InputField className='w-1/3' type='number' label='Quantity' value={order.quantity}/>
            </div> 
            <div className='flex space-x-2 mt-2'>
                <InputField className='w-1/3' type='number' label='Value'/>
                <InputField className='w-1/3' type='number' label='P$L'/>
            </div>   
            <div className='mt-5 flex'>
                <div className='secondary-btn ml-auto' onClick={() => orderEditDialog.current.hide()}>Cancel</div>
              <div className='primary-btn ml-2' onClick={editOrder}>Save</div>
            </div>         
        </Dialog>
        <Card className='lg:w-2/3'>
            <div className='flex flex-col h-full'>
                <div className='flex mb-2 items-center'>
                    <Icon className='primary-material mr-2' icon={faPlay} size='sm' />
                    <div className='text-lg font-bold mr-auto'>Executions</div>
                </div>
                <div className='overflow-x-auto'>
                    <Table
                        ref={table}
                        headers={headers}
                        adapter={adapter}
                        onDelete={deleteOrder} 
                        onEdit={showEditOrderDialog}/>
                </div>
                <div className='flex items-center'>
                    <div className='ml-auto mr-1 text-sm'>Add an order</div>
                    <IconBtn icon={faCirclePlus} box />
                </div>
                <div className='mt-auto text-xs text-center mb-1'>
                    <Pagination
                        className='w-fit mx-auto'
                        limit={total}
                        onChange={showOrders}
                        loading={loading} />
                </div>
            </div>
        </Card>
    </>)
}
