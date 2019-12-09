import React, {PureComponent} from 'react';
import {disabledDate,getTimeDistance} from './../../../utils/utils'
import request from './../../../utils/request'
import { DatePicker,Button} from 'antd';
import {injectIntl} from 'react-intl';
import moment from 'moment';
const ButtonGroup = Button.Group;
@injectIntl
export default class DMArate extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {
      date: moment(),
      data:[],
      rangePickerValue: [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
    }
  }

  componentDidMount() {
    this.fetch()
    // if(this.props.editRecord.body){
    //   this.dynamic(this.props.editRecord.body)
    // }
  }
  fetch=(cb)=> {
    const that = this;
    request(`/complete_meter_data/`, {
      method: 'GET',
      params:{
        meter_number:this.props.editRecord.meter_number,
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),

      }
    }).then((response)=>{
      if(response.status===200){
        this.dynamic(response.data.data)
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.data !== this.props.data) && nextProps.data) {
      console.log('重新渲染')
      this.dynamic(nextProps.data);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  changeDate = (date, dateString)=> {
    this.setState({date:date})
    this.fetch(date)
  }

  dynamic = (data)=> {
    const {intl:{formatMessage}} = this.props;
    if (this.myChart) {
      this.myChart.clear();
    }

    const company_code = sessionStorage.getItem('company_code');
    this.myChart = this.echarts.init(document.querySelector('.PressureLineChart'));
    let xAxis = [];
    let textColor = '#eee';
    let parseDate=[];
    for(let i=0;i<data.length;i++){
      parseDate.push(data[i].body.fmv0)
      parseDate.push(data[i].body.fmv1)
      parseDate.push(data[i].body.fmv2)
      parseDate.push(data[i].body.fmv3)
      parseDate.push(data[i].body.fmv4)
      parseDate.push(data[i].body.fmv5)
      parseDate.push(data[i].body.fmv6)
      parseDate.push(data[i].body.fmv7)
      parseDate.push(data[i].body.fmv8)
      parseDate.push(data[i].body.fmv9)
      parseDate.push(data[i].body.fmv10)
      parseDate.push(data[i].body.fmv11)
      parseDate.push(data[i].body.fmv12)
      parseDate.push(data[i].body.fmv13)
      parseDate.push(data[i].body.fmv14)
      parseDate.push(data[i].body.fmv15)
      parseDate.push(data[i].body.fmv16)
      parseDate.push(data[i].body.fmv17)
      parseDate.push(data[i].body.fmv18)
      parseDate.push(data[i].body.fmv19)
      parseDate.push(data[i].body.fmv20)
      parseDate.push(data[i].body.fmv21)
      parseDate.push(data[i].body.fmv22)
      parseDate.push(data[i].body.fmv23)
    }


    for (let j = 0; j <24*data.length; j++) {
      xAxis.push(`${j%24} 点`)

    }
    let option = {
      color: ['#1890ff', '#d48265', '#FF69B4', '#ca8622'],
      title: {
        text: '每小时使用量',
        x: 'left',
        textStyle: {
          color: textColor
        }
      },
      backgroundColor: '#404a59',
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          textStyle:{
            color: textColor
          },
          dataBackground:{
            lineStyle:{
              color:'#fff'
            },
            areaStyle:{
              color:'#fff'
            }
          }
        },{
        type: 'inside'
      }],

      xAxis: [
        {
          type: 'category',
          data: xAxis,
          axisLine: {
            lineStyle: {
              color: textColor
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '使用量',
          axisLine: {
            lineStyle: {
              color:textColor
            }
          },
        },
      ],
      series: [{
        name: formatMessage({id: 'intl.water_consumption'}),
        type: 'bar',
        data: parseDate
      }]
    };
    const that = this;
    that.myChart.setOption(option);
  }
  selectDate = (type) => {
    const that=this;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    },function () {
      that.fetch()
    });
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
  render() {
    const {intl:{formatMessage}} = this.props;
    const columns = [
      {
        title:formatMessage({id: 'intl.index'}),
        dataIndex: 'id',
        key: 'id',
        width: 60,
        className: 'table-index',
        render: (text, record, index) => {
          return (index+1)
        }
      },
      {title: formatMessage({id: 'intl.time'}), dataIndex: 'time', key: 'time'},
      {title: formatMessage({id: 'intl.water_consumption'}) , dataIndex: 'value', key: 'value'}
  ]
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='mys'||company_code==='amwares'||company_code==='zhsgy'){
      columns.push(
        {title: formatMessage({id: 'intl.water_temperature'}) , dataIndex: 'temperature_values', key: 'temperature_values'}
      )
    }
    return (
      <div>
        <div style={{marginBottom:'12px '}}>
          <ButtonGroup>
            <Button  onClick={() => this.selectDate('today')} type={this.isActive('today')?'primary':''}>{formatMessage({id: 'intl.today'})}</Button>
            <Button  onClick={() => this.selectDate('week')} type={this.isActive('week')?'primary':''}>{formatMessage({id: 'intl.this_week'})}</Button>
            <Button  onClick={() => this.selectDate('month')} type={this.isActive('month')?'primary':''}>{formatMessage({id: 'intl.this_month'})}</Button>
          </ButtonGroup>

          <DatePicker
            value={this.state.rangePickerValue[0]}
            allowClear={false}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder={formatMessage({id: 'intl.start'})}
            onChange={(e)=>this.handleRangePickerChange(e,'start')}
          />
          <DatePicker
            allowClear={false}
            value={this.state.rangePickerValue[1]}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder={formatMessage({id: 'intl.end'})}
            onChange={(e)=>this.handleRangePickerChange(e,'end')}
          />
          <span style={{fontSize:'16px',padding:'3px 5px',marginLeft:'5px',fontWeight:'500'}}>{formatMessage({id: 'intl.total_water_consumption'})}:{this.state.difference_value}</span>
          {/*<RangePicker
            disabledDate={disabledDate}
            value={this.state.rangePickerValue}
            onChange={this.handleRangePickerChange}
            style={{width: 256}}
          />*/}
        </div>
        <div className="PressureLineChart"></div>

      </div>

    );
  }
}
