import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm, Modal,Badge } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMeterModels'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  meter_models: state.meter_models,
  manufacturers: state.manufacturers,
}))
@injectIntl
class MeterModel extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
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
      canOperate:localStorage.getItem('canOperateMeterModel')==='true'?true:false,
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        page: 1,
      },
      callback:()=>{
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
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {meter_models: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page:this.state.per_page,
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
  changeTableY = ()=> {
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
      per_page:30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'meter_models/fetchAndPush':'meter_models/fetch',
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
        if (cb)cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page:per_page
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'meter_models/add',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
        is_control:formValues.is_control.key?parseInt(formValues.is_control.key):-1
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.water_meter_type'})}
          )
        )
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
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
      type: 'meter_models/edit',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
        is_control: formValues.is_control.key,
        id: this.state.editRecord.id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.water_meter_type'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'meter_models/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.water_meter_type'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleTableChange=(pagination, filters, sorter)=>{
    console.log('sorter', sorter)
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {meter_models: {data, meta, loading}, manufacturers} = this.props;
    console.log('this.state.initPage',this.state.initPage);
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
      {title: formatMessage({id: 'intl.water_meter_type'}), width: 120, dataIndex: 'name', key: 'name',render: (text, record, index) => {
        return ellipsis2(text,120)
      }},
      {title: formatMessage({id: 'intl.size_type'}), width: 100, dataIndex: 'size_type_explain', key: 'size_type_explain',render: (text, record, index) => {
        return ellipsis2(text,100)
      }},
      {title: formatMessage({id: 'intl.output_type'}), dataIndex: 'output_type_explain', key: 'output_type_explain', width: 100,render: (text, record, index) => {
        return ellipsis2(text,100)
      }
      },
      {title:formatMessage({id: 'intl.temperature_type'}) , dataIndex: 'temperature_type_explain', key: 'temperature_type_explain', width: 110,render: (text, record, index) => {
        return ellipsis2(text,110)
      }
      },

      {title: formatMessage({id: 'intl.can_valve'}), dataIndex: 'is_control', key: 'is_control', width: 110,
      render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.is_control_explain}

        </p>
      )},
      {title:formatMessage({id: 'intl.bore'}) , width: 80, dataIndex: 'bore', key: 'bore',render: (text, record, index) => {
        return ellipsis2(text,80)
      }},
      {title: formatMessage({id: 'intl.battery_life'}), dataIndex: 'service_life', key: 'service_life', width: 100,
        render: (text, record, index) => {
          return ellipsis2(text,100)
        }},
      {title:formatMessage({id: 'intl.baud_rate'}) , dataIndex: 'baud_rate', key: 'baud_rate', width:80,
        render: (text, record, index) => {
          return ellipsis2(text,80)
        }},
      {
        title: formatMessage({id: 'intl.down_protocol'}), dataIndex: 'down_protocol', key: 'down_protocol', width: 100,
        render: (text, record, index) => {
          return ellipsis2(text,100)
        }
      },
      {
        title: formatMessage({id: 'intl.vendor_name'}), dataIndex: 'manufacturer_name', key: 'manufacturer_name',
      },
    ];
    const company_code = sessionStorage.getItem('company_code');
    if(company_code==='hy') {
      columns.splice(3, 1)
    }
    const operate={
      title: formatMessage({id: 'intl.operate'}),
      width: 100,
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
                      }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
          }
          {
            this.state.showdelBtn &&
            <Popconfirm placement="topRight"  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a href="">{formatMessage({id: 'intl.delete'})}</a>
            </Popconfirm>
          }

        </p>
      ),
    }
    if(this.state.canOperate){
      columns.push(operate)
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 "   breadcrumb={[{name: formatMessage({id: 'intl.device'})},
              {name: formatMessage({id: 'intl.meter_type_manage'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="水表类型" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x:1600,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperate}
                                 onChange={this.handleTableChange}
                />
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
          <Modal
            width="900px"
            title={formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            width="900px"
            key={ Date.parse(new Date())}
            title={formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm manufacturers={manufacturers.data} editRecord={this.state.editRecord}
                           wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default MeterModel
