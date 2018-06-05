import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Select,
  Badge,
  Table,
  Pagination,
  message,
  Divider,
  Tooltip
} from 'antd';
import {renderIndex, ellipsis,ellipsis2} from './../../../utils/utils'
import uuid from 'uuid/v4'
const Option = Select.Option;
const FormItem = Form.Item;
@connect(state => ({
  user_command_data: state.user_command_data
}))
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      auto: false,
      page: 1,
      page2: 1,
      feature: [{key: 'open_valve', value: '开阀'}, {key: 'close_valve', value: '关阀'}
        , {key: 'read_single_901f', value: '901F点抄'}, {
          key: 'read_multiple_901f',
          value: '901F集抄'
        }, {key: 'upload_single', value: '点抄'}, {key: 'runonce_upload_multiple_timing', value: '集抄'}]
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        page: 1,
      }
    });
    dispatch({
      type: 'user_command_data/fetchMeterDetail',
      payload: {
        page: 1,
      }
    });
    // this.timer=setInterval(this.setIntervalFetch,10000)

  }

  setIntervalFetch = ()=> {
    this.handleSearch({
      page: 1,
    })
  }
  componentWillUnmount = ()=> {
    clearInterval(this.timer)
  }
  toggleAuto = ()=> {
    const that = this;
    this.setState({
      auto: !this.state.auto
    }, function () {
      if (this.state.auto) {
        console.log('开启自动刷新')
        clearInterval(this.timer)
        that.handleSearch({
          page: 1,
        })
        that.handleSearch2({
          page: 1,
        })
        this.timer = setInterval(function () {
          that.handleSearch({
            page: 1,
          });
          that.handleSearch2({
            page: 1,
          })
        }, 10000)
      } else {
        console.log('停止自动刷新')
        clearInterval(this.timer)
      }
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const that = this;
        const {dispatch} = this.props;
        dispatch({
          type: 'user_command_data/add',
          payload: {
            ...values,
            feature: values.feature ? values.feature.key : ''
          },
          callback: ()=> {
            message.success('发送指令成功')
            that.props.dispatch({
              type: 'user_command_data/fetch',
              payload: {
                page: that.state.page
              },
            });
          }
        });
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
    })
  }
  handPageChange2 = (page)=> {
    this.handleSearch2({
      page: page,
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      page: values.page
    })
  }
  handleSearch2 = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/fetchMeterDetail',
      payload: {
        ...values,
      },
    });

    this.setState({
      page2: values.page
    })
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24},
        sm: {offset: 7, span: 17},
      }
    };
    const {getFieldDecorator} = this.props.form;
    const {user_command_data: {data, meta, loading, dataMeterDetail, metaMeterDetail, loadingMeterDetail, command_msg}} = this.props;
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
    }
    for(let i=0;i<dataMeterDetail.length;i++){
      dataMeterDetail[i].uuidkey=uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number2', fixed: 'left',},
      {title: '水表号', width: 90, dataIndex: 'meter_number', key: 'meter_number2', fixed: 'left',},
      {title: '功能代码', dataIndex: 'feature', key: 'feature', width: 150,
        render: (val, record, index)=> {
          return (
            <Tooltip  placement="topLeft"  title={<p style={{width: '200px', wordWrap: 'break-word'}}>{val}</p>}>
              <p style={{
                width: '130px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{val}</p>
            </Tooltip>
          )
        }},
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (val, record, index)=> {
          return (
            <span>
                 <Badge status={`${val === -1 ? "error" : "success"}`}/>{record.status_explain}
              </span>
          )
        }
      },
      {title: '执行回调结果', dataIndex: 'result', key: 'result', width: 130,},
      {
        title: '附带参数', dataIndex: 'body', key: 'body', width: 150,
        render: (val, record, index)=> {
          return (
            <Tooltip title={<p style={{width: '200px', wordWrap: 'break-word'}}>{ JSON.stringify(val)}</p>}>
              <p style={{
                width: '130px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{JSON.stringify(val)}</p>
            </Tooltip>
          )
        }
      },
      {title: '创建时间', dataIndex: 'created_at', key: 'created_at',},

    ];
   const columns2 = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(metaMeterDetail, this.state.page, index)
        }
      },
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number2',fixed: 'left',},
      {title: '水表号', width: 90, dataIndex: 'meter_number', key: 'meter_number2',fixed: 'left',},
      {title: '读数(m³)', width: 80, dataIndex: 'value', key: 'value2'},
     {title: '上传时间', dataIndex: 'uploaded_at', key: 'uploaded_at', width: 150,},
     {title: '采集时间', dataIndex: 'collected_at', key: 'collected_at',},
      {
        title: '其它参数', dataIndex: 'body', key: 'body', width: 150,
        render: (val, record, index)=> {
          return (
            <Tooltip arrowPointAtCenter
                     title={<p style={{width: '200px', wordWrap: 'break-word'}}>{ JSON.stringify(val)}</p>}>
              <p style={{
                width: '130px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{JSON.stringify(val)}</p>
            </Tooltip>
          )
        }
      },
      // {title: 'cell_voltage_lora', width: 130, dataIndex: 'cell_voltage_lora', key: 'cell_voltage_lora',
      //   render: (val, record, index)=> {
      //       return ellipsis2(record['body'].cell_voltage_lora,130)
      //   }},
      // {title: 'point0_freeze_value', width: 150, dataIndex: 'point0_freeze_value', key: 'point0_freeze_value',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].point0_freeze_value)
      //   }},
      // {title: 'meter_address', width: 150, dataIndex: 'meter_address', key: 'meter_address',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].meter_address)
      //   }},
      // {title: 'cover_is_opened', width: 150, dataIndex: 'cover_is_opened', key: 'cover_is_opened',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].cover_is_opened)
      //   }},
      // {title: 'collect_time', width: 150, dataIndex: 'collect_time', key: 'collect_time',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].collect_time)
      //   }},
      // {title: 'status_code', width: 150, dataIndex: 'status_code', key: 'status_code',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].status_code)
      //   }},
      // {title: 'unit', width: 50, dataIndex: 'unit', key: 'unit',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].unit,50)
      //   }},
      // {title: 'water_temperature', width: 150, dataIndex: 'water_temperature', key: 'water_temperature',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].water_temperature,150)
      //   }},
      // {title: 'reflow_up_time', width: 150, dataIndex: 'reflow_up_time', key: 'reflow_up_time',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].reflow_up_time,150)
      //   }},
      // {title: 'read_meter_times', width: 150, dataIndex: 'read_meter_times', key: 'read_meter_times',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].read_meter_times,150)
      //   }},
      // {title: 'temp_up', width: 80, dataIndex: 'temp_up', key: 'temp_up',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].temp_up,80)
      //   }},
      // {title: 'cell_voltage_1', width: 150, dataIndex: 'cell_voltage_1', key: 'cell_voltage_1',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].cell_voltage_1,150)
      //   }},
      // {title: 'meter_time', width: 100, dataIndex: 'meter_time', key: 'meter_time',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].meter_time,100)
      //   }},
      // {title: 'temp_up_time', width: 150, dataIndex: 'temp_up_time', key: 'temp_up_time',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].temp_up_time,100)
      //   }},
      // {title: 'meter_revalue', width: 150, dataIndex: 'meter_revalue', key: 'meter_revalue',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].meter_revalue,100)
      //   }},
      // {title: 'empty_pipe_alarm', width: 150, dataIndex: 'empty_pipe_alarm', key: 'empty_pipe_alarm',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].empty_pipe_alarm)
      //   }},
      // {title: 'meter_number', width: 150, dataIndex: 'meter_number', key: 'meter_number',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].meter_number,150)
      //   }},
      // {title: 'signal', width: 150, dataIndex: 'signal', key: 'signal',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].signal)
      //   }},
      // {title: 'unit_revalue', width: 150, dataIndex: 'unit_revalue', key: 'unit_revalue',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].unit_revalue)
      //   }},
      // {title: 'flow_up_time', width: 150, dataIndex: 'flow_up_time', key: 'flow_up_time',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].flow_up_time)
      //   }},
      // {title: 'reflow_up', width: 150, dataIndex: 'reflow_up', key: 'reflow_up',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].reflow_up)
      //   }},
      // {title: 'flow_up', width: 150, dataIndex: 'flow_up', key: 'flow_up',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].flow_up)
      //   }},
      // {title: 'meter_index', width: 150, dataIndex: 'meter_index', key: 'meter_index',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].meter_index)
      //   }},
      // {title: 'cell_voltage_2', width: 150, dataIndex: 'cell_voltage_2', key: 'cell_voltage_2',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].cell_voltage_2)
      //   }},
      // {title: 'low_voltage', width: 150, dataIndex: 'low_voltage', key: 'low_voltage',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].low_voltage)
      //   }},
      // {title: 'meter_value', width: 150, dataIndex: 'meter_value', key: 'meter_value',
      //   render: (val, record, index)=> {
      //     return ellipsis2(record['body'].meter_value)
      //   }},

    ];


    let columns2Width=0;
    for(let i=0;i<columns2.length;i++){
      if(columns2[i].width){
        columns2Width=columns2Width+parseInt(columns2[i].width)
      }
      else{
        columns2Width=columns2Width+150
      }
    }

    if(dataMeterDetail.length>0){
      let body0=dataMeterDetail[0].body;
      for(let i in body0) {
          let itemWidth=parseInt(i.length*5+60);
        // if(itemWidth>150)
        // {
        //   itemWidth=150
        // }
          columns2Width=columns2Width+itemWidth
          columns2.push({
          title: `${i}`, dataIndex:  `${i}`, key:`${i}`, width:itemWidth,
          render: (val, record, index)=> {
            return ellipsis2(record['body'][i],itemWidth)
          }
        })
      }
    }
    return (
      <div>
        <Row type="flex" justify="center" align="top" gutter={16}>
          <Col sm={12} md={8} lg={6}>
            <Card title="测试">
              <Form >
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>集中器编号</span>
                  )}>
                  {getFieldDecorator('concentrator_number', {})(
                    <Input placeholder="集中器编号"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>
              水表编号
            </span>
                  )}>
                  {getFieldDecorator('meter_number', {})(
                    <Input placeholder="水表编号"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>
              指令
            </span>
                  )}>
                  {getFieldDecorator('feature', {})(
                    <Select labelInValue={true}>
                      { this.state.feature.map((item, key) => {
                        return (
                          <Option key={item.key} value={item.key}>{item.value}</Option>
                        )
                      }) }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>协议</span>
                  )}>
                  {getFieldDecorator('protocol', {})(
                    <Input placeholder="协议"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithOutLabel}
                >
                  <Button style={{width: '100%'}} type="primary" onClick={this.handleSubmit}>
                    发送指令
                  </Button>
                </FormItem>
                <FormItem
                  {...formItemLayoutWithOutLabel}
                >
                  {
                    JSON.stringify(command_msg)
                  }
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col sm={20} md={20} lg={16}>
            <Card title="测试结果列表"
                  extra={<div><Button type="primary" onClick={this.toggleAuto}>{this.state.auto ? '停止自动刷新' : '开启自动刷新'}
                    <Icon type="sync"/></Button> <Divider type="vertical"/><Button disabled={this.state.auto}
                                                                                   onClick={()=> {
                                                                                     this.handleSearch({page: 1})
                                                                                     this.handleSearch2({page: 1})
                                                                                   }}>手动刷新 <Icon type="sync"/></Button>
                  </div> }>
              <Table
                rowClassName={function (record, index) {
                  if (record.description === '') {
                    return 'error'
                  }
                }}
                className='meter-table'
                loading={loading}
                rowKey={record => record.id}
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{x: 1000, y: 350}}
                size="small"
              />
              <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                          current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                          style={{marginTop: '10px',marginBottom: '10px'}} onChange={this.handPageChange}/>
              <div style={{clear:'both',zIndex:0,overflow:'hidden'}}></div>
              <Table
                rowClassName={function (record, index) {
                  if (record.description === '') {
                    return 'error'
                  }
                }}
                className='meter-table'
                loading={loadingMeterDetail}
                rowKey={record => record.uuidkey}
                dataSource={dataMeterDetail}
                columns={columns2}
                pagination={false}
                scroll={{x: columns2Width, y: 350}}
                size="small"
              />
              <Pagination showQuickJumper className='pagination' total={metaMeterDetail.pagination.total}
                          current={metaMeterDetail.pagination.current_page}
                          pageSize={metaMeterDetail.pagination.per_page}
                          style={{marginTop: '10px'}} onChange={this.handPageChange2}/>
            </Card>

          </Col>
        </Row>
        <style>
          {`
                            #root{
                                background: #f9f9f9;
                                overflow-x: hidden;
                            }
                        `}
        </style>
      </div>


    );
  }
}
const WrappedNormalLoginForm = Form.create()(Dashboard);
export default WrappedNormalLoginForm
