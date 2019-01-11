import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm, Modal,Badge } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Pagination from './../../../components/Pagination/Index'
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditServers'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import map from './../../../images/map.png'
import RouteMap from './RouteMap'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  locations: state.locations,
}))
class Location extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'server_add_and_edit'}),
      showStatusBtn: find(this.permissions, {name: 'server_status_edit'}),
      showdelBtn: find(this.permissions, {name: 'server_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      editStatusModal:false,
      canOperate:localStorage.getItem('canOperateServer')==='true'?true:false,
      display_type: 'all',
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    this.handleSearch({
      page: 1,
      display_type: 'all',
    })
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
        const {locations: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            display_type: this.state.display_type,
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
  findChildFunc = (cb)=> {
    this.findChildPoi = cb
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
      display_type: 'all',
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'locations/fetchAndPush':'locations/fetch',
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
      display_type:this.state.display_type,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      display_type:this.state.display_type,
      per_page:per_page
    })
  }
  handleEditRoute = ()=> {
    const that = this;
    const formValues = this.editRouteRef;
    const locations= this.findChildPoi()
    console.log('locations',locations)

    this.props.dispatch({
      type: 'locations/edit',
      payload: {
        locations:locations,
        id: this.state.editRecord.user_id,
      },
      callback: function () {
        message.success('修改抄表地点成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'locations/fetch',
          payload: {
            // query: that.state.query,
            page: that.state.page,
            per_page:that.state.per_page
          }
        });
      }
    });
  }

  render() {
    const {locations: {data, meta, loading}} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {title: '用户名', width: 150, dataIndex: 'username', key: 'username',
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {title: '真实姓名',  dataIndex: 'real_name', key: 'real_name',width:150,
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {
        title: '地图', dataIndex: 'map', key: 'map', render: (val, record, index) => {
        return <div  onClick={()=> {
          this.setState(
            {
              editRecord: record,
              mapModal: true
            }
          )
        }}><img src={map} alt="" style={{width:'30px',cursor:'pointer'}} className="concentrator-map"/></div>
      }}
    ];
    let operate={
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
                </span>
          }

        </p>
      ),
    }
    if(this.state.canOperate){
      columns.push(operate)
    }
    return (
      <Layout className="layout">
     {/*   <Sider changeArea={this.changeArea} location={this.props.history.location}/>*/}
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '},{name: '抄表路线管理'}, {name: '抄表地点管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   per_page={this.state.per_page}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.user_id}
                                 scroll={{x:1000,y: this.state.tableY}}
                                 history={this.props.history}
                                 canOperate={this.state.canOperate}
                                 operate={operate}
                />
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            style={{ top: 0 }}
            width="100%"
            key={ Date.parse(new Date()) + 1}
            title={`${this.state.editRecord ? this.state.editRecord.username : ''}抄表线路图 `}
            visible={this.state.mapModal}
            onOk={() => this.setState({mapModal: false})}
            onCancel={() => this.setState({mapModal: false})}
            footer={null}
          >
            <RouteMap editRecord={this.state.editRecord} cantMovePoint={false} />
          </Modal>
          <Modal
            style={{ top: 0 }}
            width="100%"
            key={ Date.parse(new Date()) + 2}
            destroyOnClose={true}
            title={`修改${this.state.editRecord ? this.state.editRecord.username : ''}抄表线路图 `}
            visible={this.state.editModal}
            onCancel={() => this.setState({editModal: false})}
            onOk={this.handleEditRoute}
          >
            <RouteMap findChildFunc={this.findChildFunc} editRecord={this.state.editRecord} cantMovePoint={true}  ref="RouteMap"  wrappedComponentRef={(inst) => this.editRouteRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Location
