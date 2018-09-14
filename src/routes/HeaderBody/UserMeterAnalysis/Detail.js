import React, { PureComponent } from 'react';
import { Tabs,DatePicker,Button} from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;
import {getTimeDistance,disabledDate,errorNumber} from './../../../utils/utils';
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
    request(`/member_meter_data/${this.props.meter_number}`,{
      method:'GET',
      params:{
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),
        return:'all'
      }
    }).then((response)=>{
      console.log(response);
      that.dynamic(response.data)
    });
  }
  dynamic=(data)=>{
    let Date=[];
    let Data=[];
    let diffData=[];
    forEach(data,(value)=>{
      Date.push(value.date);
      if(value.value.toString().indexOf(errorNumber)>=0){
        Data.push('-')
      }else{
        Data.push(value.value)
      }
      diffData.push(value.difference_value)
    })
    this.myChart = this.echarts.init(document.querySelector('.month-analysis'));
    let option = {
      tooltip: {
        trigger: 'axis' //只显示一条线
      },
      toolbox: {
        show: false,
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
        // type: 'category',
        // boundaryGap: false,//坐标轴两边留白策略.默认为 true，这时候刻度只是作为分隔线
        silent: false,
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false},
        data:Date
      },
      yAxis:  [
        {
          type: 'value',
          name: '水表读数',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#1890ff'
            }
          },
        },
        {
          type: 'value',
          name: '用水量',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#c23531'
            }
          },
        },
      ],
      series: [
        {
          name:'水表读数',
          type:'bar',
          data:Data,
          itemStyle:{
            normal: {
              color: '#1890ff',
            }
          }
        },
        {
          name:'用水量',
          type:'line',
          yAxisIndex: 1,
          data:diffData,
          smooth: true,
          itemStyle:{
            normal: {
              color: '#c23531',
            }
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
    console.log('value',value)
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
