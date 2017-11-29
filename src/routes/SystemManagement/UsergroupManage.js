import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Button,
  Popconfirm,
  Table,
  Tooltip,
  Pagination,
  message,
  Badge
} from 'antd';
import {Link, routerRedux} from 'dva/router';
import DefaultSearch from './../../components/DefaultSearch/index'
import {convertPoliciesTopic} from './../../utils/utils'

@connect(state => ({
  usergroup: state.usergroup,
}))
@Form.create()
export default class StrategyManage extends PureComponent {
  state = {
    modalVisible: false,
    modalEditVisible: false,
    editRecord: {},
    query: '',
    page: 1,
    started_at: '',
    ended_at: '',
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'usergroup/fetch',
      payload: {
        page: 1
      }
    });
  }


  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'usergroup/fetch',
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
      type: 'usergroup/fetch',
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
  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

  handleAdd = () => {
    const that = this;
    const formValues = convertPoliciesTopic(this.formRef.props.form.getFieldsValue());
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'usergroup/add',
      payload: {
        data: {
          ...formValues,
        },
      },
      callback: function () {
        message.success('添加规则成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'usergroup/fetch',
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
    const formValues = convertPoliciesTopic(this.editFormRef.props.form.getFieldsValue());
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'usergroup/edit',
      payload: {
        data: {
          id: this.state.editRecord.id,
          ...formValues
        }
      },
      callback: function () {
        message.success('修改规则成功')
        that.setState({
          modalEditVisible: false,
        });
        that.props.dispatch({
          type: 'usergroup/fetch',
          payload: {
            endpoint_id: that.props.match.params.id,
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
      type: 'usergroup/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除规则成功')
        that.props.dispatch({
          type: 'usergroup/fetch',
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
    const {usergroup: {data, meta, loading},dispatch} = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },{
        title: '描述',
        dataIndex: 'description',
        className: 'description',
        render: (val, record, index) => {
          return (
            <Tooltip  title={val}>
              {(val && val.length > 20) ? val.substring(0, 20) + '...' : val}
            </Tooltip>
          )
        }
      },
      {
        title: '操作',
        width:150,
        render: (val, record, index) => (
          <p>
            <a href="javascript:;" onClick={()=>{
               dispatch(routerRedux.push(`/system-management/usergroup/${record.id}`))

            }}>编辑</a>
            <span className="ant-divider" />
            <a href="javascript:;" onClick={()=>{
              this.handleEditStatus(record.id,record.status)
            }}>{record.status===1?'禁用':'启用'}</a>
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
     <div>
        <Card bordered={false}>
          <div className='tableList'>
            <div className='tableListForm'>
              <DefaultSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>
            </div>
            <div className='tableListOperator'>
              <Button icon="plus" type="primary"
                      onClick={() => dispatch(routerRedux.push(`/system-management/usergroup/add`))}>创建用户组</Button>
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
     </div>
    );
  }
}
