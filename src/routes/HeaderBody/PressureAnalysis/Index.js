import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Row, Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import debounce from 'lodash/throttle'
import {ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import uuid from 'uuid/v4'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import PressureChart from './PressureChart.js'
import request from '../../../utils/request';

const {Content} = Layout;
@connect(state => ({
  pressure_analysis: state.pressure_analysis,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      query: '',
      pressure_sensor_number: '',
      member_number: '',
      real_name: '',
      install_address: '',
      page: 1,
      initPage: 1,
      initDate:moment(moment().add(-1, 'days'), 'YYYY-MM-DD'),
      date: moment().add(-1, 'days').format('YYYY-MM-DD'),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      per_page: 30,
      canLoadByScroll: true,
      data:[],
      minimum_pressure_value:0,
      maximum_pressure_value:0
    }
  }

  componentDidMount() {
    this.changeTableY();
    document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const that = this;
    request(`/configs?groups[]=pressure_sensor_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        minimum_pressure_value: find(response.data.data, function (o) {
          return o.name === 'minimum_pressure_value'
        }).value,
        maximum_pressure_value: find(response.data.data, function (o) {
          return o.name === 'maximum_pressure_value'
        }).value,
      })

    })

  }

  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
  }

  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {pressure_analysis: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page: this.state.per_page,

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
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5 +370)
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      showAddBtnByCon: false,
      village_id: village_id,
      concentrator_number: ''
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        pressure_sensor_number: this.state.pressure_sensor_number,
        member_number: this.state.member_number,
        real_name: this.state.real_name,
        install_address: this.state.install_address,
        per_page: this.state.per_page
        // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),

      })
    })

  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number,
      showAddBtnByCon: true,
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        date:this.state.date,
        pressure_sensor_number: this.state.pressure_sensor_number,
        per_page: this.state.per_page
        // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page: 30,
      pressure_sensor_number: '',
      date: moment(new Date()).format('YYYY-MM-DD'),
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'pressure_analysis/fetchAndPush' : 'pressure_analysis/fetch',
      payload: {
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        ...values,
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
        if (cb) cb()
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      pressure_sensor_number: this.state.pressure_sensor_number,
      per_page: this.state.per_page,
      date:this.state.date
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page: per_page,
      pressure_sensor_number: this.state.pressure_sensor_number,
      date:this.state.date
    })
  }

  render() {
    const {pressure_analysis: { data,meta, loading}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      {title: '压力传感器编号', width: 150, dataIndex: 'pressure_sensor_number', key: 'pressure_sensor_number',
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }},
      {title: '集中器号', width: 150, dataIndex: 'concentrator_number', key: 'concentrator_number',},
      {title: '当前数据日期', width: 150, dataIndex: 'date', key: 'date',},
      {
        title: '传感器上传时间', dataIndex: 'uploaded_at', key: 'uploaded_at',
      },
    ];
    return (
      <Layout className="layout">
        <Sider cantSelectArea={true} changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '数据分析'}, {name: '压力传感器历史分析'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initDate={this.state.initDate}
                            village_id={this.state.village_id}
                            per_page={this.state.per_page}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Row >
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <ResizeableTable loading={loading} customIndex={true}  initPage={this.state.initPage}
                                     dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                     history={this.props.history}
                                     scroll={{ y: this.state.tableY}}/>
                  </Col>
                  <Col  xs={24} sm={24} md={24} lg={24}  xl={24}>
                    <PressureChart data={data} maximum_pressure_value={this.state.maximum_pressure_value} minimum_pressure_value={this.state.minimum_pressure_value}/>
                  </Col>
                </Row>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
