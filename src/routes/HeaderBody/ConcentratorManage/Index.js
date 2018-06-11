import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Badge, Tooltip} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOrEditConcentrator from './AddOrEditConcentrator'
import Sider from './../Sider'
import {connect} from 'dva';
import Detail from './Detail'
import find from 'lodash/find'
// import moment from 'moment'
import {renderIndex, ellipsis, ellipsis2} from './../../../utils/utils'
import './index.less'
import ConcentratorDetail from './ConcentratorDetail'
const {Content} = Layout;
@connect(state => ({
  concentrator_models: state.concentrator_models,
  concentrators: state.concentrators,
  servers: state.servers,
  area: state.area
}))
class ConcentratorManage extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'concentrator_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'concentrator_delete'}),
      showSiderCon: true,
      tableY: 0,
      query: '',
      page: 1,
      // initRange:[moment(new Date().getFullYear()+'-'+new  Date().getMonth()+1+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      // started_at:'',
      // ended_at:'',
      editModal: false,
      addModal: false,
      orderModal: false,
      village_id: '',
      showArea: true,
      editRecord: null,
      refreshSider: 0,
      canOperateConcentrator: localStorage.getItem('canOperateConcentrator') === 'true' ? true : false
    }

  }

  componentDidMount() {
    // this.setState({
    //   tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    // })
    const {dispatch}=this.props
    dispatch({
      type: 'concentrator_models/fetch',
      payload: {
        return: 'all'
      },
    });
    dispatch({
      type: 'servers/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'area/fetch',
      payload: {
        return: 'all'
      }
    });
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id
    })
    this.handleSearch({
      page: 1,
      query: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      showAddBtnByCon: false,
      query: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
      })
    })
  }
  changeConcentrator = (concentrator_number, village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      query: concentrator_number,
      village_id: '',
    }, function () {
      this.handleSearch({
        page: 1,
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrators/fetch',
      payload: {
        query: this.state.query ? this.state.query : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        ...values,
      },
    });

    this.setState({
      // started_at: values.started_at,
      // ended_at: values.ended_at,
      page: values.page,
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
    })
  }

  operate = (record)=> {
    this.setState({
      orderModal: true,
      editRecord: record
    })

  }
  refreshSider = ()=> {
    this.setState({
      refreshSider: true
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'concentrators/add',
      payload: {
        ...formValues,
        village_id: formValues.village_id[formValues.village_id.length - 1],
        // server_id: formValues.server_id.key,
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
      },
      callback: function () {
        message.success('添加集中器成功')
        that.setState({
          addModal: false,
          refreshSider: that.state.refreshSider + 1
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
        // this.reload()
      }
    });
  }
  setReload = (reload)=> {
    this.reload = reload;
  }
  handleEdit = () => {
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'concentrators/edit',
      payload: {
        ...formValues,
        // server_id: formValues.server_id.key,
        concentrator_model_id: formValues.concentrator_model_id.key,
        village_id: formValues.village_id[formValues.village_id.length - 1],
        is_count: formValues.is_count.key,
        id: this.state.editRecord.id
      },
      callback: function () {
        message.success('修改集中器成功')
        that.setState({
          editModal: false,
          refreshSider: that.state.refreshSider + 1
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除集中器成功')
        that.setState({
          refreshSider: that.state.refreshSider + 1
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
      }
    });
  }
  showConcentrator = (record)=> {
    console.log(record.id);
    this.setState({
      concentratorId: record.id,
      concentratorNumber: record.number,
      protocols: record.protocols,
    }, function () {
      this.setState({
        showArea: false
      })
    })
  }
  handleBack = ()=> {
    this.setState({
      showArea: true,
      concentratorNumber: null,
    })
  }

  render() {
    const {concentrators: {data, meta, loading}, servers, concentrator_models, area} = this.props;
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
        title: '集中器编号', width: 90, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (text, record, index) => {
          return (
            <p className="link" onClick={()=>this.showConcentrator(record)}>
              {text}
            </p>
          )
        }
      },
      {
        title: '集中器类型',
        width: 100,
        dataIndex: 'concentrator_model_name',
        key: 'concentrator_model_name',
        render: (val, record, index) => {
          return ellipsis2(val,100)
        }
      },
      {
        title: '支持协议', width: 100, dataIndex: 'protocols', key: 'protocols', render: (val, record, index) => {
        return  ellipsis2(val,100)
      }
      },
      {title: '硬件编号', dataIndex: 'serial_number', key: 'serial_number', width: 100,},
      {title: '水表总数', dataIndex: 'meter_count', key: 'meter_count', width: 80},
      {
        title: '在线状态', dataIndex: 'is_online', key: 'is_online', width: 80,
        render: (val, record, index) => {
          let status = "success";
          let status_text = "是";
          switch (val) {
            case  1:
              status = 'success';
              status_text = "是";
              break;
            case  -1:
              status = 'error';
              status_text = "否";
              break;
            case  -2:
              status = 'warning';
              status_text = "休眠";
              break;
          }
          return (
            <p>
              <Badge status={status}/>{status_text}
            </p>
          )
        }
      },
      {
        title: '安装小区', dataIndex: 'village_name', key: 'village_name', width: 120,
        render: (val, record, index) => {
          return ellipsis(val, 7)
        }
      },
      {
        title: '安装地址', dataIndex: 'install_address', key: 'install_address', width: 120,
        render: (val, record, index) => {
          return ellipsis2(val, 120)
        }
      },

      {title: '本轮登录时间', dataIndex: 'last_logined_at', key: 'last_logined_at', width: 150,},
      {title: '最后访问时间', dataIndex: 'last_onlined_at', key: 'last_onlined_at', width: 150,},
      {
        title: '上行报文（指令）', dataIndex: 'uplink_message', key: 'uplink_message', width: 150,
        render: (val, record, index) => {
          return ellipsis(val)
        }
      },
      {
        title: '下行报文（指令）', dataIndex: 'downlink_message', key: 'downlink_message', width: 150,
        render: (val, record, index) => {
          return ellipsis(val)
        }
      },
      {
        title: '是否做统计日报', dataIndex: 'is_count', key: 'is_count', width: 120,
        render: (val, record, index) => {
          return (
            <p>
              <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? "是" : "否"}
            </p>
          )
        }
      },
      {
        title: '备注', dataIndex: 'remark', key: 'remark', render: (val, record, index) => {
        return ellipsis(val, 8)
      }
      },

    ];
    if (this.state.canOperateConcentrator) {
      columns.push({
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 90,
        render: (val, record, index) => {
          return (
            <p>
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
                <span>
                  <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                              onConfirm={()=>this.handleRemove(record.id)}>
                  <a href="">删除</a>
                </Popconfirm>
                </span>
              }
            </p>
          )
        }
      })
    }
    let breadcrumb = this.state.concentratorNumber ? [{name: '运行管理'}, {
      name: '集中器管理',
      click: this.handleBack
    }, {name: this.state.concentratorNumber}] : [{name: '运行管理'}, {name: '集中器管理'}]
    return (
      <Layout className="layout">
        <Sider refreshSider={this.state.refreshSider} showSiderCon={this.state.showSiderCon}
               changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator} showArea={this.state.showArea}
               siderLoadedCallback={this.siderLoadedCallback}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={breadcrumb}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                {
                  this.state.showArea
                    ?
                    <div>
                      <div className='tableList'>
                        <div className='tableListForm'>
                          <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                  village_id={this.state.village_id}
                                  handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                  showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                  canOperateConcentrator={this.state.canOperateConcentrator} changeShowOperate={()=> {
                            this.setState({canOperateConcentrator: !this.state.canOperateConcentrator})
                          }}/>
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
                        scroll={{x: 1800, y: this.state.tableY}}
                        pagination={false}
                        size="small"
                      />
                      <Pagination meta={meta} handPageChange={this.handPageChange}/>
                    </div>
                    :
                    <ConcentratorDetail protocols={this.state.protocols} concentratorId={this.state.concentratorId}
                                        concentratorNumber={this.state.concentratorNumber}
                                        handleBack={this.handleBack}/>
                }
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          title="添加集中器"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false})}
        >
          <AddOrEditConcentrator wrappedComponentRef={(inst) => this.formRef = inst} area={area.data}
                                 concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="编辑集中器"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <AddOrEditConcentrator editRecord={this.state.editRecord}
                                 wrappedComponentRef={(inst) => this.editFormRef = inst} area={area.data}
                                 concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date()) + 1}
          title={`集中器指令:集中器编号${this.state.editRecord ? this.state.editRecord.number : ''}`}
          visible={this.state.orderModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({orderModal: false})}
        >
          <Detail />
        </Modal>

      </Layout>
    );
  }
}

export default ConcentratorManage
