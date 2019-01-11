import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Badge, Tooltip, Tabs, Button} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOrEditMonitor from './EditMonitor'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import Sider from './../EmptySider'
import {connect} from 'dva';
import find from 'lodash/find'
import debounce from 'lodash/throttle'
// import moment from 'moment'
import {renderIndex, ellipsis, ellipsis2, fillZero} from './../../../utils/utils'
import uuid from 'uuid/v4'
const {Content} = Layout;
@connect(state => ({
  big_meter_analysis: state.big_meter_analysis,
}))
class ConcentratorManage extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.BMap = window.BMap;
    this.state = {
      showEditBtn: find(this.permissions, {name: 'monitoring_meter_edit'}),
      showSyncBtn: find(this.permissions, {name: 'monitoring_meter_sync'}),
      showSiderCon: true,
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      // initRange:[moment(new Date().getFullYear()+'-'+new  Date().getMonth()+1+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      // started_at:'',
      // ended_at:'',
      editModal: false,
      addModal: false,
      orderModal: false,
      mapModal:false,
      village_id: '',
      showArea: true,
      editRecord: null,
      refreshSider: 0,
      canOperateMonitor: localStorage.getItem('canOperateMonitor') === 'true' ? true : false,
      canAdd: true,
      per_page: 30,
      canLoadByScroll: true,
      display_type: 'all',
    }

  }

  componentDidMount() {
    // this.setState({
    //   tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    // })
    document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    this.handleSearch({
      page: 1,
      per_page: this.state.per_page,
      display_type: 'all',
    },this.changeTableY)
  }
  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
    document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
    const {dispatch} = this.props;
    dispatch({
      type: 'big_meter_analysis/reset',

    });
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {big_meter_analysis: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page: this.state.per_page,
            display_type: this.state.display_type,
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
      per_page: 30,
      display_type: 'all',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'big_meter_analysis/fetchAndPush' : 'big_meter_analysis/fetch',
      payload: {
        ...values,
        site_type:4
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        });
        if (!fetchAndPush) {
          that.setState({
            initPage: values.page
          })
        }
        if (cb) cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      per_page: this.state.per_page,
      display_type: this.state.display_type,
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page: per_page,
      display_type: this.state.display_type,

    })
  }
  changeShowOperate = ()=> {
    this.setState({canOperateMonitor: !this.state.canOperateMonitor})
  }
  handleSync=()=>{
    const {dispatch} = this.props;
    dispatch({
      type:  'big_meter_analysis/syncData',
      payload: {
        site_type:4
      },
      callback: function () {
        message.success('同步数据成功')
      }
    });
  }
  handleEdit = () => {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'big_meter_analysis/edit',
      payload: {
        id:this.state.editRecord.id,
        village_id:formValues.village_id
      },
      callback: function () {
        that.setState({editModal:false})
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page,
          display_type: that.state.display_type,
        })
      }
    });
  }
  render() {
    const {big_meter_analysis: {data, meta, loading}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta, this.state.initPage, index)
      //   }
      {
        title: '站点名称', width: 150, dataIndex: 'site_name', key: 'site_name', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }
      },
      {
        title: '站点id', width: 100, dataIndex: 'site_id', key: 'site_id',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: '安装小区', width: 150, dataIndex: 'village_full_name', key: 'village_full_name',
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }
      },
      {
        title: '详细地址', width: 250, dataIndex: 'address', key: 'address',
        render: (val, record, index) => {
          return ellipsis2(val, 250)
        }
      },
      {
        title: '口径',  dataIndex: 'caliber', key: 'caliber',
      },

    ];
    const company_code = sessionStorage.getItem('company_code');

    const operate = {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      className: 'operation',
      width: 80,
      render: (val, record, index) => {
        return (
          <p>
            {
              this.state.showEditBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            editModal: true
                          }
                        )
                      }}>更改小区</a>
                </span>
            }
            </p>
        )
      }
    }
    if (this.state.canOperateMonitor) {
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider refreshSider={this.state.refreshSider} showSiderCon={this.state.showSiderCon}
               changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator} showArea={this.state.showArea}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={[{name: '设备管理'}, {name: '监控表管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                    <div>
                      <div className='tableList'>
                        <div className='tableListForm'>
                          <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                  village_id={this.state.village_id}
                                  per_page={this.state.per_page}
                                  showSyncBtn={this.state.showSyncBtn}
                                  handleSync={this.handleSync}
                                  handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                  showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                  canOperateMonitor={this.state.canOperateMonitor}
                                  changeShowOperate={this.changeShowOperate}
                          />
                        </div>
                      </div>
                      <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                       dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                       scroll={{x: 1000, y: this.state.tableY}}
                                       history={this.props.history}
                                       canOperate={this.state.canOperateMonitor}
                                       operate={operate}
                                       showConcentrator={this.showConcentrator}/>
                      <Pagination meta={meta} initPage={this.state.initPage}
                                  handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
                    </div>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            key={ Date.parse(new Date())}
            title="修改区域"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditMonitor  editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default ConcentratorManage
