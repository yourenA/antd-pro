import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm, Modal,Badge } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../OnlyAdd'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import {renderIndex} from './../../../utils/utils'
const {Content} = Layout;
@connect(state => ({
  meter_models: state.meter_models,
  manufacturers: state.manufacturers,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
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
      type: 'meter_models/fetch',
      payload: {
        page: 1,
      }
    });
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      }
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_models/fetch',
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
      type: 'meter_models/fetch',
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
      type: 'meter_models/add',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
        is_control:formValues.is_control.key?parseInt(formValues.is_control.key):-1
      },
      callback: function () {
        message.success('添加水表类型成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'meter_models/fetch',
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
      type: 'meter_models/edit',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
        is_control: formValues.is_control.key,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改水表类型成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'meter_models/fetch',
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
      type: 'meter_models/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除水表类型成功')
        that.props.dispatch({
          type: 'meter_models/fetch',
          payload: {
            query: that.state.query,
            page: that.state.page
          }
        });
      }
    });
  }

  render() {
    const {meter_models: {data, meta, loading}, manufacturers} = this.props;
    console.log('meta',meta)
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '水表类型', width: 80, dataIndex: 'type', key: 'type'},
      {title: '口径mm', width: 80, dataIndex: 'bore', key: 'bore'},
      {title: '是否支持阀控', dataIndex: 'is_control', key: 'is_control', width: 110,
      render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.is_control_explain}

        </p>
      )},
      {title: '使用年限', dataIndex: 'service_life', key: 'service_life', width: 100},
      {title: '波特率', dataIndex: 'baud_rate', key: 'baud_rate', width:80},
      {
        title: '下行协议', dataIndex: 'down_protocol', key: 'down_protocol', width: 100
      },
      {
        title: '所属厂商', dataIndex: 'manufacturer_name', key: 'manufacturer_name',
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
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '水表类型查询'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表类型" dateText="发送时间" handleSearch={this.handleSearch}
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
                  scroll={{x: 800}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            title="添加水表类型"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改水表类型"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default MeterModel
