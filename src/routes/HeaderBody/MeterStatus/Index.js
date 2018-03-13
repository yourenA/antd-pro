import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Popconfirm , Layout,message,Modal} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOREditUserArchives from './addOREditUserArchives'
import Sider from './../Sider'
import {connect} from 'dva';
import ChangeTable from './ChangeTable'
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
const { Content} = Layout;
@connect(state => ({
  meter_status: state.meter_status,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon:false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY:0,
      query: '',
      page: 1,
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at:'',
      ended_at:'',
      village_id: '',
      editModal:false,
      changeModal:false,
      area: '',
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
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
    this.searchFormRef.props.form.resetFields();
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
      showAddBtnByCon:true,
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
      meter_number:'',
      distribution_area:'',
      statistical_forms:''
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_status/fetch',
      payload: {
        concentrator_number:this.state.concentrator_number?this.state.concentrator_number:'',
        village_id: values.village_id? values.village_id:this.state.village_id,
        ...values,
      },
      callback:function () {
        that.setState({
          ...values,
          village_id: values.village_id? values.village_id:that.state.village_id,
        })
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
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
      type: 'meter_status/add',
      payload: {
        ...formValues,
        is_change:formValues.is_change.key,
        installed_at:formValues.installed_at?moment(formValues.installed_at).format('YYYY-MM-DD'):'',
        village_id: this.state.village_id,
        concentrator_number:this.state.concentrator_number
      },
      callback: function () {
        message.success('添加用户成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
      }
    });
  }
  handleEdit = () => {
    const that = this;
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'meter_status/edit',
      payload: {
        ...formValues,
        village_id: this.state.village_id,
        id:this.state.editRecord.id
      },
      callback: function () {
        message.success('修改用户成功')
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
      type: 'meter_status/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除用户成功')
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
        })
      }
    });
  }
  handleChangeTable=()=>{
    const formValues =this.ChangeTableformRef.props.form.getFieldsValue();
    console.log(formValues)
  }
  render() {
    const {meter_status: {data, meta, loading},concentrators,meters} = this.props;
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      { title: '水表编号', width: '20%', dataIndex: 'meter_number', key: 'meter_number', },
      { title: '用户名称', width: '20%', dataIndex: 'real_name', key: 'real_name' },
      { title: '安装地址', dataIndex: 'install_address', key: 'install_address' ,width: '20%', },
      { title: '安装时间', dataIndex: 'installed_at', key: 'installed_at' ,width: '20%',},
      { title: '年限', dataIndex: 'service_life', key: 'service_life' },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '户表使用年限'}]}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            village_id={this.state.village_id}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn&&this.state.showAddBtnByCon} clickAdd={()=>this.setState({addModal:true})}/>
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
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{y: this.state.tableY }}
                  pagination={false}
                  size="small"
                />
                <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                            current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                            style={{marginTop: '10px'}} onChange={this.handPageChange}/>
              </Card>
          </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          key={ Date.parse(new Date())}
          title="添加用户档案"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal:false})}
        >
        </Modal>
        <Modal
          key={ Date.parse(new Date())+1}
          title="编辑用户档案"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
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
