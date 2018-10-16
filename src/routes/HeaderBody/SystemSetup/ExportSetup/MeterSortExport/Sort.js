import React, { Component } from 'react'
// import { DragDropContext } from 'react-dnd'
import {Icon,Button,message,Radio} from 'antd'
// import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'
import OriginalCard from './OriginalCards'
import update from 'immutability-helper'
import find from "lodash/find";
// import forEach from "lodash/forEach";
import request from "./../../../../../utils/request";
const RadioGroup = Radio.Group;

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      originalCards: [{
        display_name: "小区名称",
        field: "village_name",
        direction:'asc'
      },{
        display_name: "集中器编号",
        field: "concentrator_number",
        direction:'asc'
      },{
        display_name: "水表编号",
        field: "meter_number",
        direction:'asc'
      },{
        display_name: "水表生产厂家",
        field: "meter_manufacturer_name",
        direction:'asc'
      },{
        display_name: "户号",
        field: "member_number",
        direction:'asc'
      },{
        display_name: "用户名称",
        field: "real_name",
        direction:'asc'
      },{
        display_name: "安装位置",
        field: "address",
        direction:'asc'
      },{
        display_name: "读数",
        field: "value",
        direction:'asc'
      },{
        display_name: "日期",
        field: "date",
        direction:'asc'
      },{
        display_name: "抄表时间",
        field: "updated_at",
        direction:'asc'
      },{
        display_name: "抄表员",
        field: "reader",
        direction:'asc'
      }
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
        return o.name === 'meter_data_export_sort'
      }).value;
      that.setState({
        cards:cardData,
      },
     function () {
          this.changeTableY()
          let originalArr=[];
          const originalCardDate=this.state.originalCards

          originalCardDate.forEach(function (item,key) {
            const isExitInCard=find(that.state.cards,function (o) {
              return o.field===item.field
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

  }

  changeTableY = ()=> {
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
    console.log(e)
    this.setState(
      update(this.state, {
        cards: {
          $splice: [[index, 1,{...this.state.cards[index],direction:e}]],
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
          meter_data_export_sort:card,
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          message.success('修改排序设置成功')
        }
      })
    }else{
      message.error('字段不能为空')
    }
  }
  render() {
    const { cards,originalCards } = this.state;
    console.log('originalCards',originalCards)
    console.log('cards',cards)
    return (
      <div className="card-container">
        <div>
          <div className="card-block">

            <div className="card-header">
              不需要排序字段
            </div>
            <div  style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {originalCards.map((card, i) => (
                <OriginalCard
                  key={card.field}
                  index={i}
                  id={card.field}
                  direction={card.direction}
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
              需要排序字段(拖动排序,上面的权重高)
            </div>
            <div  style={{maxHeight:`${this.state.tableY}px`,overflow:'auto'}}>
              {cards.map((card, i) => (
                <Card
                  key={card.field}
                  index={i}
                  id={card.field}
                  text={card.display_name}
                  changeCardValue={this.changeCardValue}
                  direction={card.direction}
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
