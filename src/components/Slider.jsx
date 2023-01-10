import React, { createRef, useEffect, useRef, useState, Component } from 'react'
import { classNames, hasValue } from '../utils';

export class Slider extends Component {
    constructor(props){
        super(props)

        this.defaultValue = hasValue(this.props.defaultValue, 0)
        this.min = hasValue(this.props.min, 0)
        this.max = hasValue(this.props.max, 100)
        this.step = hasValue(this.props.step, 1)
        this.onChange = hasValue(this.props.onChange, ()=>{})

        this.state = {
            value: this.defaultValue
        }

        this.progress = createRef()
    }

    setValue(value){
        value = Number(value)
        if(value<this.min){
            value = this.min
        }
        if(value>this.max){
            value = this.max
        }
        this.setState({value: value})
        this.onChange(value)
    }

    getValue(){
        return this.state.value
    }

    getProgress(){
        return (100*(this.state.value-this.min)/(this.max-this.min));
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='relative w-full h-1 bg-primary-900 rounded'>
                        <div className='progress absolute h-1 rounded' style={{width: this.getProgress()+'%'}}></div>
                    </div>
                    <div className='relative'>
                        <input type="range" className='range w-full -top-1 absolute appearance-none h-1 rounded p-0 bg-transparent' value={this.state.value}
                            onChange={(e) => this.setValue(e.target.value)} min={this.min} max={this.max} step={this.step}/>
                    </div>
            </div>
        )
    }
}

export default Slider