import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip, Row, Col, Input} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, renderIndex2,ellipsis2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import Pagination from './../../../components/Pagination/Index'
import AddOrEditForm from './addOrEditArea'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  relations_analysis: state.relations_analysis,
  global: state.global,
}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtn: find(this.permissions, {name: 'attrition_rate_analysis'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'attrition_rate_analysis'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage: 1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll: true,
      canOperate: localStorage.getItem('canOperateArea') === 'true' ? true : false,
      expandedRowKeys: [],
      otherMeterValue: '0',
      forwardsMeterValue: '0',
      key: uuid(),
      // concentrator_number:''
    }
  }

  componentDidMount() {
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }

  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }

  scrollTable = ()=> {
    console.log('scroll')
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop', scrollTop)
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      console.log('到达底部');
      if (this.state.canLoadByScroll) {
        const {relations_analysis: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            install_address: this.state.install_address,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            // area: this.state.area
          }, true, function () {
            that.setState({
              canLoadByScroll: true,
            })
          })
        }
      }
    }
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
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    const that = this;
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number:'',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values, saveInput) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys: []
    })
    if (!saveInput) {
      this.setState({
        key: uuid()
      })
    }
    dispatch({
      type: 'relations_analysis/fetch',
      payload: {
        ...values,
        village_id: this.state.village_id
      },
      callback: function () {
        const {relations_analysis: {data}} = that.props;
        that.setState({
          ...values,
        })
      }
    });
  }

  render() {
    const {relations_analysis: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {isMobile} =this.props.global;
    const columns = [
      {
        title: formatMessage({id: 'intl.water_meter_number'}),
        dataIndex: 'meter_number',
        key: 'meter_number',
        width: 150,
      },

      {title: formatMessage({id: 'intl.user_number'}), dataIndex: 'member_number', key: 'member_number', width: 120,
        render: (val, record, index) => {
          return ellipsis2(val, 120)
        }},
      {title: formatMessage({id: 'intl.user_name'}), dataIndex: 'real_name', key: 'real_name', width: 150,
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }},
      {title:'用水量(T)', dataIndex: 'consumption', key: 'consumption', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }},
      {title:'下属分表用水总量(T)', dataIndex: 'child_consumption', key: 'child_consumption', width: 160,
        render: (val, record, index) => {
          return ellipsis2(val, 160)
        }},
      {title:'损耗量(T)', dataIndex: 'attrition_value', key: 'attrition_value', width: 80,
        render: (val, record, index) => {
          return ellipsis2(val, 80)
        }},
      {title:'损耗率', dataIndex: 'attrition_rate', key: 'attrition_rate', width: 80,
        render: (val, record, index) => {
          return ellipsis2(val, 80)
        }},
      {title: formatMessage({id: 'intl.install_address'}), dataIndex: 'address', key: 'address',
        render: (val, record, index) => {
          return ellipsis2(val, 200)
        }},
    ];
    return (
      <Layout className="layout">
        <Sider
          showConcentrator={false}
          changeArea={this.changeArea}
          changeConcentrator={this.changeConcentrator}
          siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析"
                              breadcrumb={[{name: formatMessage({id: 'intl.data_analysis'})}, {name: formatMessage({id: 'intl.meter_relations_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            handleLeak={this.handleLeak}
                            handleForward={this.handleForward}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn }
                            changeShowOperate={()=> {
                              this.setState({canOperate: !this.state.canOperate})
                            }}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.meter_number}
                  dataSource={data}
                  columns={columns}
                  scroll={{x:1100,y: this.state.tableY}}
                  pagination={false}
                  defaultExpandAllRows={true}
                  size="small"
                />
                {/*    <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}
                 handPageChange={this.handPageChange}/>*/}
              </Card>
            </PageHeaderLayout>
            <Modal
              destroyOnClose={true}
              title={formatMessage({id: 'intl.add'})}
              visible={this.state.addModal}
              onOk={this.handleAdd}
              onCancel={() => this.setState({addModal: false})}
            >
              <AddOrEditForm wrappedComponentRef={(inst) => this.formRef = inst}/>
            </Modal>
            <Modal
              destroyOnClose={true}
              title={formatMessage({id: 'intl.edit'})}
              visible={this.state.editModal}
              onOk={this.handleEdit}
              onCancel={() => this.setState({editModal: false})}
            >
              <AddOrEditForm editRecord={this.state.editRecord}
                             wrappedComponentRef={(inst) => this.editFormRef = inst}/>
            </Modal>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
