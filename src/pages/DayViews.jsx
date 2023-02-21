import React, { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { faTriangleExclamation, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { areaGraphData, areaGraphOptions } from '../libs';
import Card from '../components/Card'
import Table from '../components/Table';
import Dialog from '../components/Dialog'
import IconBtn from '../components/IconBtn';
import { journalDialogTableAdapter } from '../adapters/table';
import { useUI } from '../contexts/UIContext';
import { useAPI } from '../contexts/APIContext';
import { API_URL } from '../config';
import { useFilter } from '../contexts/FilterContext';
import { useNavigate } from 'react-router-dom';
import { classNames, isEmpty, round, safeNumber, strDate } from '../utils';
import Icon from '../components/Icon';
import Pagination from '../elements/Pagination';
import Spinner from '../components/Spinner';

export default function Journal() {
    const [dataLoading, setDataLoading] = useState(true)
    const [dialogData, setDialogData] = useState(['', [[], []], 0, 0, 0, 0, 0, []])
    const [data, setData] = useState({
        total: 0,
        dataByDates: []
    })

    let fullDialog = useRef()
    let dialoTradesTable = useRef()
    
    const { setLoading } = useUI()
    const { isSigned, isFirstSigned, post, getAuth } = useAPI()
    const { filters } = useFilter()
    const navigate = useNavigate()

    function showData(start = 0, size = 6){
        post(API_URL + '/views/days', { filters , start, size}, getAuth()).then(response => {
            setData(response.data)
            setDataLoading(false)
        }).catch(err => {

        })
    }

    function showDetailDialog(i) {
        dialoTradesTable.current.removeAll()
        for(var j in data.dataByDates[i][1][6]){
            dialoTradesTable.current.add(data.dataByDates[i][1][6][j])
        }
        setDialogData(data.dataByDates[i])
        fullDialog.current.show()
    }

    useEffect(() => {
        if (isSigned && !isFirstSigned) {
            setDataLoading(true)
            showData()
        }
    }, [filters, isSigned, isFirstSigned])

    useEffect(() => {
        setLoading(true)
        if (isSigned === false) {
            navigate('/signin')
        } else if (isSigned && isFirstSigned) {
            navigate('/settings')
            toast.info('Setup your profile', 'First you need to setup user user profile details.')
        } else if (isSigned) {
            setLoading(false)
        }
    }, [isSigned, isFirstSigned])

    return (<>
        {dataLoading &&
            <div className='h-full pt-16 relative'>
                <div className='center'>
                    <Spinner className='w-10 h-10 mx-auto' />
                    <div>Loading data...</div>
                </div>
            </div>
        }
        {isEmpty(data.dataByDates) && !dataLoading &&
            <div className='h-full pt-16 relative w-full'>
                <div className='center text-red-500'>
                    <Icon className='mx-auto' icon={faTriangleExclamation} />
                    <div className='text-sm whitespace-nowrap'>No data is available</div>
                </div>
            </div>
        }
        {!isEmpty(data.dataByDates) && 
            <div className='md:flex flex-wrap mt-16'>
                <Dialog className='w-full h-full md:w-auto md:h-auto' ref={fullDialog} title={
                    <div className='flex items-center'>
                        <div className='md:text-lg font-bold'>Wed, Aug 11 2022</div>
                        <div className='ml-5 text-xs text-green-500 font-bold bg-green-500/25 rounded-full px-2 py-1'>Net P&L $4036.00</div>
                    </div>
                }>
                <div className='md:flex md:space-x-10 h-full'>
                    <div className='w-full md:w-2/5'>
                        <div className='h-52'>
                            <Line options={areaGraphOptions} data={areaGraphData(...dialogData[1][0])} />
                        </div>
                        <div className='md:flex mt-5 md:space-x-5'>
                            <div className='w-full md:w-1/2'>
                                <div className='flex'><div>Winrate</div><div className='ml-auto'>{round(safeNumber(dialogData[1][2] / dialogData[1][1]), 2)}%</div></div>
                                <div className='flex'><div>Total trades</div><div className='ml-auto'>{dialogData[1][1]}</div></div>
                                <div className='flex'><div>Volume</div><div className='ml-auto'>{dialogData[1][2]}</div></div>
                            </div>
                            <div className='w-full md:w-1/2'>
                                <div className='flex'><div>Profit factor</div><div className='ml-auto'>{dialogData[1][5]}</div></div>
                                <div className='flex'><div>Winners</div><div className='ml-auto'>{dialogData[1][2]}</div></div>
                                <div className='flex'><div>Losers</div><div className='ml-auto'>{dialogData[1][3]}</div></div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full md:3/5 overflow-auto h-full'>
                        <Table 
                            className='max-h-[18rem]'
                            ref={dialoTradesTable}
                            headers={['Entry time','Exit time','Symbol','Side','Volume','Net P&L','ROI','RR ratio']}
                            adapter={journalDialogTableAdapter}/>
                    </div>
                </div>
                </Dialog>
                <div className='md:flex mt-5 lg:mt-0 flex-wrap w-full'>
                    {data.dataByDates.map(([date, values], i) => 
                        <Card key={i} className='w-full md:w-1/2'>
                            <div className='flex items-center justify-between md:justify-start'>
                                <div className='font-bold'>{date}</div>
                                <div className={classNames('md:ml-5 ml-2 text-xs  font-bold  rounded-full px-2 py-1',
                                    values[0][1][values[0][1].length - 1] > 0 ? 'text-green-500 bg-green-500/25' : 'text-red-500 bg-red-500/25')}>
                                    Net Pnl: ${round(Math.abs(values[0][1][values[0][1].length-1]), 2)}
                                </div>
                                <div className='ml-auto'>
                                    <IconBtn icon={faUpRightAndDownLeftFromCenter} onClick={()=> showDetailDialog(i)} size='sm'/>
                                </div>
                            </div>
                            <div className='w-full md:flex mt-1 md:space-x-2 items-center'>
                                <div className='w-full md:w-2/5 h-36'>
                                    <Line options={areaGraphOptions} data={areaGraphData(...values[0])} />
                                </div>
                                <div className='w-full md:w-3/5 md:flex md:space-x-5'>
                                    <div className='w-full md:w-1/2 mt-3 md:mt-0'>
                                        <div className='flex'><div>Winrate</div><div className='ml-auto'>{round(safeNumber(values[2] / values[1]), 2)}%</div></div>
                                        <div className='flex'><div>Total trades</div><div className='ml-auto'>{values[1]}</div></div>
                                        <div className='flex'><div>Volume</div><div className='ml-auto'>{values[4]}</div></div>
                                    </div>
                                    <div className='w-full md:w-1/2'>
                                        <div className='flex'><div>Profit factor</div><div className='ml-auto'>{values[5]}</div></div>
                                        <div className='flex'><div>Winners</div><div className='ml-auto'>{values[2]}</div></div>
                                        <div className='flex'><div>Losers</div><div className='ml-auto'>{values[3]}</div></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
                <Pagination 
                    className='w-fit mx-auto mt-5'
                    size={6} 
                    limit={data.total}
                    onChange={showData}/>
            </div>
        }
    </>)
}
