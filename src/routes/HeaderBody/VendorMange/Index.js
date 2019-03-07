import React, {PureComponent} from 'react';
import { Tooltip, Card, Layout, message, Popconfirm,Modal,Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditVendor from './addOrEditVendor'
import debounce from 'lodash/throttle'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  manufacturers: state.manufacturers,
  global:state.global,
}))
@injectIntl
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
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
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
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.vendor'})}
          )
        )
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
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.vendor'})}
          )
        )
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
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.vendor'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {manufacturers: {data, meta, loading}} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   fixed:'left',
      //
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {title:  formatMessage({id: 'intl.vendor_number'}), width: 120, dataIndex: 'code', key: 'code',
        fixed:'left',
        render: (val, record, index) => {
          return ellipsis2(val,130)
        }},
      {title:  formatMessage({id: 'intl.vendor_name'}), width: 150, dataIndex: 'name', key: 'name',
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {title:  formatMessage({id: 'intl.concentrator_count'}), dataIndex: 'concentrator_count', key: 'concentrator_count',
        render: (val, record, index) => {
          return ellipsis2(val,140)
        },width: 140},
      {title:  formatMessage({id: 'intl.meter_count'}), dataIndex: 'meter_count', key: 'meter_count', width: 120,
        render: (val, record, index) => {
          return ellipsis2(val,120)
        }},
      {title:  formatMessage({id: 'intl.vendor_phone'}), dataIndex: 'phone', key: 'phone', width: 150,
        render: (val, record, index) => {

          return ellipsis2(val,150)
        }},
      {
        title:  formatMessage({id: 'intl.vendor_contact'}), dataIndex: 'contact', key: 'contact',
        render: (val, record, index) => {
          return  <Tooltip
            placement="topLeft"
            title={val}>
            <p >{val}</p>
          </Tooltip>
        }
      },
    ];
    const operate={
      title:  formatMessage({id: 'intl.operate'}),
      width: 100,
      fixed:'right',
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
                      }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showdelBtn &&
            <Popconfirm placement="topRight"  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">{formatMessage({id: 'intl.delete'})}</a>
            </Popconfirm>
          }

        </p>
      ),
    }
    if(this.state.canOperate){
      columns.push(operate)
    }
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 "  breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.vendor_manage'})}]}>
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
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x:1200,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperate}
                />
               {/* <Table
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
                />*/}
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title={formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false,canAdd:true})}
            footer={[
              <Button key="back" onClick={() => this.setState({addModal:false})}>{formatMessage({id: 'intl.cancel'})}</Button>,
              <Button key="submit" type="primary" disabled={!this.state.canAdd} onClick={this.handleAdd}>
                {formatMessage({id: 'intl.submit'})}
              </Button>,
            ]}
          >
            <AddOrEditVendor   wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title={formatMessage({id: 'intl.edit'})}
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
