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
import AddOrEditForm from './addOrEditLiquidSensor'
import ValveCommand from './ValveCommand'
import ConnectForm from './ConnectSensor'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  valve_sensors: state.valve_sensors,
  global: state.global,
  sider_regions: state.sider_regions
}))
class LiquidSensors extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'liquid_sensor_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'liquid_sensor_delete'}),
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      tableY: 0,
      page: 1,
      initPage:1,
      commandPage: '',
      started_at: '',
      ended_at: '',
      number: '',
      member_number: '',
      address: '',
      real_name: '',
      editModal: false,
      addModal: false,
      commandModal: false,
      canOperateMeter: localStorage.getItem('canOperateliquidSnsors') === 'true' ? true : false,
      per_page:30,
      canLoadByScroll:true,
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

    const {dispatch} = this.props;
    dispatch({
      type: 'sider_regions/fetch',
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
        const {valve_sensors: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            number: this.state.number,
            member_number: this.state.member_number,
            address: this.state.address,
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
        address: this.state.address,
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
        address: this.state.address,
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
      address: '',
      real_name: '',
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type:fetchAndPush?'valve_sensors/fetchAndPush': 'valve_sensors/fetch',
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
      address: this.state.address,
      real_name: this.state.real_name,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      number: this.state.number,
      member_number: this.state.member_number,
      address: this.state.address,
      real_name: this.state.real_name,
      per_page:per_page
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'valve_sensors/add',
      payload: {
        ...formValues,
        enabled_date: formValues.enabled_date ? moment(formValues.enabled_date).format('YYYY-MM-DD') : '',
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.valve_sensors'})}
          )
        )
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          address: that.state.address,
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
      type: 'valve_sensors/edit',
      payload: {
        ...formValues,
        enabled_date: formValues.enabled_date ? moment(formValues.enabled_date).format('YYYY-MM-DD') : '',
        id: this.state.editRecord.id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.valve_sensors'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          address: that.state.address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'valve_sensors/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.valve_sensors'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          member_number: that.state.member_number,
          address: that.state.address,
          real_name: that.state.real_name,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleConnect=()=>{
    const formValues = this.connectFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'valve_sensors/connect',
      payload: {
        ...formValues,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate:'', type: formatMessage({id: 'intl.associated_level_sensor'})}
          )
        )
        that.setState({
          connectModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          address: that.state.address,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleCommand=()=>{
    const formValues = this.valveCommandFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'valve_sensors/command',
      payload: {
        ...formValues,
        feature:"set_valve_position"
      },
      callback: function () {
        // message.success('设置比例阀控传感器值成功')
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate:'', type: formatMessage({id: 'intl.sett_valve_open_value'})}
          )
        )
        that.setState({
          valveModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          address: that.state.address,
          per_page:that.state.per_page
        })
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const { selectedRowKeys } = this.state;
    const {valve_sensors: {data, meta, loading},  sider_regions} = this.props;
    const {isMobile} =this.props.global;
    const columns = [
      {
        title:formatMessage({id: 'intl.valve_sensors_number'}) , width: 150, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }
      },
      {
        title: formatMessage({id: 'intl.valve_sensors_index'}), dataIndex: 'index', key: 'index2', width: 100, render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      },
      {
        title:formatMessage({id: 'intl.positive/negative_feedback'}) , dataIndex: 'is_positive_feedback', key: 'is_positive_feedback', width: 125, render: (text, record, index) => {
        if (text === 1) {
          return (
            <div><Badge status="success"/>{formatMessage({id: 'intl.positive_feedback'})}</div>
          )
        } else if (text === -1) {
          return (
            <div><Badge status="error"/>{formatMessage({id: 'intl.negative_feedback'})}</div>
          )
        }
      }
      },
      {
        title: formatMessage({id: 'intl.current_valve_open_value'}), dataIndex: 'current_value', key: 'current_value', width: 120, render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title:formatMessage({id: 'intl.min_actual_value'}) , dataIndex: 'min_actual_value', key: 'min_actual_value', width: 100, render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      },
      {
        title:formatMessage({id: 'intl.max_actual_value'}) , dataIndex: 'max_actual_value', key: 'max_actual_value', width: 100, render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      },
      {
        title:formatMessage({id: 'intl.level_valve_control_threshold_value'}) , dataIndex: 'thresholds', key: 'thresholds', width: 120, render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title:formatMessage({id: 'intl.unit'}) , dataIndex: 'unit', key: 'unit', width: 120, render: (text, record, index) => {
        return ellipsis2(text, 80)
      }
      },
      {
        title:formatMessage({id: 'intl.number_of_associated_level_sensor'}) , width: 160, dataIndex: 'liquid_sersor_number', key: 'liquid_sersor_number',
        render: (val, record, index) => {
          return ellipsis2(val, 160)
        }
      },
      {
        title: formatMessage({id: 'intl.is_automatic_linkage'}), dataIndex: 'is_automatic_linkage', key: 'is_automatic_linkage', width: 120, render: (text, record, index) => {
        if (text === 1) {
          return (
            <div><Badge status="success"/>{formatMessage({id: 'intl.yes'})}</div>
          )
        } else if (text === -1) {
          return (
            <div><Badge status="error"/>{formatMessage({id: 'intl.no'})}</div>
          )
        }
      }
      },
      {
        title:formatMessage({id: 'intl.install_address'}) ,
        dataIndex: 'address',
        key: 'address',
        width: 140,
        render: (text, record, index) => {
          return ellipsis2(text, 140)
        }
      },
      {
        title:formatMessage({id: 'intl.concentrator_number'}) ,
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },

      {
        title: formatMessage({id: 'intl.enabled_date'}), width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title:formatMessage({id: 'intl.created_time'}) , width: 140, dataIndex: 'created_at', key: 'created_at', render: (text, record, index) => {
        return ellipsis2(text, 140)
      }
      },
      {
        title:formatMessage({id: 'intl.remark'}), dataIndex: 'remark', key: 'remark'
      }

    ];
    const operate={
      title: formatMessage({id: 'intl.operate'}),
      width:280 ,
      fixed: 'right',
      render: (val, record, index) => (
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
                      }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showCommandBtn &&
            <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            valveModal: true
                          }
                        )
                      }}>{formatMessage({id: 'intl.sett_valve_open_value'})}</a>
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
                            connectModal: true
                          }
                        )
                      }}>{formatMessage({id: 'intl.associated_level_sensor'})}</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showdelBtn&&
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
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name:formatMessage({id: 'intl.device'})}, {name: formatMessage({id: 'intl.valve_sensors_manage'})}]}>
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
                                 scroll={{x:2300,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperateMeter}

                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            width="60%"
            title={formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
           <AddOrEditForm sider_regions={sider_regions} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            width="60%"
            key={ Date.parse(new Date())}
            title={formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm sider_regions={sider_regions} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())+1}
            title={formatMessage({id: 'intl.associated_level_sensor'})}
            visible={this.state.connectModal}
            onOk={this.handleConnect}
            onCancel={() => this.setState({connectModal: false})}
          >
            <ConnectForm  editRecord={this.state.editRecord} type="valve"
                           wrappedComponentRef={(inst) => this.connectFormRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())+2}
            title={formatMessage({id: 'intl.sett_valve_open_value'})}
            visible={this.state.valveModal}
            onOk={this.handleCommand}
            onCancel={() => this.setState({valveModal: false})}
          >
            <ValveCommand  editRecord={this.state.editRecord}
                          wrappedComponentRef={(inst) => this.valveCommandFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export
default
LiquidSensors
