import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../Sider'
import {renderIndex, ellipsis2} from './../../../utils/utils'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  temperature: state.temperature,
  sider_regions: state.sider_regions,
  global: state.global,
}))
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'temperature_sensor_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'temperature_sensor_delete'}),
      tableY: 0,
      page: 1,
      initPage:1,
      commandPage: '',
      started_at: '',
      ended_at: '',
      number: '',
      address: '',
      editModal: false,
      addModal: false,
      commandModal: false,
      canOperateMeter: localStorage.getItem('canOperateTemperature') === 'true' ? true : false,
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

    // dispatch({
    //   type: 'temperature/fetch',
    //   payload: {
    //     page: 1,
    //   },
    //   callback:()=>{
    //   this.changeTableY()
    // }
    // });
    const {dispatch}=this.props
    dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all'
      }
    });
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {temperature: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            number: this.state.number,
            address: this.state.address,
            per_page:this.state.per_page,

          },function () {
            that.setState({
              canLoadByScroll:true,
            })
          },true)
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        number: this.state.number,
        address: this.state.address,
        per_page:this.state.per_page
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
        number: this.state.number,
        address: this.state.address,
        per_page:this.state.per_page
      })
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      number: '',
      address: '',
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type:fetchAndPush?'temperature/fetchAndPush': 'temperature/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if(!fetchAndPush){
          that.setState({
            initPage:values.page
          })
        }
        if(cb) cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      number: this.state.number,
      address: this.state.address,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      number: this.state.number,
      address: this.state.address,
      per_page:per_page
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'temperature/add',
      payload: {
        ...formValues,
        enabled_date:formValues.enabled_date?moment(formValues.enabled_date).format('YYYY-MM-DD'):'',
      },
      callback: function () {
        message.success('添加水表成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          address: that.state.address,
          per_page:that.state.per_page
        })
      }
    });

  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'temperature/edit',
      payload: {
        ...formValues,
        enabled_date:formValues.enabled_date?moment(formValues.enabled_date).format('YYYY-MM-DD'):'',
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改压力计成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          address: that.state.address,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'temperature/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除压力计成功')
        that.handleSearch({
          page: that.state.page,
          number: that.state.number,
          address: that.state.address,
          per_page:that.state.per_page
        })
      }
    });
  }
  showCommandInfo = ()=> {
    const that = this;
    this.handleCommandSearch({
      page: this.state.commandPage,
    }, function () {
      that.setState({
        commandModal: true
      })
    })
  }
  handCommandPageChange = (page)=> {
    this.handleCommandSearch({
      page: page,
    })
  }

  render() {

    const {temperature: {data, meta, loading},sider_regions} = this.props;
    const columns = [
      {
        title: '温度传感器编号', width: 140, dataIndex: 'number', key: 'number',
        render: (val, record, index) => {
          return ellipsis2(val, 140)
        }
      },

      {
        title: '温度传感器序号',
        dataIndex: 'index',
        key: 'index',
        width: 140,
        render: (text, record, index) => {
          return ellipsis2(text, 140)
        }
      },
      {
        title: '计量单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 120,
        render: (text, record, index) => {
          return ellipsis2(text, 120)
        }
      },
      {
        title: '集中器号',
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 100,
        render: (text, record, index) => {
          return ellipsis2(text, 100)
        }
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 140,
        render: (text, record, index) => {
          return ellipsis2(text, 140)
        }
      },
      {
        title: '开始使用日期', width: 120, dataIndex: 'enabled_date', key: 'enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }
      },
      {
        title: '备注', dataIndex: 'remark', key: 'remark', render: (text, record, index) => {
        return ellipsis2(text, 100)
      }
      }

    ];
    const operate={
      title: '操作',
      width:  90 ,
      fixed: 'right',
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
                      }}>编辑</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showdelBtn &&
            <Popconfirm placement="topRight" title={ <div><p>确定要删除吗?</p></div>}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          }

        </p>
      ),
    }
    if (this.state.canOperateMeter) {
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="设备管理 " breadcrumb={[{name: '设备管理 '}, {name: '温度传感器管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch wrappedComponentRef={(inst) => this.searchFormRef = inst}
                                   inputText="温度计号" dateText="发送时间" handleSearch={this.handleSearch}
                                   clickInfo={this.showCommandInfo}
                                   per_page={this.state.per_page}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   canOperateConcentrator={this.state.canOperateMeter} changeShowOperate={()=> {
                      this.setState({canOperateMeter: !this.state.canOperateMeter})
                    }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x:1500,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperateMeter}
                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            title="添加温度传感器"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm  sider_regions={sider_regions}   wrappedComponentRef={(inst) => this.formRef = inst}    />

          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改温度传感器"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm  editRecord={this.state.editRecord} sider_regions={sider_regions}   wrappedComponentRef={(inst) => this.editFormRef = inst}    />
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export
default
MeterModel
