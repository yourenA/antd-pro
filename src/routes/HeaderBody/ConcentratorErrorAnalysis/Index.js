import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Badge  , Layout,message,Modal,Button } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
const { Content} = Layout;
@connect(state => ({
  concentrator_errors: state.concentrator_errors,
  manufacturers: state.manufacturers,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(localStorage.getItem('permissions')) || JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon:false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY:0,
      manufacturer_id: '',
      page: 1,
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at:'',
      ended_at:'',
      village_id: '',
      editModal:false,
      changeModal:false,
      member_number:''
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return:'all'
      }
    });
  }

  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id,
      concentrator_number:null
    })
    this.handleSearch({
      page: 1,
      manufacturer_id: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    this.searchFormRef.props.form.resetFields();
    this.setState({
      manufacturer_id:'',
      concentrator_number:null
    },function () {
      this.handleSearch({
        page: 1,
        started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        village_id: village_id
      })
    })

  }
  changeConcentrator = (concentrator_number,village_id)=> {
    this.searchFormRef.props.form.resetFields()
    this.setState({
      concentrator_number:concentrator_number,
      manufacturer_id:'',
    })
    this.handleSearch({
      page: 1,
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id:village_id,
      concentrator_number:concentrator_number
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      manufacturer_id: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrator_errors/fetch',
      payload: {
        concentrator_number:this.state.concentrator_number?this.state.concentrator_number:'',
        village_id: values.village_id? values.village_id:this.state.village_id,
        ...values,
      },
      callback:function () {
        that.setState({
          ...values,
          village_id: values.village_id? values.village_id:that.state.village_id,
          started_at: values.started_at,
          ended_at: values.ended_at,
        })
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      manufacturer_id: this.state.manufacturer_id,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      // area: this.state.area
    })
  }
  renderStatus=(code)=>{
    if(code===1){
      return(
        <Badge status="success"/>
      )
    }else if(code===-1){
      return(
        <Badge status="error"/>
      )
    }else if(code===-2){
      return(
        <Badge status="warning"/>
      )
    }else{
      return null
    }
  }
  render() {
    const {concentrator_errors: {data, meta, loading},manufacturers} = this.props;
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
        fixed: 'left',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '集中器编号', width: 150, dataIndex: 'concentrator_number', key: 'concentrator_number', fixed: 'left',},
      {title: '生产厂商', width: 150, dataIndex: 'manufacturer_name', key: 'manufacturer_name'},
      {title: '安装位置', dataIndex: 'install_address', key: 'install_address', width: 150,},
      {title: '日期', dataIndex: 'date', key: 'date',},
      {title: '0', dataIndex: 'address', key: '0', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[0])
      }},
      {title: '1', dataIndex: 'address', key: '1', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[1])
      }},
      {title: '2', dataIndex: 'address', key: '2', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[2])
      }},
      {title: '3', dataIndex: 'address', key: '3', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[3])
      }},
      {title: '4', dataIndex: 'address', key: '4', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[4])
      }},
      {title: '5', dataIndex: 'address', key: '5', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[5])
      }},
      {title: '6', dataIndex: 'address', key: '6', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[6])
      }},
      {title: '7', dataIndex: 'address', key: '7', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[7])
      }},
      {title: '8', dataIndex: 'address', key: '8', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[8])
      }},
      {title: '9', dataIndex: 'address', key: '9', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[9])
      }},
      {title: '10', dataIndex: 'address', key: '10', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[10])
      }},
      {title: '11', dataIndex: 'address', key: '11', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[11])
      }},
      {title: '12', dataIndex: 'address', key: '12', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[12])
      }},
      {title: '13', dataIndex: 'address', key: '13', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[13])
      }},
      {title: '14', dataIndex: 'address', key: '14', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[14])
      }},
      {title: '15', dataIndex: 'address', key: '15', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[15])
      }},
      {title: '16', dataIndex: 'address', key: '16', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[16])
      }},
      {title: '17', dataIndex: 'address', key: '17', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[17])
      }},
      {title: '18', dataIndex: 'address', key: '18', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[18])
      }},
      {title: '19', dataIndex: 'address', key: '19', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[19])
      }},
      {title: '20', dataIndex: 'address', key: '20', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[20])
      }},
      {title: '21', dataIndex: 'address', key: '21', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[21])
      }},
      {title: '22', dataIndex: 'address', key: '22', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[22])
      }},
      {title: '23', dataIndex: 'address', key: '23', width: 40, render: (val, record, index) => {
        return this.renderStatus(record.is_onlines[23])
      }},
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '集中器异常分析'}]}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            manufacturers={manufacturers.data}
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
                  className='meter-table error-analysis'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{ x: 1600, y: this.state.tableY }}
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
      </Layout>
    );
  }
}

export default UserMeterAnalysis
