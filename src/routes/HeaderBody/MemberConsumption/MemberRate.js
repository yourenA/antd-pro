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
    if((nextProps.data !== this.props.data) && nextProps.data.length>0){
      this.setState({
        activeKey:'0'
      })
      this.dynamic(nextProps.data[0]);
    }
  }
  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  dynamic = (data)=> {
    let model_legend=[];
    let model_data=[];
    let meter_data=[];
    let meter_legend=[];
    // data={
    //   meter_models:[{difference_value:10,meter_model_name:'PMV15'},{difference_value:5,meter_model_name:'PMV100'}],
    //   meters:[{meter_number:'0001',meter_model_name:'PMV15',difference_value:'3'},
    //     {meter_number:'0005',meter_model_name:'PMV100',difference_value:'2'},
    //     {meter_number:'0003',meter_model_name:'PMV15',difference_value:'4'},
    //     {meter_number:'0002',meter_model_name:'PMV15',difference_value:'3'},
    //     {meter_number:'0004',meter_model_name:'PMV100',difference_value:'3'},
    //    ]
    // }
    for(let i=0;i<data.meter_models.length;i++){
      model_data.push({value:data.meter_models[i].difference_value, name:data.meter_models[i].meter_model_name})
        if(model_legend.indexOf(data.meter_models[i].meter_model_name)<0){
          model_legend.push(data.meter_models[i].meter_model_name)
        }
    }
    for(let j=0;j<data.meters.length;j++){
      if(meter_legend.indexOf(data.meters[j].meter_number)<0){
        meter_legend.push(data.meters[j].meter_number)
      }
    }
    for(let k=0;k<model_legend.length;k++){
      for(let m=0;m<data.meters.length;m++){
        if(data.meters[m].meter_model_name===model_legend[k]){
          meter_data.push({value:data.meters[m].difference_value, name:data.meters[m].meter_number})
        }
      }

    }
    console.log('legend',model_legend.concat(meter_legend))
    this.myChart = this.echarts.init(document.querySelector('.member-rate-analysis'));
    const {isMobile} =this.props.global;
    let option =  {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data:model_legend.concat(meter_legend)
      },
      series: [
        {
          name:'用水量',
          type:'pie',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:model_data
        },
        {
          name:'用水量',
          type:'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c|{c}}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                },
                c:{
                  fontSize:16
                }
              }
            }
          },
          data:meter_data
        }
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }
  changeTab=(key)=>{
    this.setState({
      activeKey:key
    })
    this.dynamic(this.props.data[key])
  }
  render() {
    const renderTabGrounp=this.props.data&&this.props.data.map((item,index)=>{
      return(
        <TabPane tab={item.date} key={index} forceRender={true}>
        </TabPane>
      )
    })
    return (
      <div className="site-name">
        <Tabs activeKey={this.state.activeKey} onChange={this.changeTab}>
          {renderTabGrounp}
        </Tabs>
        <div  style={{position:'relative'}}>
          <div className="member-rate-analysis" ></div>
        </div>
      </div>
    );
  }
}
