import React, { PureComponent } from 'react';
import { Tabs,DatePicker,Button} from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;
import {getTimeDistance,disabledDate} from './../../../utils/utils';
import request from './../../../utils/request'
import moment from 'moment'
const TabPane = Tabs.TabPane;
@connect(state => ({
  member_meter_data: state.member_meter_data,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.myChart2=null;
    this.state = {
      Data:[],
      rangePickerValue: [moment(this.props.started_at , 'YYYY-MM-DD'), moment(this.props.ended_at, 'YYYY-MM-DD')],
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
    request(`/member_meter_data/${this.props.member_number}`,{
      method:'GET',
      params:{
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),
        return:'all'
      }
    }).then((response)=>{
      console.log(response);
      that.dynamic(response.data.data)
    });
  }
  dynamic=(data)=>{
    let Date=[];
    let Data=[];
    forEach(data,(value)=>{
      Date.push(value.date);
      Data.push(value.value)
    })
    this.myChart = this.echarts.init(document.querySelector('.month-analysis'));
    let option = {
      tooltip: {
        trigger: 'axis' //只显示一条线
      },
      legend: {
        data:['最高用水量','最低用水量']
      },
      toolbox: {
        show: true,
        feature: {
          dataView: {readOnly: false},
          saveAsImage: {}
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
      xAxis:  {
        type: 'category',
        boundaryGap: false,//坐标轴两边留白策略.默认为 true，这时候刻度只是作为分隔线
        data:Date
      },
      yAxis: {
        type: 'value',
        axisLabel: { //格式化刻度尺上面的文字
          formatter: '{value} T'
        }
      },
      series: [
        {   //第一条数据
          name:'用水量',
          type:'line',
          data:Data,
          markPoint: { //在该数据线上描点
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          markLine: { //在该数据线上描线
            data: [
              {type: 'average', name: '平均值'}
            ]
          }
        },
      ]
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
  handleRangePickerChange = (rangePickerValue) => {
    const that=this;
    this.setState({
      rangePickerValue,
    },function () {
      that.fetch()
    });

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
          <RangePicker
            disabledDate={disabledDate}
            value={this.state.rangePickerValue}
            onChange={this.handleRangePickerChange}
            style={{width: 256}}
          />
        </div>
        <div className="month-analysis"></div>
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
