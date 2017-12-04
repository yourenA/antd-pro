import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Tooltip,
  Button,
  Popconfirm,
  Table,
  Modal,
  Pagination,
  message,
  Badge
} from 'antd';
import moment from 'moment'
import {Link,routerRedux} from 'dva/router';
import DefaultSearch from './../../components/DefaultSearch/index'
import AddOrEditDevice from './addOrEditDevice.js'

@connect(state => ({
  endpoints:state.endpoints,
  device: state.device,
  strategy: state.strategy,
  identify:state.identify
}))
@Form.create()
export default class DeviceManage extends PureComponent {
  state = {
    modalVisible: false,
    modalEditVisible:false,
    editRecord:{},
    query: '',
    page: 1,
    started_at:'',
    ended_at:'',
    endpointName:''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const endpoint_id=this.props.match.params.id;
    dispatch({
      type: 'device/fetch',
      payload: {
        endpoint_id,
        page: 1
      }
    });
    dispatch({
      type: 'strategy/fetch',
      payload: {
        endpoint_id,
        return:'all'
      }
    });
    dispatch({
      type: 'identify/fetch',
      payload: {
        endpoint_id,
        return:'all'
      }
    });
  }



  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'device/fetch',
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
      type: 'device/fetch',
      payload: {
        endpoint_id:this.props.match.params.id,
        ...values,
      },
    });
    this.setState({
      query:values.query,
      started_at:values.started_at,
      ended_at:values.ended_at
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

  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'device/add',
      payload: {
        name:formValues.name,
        description:formValues.description,
        principal_id:formValues.identify.key,
        endpoint_id:this.props.match.params.id
      },
      callback: function () {
        message.success('添加实例成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'device/fetch',
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
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    const that = this;
    this.props.dispatch({
      type: 'device/edit',
      payload: {
        id:this.state.editRecord.id,
        name:formValues.name,
        description:formValues.description,
        principal_id:formValues.identify.key,
        endpoint_id:this.props.match.params.id
      },
      callback: function () {
        message.success('修改实例成功')
        that.setState({
          modalEditVisible: false,
        });
        that.props.dispatch({
          type: 'device/fetch',
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
      type: 'device/remove',
      payload: {
        endpoint_id:this.props.match.params.id,
        id:id,
      },
      callback: function () {
        message.success('删除设备成功')
        that.props.dispatch({
          type: 'device/fetch',
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
    const {device: {data, meta, loading},endpoints:{name},strategy,identify} = this.props;
    const { modalVisible, modalEditVisible,editRecord} = this.state;
    const endpoint_id=this.props.match.params.id;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '用户名',
        dataIndex: 'username',
        render:val=>{
          return(
            <Tooltip title={val}>
              <p> {(val && val.length > 20) ? val.substring(0, 20) + '...' : val}</p>
            </Tooltip>
          )
        }
      },
      {
        title: '身份',
        dataIndex: 'principal_name',
      },
      {
        title: '策略',
        dataIndex: 'policy_name',
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
        title: '创建时间',
        dataIndex: 'created_at',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
    const expandedRowRender = (record)=> {
      return (
        <div>
          <p className="small-table-desc"><span>描述:</span>{record.description}</p>
          <Table
            style={{width: '300px'}}
            size="small"
            rowKey={record => record.id}
            columns={smallColumns}
            dataSource={record.permissions.data}
            bordered={true}
            pagination={false}
          />
        </div>

      );
    }
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>添加设备</Button>
              <Button icon="plus" type="primary" >批量添加设备</Button>
            </div>
            <Table
              expandedRowRender={(record)=>expandedRowRender(record) }
              loading={loading}
              rowKey={record => record.id}
              dataSource={data}
              columns={columns}
              pagination={false}
            />
            <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                        current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                        style={{marginTop: '10px'}} onChange={this.handPageChange}/>
          </div>
        </Card>
        <Modal
          title="创建设备"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <AddOrEditDevice endpoint_id={endpoint_id}  strategy={strategy.data} identify={identify.data}  wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          title="修改设备"
          visible={modalEditVisible}
          onOk={this.handleEdit}
          onCancel={() => this.handleModalEditVisible()}
        >
          <AddOrEditDevice editRecord={editRecord} endpoint_id={endpoint_id}  strategy={strategy.data} identify={identify.data}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
        </Modal>
      </div>

    );
  }
  }
