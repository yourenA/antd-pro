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
    this.dynamic(this.props.difference_values)
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
    const that=this;
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
        data: [ '用水量']
      },
      yAxis: {
        type: 'value',
        name: '用水量',
      },
      xAxis : {
        name: '时间',
        type: 'category',
        data:date
      },
      series: [
        {
          name:  '用水量',
          type:'bar',
          smooth: true,
          data:data,
          itemStyle:{
            normal:{
              color: function(value) {
                if(that.props.abnormality_hours.indexOf(value.dataIndex)>=0){
                  return '#c23531'
                } else
                {
                  return '#2f4554'
                }
              }
            }

            // {
            //   color:'#2f4554',
            // }
          },
        },
      ]
    };


    that.myChart.setOption(option);
  }
  render() {
    return (
       <div className="leak-date" ></div>
    );
  }
}
