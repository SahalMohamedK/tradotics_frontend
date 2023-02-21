import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import React, { Component } from 'react'
import { simpleTableAdapter } from '../adapters/table'
import { classNames, hasValue, isEmpty } from '../utils'
import Icon from './Icon'
import Spinner from './Spinner'

export class Table extends Component {
    constructor(props){
        super(props)

        this.onChange = hasValue(this.props.onChange, () => {})
        this.onClick = hasValue(this.props.onClick, ()=>{})
        this.onAdd = hasValue(this.props.onAdd, () => {})
        this.onRemove = hasValue(this.props.onRemove, () => {})
        this.adapter = hasValue(this.props.adapter, simpleTableAdapter)

        this.state = {
            data: hasValue(this.props.data, []),
            loading: false
        }
        
        this.onChange(this.state.data)
    }

    loading(loading){
        this.setState({loading})
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

    removeAll(){
        this.setState({data: []})
    }
    render() {
        return (
            <div className={classNames('relative min-h-[10rem]', this.props.className)}>
                <table className='min-w-full text-center border-separate border-spacing-y-3 align-middle h-full'>
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
                        {!this.state.loading && this.state.data.map((items, i) =>
                            <tr key={i} className={classNames('duration-200 bg-secondary-800 h-0 text-xs text-center', this.props.onClick ? 'hover:bg-secondary-700 cursor-pointer' : '')}
                                onClick={() => this.onClick(items)}>
                                {this.adapter(this, ...items).map((item, j) =>
                                    <td key={j} className="p-2 first:pl-3 first:rounded-l-lg last:pl-2 last:rounded-r-lg">{item}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
                {
                    !this.state.loading && isEmpty(this.state.data) &&
                    <div className='center text-red-500'>
                        <Icon className='mx-auto' icon={faTriangleExclamation} />
                        <div className='text-sm whitespace-nowrap'>{hasValue(this.props.emptyMessage, 'No data is available')}</div>
                    </div>
                }
                {
                    this.state.loading &&
                    <div className='center'>
                        <Spinner className='h-6 w-6 mx-auto' />
                        <div className='mt-2 font-bold text-sm text-secondary-500'>Loading...</div>
                    </div>
                }
            </div>
        )
    }
}

export default Table