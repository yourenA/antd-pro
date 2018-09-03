import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Tooltip} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import AddOREditUserArchives from './addOREditUserArchives'
import Sider from './../Sider'
import {connect} from 'dva';
import ChangeTable from './ChangeTable'
import moment from 'moment'
import debounce from 'lodash/throttle'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
import ResizeableTable from './../../../components/ResizeableTitle/Index'

const {Content} = Layout;
@connect(state => ({
  meter_status: state.meter_status,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      query: '',
      meter_number: '',
      member_number: '',
      real_name: '',
      install_address: '',
      page: 1,
      initPage:1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    this.changeTableY();
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {meter_status: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            meter_number: this.state.meter_number,
            member_number:this.state.member_number,
            real_name:this.state.real_name,
            install_address:this.state.install_address,
            per_page:this.state.per_page,

          },function () {
            that.setState({
              canLoadByScroll:true,
            })
          },true)
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      showAddBtnByCon: false,
      village_id: village_id,
      concentrator_number: ''
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number:this.state.member_number,
        real_name:this.state.real_name,
        install_address:this.state.install_address,
        per_page:this.state.per_page
        // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),

      })
    })

  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:parent_village_id,
      concentrator_number: concentrator_number,
      showAddBtnByCon: true,
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number:this.state.member_number,
        real_name:this.state.real_name,
        install_address:this.state.install_address,
        per_page:this.state.per_page
        // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '', member_number: '', real_name: '', install_address: '',
      per_page:30
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'meter_status/fetchAndPush': 'meter_status/fetch',
      payload: {
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if(!fetchAndPush){
          that.setState({
            initPage:values.page
          })
        }
        if(cb) cb()
      }
    });


  }
  handPageChange = (page)=> {
    const that = this;
    this.handleSearch({
      page: page,
      meter_number: that.state.meter_number,
      member_number: that.state.member_number,
      real_name: that.state.real_name,
      install_address: that.state.install_address,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    const that = this;
    this.handleSearch({
      page: 1,
      meter_number: that.state.meter_number,
      member_number: that.state.member_number,
      real_name: that.state.real_name,
      install_address: that.state.install_address,
      per_page:per_page
    })
  }

  render() {
    const {meter_status: {data, meta, loading}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [

      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number',},
      {
        title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name',
        render: (val, record, index) => {
          return ellipsis2(val, 95)
        }
      },
      {
        title: '安装地址', dataIndex: 'install_address', key: 'install_address', width: 130,
        render: (val, record, index) => {
          return ellipsis2(val, 125)
        }
      },
      {
        title: '水表类型', width: 130, dataIndex: 'meter_model_name', key: 'meter_model_name',
        render: (val, record, index) => {
          return ellipsis2(val, 125)
        }
      },
      {title: '水表编号', width: 110, dataIndex: 'meter_number', key: 'meter_number',
        render: (val, record, index) => {
          return ellipsis2(val, 110)
        }},
      {title: '年限', width: 100, dataIndex: 'service_life', key: 'service_life'},

      {
        title: '生产厂商', width: 100, dataIndex: 'manufacturer_name', key: 'manufacturer_name',
        render: (val, record, index) => {
          return ellipsis2(val, 95)
        }
      },


      {title: '安装时间', dataIndex: 'installed_at', key: 'installed_at',},


    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '数据分析'}, {name: '户表使用年限'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            village_id={this.state.village_id}
                            per_page={this.state.per_page}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data}  columns={columns} rowKey={record => record.uuidkey}
                                 history={this.props.history}
                                 scroll={{x: 1560, y: this.state.tableY}}/>
            {/*    <Table
                  rowClassName={function (record, index) {
                    if (record.description === '') {
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1000, y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          key={ Date.parse(new Date())}
          title="添加用户档案"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false})}
        >
        </Modal>
        <Modal
          key={ Date.parse(new Date()) + 1}
          title="编辑用户档案"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
        </Modal>
        <Modal
          key={ Date.parse(new Date()) + 2}
          title="换表"
          visible={this.state.changeModal}
          onOk={this.handleChangeTable}
          onCancel={() => this.setState({changeModal: false})}
        >
          <ChangeTable wrappedComponentRef={(inst) => this.ChangeTableformRef = inst}/>
        </Modal>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
