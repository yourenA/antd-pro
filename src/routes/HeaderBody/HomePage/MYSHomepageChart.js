import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import {injectIntl} from 'react-intl';

@injectIntl
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
    // setTimeout(function () {
    //   that.dynamic();
    // }, 0);
    window.addEventListener('resize', this.resizeChart)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.last30day !== this.props.last30day) {
      this.dynamic(nextProps.last30day);
    }
    if (nextProps.last12month !== this.props.last12month) {
      this.dynamic2(nextProps.last12month);
    }
  }

  resizeChart = () => {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart2.resize();
    }
  }
  dynamic = (data) => {
    const {intl: {formatMessage}} = this.props;
    console.log('data', data)
    if (data.length === 0) return false;
    this.myChart = this.echarts.init(document.querySelector('.last-30days-water-consumption'));
    const lengendData = [];
    const xAxisData = [];
    const seriesData = [];
    let coldData = [];
    let hotData = [];
    for (let i = 0; i < data.length; i++) {
      lengendData.push(data[i].meter_model_name);
      const diffrentValvue = [];
      for (let k = 0; k < data[i]['detail'].length; k++) {
        diffrentValvue.push(data[i]['detail'][k].difference_value);
        if (i === 0) {
          coldData.push(data[i]['detail'][k].difference_value)
        }
        if (i === 1) {
          hotData.push(data[i]['detail'][k].difference_value)
        }
      }

      seriesData.push({
        markLine: {
          data: [
            {type: 'average', name: formatMessage({id: 'intl.average_value'})}
          ],
          label: {
            show: true,
            formatter: '{b}: {d}'
          }
        },
        z: 10,
        name: data[i].meter_model_name,
        type: 'bar',
        data: diffrentValvue,
        itemStyle: {
          normal: {
            color: i === 0 ? '#93f5ff' : '#c23531',
          }
        }
      })
    }
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='mys'){
      seriesData.push({
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['80%', '18%'],
        z: 100,
        label: {
          formatter: '{b}: ({d}%)'
        },
        tooltip: {
          trigger: 'item',
          formatter: "比例 <br/>{b} : {c} ({d}%)"
        },
        data: [{
          name: '冷水表',
          value: coldData[coldData.length - 1],
          itemStyle: {
            normal: {
              color: '#93f5ff',
            }
          }
        }, {
          name: '热水表',
          value: hotData[hotData.length - 1],
          itemStyle: {
            normal: {
              color: '#c23531',
            }
          }
        }]
      })
    }

    console.log('seriesData', seriesData)
    for (let j = 0; j < data[0]['detail'].length; j++) {
      xAxisData.push(data[0]['detail'][j].date)
    }
    let option = {
      title: [{
        text: formatMessage({id: 'intl.meter_consumption_last_30_days'}),
        top: 3,
        textStyle: {
          color: '#fff'
        }
      }, {
        id: 'subtext',
        show:company_code==='mys',
        subtext: xAxisData[xAxisData.length - 1],
        left: '80%',
        top: '30%',
        textAlign: 'center',
        subtextStyle: {
          color: '#fff'
        }
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        }

      },
      legend: {
        data: lengendData,
        x: 'center',
        top: '90%',
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: 50
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          },
          nameTextStyle: {
            color: '#fff'
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: formatMessage({id: 'intl.water_consumption'}),
          axisLabel: {
            formatter: '{value} T',
            textStyle: {
              color: '#fff'
            }
          },
          nameTextStyle: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          },
        },
      ],
      series: seriesData
    };

    const that = this;
    that.myChart.setOption(option);
    if(company_code==='mys'){
      that.myChart.on('updateAxisPointer', function (event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo && that.state.now30 !== xAxisInfo.value) {
          that.setState({
            now30: xAxisInfo.value
          })
          that.myChart.setOption({
            title: {
              id: 'subtext',
              subtext: xAxisData[xAxisInfo.value],
            },
            series: {
              id: 'pie',
              data: [{
                name: '冷水表',
                value: coldData[xAxisInfo.value],
                itemStyle: {
                  normal: {
                    color: '#93f5ff',
                  }
                }
              }, {
                name: '热水表',
                value: hotData[xAxisInfo.value],
                itemStyle: {
                  normal: {
                    color: '#c23531',
                  }
                }
              }]
            }
          });
        }
      });

    }
  }
  dynamic2 = (data) => {
    const {intl: {formatMessage}} = this.props;
    console.log('data', data)
    if (data.length === 0) return false;
    this.myChart2 = this.echarts.init(document.querySelector('.last-12months-water-consumption'));
    const lengendData = [];
    const xAxisData = [];
    const seriesData = [];
    let coldData = [];
    let hotData = [];
    const company_code = sessionStorage.getItem('company_code');
    for (let i = 0; i < data.length; i++) {
      lengendData.push(data[i].meter_model_name);
      const diffrentValvue = [];
      for (let k = 0; k < data[i]['detail'].length; k++) {
        diffrentValvue.push(data[i]['detail'][k].difference_value);
        if (i === 0) {
          coldData.push(data[i]['detail'][k].difference_value)
        }
        if (i === 1) {
          hotData.push(data[i]['detail'][k].difference_value)
        }
      }
      seriesData.push({
        name: data[i].meter_model_name,
        // label: {
        //   normal: {
        //     show: true,
        //     // position: 'insideRight'
        //   }
        // },
        markLine: {
          data: [
            {type: 'average', name: formatMessage({id: 'intl.average_value'})}
          ]
        },
        type: 'bar',
        data: diffrentValvue,
        itemStyle: {
          normal: {
            color: i === 0 ? '#93f5ff' : '#c23531',
          }
        }
      })
    }
    if(company_code==='mys'){
      seriesData.push({
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['80%', '18%'],
        z: 100,
        label: {
          formatter: '{b}: ({d}%)'
        },
        tooltip: {
          trigger: 'item',
          formatter: "比例 <br/>{b} : {c} ({d}%)"
        },
        data: [{
          name: '冷水表',
          value: coldData[coldData.length - 1],
          itemStyle: {
            normal: {
              color: '#93f5ff',
            }
          }
        }, {
          name: '热水表',
          value: hotData[hotData.length - 1],
          itemStyle: {
            normal: {
              color: '#c23531',
            }
          }
        }]
      })
    }
    console.log('seriesData', seriesData)

    for (let j = 0; j < data[0]['detail'].length; j++) {
      xAxisData.push(data[0]['detail'][j].date)
    }
    let option = {
      title: [{
        text: formatMessage({id: 'intl.meter_consumption_last_12_months'}),
        top: 3,
        textStyle: {
          color: '#fff'
        }
      }, {
        id: 'subtext',
        show:company_code==='mys',
        subtext: xAxisData[xAxisData.length - 1],
        left: '80%',
        top: '30%',
        textAlign: 'center',
        subtextStyle: {
          color: '#fff'
        }
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        }

      },
      grid: {
        left: 80
      },
      legend: {
        data: lengendData,
        x: 'center',
        top: '90%',
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          },
          nameTextStyle: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },


        }
      ],
      yAxis: [
        {
          type: 'value',
          name: formatMessage({id: 'intl.water_consumption'}),
          axisLabel: {
            formatter: '{value} T',
            textStyle: {
              color: '#fff'
            }
          },
          nameTextStyle: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          },
        },
      ],
      series: seriesData
    };

    const that = this;
    that.myChart2.setOption(option);
    if(company_code==='mys'){
      that.myChart2.on('updateAxisPointer', function (event) {
      var xAxisInfo = event.axesInfo[0];
      if (xAxisInfo && that.state.now12 !== xAxisInfo.value) {
        that.setState({
          now12: xAxisInfo.value
        })
        that.myChart2.setOption({
          title: {
            id: 'subtext',
            subtext: xAxisData[xAxisInfo.value],
          },
          series: {
            id: 'pie',
            data: [{
              name: '冷水表',
              value: coldData[xAxisInfo.value],
              itemStyle: {
                normal: {
                  color: '#93f5ff',
                }
              }
            }, {
              name: '热水表',
              value: hotData[xAxisInfo.value],
              itemStyle: {
                normal: {
                  color: '#c23531',
                }
              }
            }]
          }
        });
      }
    });


    }
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
