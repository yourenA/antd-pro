import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm, Modal,Badge } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../OnlyAdd'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditServers'
import EditStatusForm from './editStatus'
const {Content} = Layout;
@connect(state => ({
  servers: state.servers,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(localStorage.getItem('permissions')) || JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'server_add_and_edit'}),
      showStatusBtn: find(this.permissions, {name: 'server_status_edit'}),
      showdelBtn: find(this.permissions, {name: 'server_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      editStatusModal:false
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'servers/fetch',
      payload: {
        page: 1,
      }
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'servers/fetch',
      payload: {},
    });
    this.setState({
      page: 1,
      // query: '',
      // started_at: '',
      // ended_at: '',
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'servers/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      // query: values.query,
      // started_at: values.started_at,
      // ended_at: values.ended_at,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      // query: this.state.query,
      // ended_at: this.state.ended_at,
      // started_at: this.state.started_at
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'servers/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('添加服务器地址成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'servers/fetch',
          payload: {
            // query: that.state.query,
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
      type: 'servers/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改服务器地址成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'servers/fetch',
          payload: {
            // query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }
  handleEditStatus = ()=> {
    const formValues = this.editStatusFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'servers/editStatus',
      payload: {
        status:formValues.status?1:-1,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改状态成功')
        that.setState({
          editStatusModal: false,
        });
        that.props.dispatch({
          type: 'servers/fetch',
          payload: {
            // query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'servers/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除服务器地址成功')
        that.props.dispatch({
          type: 'servers/fetch',
          payload: {
            // query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }

  render() {
    const {servers: {data, meta, loading}} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '服务器地址', width: '20%', dataIndex: 'ip', key: 'ip', },
      {title: '服务器端口', width: '20%', dataIndex: 'port', key: 'port'},
      {title: '状态', dataIndex: 'status', key: 'status', width: '15%',
        render:(val, record, index) => (
          <p>
            <Badge status={val===1?"success":"error"} />{record.status_explain}

          </p>
        )},
      {title: '创建时间', dataIndex: 'created_at', key: 'created_at'},
      {
        title: '操作',
        width: 170,
        render: (val, record, index) => (
          <p>
            {
              this.state.showStatusBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            editStatusModal: true
                          }
                        )
                      }}>修改状态</a>
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
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '运行管理 '}, {name: '服务器地址'}]}>
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}/>
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
                  scroll={{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                            current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                            style={{marginTop: '10px'}} onChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            title="添加服务器地址"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm  wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改服务器地址"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())+1}
            title="修改服务器地址状态"
            visible={this.state.editStatusModal}
            onOk={this.handleEditStatus}
            onCancel={() => this.setState({editStatusModal: false})}
          >
            <EditStatusForm editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editStatusFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default MeterModel