import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Badge,Tag} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import Task from './Task'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
import {injectIntl} from 'react-intl';

const {Content} = Layout;

@connect(state => ({
  workstations: state.workstations,
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
      type: 'workstations/fetch',
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
        const {workstations: {meta}} = this.props;
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
      type: fetchAndPush ? 'workstations/fetchAndPush' : 'workstations/fetch',
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
      modbus: [{enable: 0}, {enable: 0}, {enable: 0}, {enable: 0}],
      control_valve: [{enable: 0}, {enable: 0}],
      flowmeter: [{enable: 0}, {enable: 0}],
      ball_valve: [{
        enable: Number(formValues.enable_1),
        mode: 1,
        alias: '球阀1',
        parameter1: Number(formValues.parameter1_1),
        normal_upload_interval: Number(formValues.normal_upload_interval_1),
      }, {
        enable: Number(formValues.enable_2),
        mode: 1,
        alias: '球阀1',
        parameter1: Number(formValues.parameter1_2),
        normal_upload_interval: Number(formValues.normal_upload_interval_2),
      }]
    }
    this.props.dispatch({
      type: 'workstations/add',
      payload: {
        name: formValues.name,
        imei: formValues.imei,
        address: formValues.address,
        template: 1,
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
      modbus: [{enable: 0}, {enable: 0}, {enable: 0}, {enable: 0}],
      control_valve: [{enable: 0}, {enable: 0}],
      flowmeter: [{enable: 0}, {enable: 0}],
      ball_valve: [{
        enable: Number(formValues.enable_1),
        mode: 1,
        alias: '球阀1',
        parameter1: Number(formValues.parameter1_1),
        normal_upload_interval: Number(formValues.normal_upload_interval_1),
      }, {
        enable: Number(formValues.enable_2),
        mode: 1,
        alias: '球阀1',
        parameter1: Number(formValues.parameter1_2),
        normal_upload_interval: Number(formValues.normal_upload_interval_2),
      }]
    }
    this.props.dispatch({
      type: 'workstations/edit',
      payload: {
        name: formValues.name,
        imei: formValues.imei,
        address: formValues.address,
        template: 1,
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
  handleRemove = (id) => {
    const that = this;
    this.props.dispatch({
      type: 'workstations/remove',
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
    const {workstations: {data, meta, loading}, manufacturers} = this.props;
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
        title: '名称', width: 120, dataIndex: 'name', key: 'name', render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: '定时任务',
        width: 400,
        dataIndex: 'timed_tasks',
        key: 'timed_tasks',
        render: (val, record, index) => {
          return val.map((item, index) => {
            return <div key={index}  style={{marginRight:'5px',marginBottom:'5px'}}>
              <span  style={{marginRight:'5px',marginBottom:'5px'}}>通道号: <Tag color="#108ee9">通道{item.channel+1}</Tag></span>
              <span style={{marginRight:'5px',marginBottom:'5px'}}>时间:  <Tag color="#108ee9">{item.time}</Tag></span>
              <span>类型:  <Tag color={item.type ==='open_valve'? '#108ee9' :"#ff2d14"}>{item.type === 'open_valve' ? '自动开阀' : '自动关阀'}</Tag></span>
            </div>
          })
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
        title: '是否报警',
        dataIndex: '是否报警',
        key: '是否报警',
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
      width: 180,
      fixed: 'right',
      render: (val, record, index) => (
        <p>
           <span>
             <a href="javascript:;" onClick={() => {
               this.setState(
                 {
                   editRecord: record,
                   taskModal: true
                 }
               )
             }}>定时任务</a>
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
              {name: formatMessage({id: 'intl.workstations'})}]}>
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
                                 scroll={{x: 1200, y: this.state.tableY}}
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
            width={600}
            destroyOnClose={true}
            title={`${this.state.editRecord.name} 定时任务`}
            visible={this.state.taskModal}
            onCancel={() => this.setState({taskModal: false})}
            footer={null}
          >
            <Task handleSearch={()=>this.handleSearch({
                page: this.state.page,
                per_page: this.state.per_page
            })} hideModal={()=>{this.setState({taskModal:false})}} editRecord={this.state.editRecord}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default MeterModel
