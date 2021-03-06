import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Badge,Tag} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import AddTask from './addTask'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
import {injectIntl} from 'react-intl';
import History from './../Workstations2/RTU03.js'
const {Content} = Layout;

@connect(state => ({
  m1v1: state.m1v1,
  manufacturers: state.manufacturers,
}))
@injectIntl
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'meter_model_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'meter_model_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      canOperate: localStorage.getItem('workstations') === 'true' ? true : false,
      per_page: 30,
      canLoadByScroll: true,
      editRecord:{},
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'm1v1/fetch',
      payload: {
        page: 1,
      },
      callback: () => {
        that.changeTableY()
      }
    });
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      }
    });
  }

  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
  }

  scrollTable = () => {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {m1v1: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page: this.state.per_page,
            // area: this.state.area
          }, function () {
            that.setState({
              canLoadByScroll: true,
            })
          }, true)
        }
      }
    }
  }
  changeTableY = () => {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    }, function () {
      if (sessionStorage.getItem('locale') === 'en') {
        this.setState({
          tableY: this.state.tableY - 20
        })
      }
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page: 30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'm1v1/fetchAndPush' : 'm1v1/fetch',
      payload: {
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
  handPageChange = (page) => {
    this.handleSearch({
      page: page,
      per_page: this.state.per_page
    })
  }
  handPageSizeChange = (per_page) => {
    this.handleSearch({
      page: 1,
      per_page: per_page
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    let hardware_configs = {
      device: [{enable: 0, upload_interval: 60}],
      sensor: [{enable: 0}, {enable: 0}, {enable: 0}, {enable: 0}],
      digital_input: [{enable: 0}, {enable: 0}],
      digital_output: [{enable: 0}, {enable: 0}],
      modbus: [{enable: 1,
        type:'Modbus008',
        slave_address:0,
        upload_interval:Number(formValues.upload_interval),
        alias:'modbus#1',
        da0:4,
        da1:4,
      },{enable: 1,
        type:'Modbus009',
        slave_address:1,
        upload_interval:Number(formValues.upload_interval2),
        alias:'modbus#2',
      }, {enable: 0}, {enable: 0}],
      control_valve: [{enable: 0}, {enable: 0}],
      flowmeter: [{enable: 0}, {enable: 0}],
      ball_valve: [{enable: 0}, {enable: 0}]
    }
    this.props.dispatch({
      type: 'm1v1/add',
      payload: {
        name: formValues.name,
        imei: formValues.imei,
        address: formValues.address,
        template: 51300402,
        hardware_configs,
        latitude: 0,
        longitude: 0,
        type: 1
      },
      callback: function () {
        const {intl: {formatMessage}} = that.props;
        message.success('添加成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    });

  }
  handleEdit = () => {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    let hardware_configs = {
      device: [{enable: 0, upload_interval: 60}],
      sensor: [{enable: 0}, {enable: 0}, {enable: 0}, {enable: 0}],
      digital_input: [{enable: 0}, {enable: 0}],
      digital_output: [{enable: 0}, {enable: 0}],
      modbus: [{
        ...this.state.editRecord.hardware_configs.modbus[0],
        upload_interval:formValues.upload_interval,

      }, {
        ...this.state.editRecord.hardware_configs.modbus[1],
        upload_interval:formValues.upload_interval2,

      }, {enable: 0}, {enable: 0}],
      control_valve: [{enable: 0}, {enable: 0}],
      flowmeter: [{enable: 0}, {enable: 0}],
      ball_valve: [{enable: 0}, {enable: 0}]
    }
    this.props.dispatch({
      type: 'm1v1/edit',
      payload: {
        name: formValues.name,
        imei: formValues.imei,
        address: formValues.address,
        template: 51300402,
        hardware_configs,
        type: 1,
        latitude: 0,
        longitude: 0,
        id: this.state.editRecord.id,
      },
      callback: function () {
        const {intl: {formatMessage}} = that.props;
        message.success('修改成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    });
  }
  handleEditDA=()=>{
    const formValues = this.editDAFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    console.log(this.state.editRecord.hardware_configs  )
    const that = this;
    this.props.dispatch({
      type: 'm1v1/addTask',
      payload: {
        id:this.state.editRecord.id,
        da0:formValues.da0!==''?formValues.da0:'',
        da1:4,
        channel:0
      },
      callback:function () {
        message.success('修改阀门状态成功')
        that.setState({
          taskModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
      })
  }
  handleRemove = (id) => {
    const that = this;
    this.props.dispatch({
      type: 'm1v1/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl: {formatMessage}} = that.props;
        message.success('删除成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    console.log('sorter', sorter)
  }

  render() {
    const {intl: {formatMessage}} = this.props;
    const {m1v1: {data, meta, loading}, manufacturers} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {
        title: '名称', width: 200, dataIndex: 'name', key: 'name', render: (text, record, index) => {
          return ellipsis2(text, 200)
        }
      },
      {
        title: '在线状态',
        width: 100,
        dataIndex: 'online_status',
        key: 'online_status',
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? "在线" : "离线"}

          </p>
        )
      },
      {
        title: '阀门返回状态', width: 110, dataIndex: 'da00', key: 'da00', render: (text, record, index) => {
          return  (record.workstation_data.modbus&&record.workstation_data.modbus.length>0&&record.workstation_data.modbus[0].parameters)?
            ((Number(record.workstation_data.modbus[0].parameters.ain0)-4))>12?
              '开':'关':''
        }
      },
      {
        title: '阀门设置状态', width: 110, dataIndex: 'da01', key: 'da01', render: (text, record, index) => {
          return record.hardware_configs.modbus[0].da1?((record.hardware_configs.modbus[0].da0-4))>12?'开':'关':''
        }
      },
      {
        title: '瞬时流量', width: 110, dataIndex: 'da10', key: 'da10', render: (text, record, index) => {
          return  (record.workstation_data.modbus&&record.workstation_data.modbus.length>0&&record.workstation_data.modbus[1].parameters)?
            record.workstation_data.modbus[1].parameters.instantaneous_flow:''
        }
      },
      {
        title: '正累计流量', width: 110, dataIndex: 'da11', key: 'da11', render: (text, record, index) => {
          return  (record.workstation_data.modbus&&record.workstation_data.modbus.length>0&&record.workstation_data.modbus[1].parameters)?
            record.workstation_data.modbus[1].parameters.cumulative_flow:''
        }
      },
      {
        title: '采集时间', width: 160, dataIndex: 'collected_at', key: 'collected_at', render: (text, record, index) => {
          return  (record.workstation_data.modbus&&record.workstation_data.modbus.length>0&&record.workstation_data.modbus[0])?
            record.workstation_data.modbus[0].collected_at:''
        }
      },
      {
        title: 'IMEI', width: 150, dataIndex: 'imei', key: 'imei', render: (text, record, index) => {
          return ellipsis2(text, 150)
        }
      },

      {
        title: '地址', width: 150, dataIndex: 'address', key: 'address', render: (text, record, index) => {
          return ellipsis2(text, 150)
        }
      },

      {
        title: '是否报警',
        dataIndex: 'alarm',
        key: 'alarm',
        render: (val, record, index) => (
          <p>
            <Badge status={val === 1 ? "error" : "success"}/>{val === 1 ? "报警" : "正常"}

          </p>
        )
      },
    ];
    const company_code = sessionStorage.getItem('company_code');
    const operate = {
      title: formatMessage({id: 'intl.operate'}),
      width: 260,
      fixed: 'right',
      render: (val, record, index) => (
        <p>
           <span>
             <a href="javascript:;" onClick={() => {

               this.setState(
                 {
                   editRecord: record,
                   da0:record.hardware_configs.modbus[0].da0,
                   taskModal: true
                 }
               )
             }}>修改阀门状态</a>
            <span className="ant-divider"/>
            </span>
          <span>
             <a href="javascript:;" onClick={() => {

               this.setState(
                 {
                   editRecord: record,
                   historyModal:true,
                 }
               )
             }}>数据日志</a>
            <span className="ant-divider"/>
            </span>
            <span>
             <a href="javascript:;" onClick={() => {
               this.setState(
                 {
                   editRecord: record,

                   editModal: true
                 }
               )
             }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
            </span>
          <Popconfirm placement="topRight"
                      title={formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                      onConfirm={() => this.handleRemove(record.id)}>
            <a href="">{formatMessage({id: 'intl.delete'})}</a>
          </Popconfirm>

        </p>
      ),
    }
    if (this.state.canOperate) {
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content>
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: formatMessage({id: 'intl.device'})},
              {name: formatMessage({id: 'intl.m1v1'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表类型" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={() => this.setState({addModal: true})}
                                   changeShowOperate={() => {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x: 1800, y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperate}
                                 onChange={this.handleTableChange}
                />
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}
                            handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            title={formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            destroyOnClose={true}
            title={formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
          <Modal
            width={500}
            destroyOnClose={true}
            title={`修改 ${this.state.editRecord.name} 阀门状态`}
            visible={this.state.taskModal}
            onCancel={() => this.setState({taskModal: false})}
            onOk={this.handleEditDA}
          >
            <AddTask da0={this.state.da0} editRecord={this.state.editRecord}
                      wrappedComponentRef={(inst)=> this.editDAFormRef = inst}/>
          </Modal>
          <Modal
            width={1100}
            destroyOnClose={true}
            title={`${this.state.editRecord.name} 历史纪录`}
            visible={this.state.historyModal}
            onCancel={() => this.setState({historyModal: false})}
            footer={null}
          >
            <History id={this.state.editRecord.id} name={this.state.editRecord.name} config_data={this.state.editRecord.hardware_configs}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default MeterModel
