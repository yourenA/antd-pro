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
    this.fetch(this.state.date)
    window.addEventListener('resize', this.resizeChart)

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
  fetch = (date)=> {
    const that = this;
    request(`/meter_detailed_data`, {
      method: 'GET',
      params: {
        meter_number: this.props.meter_number,
        date: moment(date).format('YYYY-MM-DD')
      }
    }).then((response)=> {

      console.log(response);
      if (response.status === 200) {
        let data=[]
        for (let j = 0; j < response.data.values.length; j++) {
          let hour = Math.floor((j * 15) / 60);
          let min = (j * 15) % 60;
          data.push({time:`${fixedZero(hour)}:${fixedZero(min)}`,value:response.data.values[j],temperature_values:response.data.temperature_values[j]})

        }
        this.setState({
          data: data
        })
        that.dynamic(response.data)
      }

    });
  }

  dynamic = (data)=> {
    const {intl:{formatMessage}} = this.props;
    if (this.myChart) {
      this.myChart.clear();
    }
    const company_code = sessionStorage.getItem('company_code');
    this.myChart = this.echarts.init(document.querySelector('.PressureLineChart'));
    let series = [];
    let legend = [];
    let xAxis = [];
    let textColor = '#eee'
    for (let j = 0; j < (24 * 4); j++) {
      let hour = Math.floor((j * 15) / 60);
      let min = (j * 15) % 60;
      xAxis.push(`${fixedZero(hour)}:${fixedZero(min)}`)

    }
    let option = {
      color: ['#1890ff', '#d48265', '#FF69B4', '#ca8622'],
      title: {
        text: '每15分钟数据',
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
          name: formatMessage({id: 'intl.water_consumption'}),
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
        data: data.values
      }]
    };
    if(company_code==='mys'||company_code==='amwares'||company_code==='zhsgy'){
      option.yAxis.push( {
        type: 'value',
        name: formatMessage({id: 'intl.water_temperature'}) ,
        axisLine: {
          lineStyle: {
            color:textColor
          }
        },
        splitLine: {
          show: false
        }
      })
      option.series.push( {
        name: formatMessage({id: 'intl.water_temperature'}) ,
        type: 'line',
        yAxisIndex: 1,
        data: data.temperature_values
      })
    }
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
        <DatePicker value={this.state.date} onChange={this.changeDate} disabledDate={disabledDate}/>

        <Tabs defaultActiveKey="1" >
          <TabPane tab={formatMessage({id: 'intl.line_chart'})} key="1"> <div className="PressureLineChart"></div></TabPane>
          <TabPane tab={formatMessage({id: 'intl.table'})} key="2">
            <Table
              className={'meter-table'}
              bordered
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              size="small"
              rowKey={record => record.time}
            />
          </TabPane>
        </Tabs>

      </div>

    );
  }
}
