import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import {Button,Input} from 'antd'
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
      width,
      index,
      addCard
    } = this.props
    return (
      <div style={{...style}}>
        {text} : <Input size="small" style={{width:'100px'}}  addonAfter="px" defaultValue={width} disabled/>
        <Button size="small" type="primary"  style={{float:'right'}} onClick={()=>{

          console.log('click',index);
          addCard(index)
        }}>添加</Button>
      </div>

    )
  }
}
