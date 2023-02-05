import React, { Component } from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'
import IconBtn from './IconBtn'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { classNames } from '../utils'
import Icon from './Icon'
import Spinner from './Spinner'

export class Dialog extends Component {
    constructor(props){
        super(props)

        this.state = {
            open: false,
            isLoading: false,
            title: this.props.title,
            icon: this.props.icon
        }

        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
    }

    showLoading(){
        this.setState({isLoading: true})
    }

    hideLoading(){
        this.setState({isLoading: false})
    }

    show(title, icon){
        let state = {open: true}
        if (title) state['title'] = title
        if (icon) state['icon'] = icon
        this.setState(state)
    }

    hide(){
        this.setState({open: false}, ()=>{
            if(this.props.onHide){
                this.props.onHide()
            }
        })
    }

  render() {
    return (
        <div className={classNames('relative z-50', this.state.open?'block':'hidden')}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className={classNames('mx-auto rounded bg-secondary-900 material p-3',this.props.className)}>
                    <div className="flex flex-col h-full">
                        <div className={classNames('font-bold mb-3 flex items-center', this.props.title?'border-b border-secondary-800 pb-3':'')}>
                            {this.state.icon && <Icon className='primary-material mr-2' icon={this.state.icon} size='sm' box/>}
                            {this.state.title}
                            <IconBtn className='ml-auto' icon={faXmark} onClick={this.hide}/>
                        </div>
                        <div className={classNames('w-full grow relative', 
                            this.props.scrollable?'overflow-y-auto':'',
                            this.state.isLoading?'h-[50vh]':'')}>
                            {this.state.isLoading && 
                                <div className='center'>
                                    <Spinner className='h-10 w-10'/>
                                </div>
                            }
                            <div className={!this.state.isLoading?'block':'hidden'}>{this.props.children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default Dialog