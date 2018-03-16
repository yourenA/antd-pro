import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm,Modal,Switch,Badge,  Dropdown,
  Menu,
  Icon,} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMember'
const {Content} = Layout;
@connect(state => ({
  user: state.user,
  usergroup: state.usergroup,
}))
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'user_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'user_delete'}),
      showStatusBtn: find(this.permissions, {name: 'user_status_edit'}),
      showPasswordBtn: find(this.permissions, {name: 'user_default_password_edit'}),
      tableY: 0,
      query: '',
      page: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
    }
  }

  componentDidMount() {
    console.log(find(this.permissions, {name: 'user_add_and_edit'}))
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
        page: 1,
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
    console.log('unmount11111111111111')
    dispatch({
      type: 'usergroup/reset',
    });
  }
  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {},
    });

    this.setState({
      page: 1,
      query: '',
      started_at: '',
      ended_at: '',
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
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    this.formRef.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'user/add',
            payload: {
              data: {
                ...formValues,
                is_email_notify: formValues.is_email_notify?1:-1,
                is_sms_notify: formValues.is_sms_notify?1:-1,
                role_id: formValues.role_id.key,
              },
            },
            callback: function () {
              message.success('添加用户成功')
              that.setState({
                addModal: false,
              });
              that.props.dispatch({
                type: 'user/fetch',
                payload: {
                  query:that.state.query,
                  page:that.state.page
                }
              });
            }
          });
        }else{
        }
      })


  }
  handleEdit=()=>{
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    const that = this;
    this.props.dispatch({
      type: 'user/edit',
      payload: {
        data: {
          ...formValues,
          is_email_notify: formValues.is_email_notify?1:-1,
          is_sms_notify: formValues.is_sms_notify?1:-1,
          role_id: formValues.role_id?formValues.role_id.key:'',
          id:this.state.editRecord.id
        },
      },
      callback: function () {
        message.success('修改用户成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
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
        id:id,
      },
      callback: function () {
        message.success('删除用户成功')
        that.props.dispatch({
          type: 'user/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
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
            query:that.state.query,
            page:that.state.page
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
            page: that.state.page
          }
        });
      }
    });
  }
  handleChangePhoneCall=(id)=>{
    console.log(id)
  }
  render() {
    const {user: {data, meta, loading},usergroup} = this.props;
    const itemMenu = (
      <Menu>
        {
          this.state.showPasswordBtn&& <Menu.Item>
            <a onClick={()=>{this.handleResetPassword(this.state.editRecord.id)}}>重置密码</a>
          </Menu.Item>
        }

        {this.state.showdelBtn&&<Menu.Item>
          <a onClick={()=>{this.handleRemove(this.state.editRecord.id)}}>删除</a>
        </Menu.Item>}

      </Menu>
    );
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
      {title: '账号', width: '10%', dataIndex: 'username', key: 'username'},
      {title: '名字', width: '8%', dataIndex: 'real_name', key: 'real_name'},
      {title: '电话', dataIndex: 'mobile', key: 'mobile', width: '11%'},
      {title: '邮箱', dataIndex: 'email', key: 'email', width: '15%'},
      {title: '电话通知', dataIndex: 'is_sms_notify', key: 'is_sms_notify', width: '8%',
        render: (val, record, index) => (
          <Switch checked={record.is_sms_notify===1?true:false}  />
        )},

      {
        title: '电邮通知', dataIndex: 'is_email_notify', key: 'is_email_notify', width: '8%',
        render: (val, record, index) => (
            <Switch checked={record.is_email_notify===1?true:false}  />
        )
      },
      {title: '角色', dataIndex: 'role_display_name', key: 'role_display_name',  width: '12%',},
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
        width: 150,
        render: (val, record, index) =>{
          if(record.lock===1){
            return null
          }else if(record.lock===2){
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
                </span>
                }

              </p>
            )
          }else{
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
                  this.state.showStatusBtn &&
                  <span>
                     <Popconfirm placement="topRight" title={ `确定要${record.status===1?'禁用':'启用'}吗?`}
                                 onConfirm={()=>this.handleEditStatus(record.id,record.status)}>
              <a href="javascript:;">{record.status===1?'禁用':'启用'}</a>
            </Popconfirm>
            <span className="ant-divider"/>
                </span>
                }
                {
                  (this.state.showdelBtn || this.state.showPasswordBtn)?
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
                    :null
                }

              </p>
            )
          }
        }
      },
    ];
    return (
      <Layout className="layout">
        {/*<Sider changeArea={this.changeArea} location={this.props.history.location}/>*/}
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '},{name: '账号管理'}, {name: '用户管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="账号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
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
                  scroll={{x: 1000, y: this.state.tableY}}
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
            title="添加用户"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm   usergroup={usergroup.data}  wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改用户"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm usergroup={usergroup.data} editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
