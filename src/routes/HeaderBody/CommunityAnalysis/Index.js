import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Pagination from './../../../components/Pagination/Index'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import uuid from 'uuid/v4'
// import 'rsuite-table/lib/less/index.less'
import {getPreDay, renderIndex, renderErrorData,renderIndex2} from './../../../utils/utils'
// import './index.less'
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
  global:state.global,
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
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage:1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll:true,
      // concentrator_number:''
    }
  }

  componentDidMount() {
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }
  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable=()=>{
    console.log('scroll')
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop',scrollTop)
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      console.log('到达底部');
      if(this.state.canLoadByScroll){
        const {village_meter_data: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            install_address: this.state.install_address,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            // area: this.state.area
          },true,function () {
            that.setState({
              canLoadByScroll:true,
            })
          })
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }

  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id
    })
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      install_address: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number:'',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number: '',
        member_number: '',
        install_address: '',
        started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),

      })
    })
  }
  changeConcentrator = (concentrator_number,village_id)=> {
    this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:'',
      concentrator_number:concentrator_number
    }, function(){
      this.handleSearch({
        page: 1,
        meter_number: '',
        member_number: '',
        install_address: '',
        started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),

      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number:'',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values,fetchAndPush=false,cb) => {
    const that = this;
    const {dispatch} = this.props;
    console.log('village_id',this.state.village_id)
    dispatch({
      type: fetchAndPush?'village_meter_data/fetchAndPush':'village_meter_data/fetch',
      payload: {

        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
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
        if(cb)cb()
      }
    });
  }
  handPageChange = (page)=> {
    const that=this;
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  render() {
    const {village_meter_data: {data, meta, loading}, concentrators, meters} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return renderIndex(meta, this.state.initPage, index)
        }
      },
      {title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number', fixed: 'left',},
      {title: '户号', width: 80, dataIndex: 'member_number', key: 'member_number'},
      {title: '应收水量', width: 100, dataIndex: 'difference_value', key: 'difference_value'},
      {title: '上次抄见时间', dataIndex: 'previous_collected_at', key: 'previous_collected_at', width: 160,},
      {title: '上次抄见', dataIndex: 'previous_value', key: 'previous_value', width: 120,},
      {title: '本次抄见时间', dataIndex: 'latest_collected_at', key: 'latest_collected_at', width: 160,},
      {title: '本次抄见', dataIndex: 'latest_value', key: 'latest_value', width: 120,},
      {title: '水表类型', width: 130, dataIndex: 'meter_model_name', key: 'meter_model_name',},
      {title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number', width: 100,},

      {
        title: '安装地址', dataIndex: 'install_address', key: 'install_address',
        render: (val, record, index) => {
          return (
            <Tooltip title={val}>
              <span>{val.length > 10 ? val.substring(0, 7) + '...' : val}</span>
            </Tooltip>
          )
        }
      },

      /*{
       title: '操作',
       key: 'operation',
       fixed: 'right',
       width: 300,
       render: (val, record, index) => {
       return (
       <div>
       <Button type="primary" size='small' onClick={()=>message.info('该功能暂未开通')}>点抄 901F</Button>
       <Button type="primary" disabled size='small' onClick={()=>message.info('该功能暂未开通')}>点抄 90EF</Button>
       {/!*<Button type="danger" size='small' onClick={()=>message.info('该功能暂未开通')}>停用</Button>*!/}
       <Button type="primary" disabled size='small' onClick={()=>message.info('该功能暂未开通')}>关阀</Button>
       </div>
       )
       }
       },*/
    ];
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '小区水量分析'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if (record.status === -2) {
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1280,y: isMobile?document.body.offsetHeight-200:this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} initPage={this.state.initPage} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        {/*  <Modal
         key={ Date.parse(new Date())}
         title="添加用户档案"
         visible={this.state.addModal}
         onOk={this.handleAdd}
         onCancel={() => this.setState({addModal:false})}
         >
         <AddOREditUserArchives  wrappedComponentRef={(inst) => this.formRef = inst} concentrators={concentrators.data} meters={meters.data}  />
         </Modal>
         <Modal
         key={ Date.parse(new Date())+1}
         title="编辑用户档案"
         visible={this.state.editModal}
         onOk={this.handleEdit}
         onCancel={() => this.setState({editModal:false})}
         >
         <AddOREditUserArchives  wrappedComponentRef={(inst) => this.editFormRef = inst} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
         </Modal>*/}

      </Layout>
    );
  }
}

export default UserMeterAnalysis
