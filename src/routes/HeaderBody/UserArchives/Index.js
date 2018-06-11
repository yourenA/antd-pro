import React, {PureComponent} from 'react';
import { Table , Card, Popconfirm , Layout,message,Modal,Tooltip } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOREditUserArchives from './addOREditUserArchives'
import ImportArchives from './ImportUserArchives'
import Sider from './../Sider'
import {connect} from 'dva';
import request from "./../../../utils/request";
import ChangeTable from './ChangeTable'
import moment from 'moment'
import {renderIndex,renderRowSpan,parseRowSpanData} from './../../../utils/utils'
import find from 'lodash/find'
import uuid from 'uuid/v4'
import './index.less'
const { Content} = Layout;
@connect(state => ({
  members: state.members,
  concentrators: state.concentrators,
  meters: state.meters,
  meter_models: state.meter_models,
  sider_regions: state.sider_regions,

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
      showImportBtn: find(this.permissions, {name: 'member_delete'}),
      tableY:0,
      query: '',
      page: 1,
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at:'',
      ended_at:'',
      village_id: '',
      editModal:false,
      changeModal:false,
      importModal:false,
      area: '',
      distribution_area:'',
      statistical_forms:'',
      meter_number:'',
      concentrator_number:'',
      member_number:'',
      canOperate:localStorage.getItem('canOperateUserArchives')==='true'?true:false,
    }
  }

  componentDidMount() {
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
  }
  componentWillUnmount(){
    const {dispatch}=this.props
    dispatch({
      type: 'concentrators/reset',
    });
  }
  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id
    })
    this.handleSearch({
      page: 1,
      distribution_area:'',
      statistical_forms:'',
      meter_number:'',
      concentrator_number:'',
      village_id: village_id
    })
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  changeArea = (village_id)=> {
    this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number:'',
      village_id: village_id
    },function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        distribution_area:'',
        statistical_forms:'',
        meter_number:'',
        member_number:'',
        install_address: '',
        real_name: '',
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
  changeConcentrator = (concentrator_number,village_id)=> {
    this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:'',
      concentrator_number:concentrator_number,
    },function () {
      this.handleSearch({
        page: 1,
        distribution_area:'',
        statistical_forms:'',
        meter_number:'',
        member_number:'',
        install_address: '',
        real_name: '',
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
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'members/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback:function () {
        that.setState({
          ...values,
        })
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
      // ended_at: this.state.ended_at,
      // started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'members/add',
      payload: {
        ...formValues,
        is_change:formValues.is_change.key,
        installed_at:formValues.installed_at?moment(formValues.installed_at).format('YYYY-MM-DD'):'',
      },
      callback: function () {
        message.success('添加用户成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          distribution_area:that.state.distribution_area,
          statistical_forms:that.state.statistical_forms,
          meter_number:that.state.meter_number,
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
        message.success('修改用户成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          distribution_area:that.state.distribution_area,
          statistical_forms:that.state.statistical_forms,
          meter_number:that.state.meter_number,
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
        message.success('删除用户成功')
        that.handleSearch({
          page: that.state.page,
          distribution_area:that.state.distribution_area,
          statistical_forms:that.state.statistical_forms,
          meter_number:that.state.meter_number,
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
    let file=this.file();
    const formValues =this.importFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    if(!formValues.file){
      message.error('请选择文件');
      return false
    }
    var formData = new FormData();
    formData.append("file", formValues.file.file);
    formData.append("meter_model_id", formValues.meter_model_id);
    formData.append("is_reset", formValues.is_reset.key);
    formData.append("concentrator_number", formValues.concentrator_number);
    const that=this;
    request(`/meter_import`, {
      method: 'POST',
      data: formData
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        message.success('导入成功');
        that.setState({
          importModal:false
        })
      }
    })
  }
  render() {
    const {members: {data, meta, loading},concentrators,meters,sider_regions,meter_models} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const resetMeterData=parseRowSpanData(data)
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          const children=renderIndex(meta,this.state.page,record.index)
          return renderRowSpan(children,record)
        }
      },
      { title: '户号', width: 80, dataIndex: 'number', key: 'number',  fixed: 'left',  render: (val, record, index) => {
        return renderRowSpan(val,record)
      } },
      { title: '用户名称', dataIndex: 'real_name', key: 'real_name' ,width: 80,   render: (val, record, index) => {
        const children= (
          <Tooltip title={val}>
            <span>{val.length>3?val.substring(0,3)+'...':val}</span>
          </Tooltip>
        )
        return renderRowSpan(children,record)
      } },
      { title: '安装地址', dataIndex: 'address', key: 'address' ,width: 150,   render: (val, record, index) => {
        const children=  (
          <Tooltip title={val}>
            <span>{val.length>10?val.substring(0,7)+'...':val}</span>
          </Tooltip>
        )
        return renderRowSpan(children,record)
      }},
      { title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number' ,width: 100, },
      { title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number' },
      { title: '水表序号', width: 80, dataIndex: 'meter_index', key: 'meter_index' },
      { title: '联系电话', dataIndex: 'phone', key: 'phone' ,width: 130,render: (val, record, index) => {
        return renderRowSpan(val,record)
      }},
      { title: '身份证号', dataIndex: 'id_card', key: 'id_card' ,width: 170,  render: (val, record, index) => {
        return renderRowSpan(val,record)
      }},
      { title: '抄表员', dataIndex: 'reader', key: 'reader',width: 120,  render: (val, record, index) => {
        return renderRowSpan(val,record)
      }},
      // { title: '台区', dataIndex: 'distribution_area', key: 'distribution_area',width: 90},
      // { title: '表册', dataIndex: 'statistical_forms', key: 'statistical_forms',width: 90,},
      { title: '用户创建时间', dataIndex: 'created_at', key: 'created_at',  render: (val, record, index) => {
        return renderRowSpan(val,record)
      }}

    ];
    if(this.state.canOperate){
      columns.push( {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 90,
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
                </span>
              }
            </p>
          )
        }
      })
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={[{name: '运行管理'}, {name: '用户档案'}]}>
              <Card bordered={false} style={{margin:'-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            village_id={this.state.village_id}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showImportBtn={this.state.showImportBtn}
                            showAddBtn={this.state.showAddBtn&&this.state.showAddBtnByCon} clickAdd={()=>this.setState({addModal:true})}
                            clickImport={()=>{this.setState({importModal:true})}}
                            changeShowOperate={()=>{this.setState({canOperate:!this.state.canOperate})}}
                    />
                  </div>
                </div>
                <Table
                  className='meter-table no-interval'
                  loading={loading}
                  rowKey={record => record.meter_number}
                  dataSource={resetMeterData}
                  columns={columns}
                  scroll={{ x: 1350,y: this.state.tableY }}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>
              </Card>
          </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          width="650px"
          title="添加用户档案"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal:false})}
        >
          <AddOREditUserArchives sider_regions={sider_regions}  wrappedComponentRef={(inst) => this.formRef = inst} concentrators={concentrators.data} meters={meters.data}  />
        </Modal>
        <Modal
          width="650px"
          key={ Date.parse(new Date())+1}
          title="编辑用户档案"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
          <AddOREditUserArchives sider_regions={sider_regions}  wrappedComponentRef={(inst) => this.editFormRef = inst} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
        </Modal>
        <Modal
          title="批量导入用户"
          visible={this.state.importModal}
          onOk={this.handleImport}
          onCancel={() => this.setState({importModal:false})}
        >
          <ImportArchives  findChildFunc={this.findChildFunc} wrappedComponentRef={(inst) => this.importFormRef = inst} meter_models={meter_models.data} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
        </Modal>
        <Modal
          key={ Date.parse(new Date())+2}
          title="换表"
          visible={this.state.changeModal}
          onOk={this.handleChangeTable}
          onCancel={() => this.setState({changeModal:false})}
        >
          <ChangeTable  wrappedComponentRef={(inst) => this.ChangeTableformRef = inst}/>
        </Modal>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
