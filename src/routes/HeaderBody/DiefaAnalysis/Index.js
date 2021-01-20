import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// import  Detail from './LiquidHistory'
import {Table, Card, Popconfirm, Layout, message, Row, Col,Button,Modal} from 'antd';
import Detail from './Chart.js'
import request from "./../../../utils/request";
import max from 'lodash/max'
import {connect} from 'dva';
import {injectIntl} from 'react-intl';
import Sider from "../EmptySider";
import Search from "./Search";
import AddTask from "../Workstations2/addTask";
import History from "../Workstations2/RTU03";
const {Content} = Layout;
@injectIntl
@connect(state => ({
  workstations2: state.workstations2,
}))
export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.echarts = window.echarts;
    this.myChart = [];
    this.state = {
      data: [],
      maxValue: 0,
      editRecord:{},
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.handleSearch({
      number: '',
    });
    this.timer = setInterval(function () {
      that.handleSearch({
        number: '',
      })
    }, 20000)

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
    if(  this.timer){
      clearInterval(this.timer)
    }

    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = () => {
    if (this.myChart.length > 0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  handleEditDA=()=>{
    const formValues = this.editDAFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'workstations2/addTask',
      payload: {
        id:this.state.editRecord.id,
        da0:formValues.da0!==''?16*(formValues.da0/100)+4:'',
        da1:formValues.da1!==''?16*(formValues.da1/100)+4:'',
        channel:0
      },
      callback:function () {
        message.success('修改开度成功')
        that.setState({
          taskModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    })
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
        if(data[i].workstation_data.modbus.length>0&&data[i].workstation_data.modbus[0].parameters.ain0){
          realSpare=((Number(data[i].workstation_data.modbus[0].parameters.ain0)-4)/16*100).toFixed(2)
          if(Number(realSpare)<0){
            spare = 100;
            realSpare=0
          }else{
            spare = 100-realSpare
          }

        }
        console.log('realSpare',realSpare)
        console.log('spare',spare)
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
              return realSpare!==''?`${name} ${realSpare} %`:''
            },
          },
          series: [
            {

              type: 'pie',
              radius: '50%',
              center: ['50%', '55%'],
              data: [
                {
                  value: realSpare,
                  name: '蝶阀开度'
                  ,
                  itemStyle: {
                    normal: {
                      color: '#3398DB',
                    }
                  }
                },
                {
                  value: spare,
                  name: '',
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

                        <Button.Group style={{width:'100%'}}>
                          <Button type="primary" style={{width:'50%'}} icon={'tool'} onClick={() => {
                            this.setState({
                              editRecord:item,
                              da0:item.hardware_configs.modbus[0].da0?(item.hardware_configs.modbus[0].da0-4)/16*100:0,
                              da1:item.hardware_configs.modbus[0].da1?(item.hardware_configs.modbus[0].da1-4)/16*100:0,
                              taskModal:true
                            })
                          }}>修改开度</Button>
                          <Button type="primary" style={{width:'50%'}} icon={'history'} onClick={() => {
                            this.setState({
                              editRecord:item,
                              historyModal:true
                            })
                          }}>历史纪录</Button>
                        </Button.Group>

                      </Col>
                    })}

                  </Row>
                  : <h3 style={{textAlign: 'center'}}>{formatMessage({id: 'intl.no_data'})}</h3>}
              </Card>
            </PageHeaderLayout>
            <Modal
              width={500}
              destroyOnClose={true}
              title={`修改 ${this.state.editRecord.name} 开度`}
              visible={this.state.taskModal}
              onCancel={() => this.setState({taskModal: false})}
              onOk={this.handleEditDA}
            >
              <AddTask da0={this.state.da0} da1={this.state.da1} editRecord={this.state.editRecord}
                       wrappedComponentRef={(inst)=> this.editDAFormRef = inst}/>
            </Modal>
            <Modal
              width={1100}
              destroyOnClose={true}
              title={`${this.state.editRecord.name} 历史纪录`}
              visible={this.state.historyModal}
              onCancel={() => this.setState({historyModal: false})}
              footer={null}
            >
              <History id={this.state.editRecord.id} name={this.state.editRecord.name} config_data={this.state.editRecord.hardware_configs}/>
            </Modal>
          </div>

        </Content>
      </Layout>
    );
  }
}
