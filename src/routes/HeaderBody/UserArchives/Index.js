import React, {PureComponent} from 'react';
import { Table , Card, Popconfirm , Layout,message,Modal,Tooltip,Badge,Button  } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import EditUserArchives from './EditUserArchives'
import AddUserArchives from './AddUserArchives'
import ImportArchives from './ImportUserArchives'
import ExportArchives from './ExportUserArchives'
import Sider from './../Sider'
import {connect} from 'dva';
import config from '../../../common/config'
import { routerRedux } from 'dva/router';
import request from "./../../../utils/request";
import ResizeableTable from './../../../components/ResizeableTitle/RowSpanIndex'
import moment from 'moment'
import {renderIndex,renderRowSpan,parseRowSpanData,ellipsis2,download} from './../../../utils/utils'
import find from 'lodash/find'
import uuid from 'uuid/v4'
import './index.less'
import debounce from 'lodash/throttle'
const { Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  members: state.members,
  concentrators: state.concentrators,
  meters: state.meters,
  meter_models: state.meter_models,
  sider_regions: state.sider_regions,
  dma:state.dma
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.file=()=>{}
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon:true,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      showImportBtn: find(this.permissions, {name: 'meter_import'}),
      showExportBtn: find(this.permissions, {name: 'member_export'}),
      showConcentratorExportBtn:find(this.permissions, {name: 'concentrator_export'}),
      showConfigBtn: find(this.permissions, {name: 'config_edit'}),
      tableY:0,
      query: '',
      page: 1,
      initPage: 1,
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at:'',
      ended_at:'',
      village_id: '',
      editModal:false,
      changeModal:false,
      importModal:false,
      exportModal:false,
      area: '',
      distribution_area:'',
      statistical_forms:'',
      meter_number:'',
      concentrator_number:'',
      member_number:'',
      canOperate:localStorage.getItem('canOperateUserArchives')==='true'?true:false,
      canImport:true,
      per_page:30,
      canLoadByScroll: true,
      changeRecord:[]
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch}=this.props
    dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'concentrators/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        return: 'all'
      }
    });
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='hy'){
      dispatch({
        type: 'dma/fetchAll',
        payload: {
          return: 'all'
        },
      });
    }

  }
  componentWillUnmount(){
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch}=this.props
    dispatch({
      type: 'concentrators/reset',
    });
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {members: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            meter_number:this.state.meter_number,
            member_number:this.state.member_number,
            install_address: this.state.install_address,
            real_name: this.state.real_name,
            distribution_area:this.state.distribution_area,
            statistical_forms:this.state.statistical_forms,
            per_page:this.state.per_page,

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
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    }, function () {
      if (sessionStorage.getItem('locale') === 'en') {
        this.setState({
          tableY: this.state.tableY - 20
        })
      }
    })
  }
  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number:'',
      village_id: village_id
    },function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        distribution_area:this.state.distribution_area,
        statistical_forms:this.state.statistical_forms,
        meter_number:this.state.meter_number,
        member_number:this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
        per_page:this.state.per_page,
      })
    })
    const {dispatch}=this.props
    // dispatch({
    //   type: 'concentrators/fetch',
    //   payload: {
    //     village_id: village_id
    //   }
    // });

  }
  changeConcentrator = (concentrator_number,parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:parent_village_id,
      concentrator_number:concentrator_number,
    },function () {
      this.handleSearch({
        page: 1,
        distribution_area:this.state.distribution_area,
        statistical_forms:this.state.statistical_forms,
        meter_number:this.state.meter_number,
        member_number:this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
        per_page:this.state.per_page,
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      query: '',
      meter_number:'',
      member_number:'',
      install_address: '',
      real_name: '',
      distribution_area:'',
      statistical_forms:'',
      per_page:30,
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'members/fetchAndPush':'members/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
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
      distribution_area:this.state.distribution_area,
      statistical_forms:this.state.statistical_forms,
      meter_number:this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      real_name: this.state.real_name,
      per_page:this.state.per_page
      // ended_at: this.state.ended_at,
      // started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      distribution_area:this.state.distribution_area,
      statistical_forms:this.state.statistical_forms,
      meter_number:this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      real_name: this.state.real_name,
      per_page:per_page
      // ended_at: this.state.ended_at,
      // started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    let meterskey=[]
    for(let i in formValues){
      let splitKey=i.split('-')
      let len=splitKey.length;
      if(len>=2){
        if(meterskey.indexOf(splitKey[1])<0){
          meterskey.push(splitKey[1])
        }
      }
    }
    const metersArr=[]
    for(let i=0;i<meterskey.length;i++){
      metersArr.push({
        concentrator_number:formValues[`concentrator_number-${meterskey[i]}`],
        channel:formValues[`channel-${meterskey[i]}`],
        meter_index:formValues[`meter_index-${meterskey[i]}`],
        manufacturer_prefix:formValues[`manufacturer_prefix-${meterskey[i]}`],
        meter_number:formValues[`meter_number-${meterskey[i]}`],
        meter_model_id:formValues[`meter_model_id-${meterskey[i]}`],
        initial_water:formValues[`initial_water-${meterskey[i]}`],
        sort_number:formValues[`sort_number-${meterskey[i]}`],
      })
    }
    console.log('metersArr',metersArr)
    this.props.dispatch({
      type: 'members/add',
      payload: {
        ...formValues,
        installed_at:formValues.installed_at?moment(formValues.installed_at).format('YYYY-MM-DD'):'',
        meters:metersArr
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.user'})}
          )
        )
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          distribution_area:that.state.distribution_area,
          statistical_forms:that.state.statistical_forms,
          meter_number:that.state.meter_number,
          per_page:that.state.per_page
          // concentrator_number:that.state.concentrator_number,
        })
      }
    });
  }
  handleEdit = () => {
    const that = this;
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'members/edit',
      payload: {
        ...formValues,
        id:this.state.editRecord.id
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.user'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          distribution_area:that.state.distribution_area,
          statistical_forms:that.state.statistical_forms,
          meter_number:that.state.meter_number,
          per_page:that.state.per_page
          // concentrator_number:that.state.concentrator_number,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'members/remove',
      payload: {
        id:id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.user'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          distribution_area:that.state.distribution_area,
          statistical_forms:that.state.statistical_forms,
          meter_number:that.state.meter_number,
          per_page:that.state.per_page
          // concentrator_number:that.state.concentrator_number,
        })
      }
    });
  }
  handleChangeTable=()=>{
    const formValues =this.ChangeTableformRef.props.form.getFieldsValue();
    console.log(formValues)
  }

  findChildFunc = (cb)=> {
    this.file=cb
  }
  handleImport=()=>{
    this.setState({
      canImport:false
    })
    let file=this.file();
    const formValues =this.importFormRef.props.form.getFieldsValue();
    const that=this;
    const {intl:{formatMessage}} = this.props;
    console.log('formValues',formValues)
    if(!formValues.file){
      message.error(formatMessage({id: 'intl.please_choose_Excel'}));
      this.setState({
        canImport:true
      })
      return false
    }

    var formData = new FormData();
    formData.append("file", formValues.file.file);
    formData.append("meter_model_id", formValues.meter_model_id);
    formData.append("meter_number_length", formValues.meter_number_length);
    formData.append("is_reset", formValues.is_reset.key);
    formData.append("concentrator_number", formValues.concentrator_number);
    formData.append("village_id", formValues.village_id[formValues.village_id.length - 1]);
    request(`/meter_import`, {
      method: 'POST',
      data: formData
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.import'}), type: formatMessage({id: 'intl.excel'})}
          )
        )
        that.setState({
          importModal:false
        })
        that.handleFormReset()
      }
      that.setState({
        canImport:true
      })
    })
  }
  handleExportConcentrator=()=>{
    const formValues =this.exportFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'members/exportConcentratorCSV',
      payload: {
        ...formValues,
        village_id: formValues.village_id?formValues.village_id[formValues.village_id.length - 1]:''
      },
      callback: function (download_key) {
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
  }
  exportCSV = ()=> {
    const that = this;
    this.props.dispatch({
      type: 'members/exportCSV',
      payload: {
      },
      callback: function (download_key) {
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {members: {data, meta, loading},concentrators,meters,sider_regions,meter_models,dma} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const resetMeterData=parseRowSpanData(data)
    const company_code = sessionStorage.getItem('company_code');
    const columns = [
      { title: formatMessage({id: 'intl.user_number'}), width: 100, dataIndex: 'number', key: 'number',  fixed: 'left',  render: (val, record, index) => {
        const children= (
          ellipsis2(val, 100)
        )
        return renderRowSpan(children,record)
      } },
      { title:formatMessage({id: 'intl.user_name'}) , dataIndex: 'real_name', key: 'real_name' ,width: 100,   render: (val, record, index) => {
        const children= (
          ellipsis2(val, 100)
        )
        return renderRowSpan(children,record)
      } },
      { title: formatMessage({id: 'intl.install_address'}), dataIndex: 'address', key: 'address' ,width: 110,   render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 110)
        )
        return renderRowSpan(children,record)
      }},
      { title: formatMessage({id: 'intl.concentrator_number'}), dataIndex: 'concentrator_number', key: 'concentrator_number' ,width: 100, },
      { title: formatMessage({id: 'intl.water_meter_number'}), width: 110, dataIndex: 'meter_number', key: 'meter_number',render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      { title: formatMessage({id: 'intl.water_meter_type'}), width: 80, dataIndex: 'meter_model_name', key: 'meter_model_name' ,render: (val, record, index) => {
        return ellipsis2(val, 80)
      }},
      { title: formatMessage({id: 'intl.temperature_type'}), width: 110, dataIndex: 'temperature_type_explain', key: 'temperature_type_explain',render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      { title: formatMessage({id: 'intl.bore'}), width: 80, dataIndex: 'bore', key: 'bore' ,render: (val, record, index) => {
        return ellipsis2(val, 80)
      }},
      { title: formatMessage({id: 'intl.water_meter_index'}), width: 80, dataIndex: 'meter_index', key: 'meter_index' ,render: (val, record, index) => {
        return ellipsis2(val, 80)
      }},
      {
        title: formatMessage({id: 'intl.status'}), dataIndex: 'status', key: 'status', width: 80,
        render: (val, record, index) => {
          if(val===undefined){
            return ''
          }
          return (
            <p>
              <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}
            </p>
          )
        }
      },
      {title: formatMessage({id: 'intl.enabled_date'}), width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.enabled_value'}), width: 120, dataIndex: 'enabled_value', key: 'enabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.disabled_date'}), width: 120, dataIndex: 'disabled_date', key: 'disabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.disabled_value'}), width: 120, dataIndex: 'disabled_value', key: 'disabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},

      // { title: '台区', dataIndex: 'distribution_area', key: 'distribution_area',width: 90},
      // { title: '表册', dataIndex: 'statistical_forms', key: 'statistical_forms',width: 90,},
      { title:formatMessage({id: 'intl.created_time'}) , dataIndex: 'created_at', key: 'created_at', width: 150, render: (val, record, index) => {
        const children= (
          ellipsis2(val, 150)
        )
        return renderRowSpan(children,record)
      }},
      { title: formatMessage({id: 'intl.id_card'}), dataIndex: 'id_card', key: 'id_card' ,width: 170,  render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 170)
        )
        return renderRowSpan(children,record)
      }},
      { title: formatMessage({id: 'intl.telephone'}), dataIndex: 'phone', key: 'phone' ,width: 130,render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 130)
        )
        return renderRowSpan(children,record)
      }},
      { title:formatMessage({id: 'intl.reader'}) , dataIndex: 'reader', key: 'reader',  render: (val, record, index) => {
        return renderRowSpan(val,record)
      }}

    ];
    if(company_code==='hy') {
      columns.splice(6, 1)
    }
    const operate={
      title: formatMessage({id: 'intl.operate'}),
      key: 'operation',
      fixed: 'right',
      width:  company_code==='hy'?150:90,
      render: (val, record, index) => {
        const children= (
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
                      }}>{ formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <span>
                  <Popconfirm placement="topRight"  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                              onConfirm={()=>this.handleRemove(record.id)}>
                <a href="javascript:;">{formatMessage({id: 'intl.delete'})}</a>
              </Popconfirm>
                </span>
            }
            {
              (company_code==='hy'&&record.meters.data.length>1) &&
              <span>
                   <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>{
                      this.setState(
                        {
                          changeRecord: record.meters.data.reduce((pre,item)=>{
                            pre.push({
                              ...record,
                              ...item,
                            })
                            return pre
                          },[]),
                          changeModal: true
                        },function () {
                          console.log('changeRecord',this.state.changeRecord)
                        }
                      )
                    }}>{formatMessage({id: 'intl.change_record'})}</a>
                </span>
            }
          </p>
        )
        return renderRowSpan(children,record)
      }
    }
    if(this.state.canOperate){
      columns.push(operate)
    }
    const {dispatch} =this.props;
    const changeRecordColumns=[
      { title: formatMessage({id: 'intl.user_number'}), width: 100, dataIndex: 'number', key: 'number',  fixed: 'left',  render: (val, record, index) => {
        return  ellipsis2(val, 100)
      } },
      { title:formatMessage({id: 'intl.user_name'}) , dataIndex: 'real_name', key: 'real_name' ,width: 100,   render: (val, record, index) => {
        return  ellipsis2(val, 100)
      } },
      { title: formatMessage({id: 'intl.install_address'}), dataIndex: 'address', key: 'address' ,width: 110,   render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      { title: formatMessage({id: 'intl.concentrator_number'}), dataIndex: 'concentrator_number', key: 'concentrator_number' ,width: 100, },
      { title: formatMessage({id: 'intl.water_meter_number'}), width: 110, dataIndex: 'meter_number', key: 'meter_number',render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      { title: formatMessage({id: 'intl.water_meter_index'}), width: 80, dataIndex: 'meter_index', key: 'meter_index' ,render: (val, record, index) => {
        return ellipsis2(val, 80)
      }},
      {
        title: formatMessage({id: 'intl.status'}), dataIndex: 'status', key: 'status', width: 80,
        render: (val, record, index) => {
          if(val===undefined){
            return ''
          }
          return (
            <p>
              <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}
            </p>
          )
        }
      },
      {title: formatMessage({id: 'intl.enabled_date'}), width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.enabled_value'}), width: 120, dataIndex: 'enabled_value', key: 'enabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.disabled_date'}), width: 120, dataIndex: 'disabled_date', key: 'disabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.disabled_value'}), dataIndex: 'disabled_value', key: 'disabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},


    ]
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={[{name: formatMessage({id: 'intl.system'})}, {name:formatMessage({id: 'intl.user_profile'})}]}>
              <Card bordered={false} style={{margin:'-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            village_id={this.state.village_id}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showImportBtn={this.state.showImportBtn}
                            per_page={this.state.per_page}
                            exportCSV={this.exportCSV}
                            exportConcentratorCSV={()=>{
                              this.setState({
                                exportModal:true
                              })
                            }}
                            setExport={()=>{
                              dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/export_setup?type=2`));
                            }}
                            showConfigBtn={this.state.showConfigBtn}
                            showExportBtn={this.state.showExportBtn}
                            showConcentratorExportBtn={this.state.showConcentratorExportBtn}
                            showAddBtn={this.state.showAddBtn&&this.state.showAddBtnByCon} clickAdd={()=>this.setState({addModal:true})}
                            clickImport={()=>{this.setState({importModal:true})}}
                            changeShowOperate={()=>{this.setState({canOperate:!this.state.canOperate})}}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={resetMeterData} columns={columns} rowKey={record => record.myId}
                                 scroll={{x: 2650, y: this.state.tableY}}
                                 history={this.props.history}
                                 canOperate={this.state.canOperate}
                                 operate={operate}
                                 className={'meter-table no-interval'}
                                 />
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
              </Card>
          </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          width="80%"
          title={formatMessage({id: 'intl.add'})}
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal:false})}
        >
          <AddUserArchives  dma={dma} sider_regions={sider_regions}  wrappedComponentRef={(inst) => this.formRef = inst}  meter_models={meter_models.data}  concentrators={concentrators.data} meters={meters.data}   />
        </Modal>
        <Modal
          width="650px"
          destroyOnClose={true}
          title={formatMessage({id: 'intl.edit'})}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
          <EditUserArchives sider_regions={sider_regions}  wrappedComponentRef={(inst) => this.editFormRef = inst} concentrators={concentrators.data} meters={meters.data}    editRecord={this.state.editRecord} />
        </Modal>
        <Modal
          title={formatMessage({id: 'intl.batch_Import'})}
          visible={this.state.importModal}
          onCancel={() => this.setState({importModal:false,canImport:true})}
          //onOk={this.handleImport}
          footer={[
            <Button key="back" onClick={() => this.setState({importModal:false})}>{formatMessage({id: 'intl.cancel'})}</Button>,
            <Button key="submit" type="primary" disabled={!this.state.canImport} onClick={this.handleImport}>
              {formatMessage({id: 'intl.submit'})}
            </Button>,
          ]}
        >
          <ImportArchives dma={dma} sider_regions={sider_regions}  findChildFunc={this.findChildFunc} wrappedComponentRef={(inst) => this.importFormRef = inst} meter_models={meter_models.data} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
        </Modal>
        <Modal
          title={formatMessage({id: 'intl.export_single_concentrator_info'})}
          visible={this.state.exportModal}
          onCancel={() => this.setState({exportModal:false})}
          //onOk={this.handleImport}
          footer={[
            <Button key="back" onClick={() => this.setState({exportModal:false})}>{formatMessage({id: 'intl.cancel'})}</Button>,
            <Button key="submit" type="primary"  onClick={this.handleExportConcentrator}>
              {formatMessage({id: 'intl.submit'})}
            </Button>,
          ]}
        >
          <ExportArchives dma={dma} sider_regions={sider_regions}   wrappedComponentRef={(inst) => this.exportFormRef = inst} meter_models={meter_models.data} concentrators={concentrators.data}   />
        </Modal>
        <Modal
          title={formatMessage({id: 'intl.change_record'})}
          visible={this.state.changeModal}
          onCancel={() => this.setState({changeModal:false})}
          //onOk={this.handleImport}
          width={900}
          footer={null}
        >
          <Table dataSource={this.state.changeRecord} size="small" rowKey={record => record.meter_number} pagination={false} columns={changeRecordColumns} scroll={{x: 1500, y: this.state.tableY}}/>
        </Modal>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
