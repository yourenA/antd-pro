import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Popconfirm, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import Detail from './Detail'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import axios from 'axios'
import config from '../../../common/config'
import {download} from '../../../utils/utils'
const {Content} = Layout;
@connect(state => ({
  member_meter_data: state.member_meter_data,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(localStorage.getItem('permissions')) || JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      only_show_unusual: -1,
      real_name: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      member_number: ''
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
      meter_number: '',
      only_show_unusual: -1,
      real_name: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    this.searchFormRef.props.form.resetFields();
    this.setState({
      showAddBtnByCon: false,
      concentrator_number: null
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: '',
        only_show_unusual: -1,
        real_name: '',
        started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        village_id: village_id
      })
    })

  }
  changeConcentrator = (concentrator_number, village_id)=> {
    this.searchFormRef.props.form.resetFields()
    this.setState({
      concentrator_number: concentrator_number,
      showAddBtnByCon: true,
    })
    this.handleSearch({
      page: 1,
      meter_number: '',
      only_show_unusual: -1,
      real_name: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id,
      concentrator_number: concentrator_number
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      only_show_unusual: -1,
      real_name: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'member_meter_data/fetch',
      payload: {
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: values.village_id ? values.village_id : this.state.village_id,
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
          village_id: values.village_id ? values.village_id : that.state.village_id,
          started_at: values.started_at,
          ended_at: values.ended_at,
        })
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      only_show_unusual: this.state.only_show_unusual,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'member_meter_data/add',
      payload: {
        ...formValues,
        is_change: formValues.is_change.key,
        installed_at: formValues.installed_at ? moment(formValues.installed_at).format('YYYY-MM-DD') : '',
        village_id: this.state.village_id,
        concentrator_number: this.state.concentrator_number
      },
      callback: function () {
        message.success('添加用户成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          meter_number: that.state.meter_number,
          only_show_unusual: that.state.only_show_unusual,
          real_name: that.state.real_name,
          ended_at: that.state.ended_at,
          started_at: that.state.started_at,
        })
      }
    });
  }
  handleEdit = () => {
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'member_meter_data/edit',
      payload: {
        ...formValues,
        village_id: this.state.village_id,
        id: this.state.editRecord.id
      },
      callback: function () {
        message.success('修改用户成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          meter_number: that.state.meter_number,
          only_show_unusual: that.state.only_show_unusual,
          real_name: that.state.real_name,
          ended_at: that.state.ended_at,
          started_at: that.state.started_at,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'member_meter_data/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除用户成功')
        that.handleSearch({
          page: that.state.page,
          meter_number: that.state.meter_number,
          only_show_unusual: that.state.only_show_unusual,
          real_name: that.state.real_name,
          ended_at: that.state.ended_at,
          started_at: that.state.started_at,
        })
      }
    });
  }
  handleChangeTable = ()=> {
    const formValues = this.ChangeTableformRef.props.form.getFieldsValue();
    console.log(formValues)
  }
  operate = (record)=> {
    this.setState({
      member_number: record.member_number,
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

  render() {
    const {member_meter_data: {data, meta, loading}} = this.props;
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
      {title: '户号', width: 150, dataIndex: 'member_number', key: 'member_number', fixed: 'left',},
      {title: '用户名称', width: 150, dataIndex: 'real_name', key: 'real_name'},
      {title: '用户地址', dataIndex: 'install_address', key: 'install_address', width: 180,},
      {title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number', width: 140,},
      {title: '水表编号', dataIndex: 'meter_number', key: 'meter_number', width: 140,},
      {title: '水表厂商', dataIndex: 'meter_manufacturer_name', key: 'meter_manufacturer_name', width: 120,},
      {title: '上次读数(T)', dataIndex: 'previous_value', key: 'previous_value', width: 100,},
      {title: '上次读数时间', dataIndex: 'previous_collected_at', key: 'previous_collected_at', width: 180},
      {title: '本次读数(T)', dataIndex: 'latest_value', key: 'latest_value', width: 100,},
      {title: '本次读数时间', dataIndex: 'latest_collected_at', key: 'latest_collected_at', width: 180},
      {title: '用水量(T)', dataIndex: 'difference_value', key: 'difference_value', width: 100},
      {title: '状态', dataIndex: 'status_explain', key: 'status_explain', width: 100},
      {title: '抄表员', dataIndex: 'reader', key: 'reader', width: 120},
      {title: '台区', dataIndex: 'distribution_area', key: 'distribution_area', width: 100},
      {title: '表册', dataIndex: 'statistical_forms', key: 'statistical_forms'},
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
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '户表水量分析'}]}>
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            exportCSV={this.exportCSV}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if (record.description === '') {
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.member_number}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 2150, y: this.state.tableY}}
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
          width="750px"
          key={ Date.parse(new Date())}
          title={`${this.state.member_number} 详细信息`}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <Detail member_number={this.state.member_number} ended_at={this.state.ended_at} started_at={this.state.started_at}/>
        </Modal>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
