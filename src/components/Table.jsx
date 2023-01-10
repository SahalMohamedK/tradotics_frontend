import React, { Component } from 'react'
import { simpleTableAdapter } from '../adapters/table'
import { classNames, hasValue } from '../utils'

export class Table extends Component {
    constructor(props){
        super(props)

        this.onChange = hasValue(this.props.onChange, () => {})
        this.onClick = hasValue(this.props.onClick, ()=>{})
        this.onAdd = hasValue(this.props.onAdd, () => {})
        this.onRemove = hasValue(this.props.onRemove, () => {})
        this.adapter = hasValue(this.props.adapter, simpleTableAdapter)

        this.state = {
            data: hasValue(this.props.data, [])
        }
        
        this.onChange(this.state.data)
    }

    add(...item){
        this.setState((prev) => ({data: [...prev.data, item]}), () => {
            this.onChange(this.state.data)
            this.onAdd(...item)
        })
    } 

    remove(i){
        this.setState({data: this.state.data.filter((_, a) => a !== i)}, () => {
            this.onChange(this.state.data)
            this.onRemove(i)
        })
    }

    render() {
        return (
            <table className={classNames('relative min-w-full text-center border-separate border-spacing-y-3 align-middle', this.props.className)}>
                <thead>
                    <tr className='sticky top-0'>
                        {this.props.headers.map((head, i) => 
                            <th key={i} scope="col" className="text-xs font-bold p-2 text-white bg-indigo-500 first:rounded-l-lg last:rounded-r-lg">
                                {head}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody >
                    {this.state.data.map((items, i) => 
                        <tr key={i} className={classNames('duration-200 bg-secondary-800 text-xs text-center', this.props.onClick?'hover:bg-secondary-700 cursor-pointer':'')}
                            onClick={() => this.onClick(items)}>
                            {this.adapter(this, ...items).map((item, j ) => 
                                <td key={j} className="p-2 first:pl-3 first:rounded-l-lg last:pl-2 last:rounded-r-lg">{item}</td>
                            )}
                        </tr>)}
                </tbody>
            </table>
        )
    }
}

export default Table