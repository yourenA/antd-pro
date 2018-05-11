import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import {Icon} from 'antd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'
import OriginalCard from './OriginalCards'
import update from 'immutability-helper'
const style = {
}

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      originalCards: [
        {
          id: 1,
          text: '户号',
          width:100
        },
        {
          id: 2,
          text: '水表编号',
          width:100

        },
        {
          id: 3,
          text: '用水量',
          width:110

        },
        {
          id: 4,
          text: '上次读数',
          width:120

        },
        {
          id: 5,
          text:
            '上次读数时间',
          width:130

        },
        {
          id: 6,
          text: '本次读数',
          width:140

        },
        {
          id: 7,
          text: '本次读数时间',
          width:150

        },
        {
          id: 8,
          text: '户号2',
          width:100
        },
        {
          id: 9,
          text: '水表编号2',
          width:100

        },
        {
          id: 10,
          text: '用水量2',
          width:110

        },
        {
          id: 11,
          text: '上次读数2',
          width:120

        },
        {
          id: 12,
          text:
            '上次读数时间2',
          width:130

        },
        {
          id: 13,
          text: '本次读数2',
          width:140

        },
        {
          id: 14,
          text: '本次读数时间2',
          width:150

        },
      ],
      cards: [

      ],
      tableY:0
    }
  }

  componentDidMount() {
    this.props.findChildFunc(this.getState);
    const that=this
    setTimeout(function () {
      that.changeTableY()
    },10)
  }
  getState=(value)=>{
    return this.state.cards
  }
  changeTableY = ()=> {
    console.log(document.querySelector('.card-container').offsetTop  )
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.card-container').offsetTop - (68 + 54 + 50 + 38 + 50)
    })
  }
  moveCard=(dragIndex, hoverIndex) =>{
    const { cards } = this.state
    const dragCard = cards[dragIndex]
    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      }),
    )
  }
  removeCard=(index)=>{
    this.setState(
      update(this.state, {
        originalCards: {
          $push: [this.state.cards[index]],
        },
        cards: {
          $splice: [[index, 1]],
        },
      }),
    )
  }
  changeCardValue=(e,index)=>{
    this.setState(
      update(this.state, {
        cards: {
          $splice: [[index, 1,{...this.state.cards[index],width:e.target.value}]],
        },
      }),
    )
  }
  addCard=(index)=>{
    this.setState(
      update(this.state, {
        cards: {
          $push: [this.state.originalCards[index]],
        },
        originalCards: {
          $splice: [[index, 1]],
        },
      }),
    )

  }
  render() {
    const { cards,originalCards } = this.state
    return (
      <div className="card-container">
        <div className="card-scale">
          <div className="card-scale-content">
            比例尺 :
            <div className="scale-item">
              <span className="first">50px</span>
              <span>100px</span>
              <span>150px</span>
            </div>

          </div>

        </div>
        <div>
          <div className="card-block">
            <div className="card-header">
              不需要显示
            </div>
            <div style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {originalCards.map((card, i) => (
                <OriginalCard
                  key={card.id}
                  index={i}
                  id={card.id}
                  text={card.text}
                  width={card.width}
                  addCard={this.addCard}
                />
              ))}
            </div>

          </div>
          <div className="card-block" style={{width:'60px',border:'none',textAlign:'center',marginTop:'10px'}}>
            <Icon type="swap" style={{fontSize:'32px',color:'#1890ff'}}/>
          </div>
          <div className="card-block">
            <div className="card-header">
              需要显示
            </div>
            <div style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {cards.map((card, i) => (
                <Card
                  key={card.id}
                  index={i}
                  id={card.id}
                  text={card.text}
                  width={card.width}
                  changeCardValue={this.changeCardValue}
                  moveCard={this.moveCard}
                  removeCard={this.removeCard}
                />
              ))}
            </div>

          </div>
        </div>

      </div>

    )
  }
}
