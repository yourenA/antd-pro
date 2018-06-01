import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Radio,DatePicker,Button,Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import {connect} from 'dva';
@connect(state => ({
  global:state.global,
}))
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
    window.addEventListener('resize', this.resizeChart)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.data.flow_meters !== this.props.data.flow_meters) && nextProps.data.flow_meters.length>0){
      this.setState({
        activeKey:'0'
      })
      this.dynamic(nextProps.data.flow_meters[0]);
    }
  }
  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  dynamic = (data)=> {
     let  difference_values=0;
    for(let i=0;i<data.difference_values.length;i++){
      if(Number(data.difference_values[i])){
        difference_values=difference_values+data.difference_values[i];
      }
    }
    this.myChart = this.echarts.init(document.querySelector('.site-data-chart'));
    const {isMobile} =this.props.global;
    let option = {
      backgroundColor: '#eee',
      title: {
        text: `${data.is_forward_explain}-${data.site_name}  ${isMobile?'\n':''}读值 : ${difference_values.toFixed(2)} `,
        x: isMobile?'right':'center',
        textStyle:{
          fontSize:isMobile?14:16
        }
      },
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
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      },
      series: [
        {
          name:  '读值',
          type: 'line',
          smooth: true,
          data:data.difference_values,
          itemStyle:{
            normal: {
              color:data.is_forward===-1? '#c23531':'#2f4554',
            }
          },
        },
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }
  changeTab=(key)=>{
    this.setState({
      activeKey:key
    })
    this.dynamic(this.props.data.flow_meters[key])
  }
  render() {
    const renderTabGrounp=this.props.data.flow_meters&&this.props.data.flow_meters.map((item,index)=>{
      return(
        <TabPane tab={item.is_forward===-1?<span style={{color:'#c23531'}}>{item.site_name}</span>:item.site_name} key={index} forceRender={true}>
        </TabPane>
      )
    })
    return (
      <div className="site-name">
        <Tabs activeKey={this.state.activeKey} onChange={this.changeTab}>
          {renderTabGrounp}
        </Tabs>
        <div  style={{position:'relative'}}>
          <div className="site-data-chart" ></div>
        </div>
      </div>
    );
  }
}
