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
  endpoints: state.endpoints,
  rule: state.rule,
}))
@Form.create()
export default class StrategyManage extends PureComponent {
  state = {
    addInputValue: '',
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
    const endpoint_id = this.props.match.params.id;
    console.log('endpoint_id in manage' ,endpoint_id)
    dispatch({
      type: 'rule/fetch',
      payload: {
        endpoint_id,
        page: 1
      }
    });
  }


  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        endpoint_id: this.props.match.params.id
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
      type: 'rule/fetch',
      payload: {
        endpoint_id: this.props.match.params.id,
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
      type: 'rule/add',
      payload: {
        data: {
          ...formValues,
          endpoint_id: this.props.match.params.id
        },
      },
      callback: function () {
        message.success('添加规则成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'rule/fetch',
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
  handleEdit = ()=> {
    const that = this;
    const formValues = convertPoliciesTopic(this.editFormRef.props.form.getFieldsValue());
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'rule/edit',
      payload: {
        data: {
          endpoint_id: this.props.match.params.id,
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
          type: 'rule/fetch',
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
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'rule/remove',
      payload: {
        endpoint_id: this.props.match.params.id,
        id: id,
      },
      callback: function () {
        message.success('删除规则成功')
        that.props.dispatch({
          type: 'rule/fetch',
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

  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }
  render() {
    const {rule: {data, meta, loading}, endpoints:{name},dispatch} = this.props;
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
        title: '状态',
        dataIndex: 'status',
        render:(val,record,index)=>{
          if(val===-1){
            return(
              <span>
                 <Badge status="error" />{record.status_explain}
              </span>
            )
          }   else  if(val===1){
            return(
              <span>
                 <Badge status="processing" />{record.status_explain}
              </span>
            )
          }
        }
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        width:120,
        render: (val, record, index) => (
          <p>
            <a href="javascript:;" onClick={()=>{
               dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/rule/${record.id}`))

            }}>编辑</a>
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
                      onClick={() => dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/rule/add`))}>创建规则</Button>
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
