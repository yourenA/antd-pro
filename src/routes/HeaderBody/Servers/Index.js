import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm, Modal,Badge } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Pagination from './../../../components/Pagination/Index'
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditServers'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'

import EditStatusForm from './editStatus'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  servers: state.servers,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'server_add_and_edit'}),
      showStatusBtn: find(this.permissions, {name: 'server_status_edit'}),
      showdelBtn: find(this.permissions, {name: 'server_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      editStatusModal:false,
      canOperate:localStorage.getItem('canOperateServer')==='true'?true:false,
      display_type: 'all',
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    this.handleSearch({
      page: 1,
      display_type: 'all',
    })
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {servers: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            display_type: this.state.display_type,
            per_page:this.state.per_page,
            // area: this.state.area
          }, function () {
            that.setState({
              canLoadByScroll: true,
            })
          }, true)
        }
      }
    }
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
      display_type: 'all',
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'servers/fetchAndPush':'servers/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if (!fetchAndPush) {
          that.setState({
            initPage: values.page
          })
        }
        if (cb)cb()
      }
    });

  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      display_type:this.state.display_type,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      display_type:this.state.display_type,
      per_page:per_page
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
            page: that.state.page,
            display_type:that.state.display_type,
            per_page:that.state.per_page
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
            page: that.state.page,
            display_type:that.state.display_type,
            per_page:that.state.per_page
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
            page: that.state.page,
            display_type:that.state.display_type,
            per_page:that.state.per_page
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
            page: that.state.page,
            display_type:that.state.display_type,
            per_page:that.state.per_page
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
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.initPage,index)
        }
      },
      {title: '服务器地址', width: 200, dataIndex: 'ip', key: 'ip',
        render: (val, record, index) => {
          return ellipsis2(val,200)
        }},
      {title: '服务器端口',  dataIndex: 'port', key: 'port',width:150,
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {title: '状态', dataIndex: 'status', key: 'status',width:150,
        render:(val, record, index) => (
          <p>
            <Badge status={val===1?"success":"error"} />{record.status_explain}

          </p>
        )},
      {title: '创建时间', dataIndex: 'created_at', key: 'created_at',
      },
    ];
    let operate={
      title: '操作',
      width: 170,
      fixed:'right',
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
    }
    if(this.state.canOperate){
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '运行管理 '}, {name: '服务器地址'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   per_page={this.state.per_page}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{ y: this.state.tableY}}
                                 history={this.props.history}
                                 canOperate={this.state.canOperate}
                                 operate={operate}
                />
              {/*  <Table
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
                  //scroll={{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
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
