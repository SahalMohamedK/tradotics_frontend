import React, {  Fragment, useRef } from 'react'
import { useReducer } from 'react'
import { classNames, isEmpty } from '../utils'
import { filterTabAdapter } from '../adapters/tabs'
import { TabBar, TabView, Tab } from '../components/Tab'
import { Disclosure, Popover, Transition } from '@headlessui/react'
import { faAngleDown, faCalendar, faFilter, faFilterCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Icon from '../components/Icon'
import InputField from '../components/InputField'

const initSelection = {}

let filters = [
  ['Symbol',['TATAMOTORS', 'RELIANCE', 'APPLE']],
  ['Setup',['GAP UP', 'RSI 2', 'RSI', 'MOVING AVG']],
  ['Side',['Buy', 'Sell']],
  ['Day',['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
]

const selectionReducer = (state, action) => {
  switch(action.type){
    case 'sf':
      var {i, j} = action
      if(state.hasOwnProperty(i)){
        state[i].add(j)
      }else{
        state[i] = new Set([j])
      }
      break
    case 'uf':
      var {i, j} = action
      if(state.hasOwnProperty(i)){
        if(state[i].length>1){
          state[i].delete(j)
        }else{
          delete state[i]
        }
      }
      break
    case 'scf':
      var {i} = action
      for(var j=0; j<filters[i][1].length; j++){
        state = selectionReducer(state, {type:'sf', i, j})
      }
      break
    case 'ucf':
      var {i} = action
      for(var j=0; j<filters[i][1].length; j++){
        state = selectionReducer(state, {type:'uf', i, j})
      }
      break
    case 'saf':
      for(var i=0; i<filters.length;i++){
        for(var j=0; j<filters[i][1].length; j++){
          state = selectionReducer(state, {type:'sf', i, j})
        }
      }
      break
    case 'uaf':
      for(var i=0; i<filters.length;i++){
        for(var j=0; j<filters[i][1].length; j++){
          state = selectionReducer(state, {type:'uf', i, j})
        }
      }
      break
  }
  return {...state}
}

export function Filter({className, label}) {
  const [selection, setSelection] = useReducer(selectionReducer, initSelection)

  let tabView = useRef()

  function getSelected(){
    let selected = []
    for(let i in selection){
      let category = []
      selection[i].forEach((j) => {
        category.push(
          <div key={j} className='text-sm py-1 border-l border-secondary-600 text-secondary-500 ml-3'>
            <div>- {filters[i][1][j]}</div>
          </div>
        )
      })
      if(category.length){
        selected.push(
          <div key={i}>
            <Disclosure >
              {({open}) => (<>
                <Disclosure.Button className='text-sm py-1 text-secondary-500 flex'>
                  <Icon className={classNames('ml-1 md:ml-0 duration-200', open?'rotate-180':'')} icon={faAngleDown} size='sm'/>
                  {filters[i][0]}
                </Disclosure.Button>
                <Disclosure.Panel>
                  {category}
                </Disclosure.Panel>
              </>)
              }
            </Disclosure>
          </div>
        )
      }
    }
    return selected
  }

  function getTotalNumber(){
    var n = 0
    for(var i in selection){
      n+=selection[i].size
    }
    return n
  }

  return (
    <Popover className={classNames("md:relative", className)}>
      {({ open }) => (
        <>
          <Popover.Button className={classNames('flex items-center outline-none duration-200 bg-secondary-800/50 border-white/10 border text-sm text-secondary-500 hover:text-white px-2 md:px-3 py-1 rounded-full font-medium')}>
            <Icon icon={faFilter}/>
            <div className='ml-2 hidden md:block'>{label}</div>
            <div className='ml-1 md:ml-5 text-xs text-indigo-500 font-bold flex'>{getTotalNumber()} <span className='hidden md:block ml-1'>applied</span></div>
            <Icon className={classNames('ml-1 md:ml-0 duration-200',open?'rotate-180':'')} icon={faAngleDown} size='sm'/>
          </Popover.Button>
          <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
            <Popover.Panel className="absolute h-[80vh] md:h-auto md:top-auto left-1/2 z-10 py-3 w-screen -translate-x-1/2 transform px-4 lg:max-w-3xl">
              <div className='flex flex-col md:block bg-secondary-800 p-3 rounded-lg shadow-lg h-full material'>
                <div className='flex items-center mb-2 md:mb-5'>
                  <Icon className='primary-material' icon={faFilter} size='sm' box/>
                  <div className='ml-2'>Filters</div>
                </div>
                <div className='md:flex mb-5 grow h-0 md:h-auto overflow-y-auto'>
                  <div className='md:w-1/3 border-b pb-1 md:border-b-0 md:pb-0 md:border-r md:pr-3 border-secondary-700'>
                    <InputField icon={faMagnifyingGlass} innerClassName='bg-secondary-900' label='Category'
                      addons={[
                        <div className='flex text-xs text-secondary-600 p-1'>
                          <div className='ml-auto mr-2 whitespace-nowrap'>Select all</div>
                          <input type='checkbox' className='!ring-offset-0 h-4 w-4 rounded bg-secondary-700 border-0 focus:outline-none' 
                            onClick={(e) => setSelection({type: e.target.checked?'saf':'uaf'})}
                          />
                        </div>
                      ]}/>
                    <div className='md:h-[40vh] overflow-y-auto'>
                      <TabBar view={tabView} adapter={filterTabAdapter} defaultTab={0}>
                        {filters.map(([label, items], i)=>
                          <Tab key={i} id={i} label={label} number={selection[i] && selection[i].size}/>
                        )}
                      </TabBar>
                    </div>
                  </div>
                  <div className='md:w-1/3 border-b py-2 md:border-b-0 md:py-0 md:border-r md:px-3 border-secondary-700'>
                    <TabView ref={tabView}>
                      {filters.map(([a, items], i) => 
                        <Tab key={i} id={i}>
                          <InputField icon={faMagnifyingGlass} innerClassName='bg-secondary-900' label='Filter'
                            addons={[
                              <div className='flex text-xs text-secondary-600 py-1'>
                                <div className='ml-auto mr-2 whitespace-nowrap'>Select all</div>
                                <input type='checkbox' className='!ring-offset-0 h-4 w-4 rounded bg-secondary-700 border-0 focus:outline-none' 
                                  onChange={(e)=>setSelection({type:(e.target.checked?'scf':'ucf'), i})}
                                  checked={selection[i] && selection[i].size === filters[i][1].length}/>
                              </div>
                            ]}
                          />
                          <div className='md:h-[40vh] overflow-y-auto'>
                          {items.map((label, j) => 
                            <div key={j} className='flex items-center space-x-2 text-sm px-3 py-1 my-1 text-secondary-500 hover:text-white rounded duration-200 hover:bg-secondary-700 group'>
                              <input type='checkbox' className='!ring-offset-0 h-4 w-4 rounded bg-secondary-900 border-0 focus:outline-none'
                               onChange={(e)=>setSelection({type:(e.target.checked?'sf':'uf'), i,j})}
                               checked={selection[i] && selection[i].has(j)}
                               />
                              <div>{label}</div>
                            </div>
                          )}
                          </div>
                        </Tab>
                      )}
                    </TabView>
                  </div>
                  <div className='md:w-1/3 pt-2 md:py-0 md:pl-3 border-secondary-700'>
                    <div className='text-sm mb-1'>Applied filters</div>
                    <div className='md:h-[40vh] overflow-y-auto relative'>
                      {getSelected()}
                      {isEmpty(selection) && <>
                        <div className='hidden md:block center text-secondary-500 text-sm text-center border-dashed border p-5 lg:px-0 border-secondary-500'>
                            <Icon className='mb-2 mx-auto' icon={faFilterCircleXmark} />
                            No filters are applied
                        </div>
                        <div className='block md:hidden w-fit mx-auto text-secondary-500 text-sm text-center border-dashed border p-5 lg:px-0 border-secondary-500'>
                          <Icon className='mb-2 mx-auto' icon={faFilterCircleXmark} />
                            No filters are applied
                        </div>
                      </>
                         
                      }
                    </div>
                  </div>
                </div>
                <div className='flex mt-auto'>
                  <InputField className='w-full md:w-auto md:ml-auto' type='date' label="From date" icon={faCalendar} innerClassName="bg-secondary-900 !p-0.5" />
                  <InputField className='w-full md:w-auto ml-3' type='date' label="To date" icon={faCalendar}  innerClassName="bg-secondary-900 !p-0.5" />
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
