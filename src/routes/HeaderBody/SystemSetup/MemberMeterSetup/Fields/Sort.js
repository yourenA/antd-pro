import React, { Component } from 'react'
// import { DragDropContext } from 'react-dnd'
import {Icon,Button,message} from 'antd'
// import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'
import OriginalCard from './OriginalCards'
import update from 'immutability-helper'
import find from "lodash/find";
// import forEach from "lodash/forEach";
import {connect} from 'dva';
import request from "./../../../../../utils/request";
const style = {
}


class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      originalCards: [
      ],
      cards: [
      ],
      tableY:0,
      member_meter_data:{}
    }
  }

  componentDidMount() {
    // this.props.findChildFunc(this.getState);
    const that=this;
    request(`/configs?groups[]=member_meter_data`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      const cardData=find(response.data.data, function (o) {
        return o.name === 'member_meter_data_display_fields'
      }).value;
      that.setState({
        cards:cardData,
      },function () {
        request(`/configs?groups[]=member_meter_data&is_display_default=1`, {
          method: 'GET',
          query: {}
        }).then((response)=> {
          console.log(response);
          this.changeTableY()
          let originalArr=[];
          const originalCardDate=find(response.data.data, function (o) {
            return o.name === 'member_meter_data_display_fields'
          }).value;
          originalCardDate.forEach(function (item,key) {
            const isExitInCard=find(that.state.cards,function (o) {
              return o.key===item.key
            })
            if(isExitInCard){

            }else{
              originalArr.push(item)
            }
          })
          that.setState({
            originalCards:originalArr,
          })
        })

      })
    })

  }

  changeTableY = ()=> {
    console.log(document.querySelector('.card-container').offsetTop  )
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.card-container').offsetTop - (68 + 210)
    })
  }
  getState=(value)=>{
    return this.state.cards
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
          $splice: [[index, 1,{...this.state.cards[index],size:e}]],
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

  handleExport=()=>{
    let card=this.state.cards;
    console.log('card',card)
    if(card.length>0){
      let patchData={};
      console.log('patchData',patchData)
      request(`/configs`, {
        method: 'PATCH',
        data: {
          member_meter_data_display_fields:card
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          message.success('修改显示字段成功')
        }
      })
    }else{
      message.error('字段不能为空')
    }
  }
  render() {
    const { cards,originalCards } = this.state
    return (
      <div className="card-container">
        <div>
          <div className="card-block">
            <div className="card-header">
              不需要显示字段
            </div>
            <div  style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {originalCards.map((card, i) => (
                <OriginalCard
                  key={card.key}
                  index={i}
                  id={card.key}
                  text={card.display_name}
                  size={card.size}
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
              需要显示字段
            </div>
            <div  style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {cards.map((card, i) => (
                <Card
                  key={card.key}
                  index={i}
                  id={card.key}
                  text={card.display_name}
                  size={card.size}
                  changeCardValue={this.changeCardValue}
                  moveCard={this.moveCard}
                  removeCard={this.removeCard}
                />
              ))}
            </div>
            <Button  type="primary" style={{width:'100%',marginTop:'5px'}} onClick={this.handleExport}>保存</Button>
          </div>
        </div>

      </div>

    )
  }
}
export default Container
