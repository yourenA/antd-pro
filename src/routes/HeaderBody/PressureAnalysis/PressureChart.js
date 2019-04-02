import React, {PureComponent} from 'react';
import {fixedZero} from './../../../utils/utils'
import {injectIntl} from 'react-intl';
@injectIntl
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
  dynamic = (data)=> {
    console.log('data',data)
    const {intl:{formatMessage}} = this.props;
    if(this.myChart){
      this.myChart.clear();
    }
    this.myChart = this.echarts.init(document.querySelector('.PressureLineChart'));
    let series=[];
    let legend=[];
    let xAxis=[];
    let textColor='#eee'
    for(let j=0;j<(24*4);j++){
      let hour=Math.floor((j * 15) / 60);
      let min=(j * 15) % 60;
      xAxis.push(`${fixedZero(hour)}:${fixedZero(min)}`)

    }
    for(let i=0;i<data.length;i++){
      legend.push(data[i].pressure_sensor_number);
      if(i===0){
        series.push(
          {
            name:data[i].pressure_sensor_number,
            type:'line',
            smooth: true,
            data:data[i].values,
            markArea: {
              data: [
                [{
                  yAxis:this.props.minimum_pressure_value,
                  itemStyle: {
                    normal: {
                      color: 'rgba(183,234,209,0.7)'
                    }
                  }
                }, {
                  yAxis: this.props.maximum_pressure_value
                }],
              ]
            },
          }
        )
      }else{
        series.push(
          {
            name:data[i].pressure_sensor_number,
            type:'line',
            smooth: true,
            data:data[i].values,
          }
        )
      }
    }
    series.push( {
      type:'line',
      markLine: {
        lineStyle:{
          normal: {
            color: textColor
          }
        },
        label: {
          normal: {
            formatter:   formatMessage({id: 'intl.min_effective_value'})+' '+this.props.minimum_pressure_value,
          }
        },
        data: [
          {
            yAxis: this.props.minimum_pressure_value
          },
        ]
      }
    }, {
      type:'line',
      markLine: {
        lineStyle:{
          normal: {
            color: textColor
          }
        },
        label: {
          normal: {
            formatter:  formatMessage({id: 'intl.max_effective_value'})+' '+this.props.maximum_pressure_value,
          }
        },
        data: [
          {
            yAxis: this.props.maximum_pressure_value
          },
        ]
      }
    })
    let option =  {
      color: ['#c23531', '#d48265', '#FF69B4', '#ca8622'],
      title : {
        text: '压力传感器曲线图',
        x:'left',
        textStyle: {
          color: textColor
        }
      },
      backgroundColor: '#404a59',
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data:legend,
        textStyle:{
          color: textColor
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
        },
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      toolbox: {
        iconStyle:{
          normal: {
            color: textColor
          }
        },
        feature: {
          saveAsImage: {},
          dataView:{}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
        axisLine: {
          lineStyle: {
            color: textColor
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '单位:KPa',
        axisLine: {
          lineStyle: {
            color:textColor
          }
        },
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
