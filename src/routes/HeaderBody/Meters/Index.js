import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../Sider'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
const {Content} = Layout;
@connect(state => ({
  user_command_data: state.user_command_data,
  meter_models: state.meter_models,
  meters: state.meters,
  global: state.global,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'meter_model_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'meter_model_delete'}),
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      tableY: 0,
      page: 1,
      commandPage: '',
      started_at: '',
      ended_at: '',

      number: '',
      member_number: '',
      install_address: '',
      real_name: '',

      editModal: false,
      addModal: false,
      commandModal: false,
      canOperateMeter: localStorage.getItem('canOperateMeter') === 'true' ? true : false,
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'meters/fetch',
    //   payload: {
    //     page: 1,
    //   },
    //   callback:()=>{
    //   this.changeTableY()
    // }
    // });
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        return: 'all'
      }
    });

    // this.handleCommandSearch({page:1})
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        number: this.state.number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
      })
    })
  }
  changeConcentrator = (concentrator_number, village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: '',
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        number: this.state.number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
      })
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      number: '',
      member_number: '',
      install_address: '',
      real_name: '',
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'meters/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      number: this.state.number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      real_name: this.state.real_name,
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'meters/add',
      payload: {
        ...formValues,
        meter_model_id: formValues.meter_model_id.key,
        installed_at: formValues.installed_at ? moment(formValues.installed_at).format('YYYY-MM-DD') : '',
        manufactured_at: formValues.manufactured_at ? moment(formValues.manufactured_at).format('YYYY-MM-DD') : '',
        is_valve: formValues.is_valve.key ? parseInt(formValues.is_valve.key) : -1,
        valve_status: formValues.valve_status ? 1 : -1
      },
      callback: function () {
        message.success('添加水表成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            number: that.state.number,
            member_number: that.state.member_number,
            install_address: that.state.install_address,
            real_name: that.state.real_name,
            page: that.state.page
          }
        });
      }
    });

  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'meters/edit',
      payload: {
        ...formValues,
        meter_model_id: formValues.meter_model_id.key,
        installed_at: formValues.installed_at ? moment(formValues.installed_at).format('YYYY-MM-DD') : '',
        manufactured_at: formValues.manufactured_at ? moment(formValues.manufactured_at).format('YYYY-MM-DD') : '',
        is_valve: formValues.is_valve.key ? parseInt(formValues.is_valve.key) : -1,
        valve_status: formValues.valve_status ? 1 : -1,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改水表成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            number: that.state.number,
            member_number: that.state.member_number,
            install_address: that.state.install_address,
            real_name: that.state.real_name,
            page: that.state.page
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'meters/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除水表成功')
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            number: that.state.number,
            member_number: that.state.member_number,
            install_address: that.state.install_address,
            real_name: that.state.real_name,
            page: that.state.page
          }
        });
      }
    });
  }
  handleCommand = (record, command)=> {
    console.log('command ', command);
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        meter_number: record.number,
        feature: command
      },
      callback: ()=> {
        message.success('发送指令成功');
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            number: that.state.number,
            member_number: that.state.member_number,
            install_address: that.state.install_address,
            real_name: that.state.real_name,
            page: that.state.page
          }
        });
      }
    });
  }
  showCommandInfo = ()=> {
    const that = this;
    this.handleCommandSearch({
      page: this.state.commandPage,
    }, function () {
      that.setState({
        commandModal: true
      })
    })
  }
  handCommandPageChange = (page)=> {
    this.handleCommandSearch({
      page: page,
    })
  }
  handleCommandSearch = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        ...values,
      },
    });
    this.setState({
      commandPage: values.page
    });
    if (cb)cb()
  }

  render() {

    const {meters: {data, meta, loading}, meter_models, user_command_data} = this.props;
    const {isMobile} =this.props.global;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return renderIndex(meta, this.state.page, index)
        }
      },
      {
        title: '水表号', width: 110, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val, 110)
        }
      },
      {
        title: '用户名称', dataIndex: 'real_name', key: 'real_name', width: 80, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {
        title: '户号', dataIndex: 'member_number', key: 'member_number', width: 80, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {title: '初始水量', width: 80, dataIndex: 'initial_water', key: 'initial_water'},
      {
        title: '水表类型名称',
        width: 140,
        dataIndex: 'meter_model_name',
        key: 'meter_model_name',
        render: (text, record, index) => {
          return ellipsis2(text, 130)
        }
      },
      {
        title: '是否阀控', dataIndex: 'is_valve', key: 'is_valve', width: 80,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? '是' : '否'}

          </p>
        )
      },
      {
        title: '阀门状态', dataIndex: 'valve_status', key: 'valve_status', width: 80,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{record.valve_status_explain}
          </p>
        )
      },
      {
        title: '水表状态', dataIndex: 'status', key: 'status', width: 80,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}
          </p>
        )
      },
      {
        title: '集中器号',
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: '安装地址',
        dataIndex: 'install_address',
        key: 'install_address',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {title: '开始使用日期', width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '开始使用时读数', width: 120, dataIndex: 'enabled_value', key: 'enabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '停止使用日期', width: 120, dataIndex: 'disabled_date', key: 'disabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '停止使用时读数', width: 120, dataIndex: 'disabled_value', key: 'disabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '生产日期', width: 120, dataIndex: 'manufactured_at', key: 'manufactured_at', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '安装日期', width: 120, dataIndex: 'installed_at', key: 'installed_at', render: (text, record, index) => {
        return ellipsis2(text, 100)
      }},

      {title: '电池寿命(年)', dataIndex: 'battery_life', key: 'battery_life', width: 100},
      {title: '条码', dataIndex: 'barcode', key: 'barcode', width: 100},
      {
        title: '所属厂商',
        dataIndex: 'manufacturer_name',
        key: 'manufacturer_name',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: '备注', dataIndex: 'remark', key: 'remark', render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      },
    ];
    if (this.state.canOperateMeter) {
      columns.push({
        title: '操作',
        width: isMobile ? 90 : 140,
        fixed: 'right',
        render: (val, record, index) => (
          <p>
            {
              (this.state.showCommandBtn && record.is_valve === 1) &&
              <span>
                {record.valve_status === -1 &&
                <Popconfirm placement="topRight" title={ `确定要开阀吗?`}
                            onConfirm={()=> {
                              this.handleCommand(record, 'open_valve')
                            }}>
                <span>
                  <a href="javascript:;">开阀</a>
                </span>
                </Popconfirm>}
                {record.valve_status === 1 &&
                <Popconfirm placement="topRight" title={ `确定要关阀吗?`}
                            onConfirm={()=> {
                              this.handleCommand(record, 'close_valve')
                            }}>
                <span>
                   <a href="javascript:;">关阀</a>
                </span>
                </Popconfirm>}
                <span className="ant-divider"/>
              </span>
            }
            {
              this.state.showAddBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            editModal: true
                          }
                        )
                      }}>编辑</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                          onConfirm={()=>this.handleRemove(record.id)}>
                <a href="">删除</a>
              </Popconfirm>
            }

          </p>
        ),
      })
    }
    const commandColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(user_command_data.meta, this.state.commandPage, index)
        }
      },
      {title: '水表号', dataIndex: 'meter_number', key: 'meter_number'},
      {title: '功能代码', dataIndex: 'feature', key: 'feature',},
      {
        title: '状态',
        dataIndex: 'status',
        render: (val, record, index)=> {
          return (
            <span>
                 <Badge status={`${val === -1 ? "error" : "success"}`}/>{record.status_explain}
              </span>
          )
        }
      },
      {title: '执行回调结果', dataIndex: 'result', key: 'result',},
      {title: '执行用户名', dataIndex: 'send_username', key: 'send_username'},
      {title: '创建时间', dataIndex: 'created_at', key: 'created_at',},
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '水表管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                   inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   clickInfo={this.showCommandInfo}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   canOperateConcentrator={this.state.canOperateMeter} changeShowOperate={()=> {
                      this.setState({canOperateMeter: !this.state.canOperateMeter})
                    }}
                    />
                  </div>
                </div>
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
                  scroll={{x: 2300, y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            title="添加水表"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm meter_models={meter_models.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改水表"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm meter_models={meter_models.data} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
          <Modal
            width="90%"
            title="开/关阀信息"
            visible={this.state.commandModal}
            onCancel={() => this.setState({commandModal: false})}
            footer={null}
          >
            <div style={{overflow: 'hidden'}}>
              <Table
                className='meter-table'
                loading={loading}
                rowKey={record => record.id}
                dataSource={user_command_data.data}
                columns={commandColumns}
                pagination={false}
                size="small"
              />
              <Pagination meta={user_command_data.meta} handPageChange={this.handCommandPageChange}/>
            </div>

          </Modal>

        </Content>
      </Layout>
    );
  }
  }

  export
  default
  MeterModel
