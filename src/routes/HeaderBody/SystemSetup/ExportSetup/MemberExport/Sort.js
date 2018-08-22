import React, { Component } from 'react'
// import { DragDropContext } from 'react-dnd'
import {Icon,Button,message,Radio} from 'antd'
// import HTML5Backend from 'react-dnd-html5-backend'
import Card from './../Card'
import OriginalCard from './../OriginalCards'
import update from 'immutability-helper'
import find from "lodash/find";
// import forEach from "lodash/forEach";
import request from "./../../../../../utils/request";
const RadioGroup = Radio.Group;

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      originalCards: [
      ],
      cards: [
      ],
      tableY:0,
      member_meter_data:{},
      value: '',
    }
  }

  componentDidMount() {
    // this.props.findChildFunc(this.getState);
    const that=this;
    request(`/configs?groups[]=export`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      const cardData=find(response.data.data, function (o) {
        return o.name === 'member_export_fields'
      }).value;
      const export_format=find(response.data.data, function (o) {
        return o.name === 'member_export_format'
      }).value;
      that.setState({
        cards:cardData,
        value:export_format
      },function () {
        request(`/configs?groups[]=export&is_display_default=1`, {
          method: 'GET',
          query: {}
        }).then((response)=> {
          console.log(response);
          this.changeTableY()
          let originalArr=[];
          const originalCardDate=find(response.data.data, function (o) {
            return o.name === 'member_export_fields'
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
      tableY: document.body.offsetHeight - document.querySelector('.card-container').offsetTop - (68 + 240)
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
  changeCardText=(e,index)=>{
    this.setState(
      update(this.state, {
        cards: {
          $splice: [[index, 1,{...this.state.cards[index],display_name:e.target.value}]],
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
    let value=this.state.value;
    console.log('card',card)
    if(card.length>0){
      let patchData={};
      console.log('patchData',patchData)
      request(`/configs`, {
        method: 'PATCH',
        data: {
          member_export_fields:card,
          member_export_format:value
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          message.success('修改导出设置成功')
        }
      })
    }else{
      message.error('字段不能为空')
    }
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  render() {
    const { cards,originalCards } = this.state
    return (
      <div className="card-container">
        <div>
          <div className="card-block">

            <div className="card-header">
              不需要导出字段
            </div>
            <div  style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {originalCards.map((card, i) => (
                <OriginalCard
                  key={card.key}
                  index={i}
                  id={card.key}
                  text={card.display_name}
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
              需要导出字段(拖动排序)
              <span style={{marginLeft:'5px'}}>导出格式 : </span><RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={'csv'}>csv</Radio>
                <Radio value={'txt'}>txt</Radio>
              </RadioGroup>
            </div>
            <div  style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {cards.map((card, i) => (
                <Card
                  key={card.key}
                  index={i}
                  id={card.key}
                  text={card.display_name}
                  changeCardValue={this.changeCardValue}
                  changeCardText={this.changeCardText}
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
