import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import request from "./../../../utils/request";
export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.echarts = window.echarts;
    this.myChart = [];
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.getData();
    this.timer = setInterval(function () {
      that.getData()
    }, 120000)

  }

  getData = ()=> {
    console.log('get data')
    const that = this;
    request(`/valve_sensors`, {
      method: 'get',
      params: {
        return: 'all'
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data
      },function () {
        that.dynamic(this.state.data);
      })
      // that.dynamic(response.data.data)
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }

    }
  }
  dynamic = (data)=> {
    if (data.length === 0) {
      return
    }
    const that = this;
    setTimeout(function () {
      for (let i = 0; i < data.length; i++) {
        that['myChart' + i] = that.echarts.init(document.querySelector(`.valve-item-${i}`));
        that.myChart.push(that['myChart' + i])
        let spare = 100 - parseFloat(data[i].current_value)
        let option = {
          backgroundColor: '#eee',
          title : {
            text: data[i].number,
            x:'right',
            textStyle:{
              fontSize:16
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}% "
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['当前阀门开度', '']
          },
          series: [
            {

              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {
                  value: parseFloat(data[i].current_value), name: '当前阀门开度'
                  ,
                  itemStyle: {
                    normal: {
                      color: '#3398DB',
                    }
                  }
                },
                {
                  value: spare, name: '',
                  itemStyle: {
                    normal: {
                      color: '#FFF',
                    }
                  },
                  label: {
                    normal: {
                      show: false
                    },
                    emphasis: {
                      show: false
                    }
                  },
                  lableLine: {
                    normal: {
                      show: false
                    },
                    emphasis: {
                      show: false
                    }
                  },
                },
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


        that['myChart' + i].setOption(option);

        that['myChart' + i].dispatchAction({
          type: 'showTip',
          seriesIndex:0 ,//第几条series
          dataIndex: 0,//第几个tooltip
        });
      }
    }, 600)


  }
  showDetail=(item)=>{
    this.setState({
      number: item.number,
      showModal: true
    })
  }
  render() {
    const that = this;

    return (
      <div className="content">
            {this.state.data.length>0?
              <Row gutter={0}>
                {this.state.data.map((item, index)=> {
                  return <Col xs={24} sm={24} md={24} lg={12} xl={12} key={index}>
                    <div className={ `valve-item-${index}`} style={{width: '100%', height: '150px'}}></div>
                  </Col>
                })}

              </Row>
              :<h3 style={{textAlign:'center'}}>无数据</h3>}

      </div>
    );
  }
}
