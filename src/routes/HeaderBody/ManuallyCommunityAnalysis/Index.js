import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Alert, Button, Tooltip, Row, Input, Tabs} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import HistorySearch from './HistorySearch'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'

import {getPreDay, parseHistory, renderErrorData, renderIndex2} from './../../../utils/utils'
import uuid from 'uuid/v4'
const {Content} = Layout;
const TabPane = Tabs.TabPane;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  manually_monitoring_meter_data: state.manually_monitoring_meter_data,
  global: state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showSyncBtn: find(this.permissions, {name: 'monitoring_meter_sync'}),
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage: 1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      history_started_at: '',
      history_ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll: true,
      expandedRowKeys: [],
      expandedHistoryRowKeys:[],
      otherMeterValue: '0',
      forwardsMeterValue: '0',
      key: uuid()

      // concentrator_number:''
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.manually_monitoring_meter_data.historyData !== this.props.manually_monitoring_meter_data.historyData) {
      console.log('nextProps.manually_monitoring_meter_data.historyData',nextProps.manually_monitoring_meter_data.historyData.children)
      console.log('改变')
    }
  }

  changeArea = (village_id)=> {
    console.log('changeArea')
    // this.searchFormRef.props.form.resetFields();
    const that = this;
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      }, false, function () {
      })
      console.log('...........')
      this.handleSearchHistory({
        page: 1,
        started_at: this.state.history_started_at ? this.state.history_started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.history_ended_at ? this.state.history_ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      }, false, function () {
      })

    })
  }
  delayering = (data, layer = 0)=> {
    if (!data) return null;
    return data.map((item) => {
      item.layer = layer
      if (item.children) {
        this.setState({
          expandedRowKeys: [item.village_id, ...this.state.expandedRowKeys]
        })
        return this.delayering(item.children, layer + 1)
      }
      return item
    });
  }
  historyDelayering = (data, layer = 0)=> {
    if (!data) return null;
    return data.map((item) => {
      item.layer = layer
      if (item.children) {
        this.setState({
          expandedHistoryRowKeys: [item.uuid, ...this.state.expandedHistoryRowKeys]
        })
        return this.historyDelayering(item.children, layer + 1)
      }
      return item
    });
  }
  handleSearch = (values, saveInput) => {
    console.log('handleSearch')
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys: []
    })

    dispatch({
      type: 'manually_monitoring_meter_data/fetch',
      payload: {
        ...values,
        // others: values.others ? values.others : [],
        // forwards: values.forwards ? values.forwards : [],
        // concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        is_manually: 1
      },
      callback: function () {
        const {manually_monitoring_meter_data: {data}} = that.props;
        if (!saveInput) {
          that.setState({
            key: uuid()
          })
        }
        that.delayering(data);
        that.setState({
          ...values,
        })
      }
    });
  }


  handleSearchHistory = (values, saveInput) => {
    const that = this;
    const {dispatch} = this.props;
    console.log('values', values)
    this.setState({
      expandedRowKeys: []
    })
    dispatch({
      type: 'manually_monitoring_meter_data/fetchHistory',
      payload: {
        ...values,
        village_id: this.state.village_id ? this.state.village_id : '',
        is_manually: 1
      },
      callback: function () {
        const {manually_monitoring_meter_data: {historyData}} = that.props;
        that.historyDelayering(historyData);
        that.setState({
          history_started_at: values.started_at,
          history_ended_at: values.ended_at,
        })
      }
    });
  }

  handleLeak = (is_save, value)=> {
    let tbodyRow = document.querySelectorAll('.compute-table .ant-table-row');
    let others = [];
    let forwards = [];
    let village_items = [];
    console.log('tbodyRow', tbodyRow)
    for (let i = 0; i < tbodyRow.length; i++) {
      let memberInput = tbodyRow[i].querySelectorAll('input.ant-input')[0];
      let forwardsInput = tbodyRow[i].querySelectorAll('input.ant-input')[1];
      let othersInput = tbodyRow[i].querySelectorAll('input.ant-input')[2];
      let inputHidden = tbodyRow[i].querySelector('input.hidden');
      if(memberInput.value===''||forwardsInput.value===''||othersInput.value===''){
        console.log('存在空');
        message.error('输入框不能为空')
        return false
      }
      others.push({value: othersInput.value, village_id: inputHidden.value})
      forwards.push({value: forwardsInput.value, village_id: inputHidden.value})
      village_items.push({
        member_count: memberInput.value,
        other_value: othersInput.value,
        forward_value: forwardsInput.value,
        village_id: inputHidden.value
      })
    }
    console.log('village_items', village_items)
    this.handleSearch({
      ...value,
      // others: others,
      // forwards:forwards,
      is_save: is_save,
      village_items: village_items
      // area: this.state.area
    }, true)
  }

  render() {
    const {manually_monitoring_meter_data: {data, historyData, loading, historyLoading}, concentrators, meters} = this.props;
    const {intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const columns = [
      {
        title: '小区名称', dataIndex: 'village_name', key: 'village_name', width: 180,
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (

            <span style={{color: record.is_village === -1 ? `#1890ff` : 'rgba(0, 0, 0, 0.65)'}}>{val}</span>
          )
        }
      },
      {
        title: '用户数量', dataIndex: 'member_count', key: 'member_count', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <div><Input disabled={record.is_village === 1 ? true : false} onChange={()=> {
          }} defaultValue={val} size="small"/></div>
        )
      }
      },
      {
        title: '进水量(T)', dataIndex: 'forward_value', key: 'forward_value', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <div><Input disabled={record.is_village === 1 ? true : false} onChange={()=> {
          }} defaultValue={val} size="small"/></div>
        )
      }
      },
      {
        title: '其他水表水量', dataIndex: 'other_value', key: 'other_value', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <div><Input disabled={record.is_village === 1 ? true : false} onChange={()=> {
          }} defaultValue={val} size="small"/><input type="hidden" className="hidden"
                                                     value={record.village_id}/></div>
        )
      }
      },

      {
        title: '漏损量',
        dataIndex: 'attrition_value',
        key: 'attrition_value',
        width: 120,
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (
            record.is_village === 1 ? '-' : <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
          )
        }
      },
      {
        title: '漏损率', dataIndex: 'attrition_rate', key: 'attrition_rate', render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          record.is_village === 1 ?'-':<p style={{marginLeft: `${parseInt(record.layer) * 25}px`}}><span style={{
            padding: '0 5px',
            borderRadius: '3px',
            color: `${parseFloat(val) ? '#fff' : '#000'}`,
            background: `${parseFloat(val) ? parseFloat(val) > 10 ? 'red' : '#e90' : '#transparent'}`
          }}>{val}</span></p>
        )
      }
      },

    ];
    const historyColumns = [
      {
        title: '小区名称', dataIndex: 'village_name', key: 'village_name', width: 180,
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (
            <span style={{color: record.is_village === -1 ? `#1890ff` : 'rgba(0, 0, 0, 0.65)',paddingLeft: `${parseInt(record.village_ids.length-2) * 25}px`}}>{val}</span>
          )
        }
      },
      {
        title: '开始日期', dataIndex: 'started_at', key: 'started_at', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },
      {
        title: '结束日期', dataIndex: 'ended_at', key: 'ended_at', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },
      {
        title: '用户数量', dataIndex: 'member_count', key: 'member_count', width: 100, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },
      {
        title: '进水量(T)', dataIndex: 'forward_value', key: 'forward_value', width: 100, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },
      {
        title: '其他水表水量', dataIndex: 'other_value', key: 'other_value', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },

      {
        title: '漏损量',
        dataIndex: 'attrition_value',
        key: 'attrition_value',
        width: 120,
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (
            <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
          )
        }
      },
      {
        title: '漏损率', dataIndex: 'attrition_rate', key: 'attrition_rate', render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <p style={{marginLeft: `${parseInt(record.layer) * 25}px`}}><span style={{
            padding: '0 5px',
            borderRadius: '3px',
            color: `${parseFloat(val) ? '#fff' : '#000'}`,
            background: `${parseFloat(val) ? parseFloat(val) > 10 ? 'red' : '#e90' : '#transparent'}`
          }}>{val}</span></p>
        )
      }
      },


    ];
    return (
      <Layout className="layout">
        <Sider
          onlyShowOneLevel={true}
          showConcentrator={false}
          changeArea={this.changeArea}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '数据分析'}, {name: '小区水量分析(手工)'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs defaultActiveKey="1" tabBarExtraContent={<Alert message="蓝色名称为手工录入监控表" type="info" showIcon/>}>
                  <TabPane tab="计算漏损率" key="1">
                    <div className='tableList'>
                      <div className='tableListForm'>
                        <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                initRange={this.state.initRange}
                                village_id={this.state.village_id}
                                handleLeak={this.handleLeak}
                                handleAddData={()=> {
                                  this.setState({
                                    addModal: true
                                  })
                                }}
                                handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                                clickAdd={()=>this.setState({addModal: true})}/>
                      </div>
                    </div>
                    <Table
                      key={this.state.key}
                      className='compute-table  meter-table'
                      loading={loading}
                      rowKey={record => record.village_id}
                      dataSource={data}
                      expandedRowKeys={this.state.expandedRowKeys}
                      onExpand={(expanded, record)=> {
                        const index = Array.indexOf(this.state.expandedRowKeys, record.village_id);
                        if (expanded) {
                          this.setState(
                            update(this.state, {
                              expandedRowKeys: {
                                $push: [record.village_id],
                              },
                            }),
                          )
                        } else {
                          this.setState(
                            update(this.state, {
                              expandedRowKeys: {
                                $splice: [[index, 1]],
                              },
                            }),
                          )
                        }

                      }}
                      columns={columns}
                      scroll={{x: 900, y: this.state.tableY}}
                      pagination={false}
                      size="small"
                    />
                  </TabPane>
                  <TabPane tab="查询数据库历史漏损率" key="2" forceRender={true}>
                    <div className='tableList'>
                      <div className='tableListForm'>
                        <HistorySearch wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                       initRange={this.state.initRange}
                                       village_id={this.state.village_id}
                                       handleLeak={this.handleLeak}
                                       handleAddData={()=> {
                                         this.setState({
                                           addModal: true
                                         })
                                       }}
                                       handleSearch={this.handleSearchHistory} handleFormReset={this.handleFormReset}
                                       showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                                       clickAdd={()=>this.setState({addModal: true})}/>
                      </div>
                    </div>
                    <Table
                      className='meter-table'
                      loading={historyLoading}
                      rowKey={record => record.uuid}
                      dataSource={historyData}
                      expandedRowKeys={this.state.expandedHistoryRowKeys}
                      onExpand={(expanded, record)=> {
                        const index = Array.indexOf(this.state.expandedHistoryRowKeys, record.uuid);
                        if (expanded) {
                          this.setState(
                            update(this.state, {
                              expandedHistoryRowKeys: {
                                $push: [record.uuid],
                              },
                            }),
                          )
                        } else {
                          this.setState(
                            update(this.state, {
                              expandedHistoryRowKeys: {
                                $splice: [[index, 1]],
                              },
                            }),
                          )
                        }

                      }}
                      columns={historyColumns}
                      scroll={{x: 1100, y: this.state.tableY}}
                      pagination={false}
                      size="small"
                    />
                  </TabPane>
                </Tabs>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
