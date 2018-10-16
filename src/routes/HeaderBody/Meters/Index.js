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
import ChangeTable from './ChangeTable'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
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
      showChangeBtn: find(this.permissions, {name: 'meter_change_record_add'}),
      tableY: 0,
      page: 1,
      initPage:1,
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
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

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
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {meters: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            number: this.state.number,
            member_number: this.state.member_number,
            install_address: this.state.install_address,
            real_name: this.state.real_name,
            per_page:this.state.per_page,

          },function () {
            that.setState({
              canLoadByScroll:true,
            })
          },true)
        }
      }
    }
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
        per_page:this.state.per_page
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        number: this.state.number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
        per_page:this.state.per_page
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
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type:fetchAndPush?'meters/fetchAndPush': 'meters/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if(!fetchAndPush){
          that.setState({
            initPage:values.page
          })
        }
        if(cb) cb()
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
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      number: this.state.number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      real_name: this.state.real_name,
      per_page:per_page
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
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
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
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleChangeMeter = ()=> {
    const formValues = this.changeFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'meters/change',
      payload: {
        ...formValues,
        initial_water: parseFloat(formValues.initial_water),
        meter_model_id: formValues.meter_model_id.key,
        is_valve: formValues.is_valve.key ? parseInt(formValues.is_valve.key) : -1,
      },
      callback: function () {
        message.success('更换水表成功')
        that.setState({
          changeModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
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
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
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
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
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
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta, this.state.initPage, index)
      //   }
      // },
      {
        title: '水表号', width: 90, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val, 90)
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
      {
        title: '安装地址',
        dataIndex: 'install_address',
        key: 'install_address',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: '水表序号', dataIndex: 'index', key: 'index', width: 80, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {title: '初始水量', width: 80, dataIndex: 'initial_water', key: 'initial_water', render: (text, record, index) => {
        return ellipsis2(text, 80)
      }},
      {
        title: '水表类型名称',
        width: 110,
        dataIndex: 'meter_model_name',
        key: 'meter_model_name',
        render: (text, record, index) => {
          return ellipsis2(text, 110)
        }
      },
      {title: '温度介质类型', dataIndex: 'temperature_type_explain', key: 'temperature_type_explain', width: 110,render: (text, record, index) => {
        return ellipsis2(text,110)
      }
      },
      {title: '尺寸类型', dataIndex: 'size_type_explain', key: 'size_type_explain', width: 80,render: (text, record, index) => {
        return ellipsis2(text,80)
      } },
      {title: '输出类型', dataIndex: 'output_type_explain', key: 'output_type_explain', width: 80,render: (text, record, index) => {
        return ellipsis2(text,80)
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
        title: '电池电压状态', dataIndex: 'voltage_status', key: 'voltage_status', width: 100,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{record.voltage_status_explain}
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
        title: '通道号',
        dataIndex: 'channel',
        key: 'channel',
        width: 80,
        render: (text, record, index) => {
          return ellipsis2(text, 80)
        }
      },

      {
        title: '厂商代码',
        dataIndex: 'manufacturer_prefix',
        key: 'manufacturer_prefix',
        width: 80,
        render: (text, record, index) => {
          return ellipsis2(text, 80)
        }
      },
      {
        title: '开始使用日期', width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title: '开始使用时读数',
        width: 120,
        dataIndex: 'enabled_value',
        key: 'enabled_value',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: '停止使用日期',
        width: 120,
        dataIndex: 'disabled_date',
        key: 'disabled_date',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: '停止使用时读数',
        width: 120,
        dataIndex: 'disabled_value',
        key: 'disabled_value',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: '生产日期',
        width: 120,
        dataIndex: 'manufactured_at',
        key: 'manufactured_at',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: '安装日期', width: 120, dataIndex: 'installed_at', key: 'installed_at', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },

      {title: '电池寿命(年)', dataIndex: 'battery_life', key: 'battery_life', width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }},
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
        title: '备注', dataIndex: 'remark', key: 'remark',  width: 100,render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      },
      {title: '条码', dataIndex: 'barcode', key: 'barcode',width: 100,render: (text, record, index) => {
        return ellipsis2(text, 100)
      }},
      {
        title:'排序号', dataIndex: 'sort_number', key: 'sort_number'
      }

    ];
    const operate={
      title: '操作',
      width: isMobile ? 100 : 180,
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
            this.state.showChangeBtn &&record.status === 1&&
            <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            changeModal: true
                          }
                        )
                      }}>换表</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showdelBtn &&record.status === 1&&
            <Popconfirm placement="topRight" title={ <div><p>确定要删除吗?</p><p style={{color:'red'}}>删除后关联的用户也会被删除！</p></div>}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          }

        </p>
      ),
    }
    if (this.state.canOperateMeter) {
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '设备管理 '}, {name: '水表管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                   inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   clickInfo={this.showCommandInfo}
                                   per_page={this.state.per_page}
                                   isMobile={isMobile}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   canOperateConcentrator={this.state.canOperateMeter} changeShowOperate={()=> {
                      this.setState({canOperateMeter: !this.state.canOperateMeter})
                    }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x:3450,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperateMeter}
                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
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
            key={ Date.parse(new Date()) + 1}
            title="更换水表"
            visible={this.state.changeModal}
            onOk={this.handleChangeMeter}
            onCancel={() => this.setState({changeModal: false})}
          >
            <ChangeTable meter_models={meter_models.data} editRecord={this.state.editRecord}
                         wrappedComponentRef={(inst) => this.changeFormRef = inst}/>
          </Modal>
         {/* <Modal
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

          </Modal>*/}

        </Content>
      </Layout>
    );
  }
}

export
default
MeterModel
