import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../Sider'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import ChangeTable from './ChangeTable'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  user_command_data: state.user_command_data,
  meter_models: state.meter_models,
  meters: state.meters,
  global: state.global,
}))
@injectIntl
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'meter_model_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'meter_model_delete'}),
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      showChangeBtn: find(this.permissions, {name: 'meter_change_record_add'}),
      tableY: 0,
      page: 1,
      initPage:1,
      commandPage: '',
      started_at: '',
      ended_at: '',
      number: '',
      member_number: '',
      install_address: '',
      real_name: '',
      editModal: false,
      addModal: false,
      commandModal: false,
      canOperateMeter: localStorage.getItem('canOperateMeter') === 'true' ? true : false,
      per_page:30,
      canLoadByScroll:true,
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

    const {dispatch} = this.props;
    // dispatch({
    //   type: 'meters/fetch',
    //   payload: {
    //     page: 1,
    //   },
    //   callback:()=>{
    //   this.changeTableY()
    // }
    // });
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        return: 'all'
      }
    });
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
        const {meters: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            number: this.state.number,
            member_number: this.state.member_number,
            install_address: this.state.install_address,
            real_name: this.state.real_name,
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
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        number: this.state.number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
        per_page:this.state.per_page
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        number: this.state.number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        real_name: this.state.real_name,
        per_page:this.state.per_page
      })
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      number: '',
      member_number: '',
      install_address: '',
      real_name: '',
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type:fetchAndPush?'meters/fetchAndPush': 'meters/fetch',
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
            initPage:values.page,
            selectedRowKeys:[]
          })
        }
        if(cb) cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      number: this.state.number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      real_name: this.state.real_name,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      number: this.state.number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      real_name: this.state.real_name,
      per_page:per_page
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'meters/add',
      payload: {
        ...formValues,
        meter_model_id: formValues.meter_model_id.key,
        installed_at: formValues.installed_at ? moment(formValues.installed_at).format('YYYY-MM-DD') : '',
        manufactured_at: formValues.manufactured_at ? moment(formValues.manufactured_at).format('YYYY-MM-DD') : '',
        is_valve: formValues.is_valve.key ? parseInt(formValues.is_valve.key) : -1,
        valve_status: formValues.valve_status ? 1 : -1
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.meter'})}
          )
        )
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });

  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'meters/edit',
      payload: {
        ...formValues,
        meter_model_id: formValues.meter_model_id.key,
        installed_at: formValues.installed_at ? moment(formValues.installed_at).format('YYYY-MM-DD') : '',
        manufactured_at: formValues.manufactured_at ? moment(formValues.manufactured_at).format('YYYY-MM-DD') : '',
        is_valve: formValues.is_valve.key ? parseInt(formValues.is_valve.key) : -1,
        valve_status: formValues.valve_status ? 1 : -1,
        id: this.state.editRecord.id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.meter'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleChangeMeter = ()=> {
    const formValues = this.changeFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'meters/change',
      payload: {
        ...formValues,
        initial_water: parseFloat(formValues.initial_water),
        meter_model_id: formValues.meter_model_id.key,
        is_valve: formValues.is_valve.key ? parseInt(formValues.is_valve.key) : -1,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.change'}), type: formatMessage({id: 'intl.meter'})}
          )
        )
        that.setState({
          changeModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'meters/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.meter'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleCommand = (record, command)=> {
    console.log('command ', command);
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        meter_number: record.number,
        feature: command
      },
      callback: ()=> {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          install_address: that.state.install_address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  showCommandInfo = ()=> {
    const that = this;
    this.handleCommandSearch({
      page: this.state.commandPage,
    }, function () {
      that.setState({
        commandModal: true
      })
    })
  }
  handCommandPageChange = (page)=> {
    this.handleCommandSearch({
      page: page,
    })
  }
  handleCommandSearch = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        ...values,
      },
    });
    this.setState({
      commandPage: values.page
    });
    if (cb)cb()
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const { selectedRowKeys } = this.state;
    const {meters: {data, meta, loading}, meter_models, user_command_data} = this.props;
    const {isMobile} =this.props.global;
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
      // },
      {
        title: formatMessage({id: 'intl.water_meter_number'}), width: 90, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }
      },
      {
        title:formatMessage({id: 'intl.user_name'}) , dataIndex: 'real_name', key: 'real_name', width: 80, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {
        title: formatMessage({id: 'intl.user_number'}), dataIndex: 'member_number', key: 'member_number', width: 80, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {
        title: formatMessage({id: 'intl.install_address'}),
        dataIndex: 'install_address',
        key: 'install_address',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.water_meter_index'}), dataIndex: 'index', key: 'index', width: 80, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {title: formatMessage({id: 'intl.initial_value'}), width: 80, dataIndex: 'initial_water', key: 'initial_water', render: (text, record, index) => {
        return ellipsis2(text, 80)
      }},
      {
        title: formatMessage({id: 'intl.water_meter_type'}),
        width: 110,
        dataIndex: 'meter_model_name',
        key: 'meter_model_name',
        render: (text, record, index) => {
          return ellipsis2(text, 110)
        }
      },
      {title: formatMessage({id: 'intl.temperature_type'}), dataIndex: 'temperature_type_explain', key: 'temperature_type_explain', width: 110,render: (text, record, index) => {
        return ellipsis2(text,110)
      }
      },
      {title: formatMessage({id: 'intl.size_type'}), dataIndex: 'size_type_explain', key: 'size_type_explain', width: 80,render: (text, record, index) => {
        return ellipsis2(text,80)
      } },
      {title: formatMessage({id: 'intl.output_type'}), dataIndex: 'output_type_explain', key: 'output_type_explain', width: 80,render: (text, record, index) => {
        return ellipsis2(text,80)
      }
      },

      {
        title: formatMessage({id: 'intl.can_valve'}), dataIndex: 'is_valve', key: 'is_valve', width: 80,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? formatMessage({id: 'intl.yes'}) :formatMessage({id: 'intl.no'})}

          </p>
        )
      },
      {
        title: formatMessage({id: 'intl.valve_status'}), dataIndex: 'valve_status', key: 'valve_status', width: 80,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{record.valve_status_explain}
          </p>
        )
      },
      {
        title: formatMessage({id: 'intl.water_meter_number'}), dataIndex: 'status', key: 'status', width: 80,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}
          </p>
        )
      },
      {
        title: formatMessage({id: 'intl.battery_voltage_state'}), dataIndex: 'voltage_status', key: 'voltage_status', width: 110,
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{record.voltage_status_explain}
          </p>
        )
      },
      {
        title: formatMessage({id: 'intl.concentrator_number'}),
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.channel'}),
        dataIndex: 'channel',
        key: 'channel',
        width: 80,
        render: (text, record, index) => {
          return ellipsis2(text, 80)
        }
      },

      {
        title: formatMessage({id: 'intl.vendor_code'}),
        dataIndex: 'manufacturer_prefix',
        key: 'manufacturer_prefix',
        width: 80,
        render: (text, record, index) => {
          return ellipsis2(text, 80)
        }
      },
      {
        title: formatMessage({id: 'intl.enabled_date'}), width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title: formatMessage({id: 'intl.enabled_value'}),
        width: 120,
        dataIndex: 'enabled_value',
        key: 'enabled_value',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: formatMessage({id: 'intl.disabled_date'}),
        width: 120,
        dataIndex: 'disabled_date',
        key: 'disabled_date',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: formatMessage({id: 'intl.disabled_value'}),
        width: 120,
        dataIndex: 'disabled_value',
        key: 'disabled_value',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: formatMessage({id: 'intl.manufactured_date'}),
        width: 120,
        dataIndex: 'manufactured_at',
        key: 'manufactured_at',
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: formatMessage({id: 'intl.installed_date'}), width: 120, dataIndex: 'installed_at', key: 'installed_at', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },

      {title:formatMessage({id: 'intl.battery_life'}) , dataIndex: 'battery_life', key: 'battery_life', width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }},
      {
        title: formatMessage({id: 'intl.vendor_name'}),
        dataIndex: 'manufacturer_name',
        key: 'manufacturer_name',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title:formatMessage({id: 'intl.remark'}) , dataIndex: 'remark', key: 'remark',  width: 100,render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      },
      {title: formatMessage({id: 'intl.barcode'}), dataIndex: 'barcode', key: 'barcode',width: 100,render: (text, record, index) => {
        return ellipsis2(text, 100)
      }},
      {
        title:formatMessage({id: 'intl.sort_number'}), dataIndex: 'sort_number', key: 'sort_number'
      }

    ];
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='hy') {
      columns.splice(7, 1)
    }
    const operate={
      title:formatMessage({id: 'intl.operate'}),
      width: isMobile ? 100 : 180,
      fixed: 'right',
      render: (val, record, index) => (
        <p>
          {
            (this.state.showCommandBtn && record.is_valve === 1) &&
            <span>
                {record.valve_status === -1 &&
                <Popconfirm placement="topRight" title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.open_valve'})})}
                            onConfirm={()=> {
                              this.handleCommand(record, 'open_valve')
                            }}>
                <span>
                  <a href="javascript:;">{formatMessage({id: 'intl.open_valve'})}</a>
                </span>
                </Popconfirm>}
              {record.valve_status === 1 &&
              <Popconfirm placement="topRight" title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.close_valve'})})}
                          onConfirm={()=> {
                            this.handleCommand(record, 'close_valve')
                          }}>
                <span>
                   <a href="javascript:;">{formatMessage({id: 'intl.close_valve'})}</a>
                </span>
              </Popconfirm>}
              <span className="ant-divider"/>
              </span>
          }
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
                      }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showChangeBtn &&record.status === 1&&
            <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            changeModal: true
                          }
                        )
                      }}>{formatMessage({id: 'intl.change_meter'})}</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showdelBtn &&record.status === 1&&
            <Popconfirm placement="topRight"  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">{formatMessage({id: 'intl.delete'})}</a>
            </Popconfirm>
          }

        </p>
      ),
    }

    if (this.state.canOperateMeter) {
      columns.push(operate)
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: formatMessage({id: 'intl.device'})}, {name: formatMessage({id: 'intl.meter_manage'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                   inputText="水表号" dateText="发送时间" handleSearch={this.handleSearch}
                                   clickInfo={this.showCommandInfo}
                                   per_page={this.state.per_page}
                                   isMobile={isMobile}
                                   valveCommand={this.valveCommand}
                                   selectedRowKeys={selectedRowKeys}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   canOperateConcentrator={this.state.canOperateMeter} changeShowOperate={()=> {
                      this.setState({canOperateMeter: !this.state.canOperateMeter})
                    }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.number}
                                 scroll={{x:3450,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperateMeter}
                                 rowSelection={['hy','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411'].indexOf(company_code)>=0?null:rowSelection}
                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            width="700px"
            title={ formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm meter_models={meter_models.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            width="700px"
            key={ Date.parse(new Date())}
            title={ formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm meter_models={meter_models.data} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
          <Modal
            width="700px"
            key={ Date.parse(new Date()) + 1}
            title={ formatMessage({id: 'intl.change_meter'})}
            visible={this.state.changeModal}
            onOk={this.handleChangeMeter}
            onCancel={() => this.setState({changeModal: false})}
          >
            <ChangeTable meter_models={meter_models.data} editRecord={this.state.editRecord}
                         wrappedComponentRef={(inst) => this.changeFormRef = inst}/>
          </Modal>
         {/* <Modal
            width="90%"
            title="开/关阀信息"
            visible={this.state.commandModal}
            onCancel={() => this.setState({commandModal: false})}
            footer={null}
          >
            <div style={{overflow: 'hidden'}}>
              <Table
                className='meter-table'
                loading={loading}
                rowKey={record => record.id}
                dataSource={user_command_data.data}
                columns={commandColumns}
                pagination={false}
                size="small"
              />
              <Pagination meta={user_command_data.meta} handPageChange={this.handCommandPageChange}/>
            </div>

          </Modal>*/}

        </Content>
      </Layout>
    );
  }
}

export
default
MeterModel
