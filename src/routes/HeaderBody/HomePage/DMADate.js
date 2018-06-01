import React, {PureComponent} from 'react';
import moment from 'moment';
import { Button, Icon,Radio,DatePicker } from 'antd';
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import request from './../../../utils/request'
import {prefix} from './../../../common/config'
import {disabledDate} from './../../../utils/utils'
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {
      initDate: moment(new Date(), 'YYYY-MM-DD'),
      area_id:'',
      date:moment( moment(new Date(), 'YYYY-MM-DD')).format('YYYY-MM-DD'),
      page:1,
      DMAArea:[],
      dmaid:'',
      total_forward_values:0,
      difference_values:0,
      total_reverse_values:0,
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.getDMAArea(this.getDMADate)
  }
  getDMADate=(area_id=this.state.dmaid,date=this.state.date)=>{
    const that=this;
    request(`/area_consumption`,{
      method:'GET',
      params:{
        area_id,
        page: this.state.page,
        date,
      }
    }).then((response)=>{
      console.log(response);
      if(response.data[0]){
        that.dynamic(response.data[0])
      }
    })
  }
  getDMAArea=(cb)=>{
    const that=this;
    request(`/areas`,{
      method:'GET',
      params:{
      }
    }).then((response)=>{
      console.log(response);
      if(response.status===200){
        if(response.data.data.length>0){
          that.setState({
            dmaid:response.data.data[0].id
          })
        }
        let arr=[]
        for(let i=0;i<response.data.data.length;i++){
          arr.push(response.data.data[i])
        }
        that.setState({
          DMAArea:arr
        })
        if(cb) cb()
      }

    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  dynamic = (data)=> {
    console.log('online')
    let total_forward_values=0,
      difference_values=0,
      total_reverse_values=0;
    for(let i=0;i<data.total_forward_values.length;i++){
      if(Number(data.difference_values[i])){
        difference_values=difference_values+data.difference_values[i];
      }
      if(Number(data.total_forward_values[i])){
        total_forward_values=total_forward_values+data.total_forward_values[i];
      }
      if(Number(data.total_reverse_values[i])){
        total_reverse_values=total_reverse_values+data.total_reverse_values[i];
      }
    }
    this.setState({
      total_forward_values,difference_values,total_reverse_values
    })
    this.myChart = this.echarts.init(document.querySelector('.dma-data'));
    let option = {
      backgroundColor: '#eee',
      title: {
        text: `${data.area_name} 正向流量 : ${total_forward_values.toFixed(2)} 反向流量 : ${total_reverse_values.toFixed(2)} 用水量 : ${difference_values.toFixed(2)} `,
        x: 'right',
        textStyle:{
          fontSize:14
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 110
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正向流量', '反向流量', '用水量']
      },
      yAxis: {
        type: 'value',
        name: '流量',
      },
      xAxis : {
        name: '时间',
        type: 'category',
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      },
      series: [
        {
          name: '正向流量',
          type: 'line',
          smooth: true,
          itemStyle:{
            normal: {
              color: '#2f4554',
            }
          },
          data: data.total_forward_values
        },
        {
          name:  '反向流量',
          type: 'line',
          smooth: true,
          data: data.total_reverse_values,
          itemStyle:{
            normal: {
              color: '#c23531',
            }
          },

        },
        {
          name:  '用水量',
          type: 'line',
          smooth: true,
          data:data.difference_values,
          itemStyle:{
            normal: {
              color: '#61a0a8',
            }
          },
        },
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }
  changeDMAId=(e)=>{
    this.setState({
      dmaid: e.target.value,
    },function () {
      console.log(e.target.value)
      this.getDMADate(e.target.value,this.state.date)
    });
  }
  changeDate=(e,dateString)=>{
    console.log(dateString)
    this.setState({
      date:dateString,
    },function () {
      this.getDMADate(this.state.dmaid,dateString)
    })
  }
  render() {
    const renderBtnGrounp=this.state.DMAArea.map((item,index)=>{
      return(
        <RadioButton value={item.id} key={index}>{item.name}</RadioButton>
      )
    })
    return (
      <div  style={{position:'relative'}}>
        <div >
          <RadioGroup onChange={this.changeDMAId} size="small" value={this.state.dmaid}>
            {renderBtnGrounp}
          </RadioGroup>
          <DatePicker allowClear={false} size="small" defaultValue={this.state.initDate} onChange={this.changeDate} disabledDate={disabledDate} />
        </div>
        <div className="dma-data"></div>
      </div>
    );
  }
}
