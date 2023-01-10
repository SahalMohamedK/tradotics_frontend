import React, { Component } from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'
import IconBtn from './IconBtn'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { classNames } from '../utils'
import Icon from './Icon'

export class Dialog extends Component {
    constructor(props){
        super(props)

        this.state = {
            open: false
        }

        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
    }

    show(){

        this.setState({open: true})
    }

    hide(){

        this.setState({open: false})
    }

  render() {
    return (
        <HeadlessDialog className='relative z-50' open={this.state.open} onClose={this.hide}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-lg" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <HeadlessDialog.Panel className={classNames('mx-auto rounded bg-secondary-900 material p-3',this.props.className)}>
                    <div className="flex flex-col h-full">
                        <HeadlessDialog.Title className='font-bold mb-3 flex items-center border-b border-secondary-800 pb-3'>
                            {this.props.icon && <Icon className='primary-material mr-2' icon={this.props.icon} size='sm' box/>}
                            {this.props.title}
                            <IconBtn className='ml-auto' icon={faXmark} onClick={this.hide}/>
                        </HeadlessDialog.Title>
                        <div className={classNames('w-full grow', this.props.scrollable?'overflow-y-auto':'')}>{this.props.children}</div>
                    </div>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    )
  }
}

export default Dialog