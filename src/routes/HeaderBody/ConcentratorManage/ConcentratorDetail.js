import React, {PureComponent} from 'react';
import { Table, Tooltip, Button, Layout, message, Modal,Popconfirm } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import DetailSearch from './DetailSearch'
import AddConcentrator from './AddOrEditConcentrator'
import Sider from './../Sider'
import {renderIndex, ellipsis2, renderNotification} from './../../../utils/utils'
import {connect} from 'dva';
import Detail from './Detail'
import moment from 'moment'
import find from 'lodash/find'
import debounce from 'lodash/throttle'
import './index.less'
import ResizeableTable from './../../../components/ResizeableTitle/Index'

const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
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
    },1000)
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable2,200))
    clearInterval(this.timer)
  }
  scrollTable2=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {concentrator_water: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            meter_number: this.state.meter_number,
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
  read_multiple_901f=(command,renderNotificationObj)=>{
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
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
        renderNotification(renderNotificationObj)
      }
    });
  }
  read_single_901f=(command,meter_number,renderNotificationObj)=>{
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
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
        renderNotification(renderNotificationObj)
      }
    });
  }
  valveCommand=(command,renderNotificationObj)=>{
    console.log(command,this.props.concentratorNumber)
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.props.concentratorNumber,
        feature: command
      },
      callback:()=>{
        sessionStorage.setItem(`${command}-${this.props.concentratorNumber}`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
        renderNotification(renderNotificationObj)
      }
    });
  }
  singleValveCommand=(command,meter,renderNotificationObj)=>{
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        meter_number:[meter],
        feature: command
      },
      callback:()=>{
        sessionStorage.setItem(`${command}-selected-${meter}`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        message.success('发送指令成功')
        renderNotification(renderNotificationObj)
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {concentrator_water: {data, meta, loading}} = this.props;
    console.log('data',data)
    const that=this;
    // const command=this.props.protocols;
    const renderComandRecord=(record)=>{
      if(!record.protocols) return '';
      const renderCommandBtn=record.protocols.map((item,index)=>{
        const clickTime=sessionStorage.getItem(`meter_number-${item}-${record.meter_number}`)
        const isLoading=clickTime&&this.state.time-clickTime<10000
        return(
          <Button loading={isLoading} key={index} type="primary" size="small"
                  style={{marginBottom:(index===0||record.protocols.length>1)?5:0}}
                  onClick={()=>{
                    let renderNotificationObj={key:item.toUpperCase()+record.meter_number,
                      message:item.toUpperCase()+formatMessage({id: 'intl.upload_single'})+record.meter_number+' 进度'};
                    that.read_single_901f(item,record.meter_number,renderNotificationObj)
                  }}>{item.toUpperCase()}&nbsp;{formatMessage({id: 'intl.upload_single'})}</Button>
        )
      })
      return renderCommandBtn
    }
    const company_code = sessionStorage.getItem('company_code');
    const renderOpenValveBtn=function (record) {
      const clickTime=sessionStorage.getItem(`open_valve-selected-${record.meter_number}`)
      const isLoading=clickTime&&that.state.time-clickTime<10000
      return(
        <Popconfirm  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.open_valve'})})}
                     onConfirm={()=>{
                       that.setState({ time:new Date().getTime()});
                       let renderNotificationObj={key:'open'+record.meter_number, message:formatMessage({id: 'intl.open_valve'})+record.meter_number+' 进度'}
                       that.singleValveCommand('open_valve',record.meter_number,renderNotificationObj)
                     }}>
          <Button size="small" loading={isLoading}  type="primary" >{isLoading?'':''}{formatMessage({id: 'intl.open_valve'})}</Button>
        </Popconfirm>
      )
    }
    const renderCloseValveBtn=function (record) {
      const clickTime=sessionStorage.getItem(`close_valve-selected-${record.meter_number}`)
      const isLoading=clickTime&&that.state.time-clickTime<10000
      return(
        <Popconfirm  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.close_valve'})})}
                     onConfirm={()=>{that.setState({ time:new Date().getTime()});
                       that.setState({ time:new Date().getTime()});
                       let renderNotificationObj={key:'close'+record.meter_number, message:formatMessage({id: 'intl.close_valve'})+record.meter_number+' 进度'}
                       that.singleValveCommand( 'close_valve',record.meter_number,renderNotificationObj)
                     }} >
          <Button size="small"  loading={isLoading}  type="danger" >{isLoading?'':''}{formatMessage({id: 'intl.close_valve'})}</Button>
        </Popconfirm>
      )
    }
    const columns = [
      {title:formatMessage({id: 'intl.water_meter_number'}), width: 120, fixed:'left', dataIndex: 'meter_number', key: 'meter_number',render: (val, record, index) => {
        return ellipsis2(val,120)
      }},
      {title: formatMessage({id: 'intl.water_meter_type'}), dataIndex: 'meter_model_name', key: 'meter_model_name', width:  150,render: (val, record, index) => {
      return ellipsis2(val,150)
    } },
      {title: formatMessage({id: 'intl.user_name'}), dataIndex: 'real_name', key: 'real_name', width: 150,render: (val, record, index) => {
        return ellipsis2(val,150)
      }},
      {title: formatMessage({id: 'intl.village_name'}), dataIndex: 'village_name', key: 'village_name', width:150,render: (val, record, index) => {
        return ellipsis2(val,150)
      }},
      {title: formatMessage({id: 'intl.install_address'}), dataIndex: 'install_address', key: 'install_address',render: (val, record, index) => {
        return   <Tooltip
          placement="topLeft"
          title={<p style={{wordWrap: 'break-word'}}>{val}</p>}>
          <p >{val}</p>
        </Tooltip>
      }}

    ];
    const {isMobile} =this.props.global;
    const operate={
      title:formatMessage({id: 'intl.operate'}),
      key: 'operation',
      fixed:'right',
      width: isMobile?150:320,
      render: (val, record, index) => {
        return (
          <div>
            {this.state.showCommandBtn&&renderComandRecord(record)}
            {['hy'].indexOf(company_code)<0&&this.state.showCommandBtn&&renderOpenValveBtn(record)}
            {['hy'].indexOf(company_code)<0&&this.state.showCommandBtn&&renderCloseValveBtn(record)}
          </div>
        )
      }
    }
    if (this.state.canOperate) {
      columns.push(operate)
    }
    return (

      <div>
        <div className='tableList'>
          <div className='tableListForm'>
            <DetailSearch protocols={this.props.protocols} concentratorNumber={this.props.concentratorNumber} wrappedComponentRef={(inst) => this.formRef = inst}
                          showCommandBtn={this.state.showCommandBtn} onBack={this.props.handleBack}
                          handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                          per_page={this.state.per_page}
                          read_multiple_901f={this.read_multiple_901f} initRange={this.state.initRange}
                          valveCommand={this.valveCommand}
                          changeShowOperate={()=> {
                            this.setState({canOperate: !this.state.canOperate})
                          }}
            />
          </div>
        </div>
        <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                         dataSource={data}  columns={columns} rowKey={record => record.meter_number}
                         scroll={isMobile?{x:950,y: this.state.tableY}:{x:1500,y: this.state.tableY}}
                         canOperate={this.state.canOperate}
                         operate={operate}
                         history={this.props.history}
                        />
        <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
      </div>


    );
  }
}

export default UserMeterAnalysis
