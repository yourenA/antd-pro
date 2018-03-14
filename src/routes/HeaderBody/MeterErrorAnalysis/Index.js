import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
const {Content} = Layout;
@connect(state => ({
  manufacturers: state.manufacturers,
  meter_errors: state.meter_errors
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      manufacturer_id: '',
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
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
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
      manufacturer_id: '',
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
        manufacturer_id: '',
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
      manufacturer_id: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id,
      concentrator_number: concentrator_number
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
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_errors/fetch',
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
      manufacturer_id: this.state.manufacturer_id,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  render() {
    const {meter_errors: {data, meta, loading}, manufacturers} = this.props;
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
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number', fixed: 'left',},
      {title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number',},
      {title: '用户名称', width: 150, dataIndex: 'real_name', key: 'real_name'},
      {
        title: '异常类型', width: 150, dataIndex: 'status', key: 'status'
        , render: (val, record, index) => (
        <p>
          <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}
        </p>
      )
      },
      {title: '用水量', width: 150, dataIndex: 'consumption', key: 'consumption'},
      {title: '日期', dataIndex: 'date', width: 150,  key: 'date',},
      {title: '当日阀值', width: 150, dataIndex: 'threshold', key: 'threshold'},
      {title: '超出阀值',dataIndex: 'beyond_threshold', key: 'beyond_threshold'},

    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '水表异常分析'}]}>
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            manufacturers={manufacturers.data}
                            village_id={this.state.village_id}
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
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1250, y: this.state.tableY}}
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
