import Field from '../core/components/Field'
import { classNames, hasValue } from '../utils'
import Icon from './Icon'

export default class FieldWraper extends Field {
  render() {
    let addons = hasValue(this.props.addons, [])
    let subLabel = this.props.subLabel
    if (subLabel === true) {
      subLabel = this.props.readOnly ? 'read only' : !this.props.required ? 'optional' : 'required'
    }
    return (
      <div className={classNames(
          'relative', 
          this.props.className)}>
        {this.props.label && 
          <label 
            htmlFor={this.props.id} 
            className="flex items-baseline text-sm">
            <div>{this.props.label}</div>
            {subLabel && 
              <div className='text-xs ml-1 text-secondary-500'>({subLabel})</div>
            }
          </label>
        }
        <div className={classNames(
          'relative rounded-md flex items-center material bg-secondary-800 px-2 py-1.5 border duration-200',
          this.props.disabled ?
            'bg-secondary-700 text-secondary-600' :
            'bg-secondary-800',
          this.state.focused ?
            'border-indigo-500' :
            this.state.errors.length > 0 ?
              'border-red-500' :
              'border-indigo-500/0',
          this.props.innerClassName)}>
          <Icon
            className={
              this.state.focused ?
                'text-indigo-500' :
                this.state.errors.length > 0 ?
                  'text-red-500' :
                  'text-secondary-600'
            }
            icon={this.props.icon}
            size='sm' />
          {this.field()}
          {addons.map((addon, i) => <div key={i}>{addon}</div>)}
        </div>
        {this.state.errors.length > 0 && <div>
          {this.state.errors.map((error, i) =>
            <p key={i} className='text-red-500 text-xs mt-1' >{error}</p>
          )}
        </div>}
        <div className={this.props.disabled ? 'absolute top-0 bottom-0 left-0 right-0' : ''}></div>
      </div>
    )
  }
}
