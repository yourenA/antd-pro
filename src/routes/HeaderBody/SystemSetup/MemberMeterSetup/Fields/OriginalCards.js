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
      index,
      addCard,
      size
    } = this.props
    return (
      <div style={{...style}}>
        <Input disabled size="small" style={{width:'120px'}}  defaultValue={text} /> : <Input size="small" style={{width:'80px'}}   defaultValue={size} disabled/> px
        <Button size="small" type="primary"  style={{float:'right'}} onClick={()=>{

          console.log('click',index);
          addCard(index)
        }}>添加</Button>
      </div>

    )
  }
}
