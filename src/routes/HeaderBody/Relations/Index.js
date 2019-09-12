import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip, Row, Col, Input} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, renderIndex2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import Pagination from './../../../components/Pagination/Index'
import AddOrEditForm from './addOrEditArea'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  relations: state.relations,
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
        const {relations: {meta}} = this.props;
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
      meter_number: '',
      member_number: '',
      install_address: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
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
        village_id: village_id
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
      type: 'relations/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        const {relations: {data}} = that.props;
        that.setState({
          ...values,
        })
      }
    });
  }
  handleAdd = () => {

    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);

    this.props.dispatch({
      type: 'relations/add',
      payload: {
        ...formValues
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.relations'})}
          )
        )
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          village_id: that.state.village_id
        })
      }
    });

  }
  handleEdit = ()=> {

    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'relations/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.meter_number,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.relations'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          village_id: that.state.village_id
        })
      }
    });
  }
  handleRemove = (id)=> {
    const {intl:{formatMessage}} = this.props;
    const that = this;
    this.props.dispatch({
      type: 'relations/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.relations'})}
          )
        )
        that.handleSearch({
          village_id: that.state.village_id
          })
      }
    });
  }

  render() {
    const {relations: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {isMobile} =this.props.global;
    const columns = [
      {
        title: formatMessage({id: 'intl.water_meter_number'}),
        dataIndex: 'meter_number',
        key: 'meter_number',
        width: 150
      },
      {title: formatMessage({id: 'intl.user_number'}), dataIndex: 'member_number', key: 'member_number', width: 150},
      {title: formatMessage({id: 'intl.user_name'}), dataIndex: 'real_name', key: 'real_name', width: 200},
      {title: formatMessage({id: 'intl.install_address'}), dataIndex: 'address', key: 'address'},
    ];
    if (this.state.canOperate) {
      columns.push({
        title: formatMessage({id: 'intl.operate'}),
        width: 120,
        render: (val, record, index) => (
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
                      }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <Popconfirm placement="topRight"
                          title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                          onConfirm={()=>this.handleRemove(record.meter_number)}>
                <a href="">{formatMessage({id: 'intl.delete'})}</a>
              </Popconfirm>
            }

          </p>
        ),
      })
    }
    const Data1 = data.length > 0 ? data[0] : {}
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
                              breadcrumb={[{name: formatMessage({id: 'intl.device'})}, {name: formatMessage({id: 'intl.meter_relations'})}]}>
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
                  scroll={{y: this.state.tableY}}
                  pagination={false}
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
