import React, {PureComponent} from 'react';
import {Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import config from '../../../common/config'
import uuid from 'uuid/v4'
import Export from './ExportForm'
import debounce from 'lodash/throttle'
import {download, renderErrorData, ellipsis2, renderNotification, dateIsToday} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import Detail from './../UserMeterAnalysis/Detail'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  manufacturers: state.manufacturers,
  meter_errors: state.meter_errors,
  global: state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      showExportBtn: find(this.permissions, {name: 'meter_error_export'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      manufacturer_id: '',
      page: 1,
      initPage: 1,
      initRange: [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      showArea: true,
      editModal: false,
      changeModal: false,
      concentrator_number: '',
      meter_number: '',
      member_number: '',
      display_type: 'all',
      ime: new Date().getTime(),
      canOperate: localStorage.getItem('canOperateMeterUnusualAnalysis') === 'true' ? true : false,
      per_page: 30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    // document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      },
    });

  }

  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))

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
        const {meter_errors: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            manufacturer_id: this.state.manufacturer_id,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            display_type: this.state.display_type,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            per_page: this.state.per_page
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
      showAddBtnByCon: false,
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        manufacturer_id: this.state.manufacturer_id,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        display_type: this.state.display_type,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        per_page: this.state.per_page
      })
    })

  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      concentrator_number: concentrator_number,
      village_id: parent_village_id,
      showAddBtnByCon: true,
    }, function () {
      this.handleSearch({
        page: 1,
        manufacturer_id: this.state.manufacturer_id,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        display_type: this.state.display_type,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        per_page: this.state.per_page
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
      per_page: 30
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'meter_errors/fetchAndPush' : 'meter_errors/fetch',
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
        if (cb) cb()
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
      per_page: this.state.per_page
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      manufacturer_id: this.state.manufacturer_id,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      display_type: this.state.display_type,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page: per_page
    })
  }
  read_single_901f = (command, meter_number,renderNotificationObj)=> {
    const company_code = sessionStorage.getItem('company_code');
    console.log('点抄：', meter_number)
    const {dispatch} = this.props;
    const that = this;
    this.timer = setInterval(function () {
      that.setState({
        // disabled:false
        time: new Date().getTime()
      })
    }, 4000)
    setTimeout(function () {
      if(that.timer){
        clearInterval(that.timer)
      }
    },14000)
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
        renderNotification(renderNotificationObj)
      }
    });
  }
  operate = (record)=> {
    this.setState({
      edit_meter_number: record.meter_number,
      showArea: false
    })
  }
  handleExport = ()=> {
    const formValues = this.exportFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'meter_errors/exportCSV',
      payload: {
        ...formValues,
        started_at: moment(formValues.started_at).format('YYYY-MM-DD'),
        ended_at: moment(formValues.ended_at).format('YYYY-MM-DD'),
        village_id: formValues.village_id ? formValues.village_id: '',
        size_type: formValues.size_type ? formValues.size_type.key : '',
        temperature_type: formValues.temperature_type ? formValues.temperature_type.key : '',
      },
      callback: function (download_key) {
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {meter_errors: {data, meta, loading}, manufacturers, dispatch} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      {
        title: formatMessage({id: 'intl.concentrator_number'}),
        width: 100,
        dataIndex: 'concentrator_number',
        key: 'concentrator_number'
        ,
        render: (val, record, index) => {
          return (
            <p className="link" onClick={()=> {
              dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/concentrator_unusual_analysis?concentrator=${val}&date=${record.date}`));
            }}>{val}</p>
          )
        }
      },
      {
        title: formatMessage({id: 'intl.water_meter_index'}),
        width: 80,
        dataIndex: 'meter_index',
        key: 'meter_index',
        render: (text, record, index) => {
          return ellipsis2(text, 80)
        }
      },
      {
        title: formatMessage({id: 'intl.water_meter_number'}),
        width: 130,
        dataIndex: 'meter_number',
        key: 'meter_number',
        render: (text, record, index) => {
          return ellipsis2(text, 130)
        }
      },
      {
        title: formatMessage({id: 'intl.install_address'}),
        width: 280,
        dataIndex: 'address',
        key: 'address',
        render: (text, record, index) => {
          return ellipsis2(text, 280)
        }
      },
      {
        title: formatMessage({id: 'intl.user_number'}),
        width: 100,
        dataIndex: 'member_number',
        key: 'member_number',
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },

      {
        title: formatMessage({id: 'intl.user_name'}),
        width: 100,
        dataIndex: 'real_name',
        key: 'real_name',
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },

      {
        title: formatMessage({id: 'intl.date'}),
        dataIndex: 'date',
        key: 'date',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.last_date'}),
        dataIndex: 'last_collected_at',
        key: 'last_collected_at',
        width: 160,
        render: (text, record, index) => {
          return ellipsis2(text, 160)
        }
      },
      {
        title: formatMessage({id: 'intl.status'}), width: 100, dataIndex: 'status', key: 'status'
        , render: (val, record, index) =>{
          let isToday=dateIsToday(record.date);
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
        title: formatMessage({id: 'intl.water_consumption'}), width: 100, dataIndex: 'consumption', key: 'consumption',
        render: (val, record, index) => {
          return renderErrorData(val)
        }
      },
      {
        title: formatMessage({id: 'intl.concentrator_protocols'}),
        dataIndex: 'protocols',
        key: 'protocols',
        width: 120,
        render: (val, record, index) => {
          if (val) {
            return ellipsis2(val.join('|'), 120)
          } else {
            return ''
          }
        }
      },
      {title: formatMessage({id: 'intl.vendor_name'}), dataIndex: 'manufacturer_name', key: 'manufacturer_name'},

    ];
    if(company_code==='mys'||company_code==='hngydx'){
      columns.splice(7,0,   {
        title: formatMessage({id: 'intl.Temperature_medium_type'}),
        width: 120,
        dataIndex: 'temperature_type_explain',
        key: 'temperature_type_explain',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },{
        title: '尺寸类型',
        width: 100,
        dataIndex: 'size_type_explain',
        key: 'size_type_explain',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      })
    }
    const that = this;
    const renderComandRecord = (record)=> {
      const command = record.protocols;
      if (!command) return '';
      const renderCommandBtn = command.map((item, index)=> {
        const clickTime = sessionStorage.getItem(`meter_number-${item}-${record.meter_number}`)
        const isLoading = clickTime && this.state.time - clickTime < 10000
        return (
          <Button loading={isLoading} key={index} type="primary" size="small" style={{marginLeft: 3, marginBottom: 3}}
                  onClick={()=> {
                    let renderNotificationObj={key:item.toUpperCase()+record.meter_number,
                      message:item.toUpperCase()+formatMessage({id: 'intl.upload_single'})+record.meter_number+' 进度'};
                    that.read_single_901f(item, record.meter_number,renderNotificationObj)
                  }}>{item.toUpperCase()}{formatMessage({id: 'intl.upload_single'})}</Button>
        )
      })
      return renderCommandBtn
    }
    const operate = {
      title: formatMessage({id: 'intl.operate'}),
      key: 'operation',
      width: 260,
      fixed: 'right',
      render: (val, record, index) => {
        return (
          <div>
            <Button type="primary" size='small'
                    onClick={()=>this.operate(record)}>{formatMessage({id: 'intl.details'})}</Button>
            {this.state.showCommandBtn && renderComandRecord(record)}
          </div>
        )
      }
    }
    if (this.state.canOperate) {
      columns.push(operate)
    }
    const {isMobile} =this.props.global;
    const breadcrumb = [{name: formatMessage({id: 'intl.abnormal_analysis'})},
      {name: formatMessage({id: 'intl.water_meter_abnormal_analysis'})}]
    if (!this.state.showArea) {
      breadcrumb.push({
        name: `水表 ${this.state.edit_meter_number} 详情`
      })
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={breadcrumb}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                {
                  this.state.showArea
                    ?
                    <div className='tableList'>
                      <div className='tableListForm'>
                        <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                initRange={this.state.initRange}
                                isMobile={isMobile}
                                manufacturers={manufacturers.data}
                                village_id={this.state.village_id}
                                per_page={this.state.per_page}
                                showExportBtn={this.state.showExportBtn}
                                exportConcentratorCSV={()=> {
                                  this.setState({
                                    exportModal: true
                                  })
                                }}
                                manufacturer_id={this.state.manufacturer_id}
                                meter_number={this.state.meter_number}
                                member_number={this.state.member_number}
                                display_type={this.state.display_type}
                                started_at={this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD')}
                                ended_at={this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD')}
                                handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                                clickAdd={()=>this.setState({addModal: true})}
                                canOperateConcentrator={this.state.canOperate} changeShowOperate={()=> {
                          this.setState({canOperate: !this.state.canOperate})
                        }}
                        />
                      </div>
                      <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                       dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                       scroll={{x: 2150, y: this.state.tableY}}
                                       history={this.props.history}
                                       operate={operate}
                                       canOperate={this.state.canOperate}
                                       rowClassName={function (record, index) {
                                         if (record.status === -2) {
                                           return 'error'
                                         }
                                       }}
                      />
                      <Pagination meta={meta} handPageChange={this.handPageChange} initPage={this.state.initPage}
                                  handPageSizeChange={this.handPageSizeChange}/>
                    </div> :
                    <div>
                      <Detail tableY={this.state.tableY} onBack={this.handleBack} showExtra={true}
                              meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                              started_at={this.state.started_at}/>
                    </div>}
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            destroyOnClose={true}
            width="900px"
            title={`${ formatMessage({id: 'intl.water_meter_number'})} ${this.state.edit_meter_number} ${ formatMessage({id: 'intl.details'})}${ formatMessage({id: 'intl.detail_info'})}`}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <Detail showExtra={true} meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                    started_at={this.state.started_at}/>
          </Modal>
          <Modal
            title={'导出异常水表'}
            visible={this.state.exportModal}
            onCancel={() => this.setState({exportModal: false})}
            //onOk={this.handleImport}
            footer={[
              <Button key="back"
                      onClick={() => this.setState({exportModal: false})}>{formatMessage({id: 'intl.cancel'})}</Button>,
              <Button key="submit" type="primary" onClick={this.handleExport}>
                {formatMessage({id: 'intl.submit'})}
              </Button>,
            ]}
          >
            <Export wrappedComponentRef={(inst) => this.exportFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
