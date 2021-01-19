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
    request(`/pressure_sensor_historical_data`, {
      method: 'GET',
      params: {
        pressure_sensor_number: this.props.number,
        date: moment(date).format('YYYY-MM-DD')
      }
    }).then((response)=> {

      console.log(response);
      if (response.status === 200) {
        if(response.data.data.length>0){
          let data=[]

          for (let j = 0; j < response.data.data[0].values.length; j++) {
            let hour = Math.floor((j * 15) / 60);
            let min = (j * 15) % 60;
            data.push({time:`${fixedZero(hour)}:${fixedZero(min)}`,value:response.data.data[0].values[j]})

          }
          this.setState({
            data: data
          })
          that.dynamic(response.data.data[0])
        }else{
          this.setState({
            data: []
          })
          this.dynamic([]);
        }

      }

    });
  }

  dynamic = (data)=> {
    const {intl:{formatMessage}} = this.props;
    if (this.myChart) {
      this.myChart.clear();
    }
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
        text: '每15分钟压力值',
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
          name: '压力值（KPa）',
          axisLine: {
            lineStyle: {
              color:textColor
            }
          },
        },

      ],
      series: {
        name: '压力值',
        type: 'bar',
        data: data.values
      }
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
      {title: '压力值（KPa）' , dataIndex: 'value', key: 'value'},
  ]
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
