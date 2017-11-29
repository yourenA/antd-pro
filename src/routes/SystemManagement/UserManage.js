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
  Dropdown
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
          name: formValues.name,
          policy_id: formValues.policy_id.key,
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
          policy_id: formValues.policy_id.key,
          id: this.state.editRecord.id,
        }
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
    const columns = [
      {
        title: '用户账号',
        dataIndex: 'name',
      },
      {
        title: '姓名',
        dataIndex: 'things_count',
      },
      {
        title: '工号',
        dataIndex: 'policy_name',
      }, {
        title: '部门',
        dataIndex: 'created_at',
      },{
        title: '电话',
        dataIndex: 'created_at1',
      },
      {
        title: '操作',
        width: 120,
        render: (val, record, index) => (
          <p>
            <a href="javascript:;" onClick={()=> {
              this.setState(
                {
                  editRecord: record,
                  modalEditVisible: true
                }
              )
            }}>编辑</a>
            <span className="ant-divider"/>
            <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">删除</a>
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

            }} overlay={itemMenu}><a >更多<Icon type="ellipsis" /></a></Dropdown>]}>
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
