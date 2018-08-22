import React, {PureComponent} from 'react';
import { Table , Card, Popconfirm , Layout,message,Modal,Tooltip,Badge,Button  } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOREditUserArchives from './addOREditUserArchives'
import ImportArchives from './ImportUserArchives'
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
      showImportBtn: find(this.permissions, {name: 'member_delete'}),
      showExportBtn: find(this.permissions, {name: 'member_export'}),
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
        message.success('修改用户成功')
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
        message.success('删除用户成功')
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
    console.log('formValues',formValues)
    if(!formValues.file){
      message.error('请选择文件');
      this.setState({
        canImport:true
      })
      return false
    }

    var formData = new FormData();
    formData.append("file", formValues.file.file);
    formData.append("meter_model_id", formValues.meter_model_id);
    formData.append("is_reset", formValues.is_reset.key);
    formData.append("concentrator_number", formValues.concentrator_number);
    formData.append("village_id", formValues.village_id[formValues.village_id.length - 1]);
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
        that.handleFormReset()
      }
      that.setState({
        canImport:true
      })
    })
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
    const {members: {data, meta, loading},concentrators,meters,sider_regions,meter_models,dma} = this.props;
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
          const children=renderIndex(meta,this.state.initPage,record.index)
          return renderRowSpan(children,record)
        }
      },
      { title: '户号', width: 80, dataIndex: 'number', key: 'number',  fixed: 'left',  render: (val, record, index) => {
        const children= (
          ellipsis2(val, 80)
        )
        return renderRowSpan(children,record)
      } },
      { title: '用户名称', dataIndex: 'real_name', key: 'real_name' ,width: 80,   render: (val, record, index) => {
        const children= (
          ellipsis2(val, 80)
        )
        return renderRowSpan(children,record)
      } },
      { title: '安装地址', dataIndex: 'address', key: 'address' ,width: 100,   render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 100)
        )
        return renderRowSpan(children,record)
      }},
      { title: '身份证号', dataIndex: 'id_card', key: 'id_card' ,width: 170,  render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 170)
        )
        return renderRowSpan(children,record)
      }},
      { title: '联系电话', dataIndex: 'phone', key: 'phone' ,width: 130,render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 130)
        )
        return renderRowSpan(children,record)
      }},
      { title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number' ,width: 100, },
      { title: '水表编号', width: 110, dataIndex: 'meter_number', key: 'meter_number',render: (val, record, index) => {
        return ellipsis2(val, 110)
      } },
      { title: '水表序号', width: 80, dataIndex: 'meter_index', key: 'meter_index' },
      {
        title: '水表状态', dataIndex: 'status', key: 'status', width: 80,
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
      {title: '开始使用日期', width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '开始使用时读数', width: 120, dataIndex: 'enabled_value', key: 'enabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '停止使用日期', width: 120, dataIndex: 'disabled_date', key: 'disabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: '停止使用时读数', width: 120, dataIndex: 'disabled_value', key: 'disabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},

      // { title: '台区', dataIndex: 'distribution_area', key: 'distribution_area',width: 90},
      // { title: '表册', dataIndex: 'statistical_forms', key: 'statistical_forms',width: 90,},
      { title: '用户创建时间', dataIndex: 'created_at', key: 'created_at', width: 150, render: (val, record, index) => {
        const children= (
          ellipsis2(val, 150)
        )
        return renderRowSpan(children,record)
      }},
      { title: '抄表员', dataIndex: 'reader', key: 'reader',  render: (val, record, index) => {
        return renderRowSpan(val,record)
      }}

    ];
    const operate={
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 90,
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
                      }}>编辑</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <span>
                  <Popconfirm placement="topRight" title={ <div><p>确定要删除吗?</p><p style={{color:'red'}}>删除后关联的水表也会被删除！</p></div>}
                              onConfirm={()=>this.handleRemove(record.id)}>
                  <a href="">删除</a>
                </Popconfirm>
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
    const company_code = sessionStorage.getItem('company_code');
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
                            per_page={this.state.per_page}
                            exportCSV={this.exportCSV}
                            setExport={()=>{
                              dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/export_setup?type=2`));
                            }}
                            showConfigBtn={this.state.showConfigBtn}
                            showExportBtn={this.state.showExportBtn}
                            showAddBtn={this.state.showAddBtn&&this.state.showAddBtnByCon} clickAdd={()=>this.setState({addModal:true})}
                            clickImport={()=>{this.setState({importModal:true})}}
                            changeShowOperate={()=>{this.setState({canOperate:!this.state.canOperate})}}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={resetMeterData} columns={columns} rowKey={record => record.myId}
                                 scroll={{x: 2500, y: this.state.tableY}}
                                 history={this.props.history}
                                 canOperate={this.state.canOperate}
                                 operate={operate}
                                 className={'meter-table no-interval'}
                                 />
               {/* <Table
                  className='meter-table no-interval'
                  loading={loading}
                  rowKey={record => record.myId}
                  dataSource={resetMeterData}
                  columns={columns}
                  scroll={{ x: 1900,y: this.state.tableY }}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
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
          <AddOREditUserArchives sider_regions={sider_regions}  wrappedComponentRef={(inst) => this.formRef = inst} concentrators={concentrators.data} meters={meters.data}   />
        </Modal>
        <Modal
          width="650px"
          key={ Date.parse(new Date())+1}
          title="编辑用户档案"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
          <AddOREditUserArchives sider_regions={sider_regions}  wrappedComponentRef={(inst) => this.editFormRef = inst} concentrators={concentrators.data} meters={meters.data}    editRecord={this.state.editRecord} />
        </Modal>
        <Modal
          title="批量导入用户"
          visible={this.state.importModal}
          onCancel={() => this.setState({importModal:false,canImport:true})}
          //onOk={this.handleImport}
          footer={[
            <Button key="back" onClick={() => this.setState({importModal:false})}>取消</Button>,
            <Button key="submit" type="primary" disabled={!this.state.canImport} onClick={this.handleImport}>
              确认
            </Button>,
          ]}
        >
          <ImportArchives dma={dma} sider_regions={sider_regions}  findChildFunc={this.findChildFunc} wrappedComponentRef={(inst) => this.importFormRef = inst} meter_models={meter_models.data} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
        </Modal>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
