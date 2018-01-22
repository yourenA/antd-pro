import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm, Modal,Badge } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
const {Content} = Layout;
@connect(state => ({
  meter_models: state.meter_models,
  meters: state.meters,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(localStorage.getItem('permissions')) || JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'meter_model_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'meter_model_delete'}),
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
      type: 'meters/fetch',
      payload: {
        page: 1,
      }
    });
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        return: 'all'
      }
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'meters/fetch',
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
      type: 'meters/fetch',
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
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'meters/add',
      payload: {
        ...formValues,
        meter_model_id: formValues.meter_model_id.key,
        installed_at:formValues.installed_at?moment(formValues.installed_at).format('YYYY-MM-DD'):'',
        manufactured_at:formValues.manufactured_at?moment(formValues.manufactured_at).format('YYYY-MM-DD'):'',
        is_valve:formValues.is_valve.key?parseInt(formValues.is_valve.key):-1,
        valve_status:formValues.valve_status?1:-1
      },
      callback: function () {
        message.success('添加水表类型成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            query: that.state.query,
            page: that.state.page
          }
        });
      }
    });

  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'meters/edit',
      payload: {
        ...formValues,
        meter_model_id: formValues.meter_model_id.key,
        installed_at:formValues.installed_at?moment(formValues.installed_at).format('YYYY-MM-DD'):'',
        manufactured_at:formValues.manufactured_at?moment(formValues.manufactured_at).format('YYYY-MM-DD'):'',
        is_valve:formValues.is_valve.key?parseInt(formValues.is_valve.key):-1,
        valve_status:formValues.valve_status?1:-1,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改水表类型成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'meters/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除水表类型成功')
        that.props.dispatch({
          type: 'meters/fetch',
          payload: {
            query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }

  render() {
    const {meters: {data, meta, loading}, meter_models} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '水表号', width: 150, dataIndex: 'number', key: 'number', fixed: 'left',},
      {title: '初始水量', width: 100, dataIndex: 'initial_water', key: 'initial_water'},
      {title: '生产日期', width: 120, dataIndex: 'manufactured_at', key: 'manufactured_at'},
      {title: '安装日期', width: 120, dataIndex: 'installed_at', key: 'installed_at'},
      {title: '水表类型名称', width: 150, dataIndex: 'meter_model_name', key: 'meter_model_name'},
      {title: '是否阀控', dataIndex: 'is_valve', key: 'is_valve', width: 100,
      render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.is_valve_explain}

        </p>
      )},
      {title: '阀门状态', dataIndex: 'valve_status', key: 'valve_status', width: 100,
        render:(val, record, index) => (
          <p>
            <Badge status={val===1?"success":"error"} />{record.valve_status_explain}
          </p>
        )},
      {title: '电池寿命(年)', dataIndex: 'battery_life', key: 'battery_life', width: 100},
      {title: '条码', dataIndex: 'barcode', key: 'barcode', width: 100},
      {
        title: '备注', dataIndex: 'remark', key: 'remark',
      },
      {
        title: '所属厂商', dataIndex: 'manufacturer_name', key: 'manufacturer_name',width: 150
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (val, record, index) => (
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
              this.state.showdelBtn &&
              <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                          onConfirm={()=>this.handleRemove(record.id)}>
                <a href="">删除</a>
              </Popconfirm>
            }

          </p>
        ),
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '水表管理'}]}>
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}/>
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
                  scroll={{x: 1500, y: this.state.tableY}}
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
            title="添加水表"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm meter_models={meter_models.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改水表"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm meter_models={meter_models.data} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default MeterModel
