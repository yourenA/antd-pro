import React, { PureComponent } from 'react';
import { Tabs} from 'antd';
const TabPane = Tabs.TabPane;

class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.myChart2=null;
    this.state = {
    }
  }
  componentDidMount() {
    const that=this;
    setTimeout(function () {
      that.dynamic();
    },0);
  }
  dynamic=()=>{
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
      xAxis:  {
        type: 'category',
        boundaryGap: false,//坐标轴两边留白策略.默认为 true，这时候刻度只是作为分隔线
        data: ['周一','周二','周三','周四','周五','周六','周日']
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
          data:[11, 11, 15, 13, 12, 13, 10],
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
        data: ['周一','周二','周三','周四','周五','周六','周日']
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
          data:[11, 11, 15, 13, 12, 13, 10],
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
      this.dynamic2()
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
