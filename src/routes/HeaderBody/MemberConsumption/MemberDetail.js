import React, { PureComponent } from 'react';
import { Tabs,DatePicker,Button} from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;
import {getTimeDistance,disabledDate,errorNumber} from './../../../utils/utils';
import request from './../../../utils/request'
import MemberRate from './MemberRate'
import moment from 'moment'
import find from 'lodash/find'
const TabPane = Tabs.TabPane;
@connect(state => ({
  member_meter_data: state.member_meter_data,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.state = {
      Data:[],
      rangePickerValue: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
    }
  }
  componentDidMount() {
    const that=this;
    this.setState({
    },function () {
      that.fetch()
    });

  }
  fetch=()=>{
    const that=this;
    request(`/member_consumption/${this.props.member_number}`,{
      method:'GET',
      params:{
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),
        return:'all'
      }
    }).then((response)=>{
      console.log(response);
      if(response.status===200){
        this.setState({
          data:response.data
        })
        that.dynamic(response.data)
      }
    });
  }
  dynamic=(data)=>{
    let date=[];
    let legend=[];
    let series=[]
    for(let i=0;i<data.length;i++){
      date.push(data[i].date);

    }
    for(let j=0;j<data[0].temperature_types.length;j++){
      if(data[0].temperature_types[j]){
        legend.push(data[0].temperature_types[j].name)
      }
    }
    console.log('legend',legend)
    for(let k=0;k<legend.length;k++){
      series.push({
        name:legend[k],
        type: 'bar',
        data:[]
      })
      for(let m=0;m<data.length;m++){
          series[k].data.push(data[m].temperature_types[k].difference_value)
      }
    }
    this.myChart = this.echarts.init(document.querySelector('.member-analysis'));
    let option = {
      color:['#2f4554','#c23531'],
      backgroundColor: '#eee',
      title: {
        text: '各水表类型用水量',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
        },
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      legend: {
        data: legend
      },
      xAxis: [
        {
          type: 'category',
          data:date,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '水量',
          axisLabel: {
            formatter: '{value} T'
          }
        },
      ],
      series: series
    };



    const that=this;
    that.myChart.setOption(option);
  }
  isActive(type) {
    const {rangePickerValue} = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return false;
    }
    if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day')) {
      return true;
    }
  }
  handleRangePickerChange = (datePickerValue,type) => {
    const that=this;
    if(type==='start'){
      this.setState({
        rangePickerValue:[datePickerValue,this.state.rangePickerValue[1]],
      },function () {
        that.fetch()
      });
    }else{
      this.setState({
        rangePickerValue:[this.state.rangePickerValue[0],datePickerValue],
      },function () {
        that.fetch()
      });
    }
  }
  selectDate = (type) => {
    const that=this;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    },function () {
      that.fetch()
    });

  }
  render() {
    return (
      <div>
        <div >
         <ButtonGroup>
            <Button  onClick={() => this.selectDate('week')} type={this.isActive('week')?'primary':''}>本周</Button>
            <Button  onClick={() => this.selectDate('month')} type={this.isActive('month')?'primary':''}>本月</Button>
            <Button  onClick={() => this.selectDate('year')} type={this.isActive('year')?'primary':''}>本年</Button>
          </ButtonGroup>

          <DatePicker
            value={this.state.rangePickerValue[0]}
            allowClear={false}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder="开始日期"
            onChange={(e)=>this.handleRangePickerChange(e,'start')}
          />
          <DatePicker
            allowClear={false}
            value={this.state.rangePickerValue[1]}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder="结束日期"
            onChange={(e)=>this.handleRangePickerChange(e,'end')}
          />
          {/*<RangePicker
            disabledDate={disabledDate}
            value={this.state.rangePickerValue}
            onChange={this.handleRangePickerChange}
            style={{width: 256}}
          />*/}
        </div>
        <div className="member-analysis"></div>
      {/*  <MemberRate data={this.state.data}/>*/}
      </div>
     /* <Tabs defaultActiveKey="month-analysis" onChange={this.changeTab}>
        <TabPane tab="历史水量分析(每月)" key="month-analysis">
          <div className="month-analysis"></div>
        </TabPane>
        <TabPane tab="历史水量分析(每日)" key="day-analysis"  forceRender={true}>
          <div className="day-analysis"></div>
        </TabPane>
      </Tabs>*/
    );
  }
}

export default Detail
