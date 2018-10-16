import React, { Component } from 'react'
import {Button,Select} from 'antd'
const Option = Select.Option;
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
}

export default class OriginalCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }
  render() {
    const {
      text,
      index,
      addCard,
      direction
    } = this.props
    return (
      <div style={{...style}}>
        <span>{text} : </span>
        <Select size="small" defaultValue={direction} style={{ width: 70 }} disabled>
          <Option value="asc">升序</Option>
          <Option value="desc">降序</Option>
        </Select>
       {/* <Input disabled size="small" style={{width:'120px'}}  defaultValue={text} />*/}
        <Button size="small" type="primary"  style={{float:'right'}} onClick={()=>{

          console.log('click',index);
          addCard(index)
        }}>添加</Button>
      </div>

    )
  }
}
