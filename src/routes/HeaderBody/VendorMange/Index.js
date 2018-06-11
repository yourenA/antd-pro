import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import {renderIndex} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditVendor from './addOrEditVendor'
const {Content} = Layout;
@connect(state => ({
  manufacturers: state.manufacturers,
  global:state.global,
}))
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'manufacturer_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'manufacturer_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      canOperate:localStorage.getItem('canOperateVendor')==='true'?true:false,
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        page: 1,
      }
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
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
      type: 'manufacturers/fetch',
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
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'manufacturers/add',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('添加厂商成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'manufacturers/fetch',
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
      type: 'manufacturers/edit',
      payload: {
        ...formValues,
        id:this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改厂商成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'manufacturers/fetch',
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
      type: 'manufacturers/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除厂商成功')
        that.props.dispatch({
          type: 'manufacturers/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
          }
        });
      }
    });
  }
  render() {
    const {manufacturers: {data, meta, loading}} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '厂商编号', width: '10%', dataIndex: 'code', key: 'code'},
      {title: '厂商名称', width: '15%', dataIndex: 'name', key: 'name'},
      {title: '集中器数量', dataIndex: 'concentrator_count', key: 'concentrator_count', width: '12%'},
      {title: '水表数量', dataIndex: 'meter_count', key: 'meter_count', width: '12%'},
      {title: '厂商电话', dataIndex: 'phone', key: 'phone', width: '15%'},
      {
        title: '联系人', dataIndex: 'contact', key: 'contact',
      },
    ];
    if(this.state.canOperate){
      columns.push({
        title: '操作',
        width: 100,
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
      })
    }
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '厂商查询'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="厂商名称" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}/>
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
                  scroll={isMobile?{x:800}:{y: this.state.tableY}}
                  //scroll={{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title="添加厂商"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditVendor   wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改厂商"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditVendor editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
