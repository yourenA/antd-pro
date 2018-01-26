import React, { PureComponent } from 'react';
import { Tabs} from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
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
      monthData:[],
      dayData:[]
    }
  }
  componentDidMount() {
    const that=this;
    setTimeout(function () {
      that.dynamic();
    },0);

  }
  dynamic=()=>{
    const {member_meter_data:{monthData}}=this.props
    let Date=[];
    let Data=[];
    forEach(monthData,(value)=>{
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
  dynamic2=()=>{
    const {member_meter_data:{dayData}}=this.props
    let Date=[];
    let Data=[];
    forEach(dayData,(value)=>{
      Date.push(value.date);
      Data.push(value.value)
    })
    this.myChart2 = this.echarts.init(document.querySelector('.day-analysis'));
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
      xAxis:  {
        type: 'category',
        boundaryGap: false,//坐标轴两边留白策略.默认为 true，这时候刻度只是作为分隔线
        data: Date
      },
      yAxis: {
        type: 'value',
        axisLabel: { //格式化刻度尺上面的文字
          formatter: '{value} T'
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
    that.myChart2.setOption(option);
  }
  changeTab=(key)=>{
    if(key==='day-analysis'){
      const {dispatch} = this.props;
      const that=this;
      that.dynamic2()
    }
  }
  render() {
    return (
      <Tabs defaultActiveKey="month-analysis" onChange={this.changeTab}>
        <TabPane tab="历史水量分析(每月)" key="month-analysis">
          <div className="month-analysis"></div>
        </TabPane>
        <TabPane tab="历史水量分析(每日)" key="day-analysis"  forceRender={true}>
          <div className="day-analysis"></div>
        </TabPane>
      </Tabs>
    );
  }
}

export default Detail
