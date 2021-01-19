import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// import  Detail from './LiquidHistory'
import {Table, Card, Popconfirm, Layout, message, Row, Col,Button,Modal} from 'antd';
import Detail from './Chart.js'
import request from "./../../../utils/request";
import max from 'lodash/max'
import {injectIntl} from 'react-intl';
import Sider from "../EmptySider";
import Search from "./Search";
const {Content} = Layout;
@injectIntl
export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.echarts = window.echarts;
    this.myChart = [];
    this.state = {
      data: [],
      maxValue: 0,
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.handleSearch({
      number: '',
    });
    // this.timer = setInterval(function () {
    //   that.handleSearch({
    //     number: '',
    //   })
    // }, 20000)

  }
  handleFormReset = () => {
    this.handleSearch({
      number: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values ) => {
    console.log('get data')
    const that = this;
    request(`/all_workstations`, {
      method: 'get',
      params: {
        template: 51300401,
      }
    }).then((response) => {
      console.log(response);
      that.setState({
        data: response.data.data
      }, function () {
        that.dynamic(that.state.data);
      })
    })
  }

  componentWillUnmount() {
    // clearInterval(this.timer)
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = () => {
    if (this.myChart.length > 0) {
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
        let spare = '';
        let realSpare=''
        if(data[i].workstation_data.modbus.length>0&&data[i].workstation_data.modbus[0].ain0){
          realSpare=((Number(data[i].workstation_data.modbus[0].ain0)-4)/16*100).toFixed(2)
          spare = 100-realSpare
        }
        let option = {
          backgroundColor: '#eee',
          title : {
            text: data[i].name,
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
            data: ['蝶阀开度' , ''],
            formatter: function (name) {
              return realSpare?`${name} ${realSpare} %`:''
            },
          },
          series: [
            {

              type: 'pie',
              radius: '50%',
              center: ['50%', '55%'],
              data: [
                {
                  value: parseFloat(data[i].current_value),
                  name: '蝶阀开度'
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

  showDetail = (item) => {
    this.setState({
      maxValue: item.max_actual_value,
      number: item.number,
      showModal: true
    })
  }

  render() {
    const {intl: {formatMessage}} = this.props;
    return (
      <Layout className="layout">
        <Sider/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name:  formatMessage({id: 'intl.data_analysis'})},
              {name: formatMessage({id: 'intl.yk0802da_history'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                {this.state.data.length > 0 ?
                  <Row gutter={24}>
                    {this.state.data.map((item, index) => {
                      return <Col style={{marginBottom:'15px'}} xs={1} sm={24} md={12} lg={6} xl={6} xxl={4} key={index}>
                        <div className={`valve-item-${index}`} style={{width: '100%', height: '200px'}}></div>
                        <Button type="primary" block onClick={() => {
                          this.showDetail(item)
                        }}>{formatMessage({id: 'intl.detail'})}</Button>
                      </Col>
                    })}

                  </Row>
                  : <h3 style={{textAlign: 'center'}}>{formatMessage({id: 'intl.no_data'})}</h3>}
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
              <Detail maxValue={this.state.maxValue} number={this.state.number}/>
            </Modal>
          </div>

        </Content>
      </Layout>
    );
  }
}
