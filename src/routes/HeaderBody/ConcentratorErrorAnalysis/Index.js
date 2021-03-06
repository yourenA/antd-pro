import React, {PureComponent} from 'react';
import {Table, Card, Badge, Layout, message, Modal, Button, Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import {renderIndex, ellipsis, GetQueryString,ellipsis2,fillZero} from './../../../utils/utils'

import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
import debounce from 'lodash/throttle'
import Detail from './../ConcentratorManage/Detail'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import request from "./../../../utils/request";
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  concentrator_errors: state.concentrator_errors,
  manufacturers: state.manufacturers,
  servers: state.servers,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.initDate = GetQueryString('date', this.props.history.location.search)
    this.initConcentrator = GetQueryString('concentrator', this.props.history.location.search)
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      commandBtn: find(this.permissions, {name: 'user_send_command'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      manufacturer_id: '',
      concentrator_number: this.initConcentrator ? this.initConcentrator : '',
      page: 1,
      initPage:1,
      initRange: this.initDate ? [moment(new Date(this.initDate), 'YYYY-MM-DD'), moment(new Date(this.initDate), 'YYYY-MM-DD')] : [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      member_number: '',
      per_page:30,
      canLoadByScroll:true,
      canOperateConcentrator: localStorage.getItem('canOperateConcentratorError') === 'true' ? true : false,
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
      callback: ()=> {
        this.changeTableY()
      }
    });
    dispatch({
      type: 'servers/fetch',
      payload: {
        display_type: 'only_enabled',
        return: 'all'
      }
    });
    if (this.initConcentrator) {
      this.handleSearch({
        page: 1,
        started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        per_page:30
      })
    }

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
        const {concentrator_errors: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            manufacturer_id: this.state.manufacturer_id,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
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
    // this.searchFormRef.props.form.setFieldsValue({
    //   concentrator_number: '',
    // });
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.handleSearch({
        page: 1,
        manufacturer_id: this.state.manufacturer_id,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
        per_page:this.state.per_page
      })
    })

  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        manufacturer_id: this.state.manufacturer_id,
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
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      per_page:30
    })
  }

  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'concentrator_errors/fetchAndPush': 'concentrator_errors/fetch',
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
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      manufacturer_id: this.state.manufacturer_id,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:per_page
    })
  }
  renderStatus = (code)=> {
    if (code === 1) {
      return (
        <Badge status="success"/>
      )
    } else if (code === -1) {
      return (
        <Badge status="error"/>
      )
    } else if (code === -2) {
      return (
        <Badge status="warning"/>
      )
    } else if (code === 0) {
      return (
        <Badge status="default"/>
      )
    } else {
      return null
    }
  }
  changeShowOperate = ()=> {
    console.log('change')
    this.setState({canOperateConcentrator: !this.state.canOperateConcentrator})
  }
  handleOrder=()=>{
    const that = this;
    console.log('this.orderFormRef.state',this.orderFormRef)
    const state = this.orderFormRef.state;
    if (state.tabsActiveKey === 'editUpload') {
      this.handleEditConfig()
    } else if (state.tabsActiveKey === 'editSleep') {
      this.handleEditSleep()
    } else if (state.tabsActiveKey === 'setGPRS') {
      this.handleSetGPRS()
    }
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
      }
    });

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
  render() {
    const {intl:{formatMessage}} = this.props;
    const {concentrator_errors: {data, meta, loading}, manufacturers,servers} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    let columns = [
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
      // },
      {title: formatMessage({id: 'intl.concentrator_number'}) , width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }},
      {title:formatMessage({id: 'intl.vendor_name'}) , width: 90, dataIndex: 'manufacturer_name', key: 'manufacturer_name',render: (val, record, index) => {
        return ellipsis2(val, 90)
      }},
      {
        title: formatMessage({id: 'intl.install_address'}), dataIndex: 'install_address', key: 'install_address', width: 130,
        render: (val, record, index) => {
          return ellipsis2(val, 130)
        }
      },
      {title:formatMessage({id: 'intl.date'}) , dataIndex: 'date', key: 'date', width: 120,
        render: (val, record, index) => {
          return ellipsis2(val, 120)
        }},
      {title:formatMessage({id: 'intl.total_meter_count'}) , width: 90, dataIndex: 'total_meter_count', key: 'total_meter_count',
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }},
      {title: formatMessage({id: 'intl.upload_meter_count'}), width: 90, dataIndex: 'upload_meter_count', key: 'upload_meter_count',
        render: (val, record, index) => {
          return ellipsis2(val, 80)
        }},
      {
        title: formatMessage({id: 'intl.upload_meter_rate'}), width: 80, dataIndex: 'upload_meter_rate', key: 'upload_meter_rate', className: 'align-center',
        render: (val, record, index) => {
          return parseFloat(val) ?
            <Progress type="circle" percent={parseFloat(val)} width={30} format={(val) =>val + '%'}/> : val
        }
      },
      {title:formatMessage({id: 'intl.normal_meter_count'}) , width: 110, dataIndex: 'normal_meter_count', key: 'normal_meter_count',
        render: (val, record, index) => {
          return ellipsis2(val, 110)
        }},
      {
        title:formatMessage({id: 'intl.normal_meter_rate'}) , width: 90, dataIndex: 'normal_meter_rate', key: 'normal_meter_rate', className: 'align-center',
        render: (val, record, index) => {
          return parseFloat(val) ?
            <Progress type="circle" percent={parseFloat(val)} width={30} format={(val) =>val + '%'}/> : val
        }
      },
      {
        title: '0', dataIndex: 'hours_status', key: '0', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[0])
      }
      },
      {
        title: '1', dataIndex: 'hours_status', key: '1', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[1])
      }
      },
      {
        title: '2', dataIndex: 'hours_status', key: '2', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[2])
      }
      },
      {
        title: '3', dataIndex: 'hours_status', key: '3', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[3])
      }
      },
      {
        title: '4', dataIndex: 'hours_status', key: '4', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[4])
      }
      },
      {
        title: '5', dataIndex: 'hours_status', key: '5', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[5])
      }
      },
      {
        title: '6', dataIndex: 'hours_status', key: '6', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[6])
      }
      },
      {
        title: '7', dataIndex: 'hours_status', key: '7', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[7])
      }
      },
      {
        title: '8', dataIndex: 'hours_status', key: '8', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[8])
      }
      },
      {
        title: '9', dataIndex: 'hours_status', key: '9', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[9])
      }
      },
      {
        title: '10', dataIndex: 'hours_status', key: '10', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[10])
      }
      },
      {
        title: '11', dataIndex: 'hours_status', key: '11', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[11])
      }
      },
      {
        title: '12', dataIndex: 'hours_status', key: '12', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[12])
      }
      },
      {
        title: '13', dataIndex: 'hours_status', key: '13', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[13])
      }
      },
      {
        title: '14', dataIndex: 'hours_status', key: '14', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[14])
      }
      },
      {
        title: '15', dataIndex: 'hours_status', key: '15', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[15])
      }
      },
      {
        title: '16', dataIndex: 'hours_status', key: '16', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[16])
      }
      },
      {
        title: '17', dataIndex: 'hours_status', key: '17', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[17])
      }
      },
      {
        title: '18', dataIndex: 'hours_status', key: '18', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[18])
      }
      },
      {
        title: '19', dataIndex: 'hours_status', key: '19', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[19])
      }
      },
      {
        title: '20', dataIndex: 'hours_status', key: '20', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[20])
      }
      },
      {
        title: '21', dataIndex: 'hours_status', key: '21', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[21])
      }
      },
      {
        title: '22', dataIndex: 'hours_status', key: '22', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[22])
      }
      },
    ];
    const company_code = sessionStorage.getItem('company_code');
    if(company_code!=='hy'){
      columns.splice(3,0 ,{
        title: formatMessage({id: 'intl.signal'}), dataIndex: 'signal', key: 'signal', width: 80,
        render: (val, record, index) => {
          return ellipsis2(val, 80)
        }
      }, {
          title:formatMessage({id: 'intl.sim_balance'}), dataIndex: 'sim_balance', key: 'sim_balance', width: 100,
          render: (val, record, index) => {
            return ellipsis2(val, 100)
          }
        },
        {
          title:formatMessage({id: 'intl.sim_traffic'}), dataIndex: 'sim_traffic', key: 'sim_traffic', width: 150,
          render: (val, record, index) => {
            return ellipsis2(val, 150)
          }
        })
    }
    if(company_code==='hy'){
      columns.push(
        {
          title: '23', dataIndex: 'hours_status', key: '23', width: 40,  render: (val, record, index) => {
          return this.renderStatus(record.is_onlines[23])
        }
        },
        {
          title:formatMessage({id: 'intl.sim_balance'}), dataIndex: 'sim_balance', key: 'sim_balance', width: 100,
          render: (val, record, index) => {
            return ellipsis2(val, 100)
          }
        },
        {
          title:formatMessage({id: 'intl.sim_traffic'}), dataIndex: 'sim_traffic', key: 'sim_traffic',
          render: (val, record, index) => {
            return ellipsis2(val, 150)
          }
        }
      )
    }else{
      columns.push(
        {
          title: '23', dataIndex: 'hours_status', key: '23', render: (val, record, index) => {
          return this.renderStatus(record.is_onlines[23])
          }
        }
      )
    }
    const operate = {
      title: formatMessage({id: 'intl.operate'}),
      key: 'operation',
      fixed: 'right',
      className: 'operation',
      width: 80,
      render: (val, record, index) => {
        return (
          <p>
            {
              this.state.commandBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        const that=this;
                        request(`/concentrators/${record.concentrator_number}`, {
                          method: 'GET',
                        }).then((response)=> {
                          console.log(response);
                          if (response.status === 200) {
                            that.setState(
                              {
                                editRecord: response.data,
                                orderModal: true
                              }
                            )
                          }
                        })

                      }}>{ formatMessage({id: 'intl.command'})}</a>
                </span>
            }
          </p>
        )
      }
    }
    if (this.state.canOperateConcentrator) {
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider noClickSider={this.initConcentrator} changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析"  breadcrumb={[{name: formatMessage({id: 'intl.abnormal_analysis'})},
              {name: formatMessage({id: 'intl.concentrator_abnormal_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search
                      changeShowOperate={this.changeShowOperate }
                      initConcentrator={this.initConcentrator}
                      wrappedComponentRef={(inst) => this.searchFormRef = inst}
                      initRange={this.state.initRange}
                      village_id={this.state.village_id}
                      manufacturers={manufacturers.data}
                      per_page={this.state.per_page}
                      handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                      showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                      clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                 scroll={{x:2400,y: this.state.tableY}}
                                 history={this.props.history}
                                 canOperate={this.state.canOperateConcentrator}
                                 operate={operate}
                                 className={'meter-table error-analysis padding-6'}
               />
               {/*  <Table
                  rowClassName={function (record, index) {
                    if (record.description === '') {
                      return 'error'
                    }
                  }}
                  className='meter-table error-analysis padding-6'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1900, y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
              <Modal
                width={'60%'}
                key={ Date.parse(new Date()) + 1}
                title={ formatMessage({id: 'intl.concentrator'})+" "+ (this.state.editRecord ? this.state.editRecord.number : '') +" "+ formatMessage({id: 'intl.command'})}
                visible={this.state.orderModal}
                onOk={this.handleOrder}
                onCancel={() => this.setState({orderModal: false})}
              >
                <Detail
                  handleSearch={()=>{
                    this.setState({orderModal: false})
                    this.handleSearch({
                      page: this.state.page,
                      manufacturer_id: this.state.manufacturer_id,
                      ended_at: this.state.ended_at,
                      started_at: this.state.started_at,
                      per_page:this.state.per_page
                    })
                  }}
                  wrappedComponentRef={(inst) => this.orderFormRef = inst}
                  editRecord={this.state.editRecord}  servers={servers.data} />
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
