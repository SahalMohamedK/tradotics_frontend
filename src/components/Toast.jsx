import { faCheck, faCircleCheck, faCircleExclamation, faCircleXmark, faInfo, faInfoCircle, faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons';
import { Transition } from '@headlessui/react';
import React, { Component } from 'react'
import { classNames } from '../utils';
import Card from './Card';
import Icon from './Icon';
import IconBtn from './IconBtn';

const icons = {
    'error': faCircleExclamation,
    'warning': faTriangleExclamation,
    'success': faCircleCheck,
    'info': faInfoCircle
}

const bgColors = {
    'error': 'bg-red-500',
    'warning': 'bg-yellow-500',
    'success': 'bg-green-500',
    'info': 'bg-blue-500',
}

const textColors = {
    'error': 'text-red-500',
    'warning': 'text-yellow-500',
    'success': 'text-green-500',
    'info': 'text-blue-500',
}

export class Toast extends Component {
    constructor(props){
        super(props)

        this.state = {
            color: '',
            icon:'',
            msg: '',
            title: '',
            show: false,
            close: false
        }

        this.callback = null;
        this.hide = this.hide.bind(this);
    }

    success(title, msg, dur=3000){
        this.show(title, msg, icons['success'], bgColors['success'], textColors['success'], dur)
    }

    info(title, msg, dur=3000){
        this.show(title, msg, icons['info'], bgColors['info'], textColors['info'], dur)
    }

    error(title, msg, dur=3000){
        this.show(title, msg, icons['error'], bgColors['error'], textColors['error'], dur)
    }

    warning(title, msg, dur=3000){
        this.show(title, msg, icons['warning'], bgColors['warning'], textColors['warning'], dur)
    }

    show(title, msg, icon, bgColor, textColor, dur=3000){
        this.setState({
            title,
            msg,
            icon,
            bgColor,
            textColor,
            show: true
        });
        if(dur == 'wait'){
            this.setState({close: true});

        }else{
            this.callback = setTimeout(this.hide, dur);
        }
    }

    hide(){
        this.setState({show: false, close: false});
        if(this.callback){
            clearTimeout(this.callback);
        }
    }


  render() {
    return (
        <Transition show={this.state.show} className='fixed bottom-0 m-5 z-[1000] duration-500'
            enterFrom='-right-[100%]' enterTo='right-0' 
            leaveFrom='right-0' leaveTo='-right-[100%]'>
            <Card className='min-w-[200px] max-w-[300px]' innerClassName='!p-0 relative !bg-primary-900'>
                <div className={classNames('absolute left-0 top-0 w-2 h-full rounded-tl-lg rounded-bl-lg', this.state.bgColor)}></div>
                <div className={classNames('absolute -inset-2 blur left-0 top-0 w-2 h-full', this.state.bgColor)}></div>
                <div className='pl-6 pr-4 py-2'>
                    <div className='flex items-center'>
                        <Icon className={this.state.textColor} icon={this.state.icon}/>
                        <div className='font-bold mx-1'>{this.state.title}</div>
                        {this.state.close && 
                            <div className='ml-auto'><IconBtn icon={faCircleXmark} size='sm' onClick={this.hide} /></div>
                        }
                    </div>
                        <div className='w-full text-sm text-secondary-500'>{this.state.msg}</div>
                </div>
            </Card>
        </Transition>
    )
  }
}

export default Toast