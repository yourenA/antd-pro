import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import {renderIndex} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditVendor from './addOrEditVendor'
import debounce from 'lodash/throttle'
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
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      canOperate:localStorage.getItem('canOperateVendor')==='true'?true:false,
      canAdd:true,
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        page: 1,
      },
      callback: function () {
        that.changeTableY()
      }
    });
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable = ()=> {
    console.log('scroll')
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop', scrollTop)
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      console.log('到达底部');
      if (this.state.canLoadByScroll) {
        const {manufacturers: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page:this.state.per_page,
            // area: this.state.area
          }, function () {
            that.setState({
              canLoadByScroll: true,
            })
          }, true)
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'manufacturers/fetchAndPush':'manufacturers/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if (!fetchAndPush) {
          that.setState({
            initPage: values.page
          })
        }
        if (cb)cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page:per_page
    })
  }
  handleAdd = () => {
    this.setState({
      canAdd:false
    })
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
        that.setState({
          canAdd:true
        })
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      },
      errorCallback:function () {
        that.setState({
          canAdd:true
        })
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
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
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
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
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
          return renderIndex(meta,this.state.initPage,index)
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
                                   per_page={this.state.per_page}
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
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title="添加厂商"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false,canAdd:true})}
            footer={[
              <Button key="back" onClick={() => this.setState({addModal:false})}>取消</Button>,
              <Button key="submit" type="primary" disabled={!this.state.canAdd} onClick={this.handleAdd}>
                确认
              </Button>,
            ]}
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
