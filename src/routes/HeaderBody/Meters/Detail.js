/**
 * Created by Administrator on 2017/3/21.
 */
import React, { Component, Fragment } from 'react';
import {
  Form,
  Button,
  Badge,
  Radio,
  Tooltip,
  DatePicker,
  Descriptions,
  Tag,
  Icon,
  Switch,
  message,
  Modal,
  Drawer,Alert
} from 'antd';
import { connect } from 'dva';
import forEach from 'lodash/forEach';
import request from '../../../utils/request';
import padStart from  'lodash/padStart'
import findIndex from 'lodash/findIndex'
import {
  getTimeDistance,
  renderValveOpen,
  download,
  formateObjToParamStr,
  renderConcerntorStatus,
} from '../../../utils/utils';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import ReactDataGrid from 'react-data-grid';
import find from 'lodash/find';
import FixedOrClearValue from './FixedOrClearValue';
import EditUnusualSpecial from './EditUnusualSpecial';
const { confirm } = Modal;
const ButtonGroup = Button.Group;

class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      currentValue:0,
      detail: {},
      totalVal: 0,
      showType: 1,
      historyData: [],
      valve_logs: [],
      showCustom: false,
      openValveLoading: false,
      closeValveLoading: false,
      rangePickerValue: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
    };
  }
  onChangeShowType = e => {
    this.setState({
      showType: e.target.value,
    });
  };
  componentDidMount() {
    console.log('this', this.props.editRecord);
    const that = this;
    that.fetchDetail();

  }

  fetchDetail = () => {
    const that = this;
    request(`/meters/${this.props.id}`, {
      method: 'GET',
      params: {},
    }).then((response) => {
      if (response.status === 200) {
        that.setState({
          detail: response.data,
        }, function() {
          that.fetchHistory();
          that.fetchCurrentValue()
        });
      }


    });
  };
  selectDate = (type) => {
    const that = this;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    }, function() {
      that.fetchHistory();
    });
  };
  fetchHistory = (cb) => {
    const that = this;
    request(`/member_meter_data/${this.state.detail.number}`, {
      method: 'GET',
      params: {
        started_at: that.state.rangePickerValue[0].format('YYYY-MM-DD'),
        ended_at: that.state.rangePickerValue[1].format('YYYY-MM-DD'),
        return:'all'
      },
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        let totalVal = 0;
        for(let i=0;i<response.data.length;i++){
          totalVal=totalVal+Number(response.data[i].difference_value)
        }
        that.setState({
          historyData: response.data,
          totalVal
        });
      }

    });
  };
  fetchCurrentValue = (cb) => {
    const that = this;
    request(`/member_meter_data/${this.state.detail.number}`, {
      method: 'GET',
      params: {
        started_at: moment().format('YYYY-MM-DD'),
        ended_at:moment().format('YYYY-MM-DD'),
        return:'all'
      },
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        if(response.data[0]){
          that.setState({
            currentValue:response.data[0].value
          })
        }

      }

    });
  };
  getOption = () => {
    const data = this.state.historyData;
    let Date = [];
    let Data = [];
    let diffData = [];
    let errDataIndex = [];
    let warmDataIndex = [];
    let difference_value = 0;
    forEach(data, (value, index) => {
      Date.push(value.date);
      Data.push(value.value);
      if (value.status !== 1) {
        errDataIndex.push(index);
      }
      diffData.push(value.difference_value);
    });

    let option =  {
      background: 'rgba(0,0,0,1)',
      color: ['#27e253','#3398DB'],
      title: {
        text: '用水量与水表读数关系图',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      toolbox: {
        right: '1%',
        feature: {
          saveAsImage: {},
          dataView: {readOnly: true},
        }
      },
      legend: {
        data: ['用水量','水表读数'],
        left: 10,
        top:10
      },
      axisPointer: {
        link: {xAxisIndex: 'all'}
      },
      dataZoom: [
        {
          show: true,
          xAxisIndex: [0, 1]
        },
        {
          type: 'inside',
          xAxisIndex: [0, 1]
        }
      ],
      grid: [{
        left: 50,
        right: 30,
        height: '35%'
      }, {
        left: 50,
        right: 30,
        top: '55%',
        height: '35%'
      }],
      xAxis: [
        {
          type: 'category',
          data: Date
        },
        {
          gridIndex: 1,
          type: 'category',
          data: Date,
          position: 'top'
        }
      ],
      yAxis: [
        {
          type: 'value',
        },
        {
          gridIndex: 1,
          type: 'value',
          min:Math.floor(Data[0])
        }
      ],
      series: [
        {
          name: '用水量',
          type: 'line',
          symbolSize: 8,
          data: diffData,
          lineStyle: {
            width: 3
          },
          markPoint: {
            symbol: 'rect',
            symbolOffset: [0, 10],
            symbolSize: [1, 1],
            data: [{
              type: 'max',
              name: '最大值',
            },
            ],
          },
          markLine: {
            silent: false,
            label: {
              formatter: '{b} {c}',
              position: 'middle'
            },
            data: [{
              name: '平均值',
              yAxis: (this.state.totalVal/(moment(this.state.rangePickerValue[1]).diff(moment(this.state.rangePickerValue[0]), 'days')+1))
            },]
          }
        },
        {
          name: '水表读数',
          type: 'bar',
          data:Data,
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle:{
            normal:{
              color: function(value) {
                if(errDataIndex.indexOf(value.dataIndex)>=0){
                  return '#c23531'
                } else{
                  return '#3398DB'
                }
              }
            }
          },
        }

      ]
    };
    return option;
  };
  handleRangePickerChange = (datePickerValue, type) => {
    const that = this;
    if (type === 'start') {
      this.setState({
        rangePickerValue: [datePickerValue, this.state.rangePickerValue[1]],
      }, function() {
        that.fetchHistory();
      });
    } else {
      this.setState({
        rangePickerValue: [this.state.rangePickerValue[0], datePickerValue],
      }, function() {
        that.fetchHistory();
      });
    }
  };
  renderValueStatus = (val) => {
    let status = 'success';
    let explain = '';
    switch (val) {
      case -4:
        status = 'error';
        explain = '抄表失败';
        break;
      case -2:
        status = 'warning';
        explain = '错报';
        break;
      case -1:
        status = 'warning';
        explain = '未上报';
        break;
      case 1:
        status = 'success';
        explain = '正常';
        break;
      default:
        status = 'success';
        explain = '正常';
    }
    return (
      <p>
        <Badge status={status}/>{explain}
      </p>
    );
  };
  renderStatus = (code) => {
    if (code === 1) {
      return (
        <Badge status="success"/>
      );
    } else if (code === -1) {
      return (
        <Badge status="error"/>
      );
    } else if (code === -2) {
      return (
        <Badge status="warning"/>
      );
    } else if (code === 0) {
      return (
        <Badge status="default"/>
      );
    } else {
      return null;
    }
  };
  valveCommand = (command,protocol) => {
    console.log('valveCommand',command)
    const {dispatch} = this.props;
    const that = this;
    request(`/user_command_data`, {
      method: 'POST',
      data:{
        meter_number:this.state.detail.number,
        feature: command,
        protocol:protocol?protocol:''
      }
    }).then((response) => {
      if (response.status === 200) {
        message.success('命令发送成功')
        console.log(command+(protocol?protocol:'')+'Loading')
        that.setState({
          [command+(protocol?protocol:'')+'Loading']:true
        })
        setTimeout(function() {
          that.setState({
            [command+(protocol?protocol:'')+'Loading']:false
          })
        },10000)
      }
    });
  }
  renderValveStatus=(val,explain)=>{
    let status='success';
    switch (val){
      case 1:
        status='success'
        break;
      case -1:
        status='error'
        break;
      default:
        status='success'
    }
    return (
      <p style={{marginBottom:'0'}}>
        <Badge status={status}/>{explain}
      </p>
    )
  }
  handleFixed=()=>{
    const that = this;
    const formValues =this.FixedForm.props.form.getFieldsValue();
    console.log('formValues',formValues)
    request(`/meter_data`,{
      method:'PUT',
      data:{
        started_at:moment(formValues.started_at).format("YYYY-MM-DD"),
        ended_at:moment(formValues.ended_at).format("YYYY-MM-DD"),
        meter_number:this.state.detail.number,
        value:formValues.value
      }
    }).then((response)=>{
      console.log(response);
      if(response.status===200){
        message.success('修正水表读数成功')
        that.setState({
          fixedModal: false
        })
        that.fetchHistory();
        that.fetchCurrentValue();
      }

    });
  }
  handleClear=()=>{
    const that = this;
    const formValues =this.clearForm.props.form.getFieldsValue();
    console.log('formValues',formValues)
    request(`/meter_data`,{
      method:'DELETE',
      data:{
        started_at:moment(formValues.started_at).format("YYYY-MM-DD"),
        ended_at:moment(formValues.ended_at).format("YYYY-MM-DD"),
        meter_number:this.state.detail.number,
      }
    }).then((response)=>{
      console.log(response);
      if(response.status===200){
        message.success('清除水表读数成功')
        that.setState({
          clearModal: false
        })
        that.fetchHistory();
        that.fetchCurrentValue();
      }

    });
  }
  findChildFunc = (cb)=> { //通过回调将子组件的方法提取到父属性中来
    this.findChildLocation = cb
  }
  handleEditUnusualSpecial=()=>{
    const that = this;
    const formValues =this.UnusualForm.props.form.getFieldsValue();
    console.log('formValues',formValues)
    if (formValues.value === undefined) {
      message.error('用水量报警值不能为空')
      return false
    }
    const consumption_abnormality_special_meters= this.findChildLocation();
    const editIndex = findIndex(consumption_abnormality_special_meters.value, function (o) {
      return o.number === that.state.detail.number;
    });
    console.log('editIndex', editIndex)
    if(editIndex>=0){
      consumption_abnormality_special_meters.value[editIndex].value = formValues.value;
    }else{
      consumption_abnormality_special_meters.value.push({
        number:  that.state.detail.number,
        value: formValues.value
      })
    }
    forEach(consumption_abnormality_special_meters.value, function (item, index) {
      delete item.name;
      delete item.id;
    });
    console.log('consumption_abnormality_special_meters',consumption_abnormality_special_meters)
    request(`/configs`, {
      method: 'PATCH',
      data: {
        consumption_abnormality_special_meters: consumption_abnormality_special_meters.value
      }
    }).then((response)=> {
      console.log(response);
      if (response.status === 200) {
        message.success('修改用水量报警成功')
        that.setState({
          UnusualModal: false
        });
      }
    })
  }
  render() {
    console.log('this.state.open_all_valveLoading',this.state.open_all_valveLoading)
    const defaultColumnProperties = {
      resizable: true,
    };
    const columns = [
      {
        name: '序号',
        width: 50,
        key: '_index',
        frozen: true,
        formatter: (event) => {
          return <p className={'index'}>{event.value + 1}</p>;
        },
      },
      {
        name: '日期',
        width: 100,
        key: 'date',
      },
      {
        name: '状态',
        width: 100,
        key: 'status',
        formatter: (event) =>{
          return this.renderValueStatus(event.value)
        }
      },
      {
        name: '用水量(m3)',
        width: 100,
        key: 'difference_value',
      },
      {
        name: '水表读数(m3)',
        width: 150,
        key: 'value',
      },
      {
        name: '水表读数(原始)',
        width: 150,
        key: 'upload_value',
      },

    ].map(c => ({ ...defaultColumnProperties, ...c }));
    const { detail } = this.state;
    const reverceData = [...this.state.historyData].reverse();
    return (
      <div>
        <div className="meter-background" style={{margin:'0 auto'}}>
          <div className="meter-value">
            {
              padStart(this.state.currentValue.toFixed(2), 9,0).split('.').join('').split('').map((item,index)=>{
                return <span style={{color:index>=6?'#e91e1e':'#000',width:'18px',display:'inline-block',textAlign:'center'}} key={index}>{item}</span>
              })
            }
            <h3 style={{position:'absolute',
              left:'50%', top: '60px',
              fontSize: '18px',fontFamily: 'auto',
              width: '100%',
              transform: 'translate(-50%, 0)',
              color: '#0082f4',
              textAlign: 'center'}}>{detail.meter_model_name}</h3>
          </div>
        </div>
        <Descriptions title={<div>
          <span>水表基本信息</span>
        </div>} bordered>
          <Descriptions.Item label="水表号" span={2}> <Tooltip
            title={detail.number}>{detail.number}</Tooltip></Descriptions.Item>
          <Descriptions.Item label="阀门状态" span={2}>{renderValveOpen(detail.valve_status,detail.valve_status_explain)}</Descriptions.Item>
          <Descriptions.Item label="用户姓名" span={2}>{detail.real_name}</Descriptions.Item>
          <Descriptions.Item label="安装地址" span={2}><Tooltip title={detail.install_address}>
            <div style={{ maxWidth: '160px', overflow: 'hidden' }}>{detail.install_address}</div>
          </Tooltip></Descriptions.Item>
          <Descriptions.Item label="集中器号" span={2}>{detail.concentrator_number}</Descriptions.Item>
          <Descriptions.Item label="户号" span={2}>{detail.member_number}</Descriptions.Item>
          <Descriptions.Item label="水表类型" span={2}>{detail.meter_model_name}</Descriptions.Item>
          <Descriptions.Item label="初始水量" span={2}>{detail.initial_water}</Descriptions.Item>

          <Descriptions.Item label="排序号" span={2}>{detail.sort_number}</Descriptions.Item>
          <Descriptions.Item label="通道号" span={2}>{detail.channel}</Descriptions.Item>
          <Descriptions.Item label="IMEI" span={2}>{detail.imei}</Descriptions.Item>
          <Descriptions.Item label="是否阀控" span={2}>{this.renderValveStatus(detail.is_valve,detail.is_valve_explain)}</Descriptions.Item>
          <Descriptions.Item label="输出类型" span={2}>{detail.output_type_explain}</Descriptions.Item>
          <Descriptions.Item label="温度介质" span={2}>{detail.temperature_type_explain}</Descriptions.Item>
          <Descriptions.Item label="尺寸类型" span={2}>{detail.size_type_explain}</Descriptions.Item>
          <Descriptions.Item label="电池寿命" span={2}>{detail.battery_life?detail.battery_life+'年':''}</Descriptions.Item>
          <Descriptions.Item label="抄表员" span={2}>{detail.reader}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>{detail.created_at}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{detail.remark}</Descriptions.Item>


        </Descriptions>
        <h3 className={'ant-descriptions-title'} style={{marginTop:'18px'}}>水表历史读值 </h3>
        <div>
          开始日期 : <DatePicker
          value={this.state.rangePickerValue[0]}
          allowClear={false}
          format="YYYY-MM-DD"
          style={{ width: 150, marginRight: '10px' }}
          placeholder={'开始日期'}
          onChange={(e) => this.handleRangePickerChange(e, 'start')}
        />
          结束日期 : <DatePicker
          allowClear={false}
          value={this.state.rangePickerValue[1]}
          format="YYYY-MM-DD"
          placeholder={'结束日期'}
          style={{ width: 150 }}
          onChange={(e) => this.handleRangePickerChange(e, 'end')}
        />
          <Radio.Group onChange={this.onChangeShowType} style={{marginLeft:'10px'}} value={this.state.showType}>
            <Radio value={1}>柱状图</Radio>
            <Radio value={2}>表格</Radio>
          </Radio.Group>

        </div>
        <Alert style={{marginTop:'10px'}} message={
          <div style={{fontSize:'16px',overflow:'hidden',fontWeight:'bold'}}>
          当前时间段用水量 : {this.state.totalVal.toFixed(3)} (m3)
            <span style={{float:'right'}}>平均用水量 : {(this.state.totalVal/(moment(this.state.rangePickerValue[1]).diff(moment(this.state.rangePickerValue[0]), 'days')+1)).toFixed(3)} (m3)</span>
          </div>} type="success" />

        <div style={{marginTop:'10px'}}>
          {
            this.state.showType===1?
              <Fragment>
                <ReactEcharts
                  option={this.getOption()}
                  style={{ height: '440px', width: '100%' }}
                  theme='my_theme'
                  //onChartReady={this.onChartReadyCallback}
                  //onEvents={EventsDict}
                />
                <p>注 : 蓝色柱状图表示当天水表读数上传正常,红色柱状图表示读数上传异常</p>
              </Fragment>:  <ReactDataGrid
                columns={columns}
                rowGetter={i => {
                  return { ...reverceData[i], _index: i };
                }}
                rowsCount={reverceData.length}
                minHeight={450}
              />
          }
        </div>

        <Descriptions title={<div style={{marginTop:'18px'}}>
          <span >水表指令</span>
        </div>} bordered>
          {
            detail.is_valve===1&&
            <Descriptions.Item label="阀控指令" span={4}>
              <Button icon="compass" type="primary" loading={this.state.open_valveLoading} className={'btn-green'}
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        const that = this;
                        confirm({
                          title: `确定要对 ${detail.number} 开阀吗?`,
                          content: '请谨慎操作！',
                          okText: '确定',
                          okType: 'danger',
                          cancelText: '取消',
                          centered: true,
                          maskClosable: true,
                          onOk() {
                            that.valveCommand('open_valve')
                          },
                          onCancel() {
                            console.log('Cancel');
                          },
                        });
                      }}
              >开阀</Button>
              <Button icon="poweroff" type="danger" loading={this.state.close_valveLoading}
                      onClick={() => {
                        const that = this;
                        confirm({
                          title: `确定要对 ${detail.number} 关阀吗?`,
                          content: '请谨慎操作！',
                          okText: '确定',
                          okType: 'danger',
                          cancelText: '取消',
                          centered: true,
                          maskClosable: true,
                          onOk() {
                            that.valveCommand('close_valve')
                          },
                          onCancel() {
                            console.log('Cancel');
                          },
                        });
                      }}
              >
                关阀
              </Button>
            </Descriptions.Item>
          }
          <Descriptions.Item label="点抄指令" span={4}>
            {
              detail.protocols && detail.protocols.map((item, index) => {
                return (
                  <Button icon='thunderbolt' key={index} loading={this.state['upload_single'+item+'Loading']} type="primary" style={{ marginRight: 10 }} onClick={() => {
                    const that = this;
                    confirm({
                      title: `确定要对 ${detail.number} ${item} 点抄吗?`,
                      content: '请谨慎操作！',
                      okText: '确定',
                      okType: 'danger',
                      cancelText: '取消',
                      centered: true,
                      maskClosable: true,
                      onOk() {
                        that.valveCommand('upload_single',item);
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                  }}>
                    {item.toUpperCase()}&nbsp;点抄 </Button>

                );
              })
            }
          </Descriptions.Item>
          <Descriptions.Item label="其他操作" span={4}>
            <Button  type="danger" style={{ marginRight: 10 }} onClick={() => {
              this.setState({
                editRecord:detail,
                fixedModal:true
              })
            }}>
             水表读数修正 </Button>
            <Button   type="danger" style={{ marginRight: 10 }} onClick={() => {
              this.setState({
                editRecord:detail,
                clearModal:true
              })
            }}>
              水表读数清除 </Button>
            <Button  type="primary" style={{ marginRight: 10 }} onClick={() => {
              this.setState({
                editRecord:detail,
                UnusualModal:true
              })
            }}>
              水表用水量异常报警设置 </Button>
          </Descriptions.Item>
        </Descriptions>
        <Modal
          title={'水表读数修正'}
          className="fixedModal"
          visible={this.state.fixedModal}
          centered
          onCancel={()=> {
            this.setState({fixedModal: false})
          }}
          onOk={()=>{
            Modal.confirm({
              title:'警告',
              content: '操作不可逆，请谨慎操作',
              onOk:  this.handleFixed,
              centered:true
            });
          }}
        >
          <FixedOrClearValue
            editRecord={this.state.editRecord}
            showValue={true}
            wrappedComponentRef={(inst) => this.FixedForm = inst}/>

        </Modal>
        <Modal
          title={'水表读数清除'}
          className="clearModal"
          visible={this.state.clearModal}
          centered
          onCancel={()=> {
            this.setState({clearModal: false})
          }}
          onOk={()=>{
            Modal.confirm({
              title:'警告',
              content: '操作不可逆，请谨慎操作',
              onOk:  this.handleClear,
              centered:true
            });
          }}
        >
          <FixedOrClearValue
            editRecord={this.state.editRecord}
            wrappedComponentRef={(inst) => this.clearForm = inst}/>

        </Modal>
        <Modal
          title={'水表用水量异常报警设置'}
          className="UnusualModal"
          visible={this.state.UnusualModal}
          centered
          onCancel={()=> {
            this.setState({UnusualModal: false})
          }}
          onOk={this.handleEditUnusualSpecial}
        >
          <EditUnusualSpecial
            findChildFunc={this.findChildFunc}
            editRecord={this.state.editRecord}
            wrappedComponentRef={(inst) => this.UnusualForm = inst}/>

        </Modal>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
