import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, renderIndex2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
  global: state.global,
}))
@injectIntl
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
      expandedRowKeys: [],
      otherMeterValue: '0',
      forwardsMeterValue: '0',
      key:uuid()
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
        const {village_meter_data: {meta}} = this.props;
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
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      }, false, function () {
        that.setState({
          otherMeterValue: '0',
          forwardsMeterValue: '0',
        })
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),

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
  handleSearch = (values,saveInput) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys: []
    })
    if(!saveInput){
      this.setState({
        key:uuid()
      })
    }
    dispatch({
      type:  'village_meter_data/fetch',
      payload: {
        ...values,
        others: values.others ? values.others : [],
        forwards: values.forwards ? values.forwards :[],
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        is_manually: -1
      },
      callback: function () {
        const {village_meter_data: {data}} = that.props;
        that.delayering(data);
        that.setState({
          ...values,
        })
      }
    });
  }
  handPageChange = (page)=> {
    const that = this;
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      // area: this.state.area
    })
  }
  handleChangeOtherMeter = ()=> {
    let others = [{}];
    others[0]['value'] = Number(this.state.otherMeterValue);
    others[0]['village_id'] = this.state.village_id;
    this.handleSearch({
      page: this.state.page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      others: JSON.stringify(others)
      // area: this.state.area
    })
  }
  handleLeak = ()=> {
    let tbodyRow = document.querySelectorAll('.ant-table-row');
    let others = [];
    let forwards = [];
    for (let i = 0; i < tbodyRow.length; i++) {
      let othersInput = tbodyRow[i].querySelectorAll('input.ant-input')[1];
      let forwardsInput = tbodyRow[i].querySelectorAll('input.ant-input')[0];
      let inputHidden = tbodyRow[i].querySelector('input.hidden');
      others.push({value: othersInput.value, village_id: inputHidden.value})
      forwards.push({value: forwardsInput.value, village_id: inputHidden.value})
    }
    console.log(others)
    this.handleSearch({
      page: this.state.page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      others: others,
      forwards:forwards
      // area: this.state.area
    },true)
  }
  handleForward = (values)=> {
    let tbodyRow = document.querySelectorAll('.ant-table-row');
    let forwards = [];
    let village_items = [];
    for (let i = 0; i < tbodyRow.length; i++) {
      let forwardsInput = tbodyRow[i].querySelector('input.ant-input');
      let inputHidden = tbodyRow[i].querySelector('input.hidden');
      // forwards.push({value: input.value, village_id: inputHidden.value})
      village_items.push({
        member_count: '-',
        other_value: '-',
        forward_value: forwardsInput.value,
        village_id: inputHidden.value
      })
    }
    console.log('forwards',forwards)
    this.handleSearch({
      ...values,
      village_items:village_items
      // forwards: forwards
      // area: this.state.area
    },true)
  }
  render() {
    const {village_meter_data: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const columns = company_code === 'hy' ? [
      // {
      //   title: '序号',
      //   dataIndex: 'index',
      //   key: 'index',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta, this.state.initPage, index)
      //   }
      // },
      {title: '小区名称', dataIndex: 'village_name', key: 'village_name', width: 180,
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (
            <span style={{color: record.is_village===-1?`#1890ff`:'rgba(0, 0, 0, 0.65)'}}>{val}</span>
          )
        }},
      {
        title: '用户数量', dataIndex: 'member_count', key: 'member_count', width: 150, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },
      {
        title: '进水量(T)', dataIndex: 'forward_value', key: 'forward_value', width: 120, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <div><Input   onChange={()=>{}} defaultValue={val}  size="small" disabled={record.is_village===-1?true:false}/></div>

        )
      }
      },
      {
        title: '远传用户总水量(T)', dataIndex: 'total_difference_value', key: 'total_difference_value', width: 150,
        render: (val, record, index) => {
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
          <div><Input  onChange={()=>{}} defaultValue={0} min={0} size="small"/><input type="hidden" className="hidden"
                                                                            value={record.village_id}/></div>

        )
      }
      },

      {title: '漏损量', dataIndex: 'attrition_value', key: 'attrition_value', width: 120,   render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }},
        {title: '漏损率', dataIndex: 'attrition_rate', key: 'attrition_rate', width: 120,render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (
            <p style={{marginLeft: `${parseInt(record.layer) * 25}px`}}><span style={{padding:'0 5px',borderRadius:'3px',color:`${parseFloat(val)?'#fff':'#000'}`,background:`${parseFloat(val)?parseFloat(val)>10?'red':'#e90':'#transparent'}`}}>{val}</span></p>
          )
        }},
      {title: '夜间流量', dataIndex: 'night_difference_value', key: 'night_difference_value',   render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }},

    ] : [{title: formatMessage({id: 'intl.member_count'}), dataIndex: 'village_name', key: 'village_name', width: '20%'},
      {
        title: formatMessage({id: 'intl.member_count'}), dataIndex: 'member_count', key: 'member_count', width: '20%', render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
        )
      }
      },
      {
        title:  formatMessage({id: 'intl.total_water_consumption'}), dataIndex: 'total_difference_value', key: 'total_difference_value', width: '20%',
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
          return (
            <span style={{paddingLeft: `${parseInt(record.layer) * 25}px`}}>{val}</span>
          )
        }
      },
      {
        title: formatMessage({id: 'intl.water_intake'}), dataIndex: 'forwards', key: 'forwards', width: 150, render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <div><Input defaultValue={0}  size="small" onChange={()=>{}}/><input type="hidden" className="hidden"
                                                                            value={record.village_id}/></div>

        )
      }
      },
      {title:  formatMessage({id: 'intl.attrition_rate'}), dataIndex: 'attrition_rate', key: 'attrition_rate',render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <p style={{marginLeft: `${parseInt(record.layer) * 25}px`}}><span style={{padding:'0 5px',borderRadius:'3px',color:`${parseFloat(val)?'#fff':'#000'}`,background:`${!isNaN(parseFloat(val))?parseFloat(val)>10?'red':'#e90':'#transparent'}`}}>{val}</span></p>
        )
      }},];
    const {isMobile} =this.props.global;
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
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name:formatMessage({id: 'intl.data_analysis'}) }, {name: formatMessage({id: 'intl.village_meter_data'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            handleLeak={this.handleLeak}
                            handleForward={this.handleForward}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Table
                  key={this.state.key}
                  className='meter-table'
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
                  scroll={{x: 1100, y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
      {/*          <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}> </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="DMA-info">
                      <div className="DMADetail">
                        <table className="custom-table">
                          <tbody>
                          <tr>
                            <td>区域名称</td>
                            <td>{Data1.village_name}</td>
                          </tr>
                          <tr>
                            <td>用户数量</td>
                            <td>{Data1.member_count}</td>
                          </tr>
                          <tr>
                            <td>远传用户总水量</td>
                            <td>{Data1.total_difference_value}</td>
                          </tr>
                          <tr>
                            <td>其他水表水量</td>
                            <td><InputNumber value={this.state.otherMeterValue} size="small" onChange={(value)=> {
                              this.setState({otherMeterValue: value})
                            }}/>
                              <Button type='primary' size="small" onClick={this.handleChangeOtherMeter}>确定</Button></td>
                          </tr>
                          <tr>
                            <td>进水量</td>
                            <td>{Data1.forward_value}</td>
                          </tr>
                          <tr>
                            <td>漏损量</td>
                            <td>{Data1.attrition_value}</td>
                          </tr>
                          <tr>
                            <td>漏损率</td>
                            <td>{Data1.attrition_rate}</td>
                          </tr>
                          <tr>
                            <td>夜间流量</td>
                            <td>{Data1.night_difference_value}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                </Row>*/}


              </Card>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
