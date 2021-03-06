
import React, {Component} from 'react'

export default class SupplierProductImageInput  extends Component{
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e, input) {
    const { input: { onChange } } = this.props;
    onChange(e, input);
  }

  render(){
    const {input,labelText } = this.props;


    return(
      <div className={"form-group"}>
        <label>{labelText}</label>
        <div>
          <input
            type='file'
            accept='.jpg, .png, .jpeg'
            onChange={ event => this.onChange(event, input)}
            name={input.name}
          />
        </div>
      </div>
    )
  }
}
