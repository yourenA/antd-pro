import React, {PureComponent} from 'react';
import { Tooltip , Card, Layout, message, Popconfirm,Modal,Button} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditConcentratorModels'
import debounce from 'lodash/throttle'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
const {Content} = Layout;
@connect(state => ({
  concentrator_models: state.concentrator_models,
  manufacturers: state.manufacturers,
  global:state.global,
}))
class ConcentratorModels extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'concentrator_model_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'concentrator_model_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      canOperate:localStorage.getItem('canOperateConcentratorModel')==='true'?true:false,
      addModal: false,
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
      type: 'concentrator_models/fetch',
      payload: {
        page: 1,
      },
      callback:()=>{
        that.changeTableY()
      }
    });
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      }
    });
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {concentrator_models: {meta}} = this.props;
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
      type: fetchAndPush?'concentrator_models/fetchAndPush':'concentrator_models/fetch',
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
      type: 'concentrator_models/add',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
      },
      callback: function () {
        message.success('添加集中器类型成功')
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
      type: 'concentrator_models/edit',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
        id:this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改集中器类型成功')
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
      type: 'concentrator_models/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除集中器类型成功')
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      }
    });
  }
  render() {
    const {concentrator_models: {data, meta, loading},manufacturers} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.page,index)
      //   }
      // },
      {title: '类型名称', width:  200, dataIndex: 'name', key: 'name',
        fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val,200)
        }},
      {title: '类型编码', width:  200, dataIndex: 'code', key: 'code',
        render: (val, record, index) => {
          return ellipsis2(val,200)
        }},

      {title: '协议', dataIndex: 'protocols', key: 'protocols', width: 200, render: (text, record, index) => {
        return ellipsis2(text.join('|'),200)
      }},
      {
        title: '所属厂商', dataIndex: 'manufacturer_name', key: 'manufacturer_name',
        render: (val, record, index) => {
          return  <Tooltip
            placement="topLeft"
            title={val}>
            <p >{val}</p>
          </Tooltip>
        }
      },
    ];
    const operate ={
      title: '操作',
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
    }
    if(this.state.canOperate){
      columns.push(operate )
    }
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '设备管理 '}, {name: '集中器类型查询'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="类型名称" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}
                    />
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
                  scroll={isMobile?{x:700}:{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title="添加集中器类型"
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
            <AddOrEditForm manufacturers={manufacturers.data}  wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改集中器类型"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default ConcentratorModels
