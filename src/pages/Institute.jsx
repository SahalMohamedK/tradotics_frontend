import React, { useEffect } from 'react'
import { instituteGroupTable } from '../adapters/table'
import Card from '../components/Card'
import Table from '../components/Table'
import { useUI } from '../contexts/UIContext'

export default function Institute() {
    let datas = [
        ['GROUP 1', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GROUP 2', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GRP003', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GROUP 2', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GROUP 2', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GROUP 2', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GROUP 2', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]],
        ['GROUP 2', [
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2],
            [1, 'Sahal Mohamed', 57, 1.8],
            [1, 'Fazin P K', 97, 2.2]
        ]]
    ]

    const { setIsLoading } = useUI()

    useEffect(() => {
        setIsLoading(false)
    }, [])
  return (
    <div className='mt-16'>
        <div className='font-bold px-2 mt-5 mb-4 text-xl md:mt-5 lg:mt-0'>Institute</div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {datas.map((item, i) => 
                <Card key={i}>
                    <div className='font-bold'>{item[0]}</div>
                    <Table adapter={instituteGroupTable} headers={['S.No', 'Name', 'Winrate', 'Profit factor']}
                        data={item[1]} onClick={() => {}}/>
                </Card>
            )}
        </div>
    </div>
  )
}
