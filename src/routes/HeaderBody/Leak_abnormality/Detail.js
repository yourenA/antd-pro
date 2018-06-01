import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Radio,DatePicker,Button,Tabs } from 'antd';
const TabPane = Tabs.TabPane;

export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {
      activeKey:''
    }
  }

  componentDidMount() {
    this.dynamic(this.props.meter_values)
    window.addEventListener('resize', this.resizeChart)
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
    let date=[];
    for(let key in data){
      date.push(key)
    }
    this.myChart = this.echarts.init(document.querySelector('.leak-date'));
    let option = {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: [ '读值']
      },
      yAxis: {
        type: 'value',
        name: '流量',
      },
      xAxis : {
        name: '时间',
        type: 'category',
        data:key
      },
      series: [
        {
          name:  '读值',
          type: 'line',
          smooth: true,
          data:data,
          itemStyle:{
            normal: {
              color:'#2f4554',
            }
          },
        },
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }
  render() {
    return (
       <div className="leak-date" ></div>
    );
  }
}
