import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Badge, Tooltip, Divider} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import Detail from './Detail'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import debounce from 'lodash/throttle'
import './index.less'
import config from '../../../common/config'
import {routerRedux} from 'dva/router';
import uuid from 'uuid/v4'
import {
  getPreDay,
  ellipsis2,
  download,
  renderIndex,
  renderErrorData,
  dateIsToday
} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import ExportForm from './ExportForm'
import AnalysisDetail from './../BigMeterAnalysis/AnalysisDetail'
import LilingForm from './LilingForm'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  member_meter_data: state.member_meter_data,
  global: state.global,
}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.company_code = sessionStorage.getItem('company_code');
    this.state = {
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      showExportBtn: find(this.permissions, {name: 'meter_data_export'}),
      showAddBtnByCon: false,
      showConfigBtn: find(this.permissions, {name: 'config_edit'}),
      tableY: 0,
      meter_number: '',
      concentrator_number: '',
      member_number: '',
      real_name: '',
      install_address: '',
      page: 1,
      initPage: 1,
      initRange: getPreDay(),
      showArea: true,
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      exportModal: false,
      uploadLlModal: false,
      showMonitor: false,
      edit_member_number: '',
      display_type: 'all',
      total_difference_value: '0',
      per_page: 30,
      canLoadByScroll: true,
      sort_field: this.company_code === 'hy' ? 'sort_number' : 'concentrator_number',
      sort_direction: 'asc',
      time: new Date().getTime(),
    }
  }

  componentDidMount() {
    this.changeTableY();
    const that = this
    // document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='hy'){
      this.timer = setInterval(function () {
        that.setState({
          // disabled:false
          time: new Date().getTime()
        })
      }, 3000)
    }

  }

  componentWillUnmount() {
    if (document.querySelector('.ant-table-body')) {
      // document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
    }
    if(this.timer){
      clearInterval(this.timer)
    }
  }

  handleBack = ()=> {
    this.setState({
      showArea: true,
    }, function () {
      // document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    })
  }
  changeTableY = ()=> {
    console.log('changeTableY')
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

  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {member_meter_data: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            real_name: this.state.real_name,
            install_address: this.state.install_address,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            per_page: this.state.per_page,
            display_type: this.state.display_type,
            sort_field: this.state.sort_field,
            sort_direction: this.state.sort_direction
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
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number: '',
      village_id: village_id,
      showMonitor: false
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        display_type: this.state.display_type,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        real_name: this.state.real_name,
        install_address: this.state.install_address,


        per_page: this.state.per_page,
        sort_field: this.state.sort_field,
        sort_direction: this.state.sort_direction
      }, this.changeTableY)
    })

  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number,
      showMonitor: false
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        real_name: this.state.real_name,
        install_address: this.state.install_address,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        per_page: this.state.per_page,
        display_type: this.state.display_type,
        sort_field: this.state.sort_field,
        sort_direction: this.state.sort_direction
      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number: '',
      real_name: '',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      display_type: 'all',
      per_page: 30,
      sort_field: this.state.sort_field,
      sort_direction: this.state.sort_direction
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'member_meter_data/fetchAndPush' : 'member_meter_data/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
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
      install_address: this.state.install_address,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type: this.state.display_type,
      per_page: this.state.per_page,
      sort_field: this.state.sort_field,
      sort_direction: this.state.sort_direction
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      install_address: this.state.install_address,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type: this.state.display_type,
      per_page: per_page,
      sort_field: this.state.sort_field,
      sort_direction: this.state.sort_direction
      // area: this.state.area
    })
  }
  handleEdit = () => {
    this.setState({
      editModal: false,
    });
  }
  operate = (record)=> {
    this.setState({
      edit_meter_number: record.meter_number,
      showArea: false
      // editModal: true
    })
  }
  exportCSV = ()=> {
    const that = this;
    const company_code = sessionStorage.getItem('company_code');
    const formValues = this.ExportformRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const payload = (company_code === 'dy' || company_code === 'mys'||company_code === 'ms') ? {
      village_id: formValues.village_id === 'all' ? '' : formValues.village_id,
      started_at: moment(formValues.date).format('YYYY-MM-DD'),
      ended_at: moment(formValues.date).format('YYYY-MM-DD'),
      concentrator_number: formValues.concentrator_number,
    } : {
      village_id: formValues.village_id === 'all' ? '' : formValues.village_id,
      started_at: moment(formValues.started_at).format('YYYY-MM-DD'),
      ended_at: moment(formValues.ended_at).format('YYYY-MM-DD'),
      concentrator_number: formValues.concentrator_number,
      export_type: formValues.export_type
    }
    if(company_code === 'ms'){
      payload.export_type='all'
    }
    this.props.dispatch({
      type: 'member_meter_data/exportCSV',
      payload: payload,
      callback: function (download_key) {
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
  }

  findChildFunc = (cb)=> {
    this.cards = cb
  }
  uploadLl = ()=> {
    const that = this;
    const formValues = this.uploadLlformRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'member_meter_data/uploadLl',
      payload: {
        date: moment(formValues.date).format('YYYY-MM-DD'),
      },
      callback: function () {
        message.success('上传读数成功');
        that.setState({
          uploadLlModal: false
        })
      }
    });
  }
  handleTableSort = (pagination, filters, sorter) => {
    console.log('sorter', sorter);
    let order = '';
    let columnkey = sorter.columnKey;
    if (sorter.order === 'descend') {
      order = 'desc'
    } else if (sorter.order === 'ascend') {
      order = 'asc'
    }

    if (sorter.columnKey === 'install_address') {
      columnkey = 'address'
    }
    this.handleSearch({
      page: 1,
      install_address: this.state.install_address,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type: this.state.display_type,
      per_page: this.state.per_page,
      sort_field: columnkey,
      sort_direction: order,
      // area: this.state.area
    })
  }
  changeMonitor = (site_id, site_name)=> {
    console.log(site_id)
    this.setState({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number: '',
      real_name: '',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      display_type: 'all',
      per_page: 30,
      sort_field: 'sort_number',
      sort_direction: 'asc',
      showMonitor: true,
      site_name: site_name,
      site_id: site_id
    })
  }
  read_single_901f = (command, meter_number)=> {
    const company_code = sessionStorage.getItem('company_code');
    console.log('点抄：', meter_number)
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        meter_number,
        feature: 'upload_single',
        protocol: command
      },
      callback: ()=> {
        sessionStorage.setItem(`meter_number-${command}-${meter_number}`, new Date().getTime())
        that.setState({
          // disabled:false
          time: new Date().getTime()
        });
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

  render() {
    const {intl:{formatMessage}} = this.props;
    const {member_meter_data: {data, meta, loading}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const that = this
    const company_code = sessionStorage.getItem('company_code');
    const renderComandRecord = (record)=> {
      if (!record.protocols) return '';
      const renderCommandBtn = record.protocols.map((item, index)=> {
        const clickTime = sessionStorage.getItem(`meter_number-${item}-${record.meter_number}`)
        const isLoading = clickTime && this.state.time - clickTime < 10000
        return (
          <Button loading={isLoading} key={index} type="primary" size="small"
                  onClick={()=> {
                    that.read_single_901f(item, record.meter_number)
                  }}>{item.toUpperCase()}&nbsp;{formatMessage({id: 'intl.upload_single'})}</Button>
        )
      })
      return renderCommandBtn
    }
    let columns = [
      {
        title: formatMessage({id: 'intl.water_meter_number'}),
        dataIndex: 'meter_number',
        key: 'meter_number',
        fixed: 'left',
        width: 100,
        sorter: true,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.user_number'}),
        width: 100,
        dataIndex: 'member_number',
        key: 'member_number',
        sorter: true,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },

      {
        title: formatMessage({id: 'intl.user_name'}),
        width: 100,
        dataIndex: 'real_name',
        key: 'real_name',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.install_address'}),
        dataIndex: 'install_address',
        key: 'install_address',
        sorter: true,
        width: 130,
        render: (val, record, index) => {
          return ellipsis2(val, 130)
        }
      },
      {
        title: formatMessage({id: 'intl.water_meter_type'}),
        width: 105,
        dataIndex: 'meter_model_name',
        key: 'meter_model_name',
        render: (val, record, index) => {
          return ellipsis2(val, 105)
        }
      },
      {
        title: formatMessage({id: 'intl.Temperature_medium_type'}),
        width: 100,
        dataIndex: 'temperature_type_explain',
        key: 'temperature_type_explain',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.water_consumption'}),
        dataIndex: 'difference_value',
        key: 'difference_value',
        sorter: true,
        width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.latest_reading'}),
        dataIndex: 'latest_value',
        key: 'latest_value',
        width: 100,
        render: (val, record, index) => {
          return ellipsis2(renderErrorData(val), 100)
        }
      },
      {
        title: formatMessage({id: 'intl.latest_reading_time'}),
        dataIndex: 'latest_collected_at',
        key: 'latest_collected_at',
        width: 150,
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }
      },
      {
        title: formatMessage({id: 'intl.previous_reading'}),
        dataIndex: 'previous_value',
        key: 'previous_value',
        width: 100,
        render: (val, record, index) => {
          return ellipsis2(renderErrorData(val), 100)
        }
      },
      {
        title: formatMessage({id: 'intl.previous_reading_time'}),
        dataIndex: 'previous_collected_at',
        key: 'previous_collected_at',
        width: 150,
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }
      },
      {
        title: formatMessage({id: 'intl.status'}), dataIndex: 'status', key: 'status', width: 90,
        render: (val, record, index) => {
          let isToday=dateIsToday(this.state.ended_at);
          let status = 'success';
          let  status_explain=record.status_explain
          switch (val) {
            case -4:
              status = 'error'
              break;
            case -2:
              status = 'error';
              break;
            case -1:
              status = 'warning';
              status_explain= isToday?formatMessage({id: 'intl.meter_no_upload_count_today'}):formatMessage({id: 'intl.meter_no_upload_count'})
              break;
            default:
              status = 'success'
          }
          return (
            <p>
              <Badge status={status}/>{status_explain}
            </p>
          )
        }
      },
      {
        title: formatMessage({id: 'intl.concentrator_number'}),
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 110,
        sorter: true,
        render: (val, record, index) => {
          return ellipsis2(val, 110)
        }
      },
      {
        title: formatMessage({id: 'intl.vendor_manage'}),
        dataIndex: 'meter_manufacturer_name',
        key: 'meter_manufacturer_name',
        width: 90,
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }
      },
    ];
    if (company_code === 'hy') {
      columns.splice(5, 1)
      columns = [...columns, {
        title: formatMessage({id: 'intl.reader'}),
        dataIndex: 'reader',
        key: 'reader',
        width: 90,
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }
      }, {title: formatMessage({id: 'intl.sort_number'}), dataIndex: 'sort_number', key: 'sort_number', sorter: true,},
        {
          title: formatMessage({id: 'intl.operate'}),
          key: 'operation',
          fixed: 'right',
          width: 230,
          render: (val, record, index) => {
            return (
              <div>
                <Button type="primary" size='small'
                        onClick={()=>this.operate(record)}>{ formatMessage({id: 'intl.details'})}</Button>
                {this.state.showCommandBtn && company_code === 'hy' && renderComandRecord(record)}
              </div>
            )
          }
        }]
    } else {
      columns = [...columns, {title: formatMessage({id: 'intl.reader'}), dataIndex: 'reader', key: 'reader',},
        {
          title: formatMessage({id: 'intl.operate'}),
          key: 'operation',
          fixed: 'right',
          width: 80,
          render: (val, record, index) => {
            return (
              <div>
                <Button type="primary" size='small'
                        onClick={()=>this.operate(record)}>{ formatMessage({id: 'intl.details'})}</Button>
              </div>
            )
          }
        }]
    }
    if (company_code === 'hngydx') {
      //用户名、地址、水量、时间数据
      columns=[
        {
          title: formatMessage({id: 'intl.user_name'}),
          width: 100,
          dataIndex: 'real_name',
          key: 'real_name',
          render: (val, record, index) => {
            return ellipsis2(val, 100)
          }
        },
        {
          title: formatMessage({id: 'intl.install_address'}),
          dataIndex: 'install_address',
          key: 'install_address',
          sorter: true,
          width: 200,
          render: (val, record, index) => {
            return ellipsis2(val, 200)
          }
        },
        {
          title: formatMessage({id: 'intl.water_consumption'}),
          dataIndex: 'difference_value',
          key: 'difference_value',
          sorter: true,
          width: 100,
          render: (val, record, index) => {
            return ellipsis2(val, 100)
          }
        },
        {
          title: formatMessage({id: 'intl.latest_reading'}),
          dataIndex: 'latest_value',
          key: 'latest_value',
          width: 100,
          render: (val, record, index) => {
            return ellipsis2(renderErrorData(val), 100)
          }
        },
        {
          title: formatMessage({id: 'intl.latest_reading_time'}),
          dataIndex: 'latest_collected_at',
          key: 'latest_collected_at',
          width: 150,
          render: (val, record, index) => {
            return ellipsis2(val, 150)
          }
        },
        {
          title: formatMessage({id: 'intl.previous_reading'}),
          dataIndex: 'previous_value',
          key: 'previous_value',
          width: 100,
          render: (val, record, index) => {
            return ellipsis2(renderErrorData(val), 100)
          }
        },
        {
          title: formatMessage({id: 'intl.previous_reading_time'}),
          dataIndex: 'previous_collected_at',
          key: 'previous_collected_at',
          width: 150,
          render: (val, record, index) => {
            return ellipsis2(val, 150)
          }
        },
        {
          title: formatMessage({id: 'intl.status'}), dataIndex: 'status', key: 'status',
          render: (val, record, index) => {
            let status = 'success';
            switch (val) {
              case -4:
                status = 'error'
                break;
              case -2:
                status = 'error'
                break;
              case -1:
                status = 'warning'
                break;
              default:
                status = 'success'
            }
            return (
              <p>
                <Badge status={status}/>{record.status_explain}
              </p>
            )
          }
        },
        {
          title: formatMessage({id: 'intl.operate'}),
          key: 'operation',
          fixed: 'right',
          width: 90,
          render: (val, record, index) => {
            return (
              <div>
                <Button type="primary" size='small'
                        onClick={()=>this.operate(record)}>{ formatMessage({id: 'intl.details'})}</Button>
              </div>
            )
          }
        }
      ]

    }
    const {dispatch} =this.props;
    const {isMobile} =this.props.global;
    const breadcrumb = [{name: formatMessage({id: 'intl.data_analysis'})},
      {name: formatMessage({id: 'intl.meter_volume_data'})}]
    if (!this.state.showArea) {
      breadcrumb.push({
        name: `水表 ${this.state.edit_meter_number} 详情`
      })
    }
    return (
      <Layout className="layout">
        <Sider siderCb={this.changeTableY} showMonitor={true} changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               changeMonitor={this.changeMonitor}
               showArea={this.state.showArea}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析"
                              breadcrumb={breadcrumb}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                {
                  this.state.showArea
                    ?
                    !this.state.showMonitor?
                    <div>
                      <div className='tableList'>
                        <div className='tableListForm'>
                          <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                  initRange={this.state.initRange}
                                  village_id={this.state.village_id}
                                  isMobile={isMobile}
                                  sort_field={this.state.sort_field}
                                  sort_direction={this.state.sort_direction}
                                  meter_number={this.state.meter_number}
                                  member_number={this.state.member_number}
                                  display_type={this.state.display_type}
                                  started_at={this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD')}
                                  ended_at={this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD')}
                                  exportCSV={()=> {
                                    this.setState({
                                      exportModal: true
                                    })
                                    //company_code !== 'mys' ?
                                    //  this.setState({
                                    //    exportModal: true
                                    //  }) :
                                    //  this.props.dispatch({
                                    //    type: 'member_meter_data/exportCSV',
                                    //    payload: {
                                    //      started_at: moment().format('YYYY-MM-DD'),
                                    //      ended_at: moment().format('YYYY-MM-DD'),
                                    //    },
                                    //    callback: function (download_key) {
                                    //      download(`${config.prefix}/download?download_key=${download_key}`)
                                    //    }
                                    //  });
                                  }}
                                  per_page={this.state.per_page}
                                  uploadLl={()=> {
                                    this.setState({
                                      uploadLlModal: true
                                    })
                                  }}
                                  setExport={()=> {
                                    dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/export_setup`));
                                  }}
                                  handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                  showConfigBtn={this.state.showConfigBtn}
                                  showExportBtn={this.state.showExportBtn}
                                  clickAdd={()=>this.setState({addModal: true})}
                                  total_difference_value={meta.aggregator.total_difference_value }/>
                        </div>
                      </div>
                      <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                       dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                       scroll={{x: company_code === 'hngydx'?1100:2200, y: this.state.tableY}}
                                       history={this.props.history}
                                       className={'meter-table'}
                                       rowClassName={function (record, index) {
                                         if (record.status === -2 || record.status === -3) {
                                           return 'error'
                                         }
                                       }}

                                       onChange={this.handleTableSort}
                      />
                      <Pagination meta={meta} initPage={this.state.initPage}
                                  handPageSizeChange={this.handPageSizeChange}
                                  handPageChange={this.handPageChange}/>

                    </div>:
                    <div>
                      <h2>{this.state.site_name}</h2>
                      <Divider dashed style={{margin: '10px 0'}}/>
                      <AnalysisDetail site_id={this.state.site_id}/>
                    </div>:
                    <div>
                      <Detail tableY={this.state.tableY} onBack={this.handleBack} showExtra={true}
                              meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                              started_at={this.state.started_at}/>
                    </div>}
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          width="950px"
          destroyOnClose={true}
          title={`${ formatMessage({id: 'intl.water_meter_number'})} ${this.state.edit_meter_number} ${ formatMessage({id: 'intl.details'})}${ formatMessage({id: 'intl.detail_info'})}`}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <Detail showExtra={true} meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                  started_at={this.state.started_at}/>
        </Modal>
        <Modal
          title={formatMessage({id: 'intl.export'})}
          visible={this.state.exportModal}
          onOk={this.exportCSV}
          onCancel={() => this.setState({exportModal: false})}
        >
          <ExportForm wrappedComponentRef={(inst) => this.ExportformRef = inst}/>
        </Modal>
        <Modal
          title={`上传读数`}
          visible={this.state.uploadLlModal}
          onOk={this.uploadLl}
          onCancel={() => this.setState({uploadLlModal: false})}
        >
          <LilingForm wrappedComponentRef={(inst) => this.uploadLlformRef = inst}/>
        </Modal>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
