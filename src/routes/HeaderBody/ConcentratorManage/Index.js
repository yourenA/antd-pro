import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Popconfirm, Layout,message,Modal,Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOrEditConcentrator from './AddOrEditConcentrator'
import Sider from './../Sider'
import {connect} from 'dva';
import Detail from './Detail'
import find from 'lodash/find'
// import moment from 'moment'
import './index.less'
import ConcentratorDetail from './ConcentratorDetail'
const { Content} = Layout;
@connect(state => ({
  concentrator_models: state.concentrator_models,
  concentrators: state.concentrators,
  servers: state.servers,
  area:state.area
}))
class ConcentratorManage extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'concentrator_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'concentrator_delete'}),
      showSiderCon:false,
      tableY:0,
      query: '',
      page: 1,
      // initRange:[moment(new Date().getFullYear()+'-'+new  Date().getMonth()+1+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      // started_at:'',
      // ended_at:'',
      editModal:false,
      addModal:false,
      orderModal:false,
      village_id: '',
      showArea:true,
      editRecord:null
    }

  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch}=this.props
    dispatch({
      type: 'concentrator_models/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'servers/fetch',
      payload: {
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

  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id
    })
    this.handleSearch({
      page: 1,
      query: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    this.searchFormRef.props.form.resetFields()
    this.setState({
      showAddBtnByCon:false,
      concentrator_number:null
    },function () {
      this.handleSearch({
        page: 1,
        query: '',
        // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        village_id: village_id
      })
    })
  }
  changeConcentrator = (concentrator_number,village_id)=> {
    this.searchFormRef.props.form.resetFields()
    this.setState({
      concentrator_number:concentrator_number,
    })
    this.handleSearch({
      page: 1,
      query: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id:village_id,
      concentrator_number:concentrator_number
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      query: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrators/fetch',
      payload: {
        concentrator_number:this.state.concentrator_number?this.state.concentrator_number:'',
        village_id: values.village_id? values.village_id:this.state.village_id,
        ...values,
      },
    });

    this.setState({
      query: values.query,
      // started_at: values.started_at,
      // ended_at: values.ended_at,
      page: values.page,
      village_id: values.village_id? values.village_id:this.state.village_id,
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
    })
  }

  operate=(record)=>{
    this.setState({
      orderModal:true,
      editRecord:record
    })

  }
  refreshSider=()=>{
    this.setState({
      refreshSider:true
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'concentrators/add',
      payload: {
        ...formValues,
        village_id: formValues.village_id[formValues.village_id.length-1],
        server_id: formValues.server_id.key,
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
      },
      callback: function () {
        message.success('添加集中器成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
        // this.reload()
      }
    });
  }
  setReload=(reload)=> {
    this.reload = reload;
  }
  handleEdit = () => {
    const that = this;
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'concentrators/edit',
      payload: {
        ...formValues,
        server_id: formValues.server_id.key,
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
        id:this.state.editRecord.id
      },
      callback: function () {
        message.success('修改集中器成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除集中器成功')
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
      }
    });
  }
  showConcentrator=(record)=>{
    console.log(record.id);
    this.setState({
      concentratorId:record.id,
      concentratorNumber:record.number,
    },function () {
      this.setState({
        showArea:false
      })
    })
  }
  handleBack=()=>{
    this.setState({
      showArea:true,
      concentratorNumber:null,
    })
  }
  render() {
    const {concentrators: {data, meta, loading},servers,concentrator_models,area} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      { title: '集中器编号', width: 100, dataIndex: 'number', key: 'number',    fixed: 'left',
        render: (text, record, index) => {
          return (
            <p style={{cursor:'pointer'}} onClick={()=>this.showConcentrator(record)}>
              {text}
            </p>
          )
        }
      },
      { title: '集中器类型', width: 120, dataIndex: 'concentrator_model_name', key: 'concentrator_model_name'},
      { title: '硬件编号', dataIndex: 'serial_number', key: 'serial_number' ,width: 100, },
      { title: '安装小区', dataIndex: 'village_name', key: 'village_name' ,width: 150,},
      { title: '安装地址', dataIndex: 'install_address', key: 'install_address' ,width: 150,},
      { title: '在线状态', dataIndex: 'is_online', key: '3' ,width: 100,
        render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{val===1?"是":"否"}
        </p>
      )},
      { title: '本轮登录时间', dataIndex: 'address', key: '4' ,width: 150,},
      { title: '最后访问时间', dataIndex: 'set', key: '5',width: 150,},
      { title: '水表总数', dataIndex: 'meter_count', key: 'meter_count',width: 100},
      { title: '上行报文（指令）', dataIndex: 'uplink_message', key: 'uplink_message',width: 150,},
      { title: '下行报文（指令）', dataIndex: 'downlink_message', key: 'downlink_message',width: 150},
      { title: '是否做统计日报', dataIndex: 'is_count', key: 'is_count'  ,width: 150,
        render: (val, record, index) => {
        return (
          <p>
            <Badge status={val===1?"success":"error"} />{val===1?"是":"否"}
          </p>
        )
      }},
      { title: '备注', dataIndex: 'remark', key: 'remark'},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (val, record, index) => {
          return(
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
                      }}>编辑</a>
            <span className="ant-divider"/>
                </span>
              }
              {
                this.state.showdelBtn &&
                <span>
                  <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                              onConfirm={()=>this.handleRemove(record.id)}>
                  <a href="">删除</a>
                </Popconfirm>
                    <span className="ant-divider"/>
                </span>
              }
              <a href="javascript:;" onClick={()=>message.info('该功能暂未开通')}>指令</a>
            </p>
            )
        }
      },
    ];
    let breadcrumb=this.state.concentratorNumber?[{name: '运行管理'}, {name: '集中器管理'},{name:this.state.concentratorNumber}]:[{name: '运行管理'}, {name: '集中器管理'}]
    return (
      <Layout className="layout">
        <Sider showSiderCon={this.state.showSiderCon} changeArea={this.changeArea} changeConcentrator={this.changeConcentrator} showArea={this.state.showArea} siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={breadcrumb}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
              {
                this.state.showArea
                  ?
                  <div>
                    <div className='tableList'>
                      <div className='tableListForm'>
                        <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                village_id={this.state.village_id}
                                handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
                      </div>
                    </div>
                    <Table
                      rowClassName={function (record, index) {
                        if(record.description===''){
                          return 'error'
                        }
                      }}
                      className='meter-table'
                      loading={loading}
                      rowKey={record => record.id}
                      dataSource={data}
                      columns={columns}
                      scroll={{ x: 2000,y: this.state.tableY }}
                      pagination={false}
                      size="small"
                    />
                    <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                                current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                                style={{marginTop: '10px'}} onChange={this.handPageChange}/>
                  </div>
                  :
                  <ConcentratorDetail concentratorId={this.state.concentratorId}  handleBack={this.handleBack}/>
              }
              </Card>
          </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          title="添加集中器"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal:false})}
        >
          <AddOrEditConcentrator  wrappedComponentRef={(inst) => this.formRef = inst} area={area.data} concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="编辑集中器"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
          <AddOrEditConcentrator   editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst} area={area.data} concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())+1}
          title={`集中器指令:集中器编号${this.state.editRecord?this.state.editRecord.number:''}`}
          visible={this.state.orderModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({orderModal:false})}
        >
          <Detail />
        </Modal>

      </Layout>
    );
  }
}

export default ConcentratorManage
