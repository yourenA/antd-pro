import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Pagination from './../../../components/Pagination/Index'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import uuid from 'uuid/v4'
// import 'rsuite-table/lib/less/index.less'
import {getPreDay, renderIndex, renderErrorData} from './../../../utils/utils'
// import './index.less'
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
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
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      data: {
        "data": [
          {
            "concentrator_number": "C002A029",
            "member_number": "户号1",
            "install_address": "地址1",
            meter: [{
              "meter_number": "水表11",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            },
              {
                "meter_number": "水表12",
                "meter_index": 0,
                "meter_model_name": "冷水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              },
              {
                "meter_number": "水表13",
                "meter_index": 0,
                "meter_model_name": "热水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              }]
          },
          {
            "concentrator_number": "C002A029",
            "member_number": "户号2",
            "install_address": "地址2",
            meter: [{
              "meter_number": "水表2",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            }]
          },
          {
            "concentrator_number": "C002A029",
            "member_number": "户号3",
            "install_address": "地址3",
            meter: [{
              "meter_number": "水表3",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            }]
          },
          {
            "concentrator_number": "C002A029",
            "member_number": "户号4",
            "install_address": "地址4",
            meter: [{
              "meter_number": "水表4",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            },]
          },
          {
            "concentrator_number": "C002A029",
            "member_number": "户号1",
            "install_address": "地址1",
            meter: [{
              "meter_number": "水表11",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            },
              {
                "meter_number": "水表12",
                "meter_index": 0,
                "meter_model_name": "冷水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              },
              {
                "meter_number": "水表12",
                "meter_index": 0,
                "meter_model_name": "冷水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              },
              {
                "meter_number": "水表13",
                "meter_index": 0,
                "meter_model_name": "热水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              }]
          },
          {
            "concentrator_number": "C002A029",
            "member_number": "户号1",
            "install_address": "地址1",
            meter: [{
              "meter_number": "水表11",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            },
              {
                "meter_number": "水表12",
                "meter_index": 0,
                "meter_model_name": "冷水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              },
              {
                "meter_number": "水表13",
                "meter_index": 0,
                "meter_model_name": "热水表",
                "latest_collected_at": "2018-05-30 03:26:06",
                "latest_value": 18.94,
                "previous_collected_at": "2018-05-29 03:25:59",
                "previous_value": 18.8,
                "difference_value": 0.14,
              }]
          },
          {
            "concentrator_number": "C002A029",
            "member_number": "户号4",
            "install_address": "地址4",
            meter: [{
              "meter_number": "水表4",
              "meter_index": 0,
              "meter_model_name": "冷水表",
              "latest_collected_at": "2018-05-30 03:26:06",
              "latest_value": 18.94,
              "previous_collected_at": "2018-05-29 03:25:59",
              "previous_value": 18.8,
              "difference_value": 0.14,
            },]
          },
        ]
      }
    }
  }

  componentDidMount() {
  }

  changeTableY = ()=> {
    this.setState({
      // tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
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
    this.searchFormRef.props.form.resetFields();
    this.setState({
      showAddBtnByCon: false,
      concentrator_number: null
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number: '',
        member_number: '',
        install_address: '',
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
      member_number: '',
      install_address: '',
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
      member_number: '',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'village_meter_data/fetch',
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
      member_number: this.state.member_number,
      install_address: this.state.install_address,
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
      type: 'village_meter_data/add',
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
          query: that.state.query,
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
      type: 'village_meter_data/edit',
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
          query: that.state.query,
          ended_at: that.state.ended_at,
          started_at: that.state.started_at,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'village_meter_data/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除用户成功')
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
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
  renderRsuiteTable = (data, loading)=> {
    return (
      <div>
        <Table
          bordered
          height={this.state.tableY}
          data={data}
          loading={loading}
          className="rsuiteTable"
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          <Column width={50} align="center" fixed resizable>
            <HeaderCell>序号</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={130} fixed resizable>
            <HeaderCell>First Name</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={130}>
            <HeaderCell>Last Name</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={200}>
            <HeaderCell>City</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={200}>
            <HeaderCell>Street</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>


          <Column width={200}>
            <HeaderCell>Company Name</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={200}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={200}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={200}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

          <Column width={200}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="meter_number"/>
          </Column>

        </Table>
      </div>
    )
  }

  render() {
    const {village_meter_data: {meta, loading}, concentrators, meters} = this.props;
    const data = this.state.data.data;
    for (let i = 0; i < data.length; i++) {
      data[i].index = i
    }
    let resetMeterData = []
    data.map((item, index)=> {
      for (let i = 0; i < item.meter.length; i++) {
        if (item.meter.length === 1) {
          resetMeterData.push({...item, ...item.meter[i], rowSpan: 1})
        } else {
          resetMeterData.push({...item, ...item.meter[i], rowSpan: i === 0 ? item.meter.length : 0})
        }
      }
      return item
    });
    for (let i = 0; i < resetMeterData.length; i++) {
      resetMeterData[i].uuidkey = uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          const parseIndex=meta?String((meta.pagination.per_page*(this.state.page-1))+(record.index + 1)):0;
          const obj = {
            children: (
              <span title={parseIndex} >
                {parseIndex.length>4?parseIndex.substring(0,3)+'...':parseIndex}
            </span>
            ),
            props: {},
          };
          obj.props.rowSpan = record.rowSpan
          // These two are merged into above cell
          return obj;
        }
      },
      {
        title: '户号', width: 80, dataIndex: 'member_number', key: 'member_number', fixed: 'left',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          obj.props.rowSpan = row.rowSpan
          // These two are merged into above cell
          return obj;
        },
      },
      {
        title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number', width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          obj.props.rowSpan = row.rowSpan
          return obj;
        },
      },

      {title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number',},
      {title: '水表类型', width: 130, dataIndex: 'meter_model_name', key: 'meter_model_name',},
      {title: '应收水量', width: 100, dataIndex: 'difference_value', key: 'difference_value'},
      {title: '上次抄见时间', dataIndex: 'previous_collected_at', key: 'previous_collected_at', width: 160,},
      {title: '上次抄见', dataIndex: 'previous_value', key: 'previous_value', width: 120,},
      {title: '本次抄见时间', dataIndex: 'latest_collected_at', key: 'latest_collected_at', width: 160,},
      {title: '本次抄见', dataIndex: 'latest_value', key: 'latest_value', width: 120,},
      {
        title: '安装地址', dataIndex: 'install_address', key: 'install_address',
        render: (val, record, index) => {
          const obj = {
            children: (
              <Tooltip title={val}>
                <span>{val.length > 10 ? val.substring(0, 7) + '...' : val}</span>
              </Tooltip>
            ),
            props: {},
          };
          obj.props.rowSpan = record.rowSpan
          return obj;
        }
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '小区水量分析'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if (record.status === -2) {
                      return 'error'
                    }
                  }}
                  className='meter-table no-interval'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={resetMeterData}
                  columns={columns}
                  scroll={{x: 1280}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        {/*  <Modal
         key={ Date.parse(new Date())}
         title="添加用户档案"
         visible={this.state.addModal}
         onOk={this.handleAdd}
         onCancel={() => this.setState({addModal:false})}
         >
         <AddOREditUserArchives  wrappedComponentRef={(inst) => this.formRef = inst} concentrators={concentrators.data} meters={meters.data}  />
         </Modal>
         <Modal
         key={ Date.parse(new Date())+1}
         title="编辑用户档案"
         visible={this.state.editModal}
         onOk={this.handleEdit}
         onCancel={() => this.setState({editModal:false})}
         >
         <AddOREditUserArchives  wrappedComponentRef={(inst) => this.editFormRef = inst} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
         </Modal>*/}

      </Layout>
    );
  }
}

export
default
UserMeterAnalysis
