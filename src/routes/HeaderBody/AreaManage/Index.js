import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm,Modal,Switch} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../OnlyAdd'

import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditArea'
const {Content} = Layout;
@connect(state => ({
  area: state.area,
}))
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'village_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'village_delete'}),
      tableY: 0,
      query: '',
      page: 1,
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
      type: 'area/fetch',
      payload: {
        page: 1,
      }
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'area/fetch',
      payload: {},
    });

    this.setState({
      page: 1,
      query: '',
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'area/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      query: values.query,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'area/add',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('添加区域成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'area/fetch',
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
      type: 'area/edit',
      payload: {
        ...formValues,
        id:this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改区域成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'area/fetch',
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
      type: 'area/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除区域成功')
        that.props.dispatch({
          type: 'area/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
          }
        });
      }
    });
  }
  handleChangePhoneCall=(id)=>{
    console.log(id)
  }
  render() {
    const {area: {data, meta, loading},manufacturers} = this.props;
    const columns = [
      {title: '区域名称', dataIndex: 'name', key: 'name',width:'30%'},
      {title: '备注', dataIndex: 'remark', key: 'remark',width:'30%'},
      {
        title: '操作',
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
        {/*<Sider changeArea={this.changeArea} location={this.props.history.location}/>*/}
        <Content >
          <div className="content">
            <PageHeaderLayout title="运行管理 " breadcrumb={[{name: '运行管理 '}, {name: 'DMA分区管理'}, {name: '分区管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="区域名称" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
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
                  scroll={{ y: this.state.tableY}}
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
            key={ Date.parse(new Date())+1}
            title="添加区域"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm    wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改区域"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm  editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
