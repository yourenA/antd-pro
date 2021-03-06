import React, {PureComponent} from 'react';
import {Button, Card, Layout, message, Popconfirm, Modal, Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../Sider'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  electric_valves: state.electric_valves,
  sider_regions: state.sider_regions,
  global: state.global,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.timer=null;
    this.state = {
      showAddBtn: find(this.permissions, {name: 'electric_valve_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'electric_valve_delete'}),
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      tableY: 0,
      page: 1,
      initPage:1,
      commandPage: '',
      started_at: '',
      ended_at: '',
      number: '',
      address: '',
      editModal: false,
      addModal: false,
      commandModal: false,
      canOperateMeter: localStorage.getItem('canOperateelectric_valves') === 'true' ? true : false,
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

    // dispatch({
    //   type: 'electric_valves/fetch',
    //   payload: {
    //     page: 1,
    //   },
    //   callback:()=>{
    //   this.changeTableY()
    // }
    // });
    const {dispatch}=this.props
    dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all'
      }
    });
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
    clearTimeout(this.timer)
  }
  scrollTable=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {electric_valves: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            number: this.state.number,
            address: this.state.address,
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
        address: this.state.address,
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
        address: this.state.address,
        per_page:this.state.per_page
      })
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      number: '',
      address: '',
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type:fetchAndPush?'electric_valves/fetchAndPush': 'electric_valves/fetch',
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
        if(that.timer){
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.handleSearch({
            page: that.state.page,
            number:that.state.number,
            address:that.state.address,
            per_page:that.state.per_page,
          })
        },10000)
        if(cb) cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      number: this.state.number,
      address: this.state.address,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      number: this.state.number,
      address: this.state.address,
      per_page:per_page
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'electric_valves/add',
      payload: {
        ...formValues,
        enabled_date:formValues.enabled_date?moment(formValues.enabled_date).format('YYYY-MM-DD'):'',
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: '远程电控阀门'}
          )
        )
        that.setState({
          addModal: false,
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
  handleCommand = (record, command)=> {
    console.log('command ', command);
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        electric_valve_number: record.number,
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
      }
    });
  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'electric_valves/edit',
      payload: {
        ...formValues,
        enabled_date:formValues.enabled_date?moment(formValues.enabled_date).format('YYYY-MM-DD'):'',
        id: this.state.editRecord.id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: '远程电控阀门'}
          )
        )
        that.setState({
          editModal: false,
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
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'electric_valves/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type:'远程电控阀门'}
          )
        )
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          address: that.state.address,
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

  render() {
    const {intl:{formatMessage}} = this.props;
    const {electric_valves: {data, meta, loading},sider_regions} = this.props;
    const columns = [
      {
        title: '远程电控阀门编号',
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        width: 140,
        render: (text, record, index) => {
          return ellipsis2(text, 140)
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title:'阀门状态',
        dataIndex: 'valve_status',
        key: 'valve_status',
        width: 100,
        render: (text, record, index) => {
          let label='';
          let status='';
          switch(text){
            case -4:
              label='抄读失败';
              status='error';
              break;
            case -2:
              label='异常';
              status='danger';
              break;
            case -1:
              label='关';
              status='error';
              break;
            case 1:
              label='开';
              status='success';
              break;
          }
          return   <div><Badge status={status}/>{label}</div>
        }
      },
      {
        title:'在线状态',
        dataIndex: 'online_status',
        key: 'online_status',
        width: 100,
        render: (text, record, index) => {
          let label='';
          let status='';
          switch(text){
            case -1:
              label='离线';
              status='error';
              break;
            case 1:
              label='在线';
              status='success';
              break;
          }
          return   <div><Badge status={status}/>{label}</div>
        }
      },
      {
        title:'上传时间',
        dataIndex: 'uploaded_at',
        key: 'uploaded_at',
        width: 150,
        render: (text, record, index) => {
          return ellipsis2(text, 150)
        }
      },
      {
        title:'规格',
        dataIndex: 'specification',
        key: 'specification',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.concentrator_number'}) ,
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: formatMessage({id: 'intl.install_address'}) ,
        dataIndex: 'address',
        key: 'address',
        width: 120,
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title:formatMessage({id: 'intl.enabled_date'}) , width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title: formatMessage({id: 'intl.remark'}) ,dataIndex: 'remark', key: 'remark', render: (text, record, index) => {
        return ellipsis2(text, 150)
      }
      }

    ];
    const operate={
      title:formatMessage({id: 'intl.operate'}) ,
      width:  280 ,
      fixed: 'right',
      render: (val, record, index) => (
        <p>
          {
            this.state.showAddBtn &&
              <Button type="primary" size='small' icon='edit'
                      onClick={()=>{
                        this.setState({
                          editRecord:record,
                          editModal:true
                        })
                      }}>编辑</Button>
          }
          {
            this.state.showCommandBtn&&
            <Button  loading={this.state['open'+record.number]} type="primary" size='small'
                    onClick={()=>{
                      const that=this
                      this.setState({
                        ['open'+record.number]:true
                      })
                      this.handleCommand(record,'open_electric_valve')
                      setTimeout(function () {
                        that.setState({
                          ['open'+record.number]:false
                        })
                      },5000)
                    }}>开阀</Button>
          }
          {
            this.state.showCommandBtn&&
            <Button loading={this.state['close'+record.number]}  type="danger" size='small'
                    onClick={()=>{
                      const that=this
                      this.setState({
                        ['close'+record.number]:true
                      })
                      this.handleCommand(record,'close_electric_valve')
                      setTimeout(function () {
                        that.setState({
                          ['close'+record.number]:false
                        })
                      },5000)
                    }}>关阀</Button>
          }
          {
            this.state.showdelBtn &&
            <Popconfirm placement="topRight" title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <Button  icon='delete' type="danger" size='small'
                   >删除</Button>
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
            <PageHeaderLayout title="设备管理 "  breadcrumb={[{name: formatMessage({id: 'intl.device'})},
              {name:'远程电控阀门'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                   inputText="压力计号" dateText="发送时间" handleSearch={this.handleSearch}
                                   clickInfo={this.showCommandInfo}
                                   per_page={this.state.per_page}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   canOperateConcentrator={this.state.canOperateMeter} changeShowOperate={()=> {
                      this.setState({canOperateMeter: !this.state.canOperateMeter})
                    }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x:1600,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperateMeter}
                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            title={ formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm  sider_regions={sider_regions}   wrappedComponentRef={(inst) => this.formRef = inst}    />

          </Modal>
          <Modal
            destroyOnClose={true}
            title={ formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm  editRecord={this.state.editRecord} sider_regions={sider_regions}   wrappedComponentRef={(inst) => this.editFormRef = inst}    />
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export
default
MeterModel
