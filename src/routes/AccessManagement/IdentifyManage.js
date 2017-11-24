import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Popconfirm,
  Table,
  Modal,
  Pagination,
  message
} from 'antd';
import {Link,routerRedux} from 'dva/router';
import AddOrEditIdentify from './addOrEditIdentify.js'
import DefaultSearch from './../../components/DefaultSearch/index'

@connect(state => ({
  endpoints:state.endpoints,
  identify: state.identify,
  strategy: state.strategy,
}))
@Form.create()
export default class StrategyManage extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    modalEditVisible:false,
    editRecord:{},
    expandForm: false,
    selectedRows: [],
    formValues: {},
    selectedRowKeys: [],
    totalCallNo: 0,
    query: '',
    page: 1,
    started_at:'',
    ended_at:'',
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const endpoint_id=this.props.match.params.id;
    dispatch({
      type: 'strategy/fetch',
      payload: {
        endpoint_id,
        page: 1
      }
    });
    dispatch({
      type: 'identify/fetch',
      payload: {
        endpoint_id,
        page: 1
      }
    });
  }


  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'identify/fetch',
      payload: {
        endpoint_id:this.props.match.params.id
      },
    });
    this.setState({
      page:1,
      query:'',
      started_at:'',
      ended_at:''
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'identify/fetch',
      payload: {
        endpoint_id:this.props.match.params.id,
        ...values,
      },
    });
    this.setState({
      query:values.query,
      started_at:values.started_at,
      ended_at:values.ended_at,
      page:values.page
    })
  }


  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleModalEditVisible= (flag) => {
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
    const formValues =this.identifyFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'identify/add',
      payload: {
        data: {
          name:formValues.name,
          policy_id:formValues.policy_id.key,
          endpoint_id:this.props.match.params.id
        },
      },
      callback: function () {
        message.success('添加身份成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'identify/fetch',
          payload: {
            endpoint_id:that.props.match.params.id,
            query:that.state.query,
            started_at:that.state.started_at,
            ended_at:that.state.ended_at,
            page:that.state.page
          }
        });
      }
    });

  }
  handleEdit=()=>{
    const that = this;
    const formValues =this.identifyEditFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'identify/edit',
      payload: {
        data:{
          endpoint_id:this.props.match.params.id,
          policy_id:formValues.policy_id.key,
          id:this.state.editRecord.id,
        }
      },
      callback: function () {
        message.success('修改身份成功')
        that.setState({
          modalEditVisible: false,
        });
        that.props.dispatch({
          type: 'identify/fetch',
          payload: {
            endpoint_id:that.props.match.params.id,
            query:that.state.query,
            started_at:that.state.started_at,
            ended_at:that.state.ended_at,
            page:that.state.page
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'identify/remove',
      payload: {
        endpoint_id:this.props.match.params.id,
        id:id,
      },
      callback: function () {
        message.success('删除身份成功')
        that.props.dispatch({
          type: 'identify/fetch',
          payload: {
            endpoint_id:that.props.match.params.id,
            query:that.state.query,
            started_at:that.state.started_at,
            ended_at:that.state.ended_at,
            page:that.state.page
          }
        });
      }
    });
  }

  handPageChange = (page)=> {
    this.handleSearch({page: page,query:this.state.query,ended_at:this.state.ended_at,started_at:this.state.started_at})
  }
  handleTabChange = (key) => {
    const { dispatch } = this.props;
    switch (key) {
      case 'device':
        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/device`));
        break;
      case 'identify':
        if(this.props.match.path.split('/')[4] !== key){
          dispatch({
            type: 'identify/reset',
          });
        }
        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/identify`));
        break;
      case 'strategy':
        if(this.props.match.path.split('/')[4] !== key){
          dispatch({
            type: 'strategy/reset',
          });
        }
        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/strategy`));
        break;
      case 'rule':
        if(this.props.match.path.split('/')[4] !== key){
          dispatch({
            type: 'rule/reset',
          });
        }
        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/rule`));
        break;
      default:
        break;
    }
  }
  render() {
    const {identify: {data, meta, loading},endpoints:{name},strategy} = this.props;
    const { modalVisible,   modalEditVisible,editRecord} = this.state;
    const columns = [
      {
        title: '身份名称',
        dataIndex: 'name',
      },
      {
        title: '设备数',
        dataIndex: 'things_count',
      },
      {
        title: '绑定的策略',
        dataIndex: 'policy_name',
      },{
        title: '创建时间',
        dataIndex: '创建时间',
      },
      {
        title: '操作',
        width:120,
        render: (val, record, index) => (
          <p>
            <a href="javascript:;" onClick={()=>{
              this.setState(
                {
                  editRecord:record,
                  modalEditVisible:true
                }
              )
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
    const tabList = [{
      key: 'device',
      tab: '设备管理',
    }, {
      key: 'identify',
      tab: '身份管理',
    }, {
      key: 'strategy',
      tab: '策略管理',
    }, {
      key: 'rule',
      tab: '规则管理',
    }];
    return (
    <div>
      <Card bordered={false}>
        <div className='tableList'>
          <div className='tableListForm'>
            <DefaultSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>
          </div>
          <div className='tableListOperator'>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>创建</Button>
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
        title="创建身份"
        visible={modalVisible}
        onOk={this.handleAdd}
        onCancel={() => this.handleModalVisible()}
      >
        <AddOrEditIdentify strategy={strategy.data} wrappedComponentRef={(inst) => this.identifyFormRef = inst}/>
      </Modal>
      <Modal
        key={ Date.parse(new Date())}
        title="修改身份"
        visible={modalEditVisible}
        onOk={this.handleEdit}
        onCancel={() => this.handleModalEditVisible()}
      >
        <AddOrEditIdentify strategy={strategy.data} wrappedComponentRef={(inst) => this.identifyEditFormRef = inst} editRecord={editRecord}/>
      </Modal>
    </div>

    );
  }
  }
