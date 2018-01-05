import React, {PureComponent} from 'react';
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {}
  }

  componentDidMount() {
    const that = this;
    setTimeout(function () {
      that.dynamic();
    }, 0)
    window.addEventListener('resize', this.resizeChart)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  dynamic = ()=> {
    console.log('online')
    this.myChart = this.echarts.init(document.querySelector('.concentratorOnline'));
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['在线', '休眠', '不稳', '失联']
      },
      yAxis: {
        type: 'value'
      },
      xAxis : {
        type: 'category',
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      },
      series: [
        {
          name: '在线',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: '#40c4ff',
            }
          },
          data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        },
        {
          name:  '休眠',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: 'rgb(97,160,168)',
            }
          },
          data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].reverse()
        },
        {
          name:  '不稳',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: 'rgb(47,69,84)',
            }
          },
          data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
        },
        {
          name: '失联',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: 'rgb(213,58,53)',
            }
          },
          data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].reverse()
        }
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="concentratorOnline"></div>
    );
  }
}
