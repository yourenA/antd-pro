import React, {PureComponent} from 'react';
import moment from 'moment';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Radio,DatePicker,Button } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import request from './../../../../utils/request'
import SiteDate from './SiteDate'
import {prefix} from './../../../../common/config'
import {connect} from 'dva';
import {disabledDate} from './../../../../utils/utils'
@connect(state => ({
  global:state.global,
}))
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
      DMAData:{},
      dmaid:'',
      total_forward_values:0,
      difference_values:0,
      total_reverse_values:0,
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart);
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
      if(response.status===200){
        if(response.data.length>0){
          that.dynamic(response.data[0]);
          that.setState({
            DMAData:response.data[0]
          })
        }
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
    console.log('resize')
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
    const {isMobile} =this.props.global;
    let option = {
      backgroundColor: '#eee',
      title: {
        text: `${data.area_name} ${isMobile?'\n':''}正向流量 : ${total_forward_values.toFixed(2)} ${isMobile?'\n':''}反向流量 : ${total_reverse_values.toFixed(2)} ${isMobile?'\n':''}用水量 : ${difference_values.toFixed(2)} `,
        x: isMobile?'right':'center',
        textStyle:{
          fontSize:isMobile?14:18
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
    <div className="content">
      <PageHeaderLayout title="运行管理 " breadcrumb={[{name: '运行管理 '}, {name: 'DMA分区管理'}, {name: 'DMA数据分析'}]}>
        <Card bordered={false} style={{margin: '-16px -16px 0'}}>
          <div className='tableList'>
            <div className='tableListForm'>
                <RadioGroup onChange={this.changeDMAId}  value={this.state.dmaid}>
                  {renderBtnGrounp}
                </RadioGroup>
                <DatePicker allowClear={false} defaultValue={this.state.initDate} onChange={this.changeDate} disabledDate={disabledDate} />
                {/*<div style={{marginBottom:'10px',marginTop:'10px',fontSize:'16px'}}>
                  <span style={{marginRight:'8px',fontWeight:'bold'}}>正向流量 : {this.state.total_forward_values.toFixed(2)}</span>
                  <span style={{marginRight:'8px',fontWeight:'bold'}}>反向流量 : {this.state.total_reverse_values.toFixed(2)}</span>
                  <span  style={{marginRight:'8px',fontWeight:'bold'}}>用水量 : {this.state.difference_values.toFixed(2)}</span>
                </div>*/}
            </div>
          </div>
          <div  style={{position:'relative'}}>
            <div className="dma-data"></div>
          </div>
          <SiteDate data={this.state.DMAData}/>
        </Card>
      </PageHeaderLayout>
    </div>

    );
  }
}
