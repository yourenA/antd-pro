import React, { PureComponent } from 'react';
import { Tabs,DatePicker,Button,Table,Badge,Modal ,message,Alert} from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;
import {getTimeDistance,disabledDate,errorNumber,renderIndex} from './../../../utils/utils';
import request from './../../../utils/request'
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
    this.myChart2=null;
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      Data:[],
      difference_value:0,
      showEditBtn: find(this.permissions, {name: 'meter_data_edit'}),
      showdelBtn: find(this.permissions, {name: 'meter_data_delete'}),
      rangePickerValue: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
    }
  }
  componentDidMount() {
    this.fetch(this.props.site_id)
    window.addEventListener('resize', this.resizeChart)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.site_id !== this.props.site_id){
      this.fetch(nextProps.site_id )
    }
  }
  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  fetch=(site_id)=>{
    const that=this;
    request(`/monitoring_meter_data`,{
      method:'GET',
      params:{
        site_id:site_id,
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),
      }
    }).then((response)=>{
      console.log(response);
      this.setState({
        Data:response.data
      })
      that.dynamic(response.data)
    });
  }
  dynamic=(data)=>{
    this.myChart = this.echarts.init(document.querySelector('.value-analysis'));
    let date=[];
    let this_period=[];
    let same_period_last_month=[];
    let same_period_last_year=[];
    let difference_value=0;
    for(let i=0;i<data.length;i++){
      date.push(data[i].date);
      this_period.push(data[i].this_period)
      same_period_last_month.push(data[i].same_period_last_month)
      same_period_last_year.push(data[i].same_period_last_year)
      if(Number(data[i].this_period)){
        difference_value=(difference_value+Number(data[i].this_period)).toFixed(10)-0
      }
    }
    this.setState({
      difference_value:difference_value
    })
    let option = {

      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data:['本期','上月','去年同期']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
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
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'本期',
          type:'line',
          smooth: true,
          data:this_period
        },
        {
          name:'上月',
          type:'line',
          smooth: true,
          data:same_period_last_month
        },
        {
          name:'去年同期',
          type:'line',
          smooth: true,
          data:same_period_last_year
        }
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
        that.fetch(this.props.site_id)
      });
    }else{
      this.setState({
        rangePickerValue:[this.state.rangePickerValue[0],datePickerValue],
      },function () {
        that.fetch(this.props.site_id)
      });
    }
  }
  selectDate = (type) => {
    const that=this;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    },function () {
      that.fetch(this.props.site_id)
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
          <span style={{fontSize:'16px',padding:'3px 5px',marginLeft:'5px',fontWeight:'500'}}>总用水量:{this.state.difference_value}</span>
          {/*<RangePicker
           disabledDate={disabledDate}
           value={this.state.rangePickerValue}
           onChange={this.handleRangePickerChange}
           style={{width: 256}}
           />*/}
        </div>
         <div className="value-analysis"></div>
      </div>
    );
  }
}

export default Detail
