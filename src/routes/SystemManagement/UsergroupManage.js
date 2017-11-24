import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  Table,
  Alert,
  Modal,
  Pagination,
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment'
import {Link} from 'dva/router';
import DefaultSearch from './../../components/DefaultSearch/index'

const FormItem = Form.Item;

@connect(state => ({
  endpoints: state.endpoints,
}))
@Form.create()
export default class EndpointsList extends PureComponent {
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
    dispatch({
      type: 'endpoints/fetch',
      payload: {
        page: 1
      }
    });
  }


  handleMenuClick = (e) => {
    console.log('handleRemoveAll')
    switch (e.key) {
      case 'remove':
        this.handleRemoveAll()
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'endpoints/fetch',
      payload: {},
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
      type: 'endpoints/fetch',
      payload: {
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
    this.props.dispatch({
      type: 'endpoints/add',
      payload: {
        name: this.state.addInputValue,
      },
      callback: function () {
        message.success('添加实例成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'endpoints/fetch',
          payload: {
            query:that.state.query,
            started_at:that.state.started_at,
            ended_at:that.state.ended_at,
            page:that.state.page
          }
        });
      }
    });

  }
  handleEditInput=(e)=>{
    this.setState({
      editRecord: {...this.state.editRecord,description:e.target.value}
    });
  }
  handleEdit=()=>{
    console.log(this.state.editRecord.description)
    const that = this;
    this.props.dispatch({
      type: 'endpoints/edit',
      payload: {
        id:this.state.editRecord.id,
        description: this.state.editRecord.description
      },
      callback: function () {
        message.success('修改实例成功')
        that.setState({
          modalEditVisible: false,
        });
        that.props.dispatch({
          type: 'endpoints/fetch',
          payload: {
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
      type: 'endpoints/remove',
      payload: id,
      callback: function () {
        message.success('删除实例成功')
        that.props.dispatch({
          type: 'endpoints/fetch',
          payload: {
            query:that.state.query,
            started_at:that.state.started_at,
            ended_at:that.state.ended_at,
            page:that.state.page
          }
        });
      }
    });
  }

  handleRemoveAll = ()=> {
    console.log(this.state.selectedRowKeys)
  }


  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.handleSelectRows) {
      this.handleSelectRows(selectedRows);
    }

    this.setState({selectedRowKeys, totalCallNo});
  }


  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  handPageChange = (page)=> {
    this.handleSearch({page: page,query:this.state.query,ended_at:this.state.ended_at,started_at:this.state.started_at})
  }

  render() {
    const {endpoints: {data, meta, loading}} = this.props;
    const {selectedRows, modalVisible, addInputValue, selectedRowKeys, modalEditVisible,editRecord} = this.state;
    const columns = [
      {
        title: '实例名称',
        dataIndex: 'name',
        render: (val, record, index) => {
          return (
            <Link to={`/access-management/endpoints/${record.id}/device`}>
              {val}
            </Link>
          )
        }
      },
      {
        title: '描述',
        dataIndex: 'description',
        className: 'description',
        render: (val, record, index) => {
          return (
            <div className='' title={val}>
              {(val && val.length > 20) ? val.substring(0, 20) + '...' : val}
              <Icon type="edit" className="edit" style={{cursor:'pointer'}} onClick={()=>{
                this.setState({
                  editRecord:record,
                })
                this.handleModalEditVisible(true)
              }}/>
            </div>
          )
        }
      },
      {
        title: '地址',
        dataIndex: 'ip',
        render: (val, record, index)=> {
          return (
            <div>
              <p>{record.mqtt_hostname}</p>
              <p>{record.mqtt_tls_hostname}</p>
              <p>{record.websocket_hostname}</p>
            </div>
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
        width:60,
        render: (val, record, index) => (
          <p>
            <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          </p>
        ),
      },
    ];
    const menu = (
      <Menu selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item key="remove">删除选中内容</Menu.Item>
      </Menu>
    );
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <PageHeaderLayout title={{label:'用户组管理'}}  breadcrumb={[{name: '系统管理'}, {name: '用户组管理'}]}>
        <Card bordered={false}>
      {/*    <div className='tableList'>
            <div className='tableListForm'>
              <DefaultSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>
            </div>
            <div className='tableListOperator'>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down"/>
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <Alert
              message={(
                <p>
                  已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>清空</a>
                </p>
              )}
              type="info"
              showIcon
            />
            <Table
              loading={loading}
              rowKey={record => record.id}
              rowSelection={rowSelection}
              dataSource={[]}
              columns={columns}
              pagination={false}
              onChange={this.handleTableChange}
            />
            <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                        current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                        style={{marginTop: '10px'}} onChange={this.handPageChange}/>
          </div>*/}
        </Card>
        <Modal
          title="创建实例"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{span: 5}}
            wrapperCol={{span: 15}}
            label="实例名称"
            extra='说明：名称由英文字母（a-z，不区分大小写）、数字（0-9）、下划线“_”以及连字符“-”（即中横线）构成，不能使用空格及特殊字符（如！、$、&、?等）。“-” 不能单独或连续使用，不能放在开头或结尾。'
          >
            <Input placeholder="请输入" onChange={this.handleAddInput} value={addInputValue}/>
          </FormItem>
        </Modal>
        <Modal
          title="修改描述"
          visible={modalEditVisible}
          onOk={this.handleEdit}
          onCancel={() => this.handleModalEditVisible()}
        >
          <FormItem
            labelCol={{span: 5}}
            wrapperCol={{span: 15}}
            label="描述"
          >
            <Input placeholder="请输入" type="textarea" rows={4}  onChange={this.handleEditInput}  value={editRecord.description}/>
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
