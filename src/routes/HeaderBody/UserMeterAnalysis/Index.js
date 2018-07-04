import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Badge,Tooltip } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import Detail from './Detail'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import {renderIndex} from './../../../utils/utils'
import forEach from "lodash/forEach";
import './index.less'
import config from '../../../common/config'
import { routerRedux } from 'dva/router';
import uuid from 'uuid/v4'
import {getPreDay, renderCustomHeaders,download} from './../../../utils/utils'
const {Content} = Layout;
@connect(state => ({
  member_meter_data: state.member_meter_data,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      concentrator_number: '',
      member_number: '',
      real_name: '',
      install_address: '',
      page: 1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      exportModal: false,
      edit_member_number: '',
      display_type: 'all',
      total_difference_value:'0'
    }
  }

  componentDidMount() {
    this.changeTableY()
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id
    })
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      concentrator_number: '',
      real_name: '',
      install_address: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id,
      display_type: 'all'
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number: '',
      village_id: village_id,
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        real_name:this.state.real_name,
        install_address:this.state.install_address,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,

        display_type: this.state.display_type
      },this.changeTableY)
    })

  }
  changeConcentrator = (concentrator_number, village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:'',
      concentrator_number: concentrator_number,
    },function () {
      this.handleSearch({
        page: 1,
        meter_number:this.state.meter_number,
        member_number:this.state.member_number,
        real_name: this.state.real_name,
        install_address: this.state.install_address,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,

        display_type: this.state.display_type
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number: '',
      real_name: '',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      display_type: 'all'
    })
  }

  handleSearch = (values,cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'member_meter_data/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if(cb) cb()
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      install_address: this.state.install_address,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type: this.state.display_type
      // area: this.state.area
    })
  }

  handleEdit = () => {
    this.setState({
      editModal: false,
    });
  }
  operate = (record)=> {
    this.setState({
      edit_meter_number: record.meter_number,
      editModal: true
    })
  }
  exportCSV = ()=> {
    const that = this;
    this.props.dispatch({
      type: 'member_meter_data/exportCSV',
      payload: {
        village_id: this.state.village_id,
        ended_at: that.state.ended_at,
        started_at: that.state.started_at,
      },
      callback: function (download_key) {
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
  }

  findChildFunc = (cb)=> {
    this.cards = cb
  }

  render() {
    const {member_meter_data: {data, meta, loading}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const parseHeader = renderCustomHeaders(meta.custom_headers,meta,this.state.page)
    let  custom_width = parseHeader.custom_width;
    const custom_headers = parseHeader.custom_headers;
    custom_width+=120;
    custom_headers.push(
      {
        title: '水表历史状况',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}>详细信息</Button>
            </div>
          )
        }
      }
    )
  console.log('custom_headers',custom_headers)
  /*  const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
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
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number', fixed: 'left',},
      {title: '水表编号', dataIndex: 'meter_number', key: 'meter_number', width: 100,},
      {title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name'},
      {title: '用户地址', dataIndex: 'install_address', key: 'install_address', width: 130,
        render: (val, record, index) => {
          return (
            <Tooltip title={val}>
              <span>{val.length>10?val.substring(0,7)+'...':val}</span>
            </Tooltip>
          )
        }},
      {title: '应收水量', dataIndex: 'difference_value', key: 'difference_value', width: 80},
      {title: '本次抄见', dataIndex: 'latest_value', key: 'latest_value', width: 100,},
      {title: '本次抄见时间', dataIndex: 'latest_collected_at', key: 'latest_collected_at', width: 150},
      {title: '上次抄见', dataIndex: 'previous_value', key: 'previous_value', width: 100,},
      {title: '上次抄见时间', dataIndex: 'previous_collected_at', key: 'previous_collected_at', width: 150},
      {
        title: '状态', dataIndex: 'status', key: 'status', width: 70,
        render: (val, record, index) => {
          let status='success';
          switch (val){
            case -2:
              status='error'
              break;
            case -1:
              status='warning'
              break;
            default:
              status='success'
          }
          return (
            <p>
              <Badge status={status}/>{record.status_explain}
            </p>
          )
        }
      },
      {title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number', width: 100,},
      {title: '水表厂商', dataIndex: 'meter_manufacturer_name', key: 'meter_manufacturer_name', width: 90,},
      {title: '抄表员', dataIndex: 'reader', key: 'reader',},
      {
        title: '查询历史状况',
        key: 'operation',
        fixed: 'right',
        width: 110,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}>详细信息</Button>
            </div>
          )
        }
      },
    ];*/
    const {dispatch} =this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '水表水量分析'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search  wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            exportCSV={this.exportCSV}
                            export={()=> {
                              this.setState({
                                exportModal: true
                              })
                            }}
                            setExport={()=>{
                              dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/member_meter_setup`));
                            }}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}
                             total_difference_value={meta.aggregator.total_difference_value }/>
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if (record.status === -2) {
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={custom_headers}
                  scroll={{x: custom_width,y: this.state.tableY}}//, y: this.state.tableY
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          width="750px"
          key={ Date.parse(new Date())}
          title={`水表 ${this.state.edit_meter_number} 详细信息`}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <Detail meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                  started_at={this.state.started_at}/>
        </Modal>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
