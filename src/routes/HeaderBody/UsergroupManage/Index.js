import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Badge,  Dropdown,
  Menu,
  Tooltip,
  Icon,} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import find from 'lodash/find'
import {Link, routerRedux} from 'dva/router';
const {Content} = Layout;
@connect(state => ({
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
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'usergroup/fetch',
      payload: {
        page: 1,
      }
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
      type: 'usergroup/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      query: values.query,
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
    console.log('formValues',formValues)
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
  handleEditStatus=(id,status)=>{
    let sendStatus=0;
    if(status===1){
      sendStatus=-1;
    }else{
      sendStatus=1;
    }
    const that=this;
    this.props.dispatch({
      type: 'usergroup/editStatus',
      payload: {
        data: {
          id,
          status:sendStatus
        }
      },
      callback: function () {
        message.success('修改状态成功')
        that.props.dispatch({
          type: 'usergroup/fetch',
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
      type: 'usergroup/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除角色成功')
        that.props.dispatch({
          type: 'usergroup/fetch',
          payload: {
            query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }
  render() {
    const company_code = sessionStorage.getItem('company_code');
    const {usergroup: {data, meta, loading},dispatch} = this.props;
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
      {
        title: '名称',
        dataIndex: 'display_name',
        key:'display_name',
        width: '25%',
      },{
        title: '描述',
        dataIndex: 'description',
        key:'description',
        width: '25%',
        render: (val, record, index) => {
          return (
            <Tooltip  title={val}>
              {(val && val.length > 20) ? val.substring(0, 20) + '...' : val}
            </Tooltip>
          )
        }
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
        width:150,
        render: (val, record, index) => (
          <p>
            <a href="javascript:;" onClick={()=>{
              dispatch(routerRedux.push(`/${company_code}/main/system_manage/account_manage/user_group_manage/${record.id}`))

            }}>编辑</a>
            <span className="ant-divider" />
            <Popconfirm placement="topRight" title={ `确定要${record.status===1?'禁用':'启用'}吗?`}
                        onConfirm={()=>this.handleEditStatus(record.id,record.status)}>
              <a href="javascript:;">{record.status===1?'禁用':'启用'}</a>
            </Popconfirm>
            <span className="ant-divider" />
            <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">删除</a>
            </Popconfirm>

          </p>
        ),
      },
    ];
    return (
      <Layout className="layout">
        {/*<Sider changeArea={this.changeArea} location={this.props.history.location}/>*/}
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '账号管理'},{name: '角色管理'}]}>
              <Card bordered={false}   style={{margin:'-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="名称" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={() => dispatch(routerRedux.push(`/${company_code}/main/system_manage/account_manage/user_group_manage/add`))}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={{ y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                {
                  meta && <Pagination meta={meta} handPageChange={this.handPageChange}/>

                }

              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title="添加用户"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改用户"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
