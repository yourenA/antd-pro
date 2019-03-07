import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Badge, Tooltip, Tabs, Button} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOrEditConcentrator from './AddOrEditConcentrator'
import AddConcentrator from './AddConcentrator'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import Sider from './../Sider'
import {connect} from 'dva';
import Detail from './Detail'
import find from 'lodash/find'
import debounce from 'lodash/throttle'
import {injectIntl} from 'react-intl';
// import moment from 'moment'
import {renderIndex, ellipsis, ellipsis2, fillZero} from './../../../utils/utils'
import './index.less'
import ConcentratorDetail from './ConcentratorDetail'
import uuid from 'uuid/v4'
import map from './../../../images/map.png'
import ShowMap from './ShowMap'
const {Content} = Layout;
@connect(state => ({
  concentrator_models: state.concentrator_models,
  concentrators: state.concentrators,
  servers: state.servers,
  area: state.area
}))
@injectIntl
class ConcentratorManage extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.BMap = window.BMap;
    this.state = {
      showAddBtn: find(this.permissions, {name: 'concentrator_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'concentrator_delete'}),
      commandBtn: find(this.permissions, {name: 'user_send_command'}),
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
      canOperateConcentrator: localStorage.getItem('canOperateConcentrator') === 'true' ? true : false,
      canAdd: true,
      per_page: 30,
      canLoadByScroll: true,
      size_type:''
    }

  }

  componentDidMount() {
    // this.setState({
    //   tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    // })
    document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const {dispatch}=this.props
    dispatch({
      type: 'concentrator_models/fetch',
      payload: {
        return: 'all'
      },
    });
    dispatch({
      type: 'servers/fetch',
      payload: {
        display_type: 'only_enabled',
        return: 'all'
      }
    });
    dispatch({
      type: 'area/fetch',
      payload: {
        return: 'all'
      }
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    }, function () {
      if (localStorage.getItem('locale') === 'en') {
        this.setState({
          tableY: this.state.tableY - 20
        })
      }
    })
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {concentrators: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page: this.state.per_page,
            size_type:this.state.size_type
          }, function () {
            that.setState({
              canLoadByScroll: true,
            })
          }, true)
        }
      }
    }
  }
  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      showAddBtnByCon: false,
      query: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        per_page: this.state.per_page,
        size_type:this.state.size_type
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      query: concentrator_number,
      village_id: parent_village_id,
    }, function () {
      this.handleSearch({
        page: 1,
        per_page: this.state.per_page,
        size_type:this.state.size_type

      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page: 30,
      size_type:''

      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'concentrators/fetchAndPush' : 'concentrators/fetch',
      payload: {
        query: this.state.query ? this.state.query : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        ...values,
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
      size_type:this.state.size_type
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page: per_page,
      size_type:this.state.size_type

    })
  }
  operate = (record)=> {
    this.setState({
      orderModal: true,
      editRecord: record
    })

  }
  handleAdd = () => {
    this.setState({
      canAdd: false
    })
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    formValues.villages = [];
    for (let k in formValues) {
      if (k.indexOf('villages-') >= 0) {
        if (formValues.hasOwnProperty(k)) {
          if (formValues[k].village === undefined) {
            const {intl:{formatMessage}} = that.props;
            message.error(formatMessage({id: 'intl.village_name'})+formatMessage({id: 'intl.can_not_be_empty'}))
            this.setState({
              canAdd: true
            })
            return false
          } else {
            const village = formValues[k].village
            formValues.villages.push(village[village.length - 1])
          }
        }
      }
    }
    const company_code = sessionStorage.getItem('company_code');
    var center=company_code==='mys'?[114.288209,27.637665]:[113.131695, 27.827433]
    formValues.longitude=center[0];
    formValues.latitude=center[1];
    console.log('formValues', formValues);
    if (formValues.latitude_longitude) {
      let latitude_longitude = formValues.latitude_longitude
      formValues.longitude = latitude_longitude ? latitude_longitude.split('/')[0] :center[0]
      formValues.latitude = latitude_longitude ? latitude_longitude.split('/')[1] : center[1]
      that.addRequest(formValues)
    } else if (formValues.install_address) {
      let myGeo = new this.BMap.Geocoder();
      myGeo.getPoint(formValues.install_address, function (point) {
        if (point) {
          console.log(point)
          formValues.longitude = point.lng.toString();
          formValues.latitude = point.lat.toString();
          that.addRequest(formValues)
        } else {
          console.log("您选择地址没有解析到结果!");
          that.addRequest(formValues)

        }
      });
    } else {
      that.addRequest(formValues)
    }

  }
  addRequest = (formValues)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/add',
      payload: {
        ...formValues,
        // village_id: formValues.village_id[formValues.village_id.length - 1],
        village_ids: formValues.villages,
        server_id: formValues.server_id ? formValues.server_id.key : '',
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.concentrator'})}
          )
        )
        that.setState({
          addModal: false,
          refreshSider: that.state.refreshSider + 1
        });
        that.setState({
          canAdd: true
        })
        // that.handleSearch({
        //   page: that.state.page,
        //   query: that.state.query,
        //   per_page:that.state.per_page,
        // })
        // this.reload()
      },
      errorCallback: function () {
        that.setState({
          canAdd: true
        })
      }
    });
  }
  setReload = (reload)=> {
    this.reload = reload;
  }
  handleOrder=()=>{
    const that = this;
    const state = this.orderFormRef.state;
    if (state.tabsActiveKey === 'editUpload') {
      this.handleEditConfig()
    } else if (state.tabsActiveKey === 'editSleep') {
      this.handleEditSleep()
    } else if (state.tabsActiveKey === 'setGPRS') {
      this.handleSetGPRS()
    }
  }
  handleSetGPRS=()=>{
    const {dispatch} = this.props;
    const that = this;
    const formValues = this.orderFormRef.state;
    console.log('formValues',formValues)
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.state.editRecord.number,
        feature: 'set_gprs',
        server_id:formValues.server_id.key,
        apn:formValues.apn
      },
      callback:()=>{
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
      }
    });
  }
  handleEdit = () => {
    const that = this;
    const state = this.editFormRef.state;
    const company_code = sessionStorage.getItem('company_code');
    if (state.tabsActiveKey === 'edit') {
      const formValues = this.editFormRef.props.form.getFieldsValue();
      console.log('formValues', formValues)
      formValues.villages = [];
      for (let k in formValues) {
        if (k.indexOf('villages-') >= 0) {
          if (formValues.hasOwnProperty(k)) {
            if (formValues[k].village === undefined) {
              const {intl:{formatMessage}} = that.props;
              message.error(formatMessage({id: 'intl.village_name'}) + formatMessage({id: 'intl.can_not_be_empty'}))
              return false
            } else {
              const village = formValues[k].village
              formValues.villages.push(village[village.length - 1])
            }
          }
        }
      }
      var center=company_code==='mys'?[114.288209,27.637665]:[113.131695, 27.827433]
      formValues.longitude=center[0];
      formValues.latitude=center[1];
      if (formValues.latitude_longitude) {
        let latitude_longitude = formValues.latitude_longitude
        formValues.longitude = latitude_longitude ? latitude_longitude.split('/')[0] :center[0]
        formValues.latitude = latitude_longitude ? latitude_longitude.split('/')[1] :center[1]
        that.editRequest(formValues)
      } else if (formValues.install_address) {
        let myGeo = new this.BMap.Geocoder();
        myGeo.getPoint(formValues.install_address, function (point) {
          if (point) {
            console.log(point)
            formValues.longitude = point.lng.toString();
            formValues.latitude = point.lat.toString();
            that.editRequest(formValues)
          } else {
            console.log("您选择地址没有解析到结果!");
            that.editRequest(formValues)
          }
        });
      } else {
        this.editRequest(formValues)
      }

    } else if (state.tabsActiveKey === 'editUpload') {
      this.handleEditConfig()
    } else if (state.tabsActiveKey === 'editSleep') {
      this.handleEditSleep()
    }

  }
  editRequest = (formValues)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/edit',
      payload: {
        ...formValues,
        server_id: formValues.server_id ? formValues.server_id.key : '',
        concentrator_model_id: formValues.concentrator_model_id.key,
        // village_id: formValues.village_id[formValues.village_id.length - 1],
        village_ids: formValues.villages,
        is_count: formValues.is_count.key,
        id: this.state.editRecord.id
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.concentrator'})}
          )
        )
        that.setState({
          editModal: false,
          refreshSider: that.state.refreshSider + 1
        });
        // that.handleSearch({
        //   page: that.state.page,
        //   query: that.state.query,
        //   per_page:that.state.per_page,
        // })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.concentrator'})}
          )
        )
        that.setState({
          refreshSider: that.state.refreshSider + 1
        });
        // that.handleSearch({
        //   page: that.state.page,
        //   query: that.state.query,
        //   per_page:that.state.per_page,
        // })
      }
    });
  }
  showConcentrator = (record)=> {
    console.log(record.id);
    this.setState({
      concentratorId: record.id,
      concentratorNumber: record.number,
      protocols: record.protocols,
    }, function () {
      this.setState({
        showArea: false
      })
    })
  }
  handleBack = ()=> {
    this.setState({
      showArea: true,
      concentratorNumber: null,
    }, function () {
      document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    })
  }
  handleEditConfig = ()=> {
    const that = this;
    const formValues = this.orderFormRef.state;
    console.log('formValues', this.orderFormRef.state);
    let upload_time = '';
    switch (formValues.value) {
      case  'monthly':
        upload_time = `${fillZero(formValues.day)} ${fillZero(formValues.hour)}:${fillZero(formValues.minute)}:${fillZero(formValues.second)}`;
        break;
      case   'daily':
        upload_time = `${fillZero(formValues.hour)}:${fillZero(formValues.minute)}:${fillZero(formValues.second)}`;
        break;
      case  'hourly':
        upload_time = `${fillZero(formValues.minute)}:${fillZero(formValues.second)}`;
        break;
      case  'every_fifteen_minutes':
        upload_time = `00:00`;
        break;
    }
    console.log(this.state.editRecord.id)
    let putData = {
      upload_cycle_unit: formValues.value,
      id: this.state.editRecord.id,
      upload_time: upload_time
    }
    // if (formValues.day || formValues.hour || formValues.minute || formValues.second) {
    //   putData.upload_time = upload_time
    // }
    this.props.dispatch({
      type: 'concentrators/editConfig',
      payload: putData,
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.upload_time'})}
          )
        )
        that.setState({
          orderModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page: that.state.per_page,
        })
      }
    });
  }
  handleEditSleep = ()=> {
    const that = this;
    const formValues = this.orderFormRef.state;
    this.props.dispatch({
      type: 'concentrators/editConfig',
      payload: {
        id: this.state.editRecord.id,
        sleep_hours: formValues.checkedList
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.sleep_hours'})}
          )
        )
        that.setState({
          orderModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page: that.state.per_page,
        })
      }
    });

  }
  changeShowOperate = ()=> {
    this.setState({canOperateConcentrator: !this.state.canOperateConcentrator})
  }
  handleTableChange=(pagination, filters, sorter)=>{
    console.log('sorter', sorter)
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {concentrators: {data, meta, loading}, servers, concentrator_models, area} = this.props;
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
        title: formatMessage({id: 'intl.concentrator_number'}), width: 100, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (text, record, index) => {
          return (
            <p className="link" onClick={()=>this.showConcentrator(record)}>
              {text}
            </p>
          )
        }
      },
      {
        title: formatMessage({id: 'intl.concentrator_type'}),
        width: 100,
        dataIndex: 'concentrator_model_name',
        key: 'concentrator_model_name',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.concentrator_protocols'}), width: 100, dataIndex: 'protocols', key: 'protocols', render: (val, record, index) => {
        if (val) {
          return ellipsis2(val.join('|'), 90)
        } else {
          return ''
        }
      }
      },
      {
        title: formatMessage({id: 'intl.serial_number'}), dataIndex: 'serial_number', key: 'serial_number', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {title: formatMessage({id: 'intl.water_meter_count'}), dataIndex: 'meter_count', key: 'meter_count', width: 80},
      {
        title: formatMessage({id: 'intl.online_status'}), dataIndex: 'is_online', key: 'is_online', width: 80,
        render: (val, record, index) => {
          let status = "success";
          let status_text = formatMessage({id: 'intl.yes'});
          switch (val) {
            case  1:
              status = 'success';
              status_text = formatMessage({id: 'intl.yes'})
              break;
            case  -1:
              status = 'error';
              status_text = formatMessage({id: 'intl.no'});
              break;
            case  -2:
              status = 'warning';
              status_text =  formatMessage({id: 'intl.sleep'});
              break;
          }
          return (
            <p>
              <Badge status={status}/>{status_text}
            </p>
          )
        }
      },
      {
        title: formatMessage({id: 'intl.village_name'}), dataIndex: 'villages', key: 'villages', width: 120,
        render: (val, record, index) => {
          let transVal = val.map((item, index)=> {
            return <span key={index}>{ellipsis2(item.name, 110)}<br/></span>

          })
          return <span>{transVal}</span>
        }
      },
      {
        title: formatMessage({id: 'intl.install_address'}), dataIndex: 'install_address', key: 'install_address', width: 120,
        render: (val, record, index) => {
          return ellipsis2(val, 120)
        }
      },
      {
        title: formatMessage({id: 'intl.server_ip'}), dataIndex: 'server_ip', key: 'server_ip', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.server_port'}), dataIndex: 'server_port', key: 'server_port', width: 90,
        render: (val, record, index) => {
          return ellipsis2(val, 80)
        }
      },
      {
        title: formatMessage({id: 'intl.sim_number'}), dataIndex: 'sim_number', key: 'sim_number', width: 90,
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }
      },
      {
        title: formatMessage({id: 'intl.sim_operator'}), dataIndex: 'sim_operator', key: 'sim_operator', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {title: formatMessage({id: 'intl.last_logined_time'}), dataIndex: 'last_logined_at', key: 'last_logined_at', width: 150,},
      {title: formatMessage({id: 'intl.last_onlined_time'}), dataIndex: 'last_onlined_at', key: 'last_onlined_at', width: 150,},
      {
        title: formatMessage({id: 'intl.upload_cycle_unit_explain'}), dataIndex: 'upload_cycle_unit_explain', key: 'upload_cycle_unit_explain', width: 100,
      },
      {
        title: formatMessage({id: 'intl.upload_time'}), dataIndex: 'upload_time', key: 'upload_time', width: 100,
      },
      {
        title: formatMessage({id: 'intl.sleep_hours'}), dataIndex: 'sleep_hours', key: 'sleep_hours', width: 100,
        render: (val, record, index) => {
          let transVal = val;
          transVal.sort(function (a, b) {
            return a - b
          })
          return ellipsis2(transVal.join(','), 100)
        }
      },
      {
        title: formatMessage({id: 'intl.is_count'}), dataIndex: 'is_count', key: 'is_count', width: 120,
        render: (val, record, index) => {
          return (
            <p>
              <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? formatMessage({id: 'intl.yes'}) : formatMessage({id: 'intl.no'})}
            </p>
          )
        }
      },
      {
        title: formatMessage({id: 'intl.remark'}), dataIndex: 'remark', key: 'remark', render: (val, record, index) => {
        return ellipsis2(val)
      }
      },

    ];
    const company_code = sessionStorage.getItem('company_code');
    company_code==='mys'&&columns.splice(8,0 ,{
      title: '地图', dataIndex: 'map', key: 'map', width: 50,render: (val, record, index) => {
        return <div  onClick={()=> {
          this.setState(
            {
              editRecord: record,
              mapModal: true
            }
          )
        }}><img src={map} alt="" style={{width:'30px',cursor:'pointer'}} className="concentrator-map"/></div>
      }})

    const operate = {
      title: formatMessage({id: 'intl.operate'}),
      key: 'operation',
      fixed: 'right',
      className: 'operation',
      width: 125,
      render: (val, record, index) => {
        return (
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
              this.state.commandBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            orderModal: true
                          }
                        )
                      }}>{ formatMessage({id: 'intl.command'})}</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <span>
                  <Popconfirm placement="topRight" title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                              onConfirm={()=>this.handleRemove(record.id)}>
                  <a href="">{ formatMessage({id: 'intl.delete'})}</a>
                </Popconfirm>
                </span>
            }
          </p>
        )
      }
    }
    if (this.state.canOperateConcentrator) {
      columns.push(operate)
    }
    let breadcrumb = this.state.concentratorNumber ? [{name: formatMessage({id: 'intl.device'})}, {
      name: formatMessage({id: 'intl.concentrator_manage'}),
      click: this.handleBack
    }, {name: this.state.concentratorNumber}] : [{name: formatMessage({id: 'intl.device'})}, {name: formatMessage({id: 'intl.concentrator_manage'})}]
    return (
      <Layout className="layout">
        <Sider refreshSider={this.state.refreshSider} showSiderCon={this.state.showSiderCon}
               changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator} showArea={this.state.showArea}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={breadcrumb}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                {
                  this.state.showArea
                    ?
                    <div>
                      <div className='tableList'>
                        <div className='tableListForm'>
                          <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                  village_id={this.state.village_id}
                                  per_page={this.state.per_page}
                                  handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                  showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                  canOperateConcentrator={this.state.canOperateConcentrator}
                                  changeShowOperate={this.changeShowOperate}
                          />
                        </div>
                      </div>
                      <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                       dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                       scroll={{x: 2650, y: this.state.tableY}}
                                       history={this.props.history}
                                       canOperate={this.state.canOperateConcentrator}
                                       operate={operate}
                                       rowClassName={function (record, index) {
                                         if (record.is_online === -1 ) {
                                           return 'error'
                                         }
                                       }}
                                       showConcentrator={this.showConcentrator}/>
                      <Pagination meta={meta} initPage={this.state.initPage}
                                  handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
                    </div>
                    :
                    <ConcentratorDetail protocols={this.state.protocols} concentratorId={this.state.concentratorId}
                                        concentratorNumber={this.state.concentratorNumber}
                                        history={this.props.history}
                                        handleBack={this.handleBack}/>
                }
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          width={650}
          key={ Date.parse(new Date()) + 3}
          title={ formatMessage({id: 'intl.add'})+" "+ formatMessage({id: 'intl.concentrator'})}
          visible={this.state.addModal}
          //onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false, canAdd: true})}
          footer={[
            <Button key="back" onClick={() => this.setState({addModal: false})}> { formatMessage({id: 'intl.cancel'})}</Button>,
            <Button key="submit" type="primary" disabled={!this.state.canAdd} onClick={this.handleAdd}>
              { formatMessage({id: 'intl.submit'})}
            </Button>,
          ]}
        >
          <AddConcentrator wrappedComponentRef={(inst) => this.formRef = inst} area={area.data}
                           concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          width={650}
          key={ Date.parse(new Date())}
          title={ formatMessage({id: 'intl.edit'})+ " "+ formatMessage({id: 'intl.concentrator'})}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <AddOrEditConcentrator
            editRecord={this.state.editRecord}
            wrappedComponentRef={(inst) => this.editFormRef = inst} area={area.data}
            concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          width={'60%'}
          key={ Date.parse(new Date()) + 1}
          title={ formatMessage({id: 'intl.concentrator'})+" "+ (this.state.editRecord ? this.state.editRecord.number : '') +" "+ formatMessage({id: 'intl.command'})}
          visible={this.state.orderModal}
          onOk={this.handleOrder}
          onCancel={() => this.setState({orderModal: false})}
        >
          <Detail
            wrappedComponentRef={(inst) => this.orderFormRef = inst}
            editRecord={this.state.editRecord}  servers={servers.data} />
        </Modal>
        <Modal
          style={{ top: 20 }}
          width="90%"
          key={ Date.parse(new Date()) + 2}
          title={ formatMessage({id: 'intl.concentrator'})+" "+ (this.state.editRecord ? this.state.editRecord.number : '') +" "+ formatMessage({id: 'intl.map'})}
          visible={this.state.mapModal}
          onOk={() => this.setState({mapModal: false})}
          onCancel={() => this.setState({mapModal: false})}
          footer={null}
        >
          <ShowMap editRecord={this.state.editRecord} cantMovePoint={true} />
        </Modal>
      </Layout>
    );
  }
}

export default ConcentratorManage
