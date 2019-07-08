import React, {PureComponent} from 'react';
import {fixedZero} from './../../../utils/utils'
import request from './../../../utils/request'
import {injectIntl} from 'react-intl';
import {disabledDate} from './../../../utils/utils'
import {DatePicker,Tabs,Table} from 'antd'
import moment from 'moment';
const TabPane = Tabs.TabPane;
@injectIntl
export default class DMArate extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {
      date: moment(),
      data:[]
    }
  }

  componentDidMount() {
    console.log('this.props.editRecord.body',this.props.editRecord.body)
    if(this.props.editRecord.body){
      this.dynamic(this.props.editRecord.body)
    }
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
    parseDate.push(data.fmv0)
    parseDate.push(data.fmv1)
    parseDate.push(data.fmv2)
    parseDate.push(data.fmv3)
    parseDate.push(data.fmv4)
    parseDate.push(data.fmv5)
    parseDate.push(data.fmv6)
    parseDate.push(data.fmv7)
    parseDate.push(data.fmv8)
    parseDate.push(data.fmv9)
    parseDate.push(data.fmv10)
    parseDate.push(data.fmv11)
    parseDate.push(data.fmv12)
    parseDate.push(data.fmv13)
    parseDate.push(data.fmv14)
    parseDate.push(data.fmv15)
    parseDate.push(data.fmv16)
    parseDate.push(data.fmv17)
    parseDate.push(data.fmv18)
    parseDate.push(data.fmv19)
    parseDate.push(data.fmv20)
    parseDate.push(data.fmv21)
    parseDate.push(data.fmv22)
    parseDate.push(data.fmv23)

    for (let j = 0; j <24; j++) {
      xAxis.push(`${j} 点`)

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
        <div className="PressureLineChart"></div>

      </div>

    );
  }
}
