/**
 * Author: dashouney
 * Date: 10/31/19
 * Description:
 */
import React, {Component} from 'react'

export default class SupplierProductCategoryImageInput  extends Component{
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    onChange(e);
  }

  render(){
    const { input,labelText } = this.props;
    return(
      <div className={"form-group"}>
        <label>{labelText}</label>
        <div>
          <input
            type='file'
            accept='.jpg, .png, .jpeg'
            onChange={this.onChange}
            name={input.name}
          />
        </div>
      </div>
    )
  }
}
