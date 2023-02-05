import React, { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { areaGraphData, areaGraphOptions } from '../libs';
import Card from '../components/Card'
import Table from '../components/Table';
import Dialog from '../components/Dialog'
import IconBtn from '../components/IconBtn';
import { journalDialogTableAdapter } from '../adapters/table';
import { useUI } from '../contexts/UIContext';
import { useAPI } from '../contexts/APIContext';

export default function Journal() {

    let fullDialog = useRef()

    let data = [
        [75, 4, 255, 2.55, 3,1],
        [75, 4, 255, 2.55, 3,1],
        [75, 4, 255, 2.55, 3,1],
        [75, 4, 255, 2.55, 3,1],
        [75, 4, 255, 2.55, 3,1],
        [75, 4, 255, 2.55, 3,1],
    ]
    
    const { setLoading } = useUI()
    const { isSigned, isFirstSigned } = useAPI()

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

  return (
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
                        <Line options={areaGraphOptions} data={areaGraphData(['09:24', '', '', '', '10:07'], [0,100,400,100,300])} />
                    </div>
                    <div className='md:flex mt-5 md:space-x-5'>
                        <div className='w-full md:w-1/2'>
                            <div className='flex'><div>Winrate</div><div className='ml-auto'>75%</div></div>
                            <div className='flex'><div>Total trades</div><div className='ml-auto'>4</div></div>
                            <div className='flex'><div>Volume</div><div className='ml-auto'>255</div></div>
                        </div>
                        <div className='w-full md:w-1/2'>
                            <div className='flex'><div>Profit factor</div><div className='ml-auto'>2.55</div></div>
                            <div className='flex'><div>Winners</div><div className='ml-auto'>3</div></div>
                            <div className='flex'><div>Losers</div><div className='ml-auto'>1</div></div>
                        </div>
                    </div>
                </div>
                <div className='w-full md:3/5 overflow-auto'>
                    <Table headers={['Entry time','Exit time','Symbol','Side','Volume','Net P&L','ROI','RR ratio']}
                        adapter={journalDialogTableAdapter}
                        data={[
                            ['09:46:00', '10:04:00', 'TATAMOTORS', 1, 34, 2755.55, 1.2, 1.57],
                            ['09:46:00', '10:04:00', 'TATAMOTORS', 0, 34, 2755.55, 1.2, 1.57],
                            ['09:46:00', '10:04:00', 'TATAMOTORS', 1, 34, 2755.55, 1.2, 1.57],
                            ['09:46:00', '10:04:00', 'TATAMOTORS', 1, 34, 2755.55, 1.2, 1.57]
                        ]}/>
                </div>
            </div>
            </Dialog>
            <div className='md:flex mt-5 lg:mt-0 flex-wrap'>
                {data.map((item, i) => 
                <Card key={i} className='w-full md:w-1/2'>
                    <div className='flex items-center justify-between md:justify-start'>
                        <div className='font-bold'>Wed, Aug 11 2022</div>
                        <div className='md:ml-5 text-xs text-green-500 font-bold bg-green-500/25 rounded-full px-2 py-1'>Net P&L $4036.00</div>
                        <div className='ml-auto'>
                            <IconBtn icon={faUpRightAndDownLeftFromCenter} onClick={()=> fullDialog.current.show()} size='sm'/>
                        </div>
                    </div>
                    <div className='w-full md:flex mt-1 md:space-x-5 items-center'>
                        <div className='w-full md:w-1/3 h-36'>
                            <Line options={areaGraphOptions} data={areaGraphData(['09:24', '', '', '', '10:07'], [0,100,400,100,300])} />
                        </div>
                        <div className='w-full md:w-1/3 mt-3 md:mt-0'>
                            <div className='flex'><div>Winrate</div><div className='ml-auto'>{item[0]}%</div></div>
                            <div className='flex'><div>Total trades</div><div className='ml-auto'>{item[1]}</div></div>
                            <div className='flex'><div>Volume</div><div className='ml-auto'>{item[2]}</div></div>
                        </div>
                        <div className='w-full md:w-1/3'>
                            <div className='flex'><div>Profit factor</div><div className='ml-auto'>{item[3]}</div></div>
                            <div className='flex'><div>Winners</div><div className='ml-auto'>{item[4]}</div></div>
                            <div className='flex'><div>Losers</div><div className='ml-auto'>{item[5]}</div></div>
                        </div>
                    </div>
                </Card>
            )}

            </div>
        </div>
  )
}
