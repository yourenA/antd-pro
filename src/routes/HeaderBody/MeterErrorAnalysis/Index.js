import React, {PureComponent} from 'react';
import { Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import { routerRedux} from 'dva/router';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
import debounce from 'lodash/throttle'
import {renderIndex,renderErrorData,ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import Detail from './../UserMeterAnalysis/Detail'
const {Content} = Layout;
@connect(state => ({
  manufacturers: state.manufacturers,
  meter_errors: state.meter_errors,
  global: state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      manufacturer_id: '',
      page: 1,
      initPage:1,
      initRange:  [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      concentrator_number: '',
      meter_number: '',
      member_number: '',
      display_type: 'all',
      ime:new Date().getTime(),
      canOperate: localStorage.getItem('canOperateMeterUnusualAnalysis') === 'true' ? true : false,
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      },
    });

    const that=this;
    this.timer=setInterval(function () {
      that.setState({
        // disabled:false
        time:new Date().getTime()
      })
    },5000)
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
    clearInterval(this.timer)
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  scrollTable=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {meter_errors: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            manufacturer_id: this.state.manufacturer_id,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            display_type: this.state.display_type,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            per_page:this.state.per_page
          },function () {
            that.setState({
              canLoadByScroll:true,
            })
          },true)
        }
      }
    }
  }
  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      showAddBtnByCon: false,
      concentrator_number:'',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        manufacturer_id: this.state.manufacturer_id,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        display_type: this.state.display_type,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
        per_page:this.state.per_page
      })
    })

  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      concentrator_number: concentrator_number,
      village_id:parent_village_id,
      showAddBtnByCon: true,
    },function () {
      this.handleSearch({
        page: 1,
        manufacturer_id: this.state.manufacturer_id,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        display_type: this.state.display_type,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
        per_page:this.state.per_page
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      manufacturer_id: '',
      meter_number: '',
      member_number: '',
      display_type: 'all',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      per_page:30
    })
  }

  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'meter_errors/fetchAndPush': 'meter_errors/fetch',
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
        if(cb) cb()
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      manufacturer_id: this.state.manufacturer_id,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      display_type: this.state.display_type,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:this.state.per_page
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page:1,
      manufacturer_id: this.state.manufacturer_id,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      display_type: this.state.display_type,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:per_page
    })
  }
  read_single_901f=(command,meter_number)=>{
    const company_code = sessionStorage.getItem('company_code');
    console.log('点抄：',meter_number)
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        meter_number,
        feature:'upload_single',
        protocol:command
      },
      callback:()=>{
        sessionStorage.setItem(`meter_number-${command}-${meter_number}`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        message.success('发送指令成功')
      }
    });
  }
  operate = (record)=> {
    this.setState({
      edit_meter_number: record.meter_number,
      editModal: true
    })
  }
  render() {
    const {meter_errors: {data, meta, loading}, manufacturers,dispatch} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
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
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number'
        , render: (val, record, index) => {
        return (
          <p  className="link" onClick={()=>{
            dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/concentrator_unusual_analysis?concentrator=${val}&date=${record.date}`));
          }} >{val}</p>
        )
      }},
      {title: '水表编号', width: 110, dataIndex: 'meter_number', key: 'meter_number',render: (text, record, index) => {
        return ellipsis2(text,110)
      }},
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number',render: (text, record, index) => {
        return ellipsis2(text,100)
      }},

      {title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name',render: (text, record, index) => {
        return ellipsis2(text,100)
      }},
      {title: '地址', width: 150, dataIndex: 'address', key: 'address',render: (text, record, index) => {
        return ellipsis2(text,150)
      }},
      {title: '日期', dataIndex: 'date',  key: 'date',width:100,render: (text, record, index) => {
        return ellipsis2(text,100)
      }},
      {
        title: '异常类型', width: 100, dataIndex: 'status', key: 'status'
        , render: (val, record, index) => {
          let status='success';
          switch (val){
            case -2:
              status='error'
              break;
            case -1:
              status='warning'
              break;
            default:
              status='success'
          }

          return (
            <p>
              <Badge status={status}/>{record.status_explain}
            </p>
          )
      }
      },

      {title: '用水量', width: 80, dataIndex: 'consumption', key: 'consumption',
        render: (val, record, index) => {
          return renderErrorData(val)
        }
      },
      {title: '集中器协议', dataIndex: 'protocols', key: 'protocols', width: 90,render: (val, record, index) => {
        if(val){
          return ellipsis2(val.join('|'), 90)
        }else{
          return ''
        }
      }},
      {title: '厂商名称', dataIndex: 'manufacturer_name',  key: 'manufacturer_name'},

    ];
    const that=this;
    const renderComandRecord=(record)=>{
      const command=record.protocols;
      if(!command) return '';
      const renderCommandBtn=command.map((item,index)=>{
        const clickTime=sessionStorage.getItem(`meter_number-${item}-${record.meter_number}`)
        const isLoading=clickTime&&this.state.time-clickTime<10000
        return(
          <Button loading={isLoading} key={index} type="primary" size="small" style={{marginLeft: 3,marginBottom: 3}} onClick={()=>{that.read_single_901f(item,record.meter_number)}}>{item.toUpperCase()}点抄</Button>
        )
      })
      return renderCommandBtn
    }
    const operate={
      title: '操作',
      key: 'operation',
      width: 250,
      fixed: 'right',
      render: (val, record, index) => {
        return (
          <div>
            <Button type="primary" size='small' onClick={()=>this.operate(record)}>详细信息</Button>
            {this.state.showCommandBtn&&renderComandRecord(record)}
          </div>
        )
      }
    }
    if(this.state.canOperate){
      columns.push(operate)
    }
    const {isMobile} =this.props.global;

    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '水表异常分析'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            isMobile={isMobile}
                            manufacturers={manufacturers.data}
                            village_id={this.state.village_id}
                            per_page={this.state.per_page}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}
                            canOperateConcentrator={this.state.canOperate} changeShowOperate={()=> {
                      this.setState({canOperate: !this.state.canOperate})
                    }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                 scroll={{x:1750,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperate}
                                 rowClassName={function (record, index) {
                                   if (record.status === -2) {
                                     return 'error'
                                   }
                                 }}
                />
               {/* <Table
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
                  scroll={{x: 1210,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination  meta={meta} handPageChange={this.handPageChange}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            destroyOnClose={true}
            width="900px"
            title={`水表 ${this.state.edit_meter_number} 详细信息(红色柱状图表示当天错报,黄色表示当天漏报)`}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <Detail showExtra={true} meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                    started_at={this.state.started_at}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
