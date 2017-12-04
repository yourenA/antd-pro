import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Button,
  Popconfirm,
  Table,
  Modal,
  Pagination,
  message,
  Dropdown,
  Menu,
  Icon,
  Badge
} from 'antd';
import AddOrEditUser from './addOrEditUser'
import DefaultSearch from './../../components/DefaultSearch/index'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
@connect(state => ({
  user: state.user,
}))
@Form.create()
export default class StrategyManage extends PureComponent {
  state = {
    modalVisible: false,
    modalEditVisible: false,
    editRecord: {},
    expandForm: false,
    selectedRows: [],
    formValues: {},
    selectedRowKeys: [],
    totalCallNo: 0,
    query: '',
    page: 1,
    started_at: '',
    ended_at: '',
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
        page: 1
      }
    });
    dispatch({
      type: 'usergroup/fetch',
      payload: {
        return: 'all'
      }
    });
  }
  componentWillUnmount(){
    const {dispatch} = this.props;
    dispatch({
      type: 'usergroup/reset',
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
      },
    });
    this.setState({
      page: 1,
      query: '',
      started_at: '',
      ended_at: ''
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
        ...values,
      },
    });
    this.setState({
      query: values.query,
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page
    })
  }


  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleModalEditVisible = (flag) => {
    this.setState({
      modalEditVisible: !!flag,
    });
  }

  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'user/add',
      payload: {
        data: {
          ...formValues,
          role_id: formValues.role_id.key,
        },
      },
      callback: function () {
        message.success('添加用户成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query: that.state.query,
            started_at: that.state.started_at,
            ended_at: that.state.ended_at,
            page: that.state.page
          }
        });
      }
    });

  }
  handleEdit = ()=> {
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'user/edit',
      payload: {
        data: {
          ...formValues,
          role_id: formValues.role_id.key,
          id:this.state.editRecord.id
        },
      },
      callback: function () {
        message.success('修改用户成功')
        that.setState({
          modalEditVisible: false,
        });
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query: that.state.query,
            started_at: that.state.started_at,
            ended_at: that.state.ended_at,
            page: that.state.page
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'user/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除用户成功')
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query: that.state.query,
            started_at: that.state.started_at,
            ended_at: that.state.ended_at,
            page: that.state.page
          }
        });
      }
    });
  }
  handleEditStatus=(id,status)=>{
    let sendStatus=0;
    if(status===1){
      sendStatus=-1;
    }else{
      sendStatus=1;
    }
    const that=this;
    this.props.dispatch({
      type: 'user/editStatus',
      payload: {
        data: {
          id,
          status:sendStatus
        }
      },
      callback: function () {
        message.success('修改状态成功')
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query: that.state.query,
            started_at: that.state.started_at,
            ended_at: that.state.ended_at,
            page: that.state.page
          }
        });
      }
    });
  }
  handleResetPassword = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'user/resetPassword',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('重置密码成功')
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query: that.state.query,
            started_at: that.state.started_at,
            ended_at: that.state.ended_at,
            page: that.state.page
          }
        });
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }

  render() {
    const {user: {data, meta, loading}, } = this.props;
    const {modalVisible, modalEditVisible, editRecord} = this.state;
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a onClick={()=>{this.handleResetPassword(this.state.editRecord.id)}}>重置密码</a>
        </Menu.Item>
        {this.state.editRecord.lock===-1&&<Menu.Item>
          <a onClick={()=>{this.handleRemove(this.state.editRecord.id)}}>删除</a>
        </Menu.Item>}

      </Menu>
    );
    const columns = [
      {
        title: '用户账号',
        dataIndex: 'username',
      },
      {
        title: '部门',
        dataIndex: 'role_display_name',
      },
      {
        title: '姓名',
        dataIndex: 'real_name',
      },
      {
        title: '工号',
        dataIndex: 'job_number',
      },{
        title: '电话',
        dataIndex: 'mobile',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render:(val,record,index)=>{
          return(
            <span>
                 <Badge status={`${val===-1?"error":"success"}`} />{record.status_explain}
              </span>
          )
        }
      },
      {
        title: '操作',
        width: 170,
        render: (val, record, index) => (
          <p>
            {record.lock!==1&&<a href="javascript:;" onClick={()=> {
              this.setState(
                {
                  editRecord: record,
                  modalEditVisible: true
                }
              )
            }}>编辑</a>}
            <span className="ant-divider"/>
            <Popconfirm placement="topRight" title={ `确定要${record.status===1?'禁用':'启用'}吗?`}
                        onConfirm={()=>this.handleEditStatus(record.id,record.status)}>
              <a href="javascript:;">{record.status===1?'禁用':'启用'}</a>
            </Popconfirm>
            <span className="ant-divider"/>
            <Dropdown onVisibleChange={(visible)=>{
              if(visible){
                this.setState({
                  editRecord:record,
                })
              }else{
                this.setState({
                  editRecord:{},
                })
              }

            }} overlay={itemMenu}><a >更多<Icon type="ellipsis" /></a></Dropdown>
          </p>
        ),
      },
    ];
    return (
      <PageHeaderLayout title={{label: '用户管理'}} breadcrumb={[{name: '系统管理'}, {name: '用户管理'}]}>
        <Card bordered={false}>
          <div className='tableList'>
            <div className='tableListForm'>
              <DefaultSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>
            </div>
            <div className='tableListOperator'>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>创建用户</Button>
            </div>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={data}
              columns={columns}
              pagination={false}
            />
            <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                        current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                        onChange={this.handPageChange}/>
          </div>
        </Card>
        <Modal
          title="创建用户"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <AddOrEditUser  wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="修改用户"
          visible={modalEditVisible}
          onOk={this.handleEdit}
          onCancel={() => this.handleModalEditVisible()}
        >
          <AddOrEditUser  wrappedComponentRef={(inst) => this.editFormRef = inst}
                             editRecord={editRecord}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
