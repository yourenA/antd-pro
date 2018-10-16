import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Badge, Tooltip, Tabs, Button} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import AddOrEditConcentrator from './AddOrEditConcentrator'
import AddConcentrator from './AddConcentrator'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import Sider from './../Sider'
import {connect} from 'dva';
import Detail from './Detail'
import find from 'lodash/find'
import debounce from 'lodash/throttle'
// import moment from 'moment'
import {renderIndex, ellipsis, ellipsis2, fillZero} from './../../../utils/utils'
import './index.less'
import ConcentratorDetail from './ConcentratorDetail'
import uuid from 'uuid/v4'
const {Content} = Layout;
@connect(state => ({
  concentrator_models: state.concentrator_models,
  concentrators: state.concentrators,
  servers: state.servers,
  area: state.area
}))
class ConcentratorManage extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.BMap = window.BMap;
    this.state = {
      showAddBtn: find(this.permissions, {name: 'concentrator_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'concentrator_delete'}),
      showSiderCon: true,
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      // initRange:[moment(new Date().getFullYear()+'-'+new  Date().getMonth()+1+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      // started_at:'',
      // ended_at:'',
      editModal: false,
      addModal: false,
      orderModal: false,
      village_id: '',
      showArea: true,
      editRecord: null,
      refreshSider: 0,
      canOperateConcentrator: localStorage.getItem('canOperateConcentrator') === 'true' ? true : false,
      canAdd: true,
      per_page: 30,
      canLoadByScroll: true,
    }

  }

  componentDidMount() {
    // this.setState({
    //   tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    // })
    document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const {dispatch}=this.props
    dispatch({
      type: 'concentrator_models/fetch',
      payload: {
        return: 'all'
      },
    });
    dispatch({
      type: 'servers/fetch',
      payload: {
        display_type: 'only_enabled',
        return: 'all'
      }
    });
    dispatch({
      type: 'area/fetch',
      payload: {
        return: 'all'
      }
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {concentrators: {meta}} = this.props;
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
  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      showAddBtnByCon: false,
      query: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        per_page: this.state.per_page,
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      query: concentrator_number,
      village_id: parent_village_id,
    }, function () {
      this.handleSearch({
        page: 1,
        per_page: this.state.per_page,
      })
    })

  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page: 30,
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'concentrators/fetchAndPush' : 'concentrators/fetch',
      payload: {
        query: this.state.query ? this.state.query : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        });
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
      per_page: this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page: per_page
    })
  }
  operate = (record)=> {
    this.setState({
      orderModal: true,
      editRecord: record
    })

  }
  handleAdd = () => {
    this.setState({
      canAdd: false
    })
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    formValues.villages = [];
    for (let k in formValues) {
      if (k.indexOf('villages-') >= 0) {
        if (formValues.hasOwnProperty(k)) {
          if (formValues[k].village === undefined) {
            message.error('安装小区 不能为空');
            this.setState({
              canAdd: true
            })
            return false
          } else {
            const village = formValues[k].village
            formValues.villages.push(village[village.length - 1])
          }
        }
      }
    }
    formValues.longitude='113.131695';
    formValues.latitude='27.827433';
    console.log('formValues', formValues);
    if (formValues.latitude_longitude) {
      let latitude_longitude = formValues.latitude_longitude
      formValues.longitude = latitude_longitude ? latitude_longitude.split('/')[0] : '113.131695'
      formValues.latitude = latitude_longitude ? latitude_longitude.split('/')[1] : '27.827433'
      that.addRequest(formValues)
    } else if (formValues.install_address) {
      let myGeo = new this.BMap.Geocoder();
      myGeo.getPoint(formValues.install_address, function (point) {
        if (point) {
          console.log(point)
          formValues.longitude = point.lng.toString();
          formValues.latitude = point.lat.toString();
          that.addRequest(formValues)
        } else {
          console.log("您选择地址没有解析到结果!");
          that.addRequest(formValues)

        }
      });
    } else {
      that.addRequest(formValues)
    }

  }
  addRequest = (formValues)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/add',
      payload: {
        ...formValues,
        // village_id: formValues.village_id[formValues.village_id.length - 1],
        village_ids: formValues.villages,
        server_id: formValues.server_id ? formValues.server_id.key : '',
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
      },
      callback: function () {
        message.success('添加集中器成功')
        that.setState({
          addModal: false,
          refreshSider: that.state.refreshSider + 1
        });
        that.setState({
          canAdd: true
        })
        // that.handleSearch({
        //   page: that.state.page,
        //   query: that.state.query,
        //   per_page:that.state.per_page,
        // })
        // this.reload()
      },
      errorCallback: function () {
        that.setState({
          canAdd: true
        })
      }
    });
  }
  setReload = (reload)=> {
    this.reload = reload;
  }
  handleEdit = () => {
    const that = this;
    const state = this.editFormRef.state;
    if (state.tabsActiveKey === 'edit') {
      const formValues = this.editFormRef.props.form.getFieldsValue();
      console.log('formValues', formValues)
      formValues.villages = [];
      for (let k in formValues) {
        if (k.indexOf('villages-') >= 0) {
          if (formValues.hasOwnProperty(k)) {
            if (formValues[k].village === undefined) {
              message.error('安装小区 不能为空')
              return false
            } else {
              const village = formValues[k].village
              formValues.villages.push(village[village.length - 1])
            }
          }
        }
      }

      formValues.longitude='113.131695';
      formValues.latitude='27.827433';
      if (formValues.latitude_longitude) {
        let latitude_longitude = formValues.latitude_longitude
        formValues.longitude = latitude_longitude ? latitude_longitude.split('/')[0] : '113.131695'
        formValues.latitude = latitude_longitude ? latitude_longitude.split('/')[1] : '27.827433'
        that.editRequest(formValues)
      } else if (formValues.install_address) {
        let myGeo = new this.BMap.Geocoder();
        myGeo.getPoint(formValues.install_address, function (point) {
          if (point) {
            console.log(point)
            formValues.longitude = point.lng.toString();
            formValues.latitude = point.lat.toString();
            that.editRequest(formValues)
          } else {
            console.log("您选择地址没有解析到结果!");
            that.editRequest(formValues)
          }
        });
      } else {
        this.editRequest(formValues)
      }

    } else if (state.tabsActiveKey === 'editUpload') {
      this.handleEditConfig()
    } else if (state.tabsActiveKey === 'editSleep') {
      this.handleEditSleep()
    }

  }
  editRequest = (formValues)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/edit',
      payload: {
        ...formValues,
        server_id: formValues.server_id ? formValues.server_id.key : '',
        concentrator_model_id: formValues.concentrator_model_id.key,
        // village_id: formValues.village_id[formValues.village_id.length - 1],
        village_ids: formValues.villages,
        is_count: formValues.is_count.key,
        id: this.state.editRecord.id
      },
      callback: function () {
        message.success('修改集中器成功')
        that.setState({
          editModal: false,
          refreshSider: that.state.refreshSider + 1
        });
        // that.handleSearch({
        //   page: that.state.page,
        //   query: that.state.query,
        //   per_page:that.state.per_page,
        // })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'concentrators/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除集中器成功')
        that.setState({
          refreshSider: that.state.refreshSider + 1
        });
        // that.handleSearch({
        //   page: that.state.page,
        //   query: that.state.query,
        //   per_page:that.state.per_page,
        // })
      }
    });
  }
  showConcentrator = (record)=> {
    console.log(record.id);
    this.setState({
      concentratorId: record.id,
      concentratorNumber: record.number,
      protocols: record.protocols,
    }, function () {
      this.setState({
        showArea: false
      })
    })
  }
  handleBack = ()=> {
    this.setState({
      showArea: true,
      concentratorNumber: null,
    }, function () {
      document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    })
  }
  handleEditConfig = ()=> {
    const that = this;
    const formValues = this.editFormRef.state;
    console.log('formValues', this.editFormRef.state);
    let upload_time = '';
    switch (formValues.value) {
      case  'monthly':
        upload_time = `${fillZero(formValues.day)} ${fillZero(formValues.hour)}:${fillZero(formValues.minute)}:${fillZero(formValues.second)}`;
        break;
      case   'daily':
        upload_time = `${fillZero(formValues.hour)}:${fillZero(formValues.minute)}:${fillZero(formValues.second)}`;
        break;
      case  'hourly':
        upload_time = `${fillZero(formValues.minute)}:${fillZero(formValues.second)}`;
        break;
      case  'every_fifteen_minutes':
        upload_time = `00:00`;
        break;
    }
    console.log(this.state.editRecord.id)
    let putData = {
      upload_cycle_unit: formValues.value,
      id: this.state.editRecord.id,
      upload_time: upload_time
    }
    // if (formValues.day || formValues.hour || formValues.minute || formValues.second) {
    //   putData.upload_time = upload_time
    // }
    this.props.dispatch({
      type: 'concentrators/editConfig',
      payload: putData,
      callback: function () {
        message.success('修改集中器上传时间成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page: that.state.per_page,
        })
      }
    });
  }
  handleEditSleep = ()=> {
    const that = this;
    const formValues = this.editFormRef.state;
    this.props.dispatch({
      type: 'concentrators/editConfig',
      payload: {
        id: this.state.editRecord.id,
        sleep_hours: formValues.checkedList
      },
      callback: function () {
        message.success('修改集中器休眠时间成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page: that.state.per_page,
        })
      }
    });

  }
  changeShowOperate = ()=> {
    this.setState({canOperateConcentrator: !this.state.canOperateConcentrator})
  }
  handleTableChange=(pagination, filters, sorter)=>{
    console.log('sorter', sorter)
  }
  render() {
    const {concentrators: {data, meta, loading}, servers, concentrator_models, area} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta, this.state.initPage, index)
      //   }
      {
        title: '集中器编号', width: 90, dataIndex: 'number', key: 'number', fixed: 'left',
        render: (text, record, index) => {
          return (
            <p className="link" onClick={()=>this.showConcentrator(record)}>
              {text}
            </p>
          )
        }
      },
      {
        title: '集中器类型',
        width: 100,
        dataIndex: 'concentrator_model_name',
        key: 'concentrator_model_name',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: '支持协议', width: 100, dataIndex: 'protocols', key: 'protocols', render: (val, record, index) => {
        if (val) {
          return ellipsis2(val.join('|'), 90)
        } else {
          return ''
        }
      }
      },
      {
        title: '硬件编号', dataIndex: 'serial_number', key: 'serial_number', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {title: '水表总数', dataIndex: 'meter_count', key: 'meter_count', width: 80},
      {
        title: '在线状态', dataIndex: 'is_online', key: 'is_online', width: 80,
        render: (val, record, index) => {
          let status = "success";
          let status_text = "是";
          switch (val) {
            case  1:
              status = 'success';
              status_text = "是";
              break;
            case  -1:
              status = 'error';
              status_text = "否";
              break;
            case  -2:
              status = 'warning';
              status_text = "休眠";
              break;
          }
          return (
            <p>
              <Badge status={status}/>{status_text}
            </p>
          )
        }
      },
      {
        title: '安装小区', dataIndex: 'villages', key: 'villages', width: 120,
        render: (val, record, index) => {
          let transVal = val.map((item, index)=> {
            return <span key={index}>{ellipsis2(item.name, 110)}<br/></span>

          })
          return <span>{transVal}</span>
        }
      },
      {
        title: '安装地址', dataIndex: 'install_address', key: 'install_address', width: 120,
        render: (val, record, index) => {
          return ellipsis2(val, 120)
        }
      },
      {
        title: '服务器IP', dataIndex: 'server_ip', key: 'server_ip', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {
        title: '服务器端口', dataIndex: 'server_port', key: 'server_port', width: 90,
        render: (val, record, index) => {
          return ellipsis2(val, 80)
        }
      },
      {
        title: 'SIM卡号码', dataIndex: 'sim_number', key: 'sim_number', width: 90,
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }
      },
      {
        title: 'SIM卡运营商', dataIndex: 'sim_operator', key: 'sim_operator', width: 100,
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }
      },
      {title: '本轮登录时间', dataIndex: 'last_logined_at', key: 'last_logined_at', width: 150,},
      {title: '最后访问时间', dataIndex: 'last_onlined_at', key: 'last_onlined_at', width: 150,},
      {
        title: '上传周期', dataIndex: 'upload_cycle_unit_explain', key: 'upload_cycle_unit_explain', width: 100,
      },
      {
        title: '上传时间', dataIndex: 'upload_time', key: 'upload_time', width: 100,
      },
      {
        title: '睡眠时间', dataIndex: 'sleep_hours', key: 'sleep_hours', width: 100,
        render: (val, record, index) => {
          let transVal = val;
          transVal.sort(function (a, b) {
            return a - b
          })
          return ellipsis2(transVal.join(','), 100)
        }
      },
      {
        title: '是否做统计日报', dataIndex: 'is_count', key: 'is_count', width: 120,
        render: (val, record, index) => {
          return (
            <p>
              <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? "是" : "否"}
            </p>
          )
        }
      },
      {
        title: '备注', dataIndex: 'remark', key: 'remark', render: (val, record, index) => {
        return ellipsis2(val)
      }
      },

    ];
    const operate = {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      className: 'operation',
      width: 100,
      render: (val, record, index) => {
        return (
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
                      }}>编辑</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <span>
                  <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                              onConfirm={()=>this.handleRemove(record.id)}>
                  <a href="">删除</a>
                </Popconfirm>
                </span>
            }
          </p>
        )
      }
    }
    if (this.state.canOperateConcentrator) {
      columns.push(operate)
    }
    let breadcrumb = this.state.concentratorNumber ? [{name: '运行管理'}, {
      name: '集中器管理',
      click: this.handleBack
    }, {name: this.state.concentratorNumber}] : [{name: '运行管理'}, {name: '集中器管理'}]
    return (
      <Layout className="layout">
        <Sider refreshSider={this.state.refreshSider} showSiderCon={this.state.showSiderCon}
               changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator} showArea={this.state.showArea}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={breadcrumb}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                {
                  this.state.showArea
                    ?
                    <div>
                      <div className='tableList'>
                        <div className='tableListForm'>
                          <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                  village_id={this.state.village_id}
                                  per_page={this.state.per_page}
                                  handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                  showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                  canOperateConcentrator={this.state.canOperateConcentrator}
                                  changeShowOperate={this.changeShowOperate}
                          />
                        </div>
                      </div>
                      <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                       dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                       scroll={{x: 2650, y: this.state.tableY}}
                                       history={this.props.history}
                                       canOperate={this.state.canOperateConcentrator}
                                       operate={operate}
                                       showConcentrator={this.showConcentrator}/>
                      {/*  <Table
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
                       scroll={{x: 2050, y: this.state.tableY}}
                       pagination={false}
                       size="small"
                       />*/}
                      <Pagination meta={meta} initPage={this.state.initPage}
                                  handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
                    </div>
                    :
                    <ConcentratorDetail protocols={this.state.protocols} concentratorId={this.state.concentratorId}
                                        concentratorNumber={this.state.concentratorNumber}
                                        history={this.props.history}
                                        handleBack={this.handleBack}/>
                }
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          title="添加集中器"
          visible={this.state.addModal}
          //onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false, canAdd: true})}
          footer={[
            <Button key="back" onClick={() => this.setState({addModal: false})}>取消</Button>,
            <Button key="submit" type="primary" disabled={!this.state.canAdd} onClick={this.handleAdd}>
              确认
            </Button>,
          ]}
        >
          <AddConcentrator wrappedComponentRef={(inst) => this.formRef = inst} area={area.data}
                           concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          width={650}
          key={ Date.parse(new Date())}
          title="编辑集中器"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <AddOrEditConcentrator
            editRecord={this.state.editRecord}
            wrappedComponentRef={(inst) => this.editFormRef = inst} area={area.data}
            concentrator_models={concentrator_models.data} servers={servers.data}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date()) + 1}
          title={`集中器指令:集中器编号${this.state.editRecord ? this.state.editRecord.number : ''}`}
          visible={this.state.orderModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({orderModal: false})}
        >
          <Detail />
        </Modal>

      </Layout>
    );
  }
}

export default ConcentratorManage
