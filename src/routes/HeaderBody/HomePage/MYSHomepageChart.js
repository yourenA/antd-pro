import React, {PureComponent} from 'react';
import { Row, Col } from 'antd';
export default class MYSHomepageChart extends PureComponent {
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
    this.myChart = this.echarts.init(document.querySelector('.last-30days-water-consumption'));
    this.myChart2 = this.echarts.init(document.querySelector('.last-12months-water-consumption'));
    let option = {
      backgroundColor: '#eee',
      title: {
        text: '近30天冷、热水用水总量',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['热水', '冷水']
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月','1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '水量',
          axisLabel: {
            formatter: '{value} T'
          }
        },
      ],
      series: [
        {
          name: '热水',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: '冷水',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
      ]
    };

    let option2 = {
      backgroundColor: '#eee',
      title: {
        text: '近12个月冷、热水用水总量',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['热水','冷水']
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '水量',
          axisLabel: {
            formatter: '{value} T'
          }
        },
      ],
      series: [
        {
          name: '热水',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: '冷水',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
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
        <Row>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <div className="last-30days-water-consumption"></div>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <div className="last-12months-water-consumption"></div>
          </Col>
        </Row>
      </div>
    );
  }
}
