import React, {PureComponent} from 'react';
import {fixedZero} from './../../../utils/utils'
export default class DMArate extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {}
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.data !== this.props.data) && nextProps.data){
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
  dynamic = (data)=> {
    console.log('data',data)
    this.myChart = this.echarts.init(document.querySelector('.PressureLineChart'));
    let series=[];
    let legend=[];
    let xAxis=[];
    for(let j=0;j<(24*4);j++){
      let hour=Math.floor((j * 15) / 60);
      let min=(j * 15) % 60;
      xAxis.push(`${fixedZero(hour)}:${fixedZero(min)}`)

    }
    for(let i=0;i<data.length;i++){
      legend.push(data[i].pressure_sensor_number)
      series.push(
        {
          name:data[i].pressure_sensor_number,
          type:'line',
          smooth: true,
          data:data[i].values
        }
      )
    }
    let option =  {
      title : {
        text: '压力传感器曲线图',
        x:'left',
      },
      backgroundColor: '#eee',
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data:legend
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
      toolbox: {
        feature: {
          saveAsImage: {},
          dataView:{}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '时间',
        data: xAxis
      },
      yAxis: {
        type: 'value',
        name: '单位:KPa',
      },
      series: series
    };

    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="PressureLineChart"></div>
    );
  }
}
