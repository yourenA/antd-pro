import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {Card, Modal} from 'antd';
import {Row, Col,Button} from 'antd';
import  Detail from './ValveHistory'
import request from "./../../../utils/request";
import {injectIntl} from 'react-intl';
@injectIntl
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
    }, 20000)

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
        that.dynamic(that.state.data);
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
    const {intl:{formatMessage}} = this.props;
    function array2obj (array, key) {
      var resObj = {}
      for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i]
      }
      return resObj
    }
    setTimeout(function () {
      for (let i = 0; i < data.length; i++) {
        that['myChart' + i] = that.echarts.init(document.querySelector(`.valve-item-${i}`));
        that.myChart.push(that['myChart' + i])
        let spare = 100 - parseFloat(data[i].current_value);

        let option = {
          backgroundColor: '#eee',
          title : {
            text: data[i].number,
            subtext: data[i].address,
            subtextStyle: {
              color: '#272727',
              fontSize: 14
            },
            x:'right',
            top:5,
            right:5
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}% "
          },
          legend: {
            orient: 'vertical',
            bottom:'1%',
            data: [formatMessage({id: 'intl.current_valve_open_value'}) , ''],
            formatter: function (name) {
              return `${name} ${parseFloat(data[i].current_value)} %`
            },
          },
          series: [
            {

              type: 'pie',
              radius: '50%',
              center: ['50%', '55%'],
              data: [
                {
                  value: parseFloat(data[i].current_value), name: formatMessage({id: 'intl.current_valve_open_value'})
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
    const {intl:{formatMessage}} = this.props;
    return (
      <div className="content">
        <PageHeaderLayout title="系统管理 " breadcrumb={[{name:  formatMessage({id: 'intl.data_analysis'})},
          {name: formatMessage({id: 'intl.liquid/valve_analysis'})}, {name: formatMessage({id: 'intl.valve_sensors'}) }]}>
          <Card bordered={false} style={{margin: '-16px -16px 0'}}>
            {this.state.data.length>0?
              <Row gutter={16}>
                {this.state.data.map((item, index)=> {
                  return <Col  xs={1} sm={24} md={8} lg={8} xl={6} xxl={6} key={index}>
                    <div className={ `valve-item-${index}`} style={{width: '100%', height: '250px',}}></div>
                    <Button style={{marginBottom:'16px'}} type="primary" block onClick={()=>{this.showDetail(item)}}>{formatMessage({id: 'intl.detail'})}</Button>
                  </Col>
                })}

              </Row>
            :<h3 style={{textAlign:'center'}}>{formatMessage({id: 'intl.no_data'})}</h3>}

          </Card>
        </PageHeaderLayout>
        <Modal
          width="950px"
          destroyOnClose={true}
          title={`${this.state.number} ${formatMessage({id: 'intl.detail'})}`}
          visible={this.state.showModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({showModal: false})}
        >
         <Detail number={this.state.number}/>
        </Modal>
      </div>
    );
  }
}
