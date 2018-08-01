import React, {PureComponent} from 'react';
import { Table, Card, Button, Layout, message, Modal} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import DetailSearch from './DetailSearch'
import AddConcentrator from './AddOrEditConcentrator'
import Sider from './../Sider'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import {connect} from 'dva';
import Detail from './Detail'
import moment from 'moment'
import find from 'lodash/find'
import debounce from 'lodash/throttle'
import './index.less'
const {Content} = Layout;
@connect(state => ({
  concentrator_water: state.concentrator_water,
  global:state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    // this.timer=null;
    this.state = {
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      tableY: 0,
      meter_number: '',
      page: 1,
      initPage:1,
      initRange: [moment(new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      area: '',
      showArea: true,
      clickCommand:[],
      time:new Date().getTime(),
      canOperate:localStorage.getItem('canOperateConcentratorDetail')==='true'?true:false,
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable2,200))
    this.handleSearch({
      page: 1,
      meter_number: '',
      per_page:30,
    },this.changeTableY)
    const that=this;
    this.timer=setInterval(function () {
      that.setState({
        // disabled:false
        time:new Date().getTime()
      })
    },3000)
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  componentWillUnmount() {
    console.log('detail componentWillUnmount')
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable2,200))
    clearInterval(this.timer)
  }
  scrollTable2=()=>{
    console.log('scroll')
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop',scrollTop)
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      console.log('到达底部',this.state.canLoadByScroll);
      if(this.state.canLoadByScroll){
        const {concentrator_water: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          console.log('handle search')
          this.handleSearch({
            page: this.state.page+1,
            meter_number: this.state.meter_number,
            per_page:this.state.per_page,
          },function () {
            console.log('setState')
            that.setState({
              canLoadByScroll:true,
            })
          },true)
        }
      }
    }
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
      meter_number: '',
    })
  }

  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'concentrator_water/fetchAndPush':'concentrator_water/fetch',
      payload: {
        ...values,
        id:this.props.concentratorId
      },
      callback: function () {
        that.setState({
          ...values,
        });
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
      meter_number: this.state.meter_number,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      meter_number: this.state.meter_number,
      per_page:per_page
    })
  }
  read_multiple_901f=(command)=>{
    console.log('集抄：',this.props.concentratorNumber)
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.props.concentratorNumber,
        feature:'runonce_upload_multiple_timing',
        protocol:command
      },
      callback:()=>{
        sessionStorage.setItem(`concentrator_number-${command}-${this.props.concentratorNumber}`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        message.success('发送指令成功')
      }
    });
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
        feature:(company_code==='hy'||company_code==='jgs'||company_code==='zz')?'upload_single':'upload_single_lora',
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
  render() {
    const {concentrator_water: {data, meta, loading}} = this.props;
    const that=this;
    // const command=this.props.protocols;
    const renderComandRecord=(record)=>{
      const renderCommandBtn=record.protocols.map((item,index)=>{
        const clickTime=sessionStorage.getItem(`meter_number-${item}-${record.meter_number}`)
        const isLoading=clickTime&&this.state.time-clickTime<10000
        return(
          <Button loading={isLoading} key={index} type="primary" size="small" style={{marginLeft: 8}} onClick={()=>{that.read_single_901f(item,record.meter_number)}}>{isLoading?'正在':''}{item.toUpperCase()}点抄</Button>
        )
      })
      return renderCommandBtn
    }
    const company_code = sessionStorage.getItem('company_code');
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
      {title: '水表号', width: 110, dataIndex: 'meter_number', key: 'meter_number'},
      {title: '水表类型', dataIndex: 'meter_model_name', key: 'meter_model_name', width:  150, },
      {title: '用户名称', dataIndex: 'real_name', key: 'real_name', width: 150,render: (val, record, index) => {
        return ellipsis2(val,150)
      }},
      {title: '小区名称', dataIndex: 'village_name', key: 'village_name', width:150,render: (val, record, index) => {
        return ellipsis2(val,150)
      }},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address',render: (val, record, index) => {
        return ellipsis2(val,150)
      }}

    ];
    if(this.state.canOperate){
      columns.push( {
        title: '操作',
        key: 'operation',
        width: 300,
        render: (val, record, index) => {
          return (
            <div>
              {this.state.showCommandBtn&&renderComandRecord(record)}
            </div>
          )
        }
      })
    }
    const {isMobile} =this.props.global;
    return (

      <div>
        <div className='tableList'>
          <div className='tableListForm'>
            <DetailSearch protocols={this.props.protocols} concentratorNumber={this.props.concentratorNumber} wrappedComponentRef={(inst) => this.formRef = inst}
                          showCommandBtn={this.state.showCommandBtn} onBack={this.props.handleBack}
                          handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                          per_page={this.state.per_page}
                          read_multiple_901f={this.read_multiple_901f} initRange={this.state.initRange}
                          changeShowOperate={()=> {
                            this.setState({canOperate: !this.state.canOperate})
                          }}
            />
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
          rowKey={record => record.meter_number}
          dataSource={data}
          columns={columns}
          scroll={isMobile?{x:950}:{x:1050,y: this.state.tableY}}
          //scroll={{ y: this.state.tableY}}
          pagination={false}
          size="small"
        />
        <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
      </div>


    );
  }
}

export default UserMeterAnalysis
