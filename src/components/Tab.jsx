import React, { Component, useEffect, useState } from "react";
import { classNames, hasValue } from "../utils";

export function TabBar({children, className, tabClassName, view, adapter = ()=>{}, defaultTab}){
    const [tabs, setTabs] = useState([])
    const [curTab, setCurTab] = useState(defaultTab)

    useEffect(() => {
        let tabs = []
        React.Children.forEach(children, child =>{
            if(!React.isValidElement(child)) return

            const {props: {id, active, ...props}} = child
            tabs.push([id, props])
            if(active) setCurTab(id)
        })
        setTabs(tabs)
    },[children])

    useEffect(() => {
        view.current.setView(curTab)
    }, [curTab])

    function setTab(id){
        setCurTab(id)
    }

    return <div className={className}>
        {tabs.map(([id, props], i) => 
            <div key={i} className={tabClassName} onClick={()=>{setTab(id)}}>{adapter(curTab === id, props)}</div>
        )}
    </div>
}

export function Tab({children}){
    return children
}

export class TabView extends Component{
    constructor(props){
        super(props)

        this.state = {
            tabs: [],
            curTab: null
        }
    }

    setView(id){
        this.setState({curTab: id})
        hasValue(this.props.onChange, () => {})(id)
    }

    render(){
        let tabs = []
        React.Children.forEach(this.props.children, child =>{
            if(!React.isValidElement(child)) return
            const {props: {id, children}} = child
            tabs.push([id, children])
        })
        return tabs.map(([id, children], i) => 
                <div key={i} className={classNames(this.state.curTab == id?'':'hidden', this.props.className)} style={this.props.style}>
                    {children}
                </div>
            )
    }

}