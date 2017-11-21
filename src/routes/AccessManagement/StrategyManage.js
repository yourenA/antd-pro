import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Button,
  Popconfirm,
  Table,
  Tooltip,
  Modal,
  Pagination,
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Endpoints.less';
import {Link,routerRedux} from 'dva/router';
import AddOrEditStrategy from './addOrEditStrategy.js'
import DefaultSearch from './../../components/DefaultSearch/index'
import {convertPoliciesTopic} from './../../utils/utils'

@connect(state => ({
  endpoints:state.endpoints,
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
      type: 'endpoints/fetchName',
      payload: {
        endpoint_id,
      }
    });
    dispatch({
      type: 'strategy/fetch',
      payload: {
        endpoint_id,
        page: 1
      }
    });
  }


  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'strategy/fetch',
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
      type: 'strategy/fetch',
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
    const formValues =convertPoliciesTopic(this.formRef.props.form.getFieldsValue());
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'strategy/add',
      payload: {
        data: {
          ...formValues,
          endpoint_id:this.props.match.params.id
        },
      },
      callback: function () {
        message.success('添加策略成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'strategy/fetch',
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
    const formValues =convertPoliciesTopic(this.editFormRef.props.form.getFieldsValue());
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'strategy/edit',
      payload: {
        data:{
          endpoint_id:this.props.match.params.id,
          id:this.state.editRecord.id,
          ...formValues
        }
      },
      callback: function () {
        message.success('修改策略成功')
        that.setState({
          modalEditVisible: false,
        });
        that.props.dispatch({
          type: 'strategy/fetch',
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
      type: 'strategy/remove',
      payload: {
        endpoint_id:this.props.match.params.id,
        id:id,
      },
      callback: function () {
        message.success('删除策略成功')
        that.props.dispatch({
          type: 'strategy/fetch',
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
      default:
        break;
    }
  }
  render() {
    const {strategy: {data, meta, loading},endpoints:{name}} = this.props;
    const { modalVisible,  selectedRowKeys, modalEditVisible,editRecord} = this.state;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '设备数',
        dataIndex: 'things_count',
      },
      {
        title: '主题',
        dataIndex: 'description',
          render: (val, record, index) => {
            let text=''
            record.permissions.data.map((item,index)=>{
              text=text+item.topic+"\t"
            })
            return (
              <Tooltip title={text}>
                {(text && text.length > 30) ? text.substring(0, 30) + '...' : text}
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
    const smallColumns = [{
      title: '主题',
      dataIndex: 'topic',
      key: 'topic',
    }, {
      title: '权限',
      dataIndex: 'allow_publish',
      key: 'allow_publish',
      render: (text, record, index)=> {
        if(record.allow_publish===1 && record.allow_subscribe===1){
          return(
              <span>订阅+发布</span>
            )
        }else if(record.allow_publish===1){
          return (
            <span>发布</span>
          )
        }else if(record.allow_subscribe===1){
          return (
            <span>订阅</span>
          )
        }

      }
    }];
    const tabList = [{
      key: 'device',
      tab: '设备管理',
    }, {
      key: 'identify',
      tab: '身份管理',
    }, {
      key: 'strategy',
      tab: '策略管理',
    }];
    const expandedRowRender = (record)=> {
      return (
                  <Table
                    style={{width: '300px'}}
                    size="small"
                    rowKey={record => record.id}
                    columns={smallColumns}
                    dataSource={record.permissions.data}
                    bordered={true}
                    pagination={false}
                  />
      );
    }
    return (
      <PageHeaderLayout title={{key:'strategy',label:`${name}策略管理`}} breadcrumb={[{name:'接入管理'},{name:'实例列表',link:'/access-management/endpoints'},{name:`策略管理`}]}
                        tabList={tabList}
                        onTabChange={this.handleTabChange}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <DefaultSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>创建</Button>
            </div>
            <Table
              expandedRowRender={(record)=>expandedRowRender(record) }
              loading={loading}
              rowKey={record => record.id}
              dataSource={data}
              columns={columns}
              pagination={false}
            />
            <Pagination showQuickJumper className={styles.pagination} total={meta.pagination.total}
                        current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                        style={{marginTop: '10px'}} onChange={this.handPageChange}/>
          </div>
        </Card>
        <Modal
          title="创建策略"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <AddOrEditStrategy  wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="修改策略"
          visible={modalEditVisible}
          onOk={this.handleEdit}
          onCancel={() => this.handleModalEditVisible()}
        >
          <AddOrEditStrategy  wrappedComponentRef={(inst) => this.editFormRef = inst} editRecord={editRecord}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
  }
