import React, {PureComponent} from 'react';
export default class Proportion extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.myChart2 = null;
    this.state = {}
  }

  componentDidMount() {
    const that = this;
    setTimeout(function () {
      that.dynamic();
    }, 0);
    window.addEventListener('resize', this.resizeChart)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart2.resize();
    }
  }
  dynamic = ()=> {
    this.myChart = this.echarts.init(document.querySelector('.concentrator-num'));
    this.myChart2 = this.echarts.init(document.querySelector('.meter-num'));
    let option = {
      title: {
        text: '平台集中器个数',
        bottom:0,
        left:'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      toolbox: {
        show: true,
        feature: {
          dataView: {readOnly: false},
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正确', '停报', '错报', '漏报']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            {value: 335, name: '正确'},
            {value: 1, name: '停报'},
            {value: 1, name: '错报'},
            {value: 0, name: '漏报'},
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    let option2 = {
      title: {
        text: '平台水表个数',
        bottom:0,
        left:'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      toolbox: {
        show: true,
        feature: {
          dataView: {readOnly: false},
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正确', '停报', '错报', '漏报']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            {value: 335, name: '正确',
              itemStyle:{
                normal: {
                  color: 'rgb(47,69,84)',
                }
              },},
            {value: 1, name: '停报'},
            {value: 1, name: '错报'},
            {value: 0, name: '漏报'},
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };


    const that = this;
    that.myChart.setOption(option);
    that.myChart2.setOption(option2);
  }

  render() {
    return (
      <div>
        <div className="concentrator-num"></div>
        <div className="meter-num"></div>
      </div>
    );
  }
}
