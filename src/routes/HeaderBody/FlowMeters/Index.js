import React, {PureComponent} from 'react';
import {
  Table,
  Card,
  Popconfirm,
  Layout,
  message,
  Modal,
  Button,
  Icon,
  Collapse,
  Popover,
  Row,
  Col,
  Alert
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './OnlyAdd'
import Sider from './../EmptySider'
import {connect} from 'dva';
import AddOrEditForm from './addOrEditFlowMeter'
import AddOrEditSiteForm from './addOrEditSite'
import moment from 'moment'
import find from 'lodash/find'
import uuid from 'uuid/v4'
import request from '../../../utils/request';
import './index.less'
const Panel = Collapse.Panel;
const {Content} = Layout;
@connect(state => ({
  flow_meters: state.flow_meters,
  flow_meter_sites: state.flow_meter_sites,
  manufacturers: state.manufacturers,

}))
class FlowMeter extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'flow_meter_add_and_edit'}),
      showAddSiteBtn: find(this.permissions, {name: 'site_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'flow_meter_delete'}),
      showdelSiteBtn: find(this.permissions, {name: 'site_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      area_id: '',
      editModal: false,
      addSiteModal:false,
      changeModal: false,
      nowArea: '',

    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      },
      callback:()=>{
        this.changeTableY()
      }
    });
    window.addEventListener('resize', this.changeTableY)
    this.handleSearchSite({
      // return: 'all',
      page:1,
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeTableY)
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.DMA-content').offsetTop - (68 + 54 + 17 + 45)
    })
  }
  changeArea = (area_id)=> {
    this.searchFormRef.props.form.resetFields();
    if (area_id === 'all') {
      area_id = null
    }
    this.setState({
      area_id: area_id
    }, function () {
      this.changeTableY();
      this.getNowArea(area_id)
      this.handleSearch({
        return: 'all',
        // page:1,
        area_id: area_id
      })
    })


  }
  getNowArea = (area_id)=> {
    if (area_id === null) {
      this.setState({
        nowArea: '全部DMA区域'
      })
      return
    }
    const that = this;
    request(`/areas/${area_id}`, {
      method: 'GET',
    }).then((response)=> {
      console.log('response', response.data.data)
      that.setState({
        nowArea: response.data.name
      })
    })
  }
  handleFormReset = () => {
    this.handleSearchSite({
      page: 1,
      meter_number: '',
      member_number: '',
      install_address: '',
    })
  }

  handleSearchSite = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'flow_meter_sites/fetch',
      payload: {
        ...values,
        // return: 'all',
        page: values.page,
        // area_id: values.area_id ? values.area_id : this.state.area_id,
      },
      callback: function () {
        that.setState({
          ...values,
          area_id: values.area_id ? values.area_id : that.state.area_id,
        })
      }
    });


  }
  handPageChange = (page)=> {
    this.handleSearchSite({
      page: page,
      // meter_number: this.state.meter_number,
      // member_number: this.state.member_number,
      // install_address: this.state.install_address,
      // area: this.state.area
    })
  }

  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'flow_meters/add',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id ? formValues.manufacturer_id.key : null,
        site_id: formValues.site_id ? formValues.site_id.key : null,
        is_virtual:-1
      },
      callback: function () {
        message.success('添加流量计成功')
        that.setState({
          addModal: false,
        });
        that.handleSearchSite({
          page:that.state.page
        })
      }
    });
  }
  handleAddSite = () => {
    const that = this;
    const formValues = this.siteFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'flow_meter_sites/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('添加流量计站点成功')
        that.setState({
          addSiteModal: false,
        });
        that.handleSearchSite({
          page:that.state.page
        })
      }
    });
  }
  handleEdit = () => {
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'flow_meters/edit',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id ? formValues.manufacturer_id.key : null,
        site_id: formValues.site_id ? formValues.site_id.key : null,
        id: this.state.editRecord.id,
        is_virtual:-1
      },
      callback: function () {
        message.success('修改流量计成功')
        that.setState({
          editModal: false,
        });
        that.handleSearchSite({
          page:that.state.page
        })
      }
    });
  }
  handleEditSite = () => {
    const that = this;
    const formValues = this.editSiteFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'flow_meter_sites/edit',
      payload: {
        ...formValues,
        id: this.state.editSiteRecord.id
      },
      callback: function () {
        message.success('修改流量计站点成功')
        that.setState({
          editSiteModal: false,
        });
        that.handleSearchSite({
          page: that.state.page,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'flow_meters/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除流量计成功')
        that.handleSearchSite({
          page: that.state.page,
        })
      }
    });
  }
  handleRemoveSite = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'flow_meter_sites/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除流量计站点成功')
        that.handleSearchSite({
          page: that.state.page,
        })
      }
    });
  }
  handleChangeTable = ()=> {
    const formValues = this.ChangeTableformRef.props.form.getFieldsValue();
    console.log(formValues)
  }
  renderPopiver = (item)=> {
    return (
      <div className="popover">
        <table className="custom-table">
          <tbody>
          <tr>
            <td>流量计编号</td>
            <td>{item.number}</td>
          </tr>
          <tr>
            <td>DMA分区名称</td>
            <td>{item.area_name}</td>
          </tr>
          <tr>
            <td>生产厂家</td>
            <td>{item.manufacturer_name}</td>
          </tr>
          <tr>
            <td>是否正向流量</td>
            <td>{item.is_forward_explain}<Icon style={{color:item.is_forward===1?'blue':'red'}} type={item.is_forward===1?"double-right":"double-left"} /> </td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>{item.created_at}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
  renderSitePopiver = (item)=> {
    return (
      <div className="popover">
        <table className="custom-table">
          <tbody>
          <tr>
            <td>流量计站点名称</td>
            <td>{item.name}</td>
          </tr>
          <tr>
            <td>流量计站点编号</td>
            <td>{item.number}</td>
          </tr>
          <tr>
            <td>地理信息编码</td>
            <td>{item.geo_code}</td>
          </tr>
          <tr>
            <td>地址</td>
            <td>{item.address}</td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>{item.created_at}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{item.remark}</td>
          </tr>

          </tbody>
        </table>
      </div>
    )
  }
  renderItem = (item)=> {
    const number = item.number;
    return (
      <span className="icon-wrap" style={{borderColor:item.is_forward===1?'#999':'red'}}>
        <span>
          <span> <i className="famen"/>流量计编号 : {number}</span>
        </span>
      </span>
    )
  }
  renderSiteItem = (item)=> {
    const name = item.name;
    return (
      <span className="icon-wrap" style={{background:'#fafafa'}}>
        <span>
          <span> <i className="fa"/>流量计站点名称 : {name}</span>
        </span>
      </span>
    )
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title = '流量计编号 : ' + item.number;
      if (item.children.length > 0) {
        return (
          <li key={item.id}>
            <Popover className="flow-meter-popover" style={{width: '200px'}} content={this.renderPopiver(item)}
                     title={title}>
              {this.renderItem(item)}
            </Popover>
            {
              this.state.showAddBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        const {dispatch} = this.props;
                        dispatch({
                          type: 'flow_meter_sites/fetchAll',
                          payload: {
                            return: 'all',
                            //area_id: item.area_id,
                          },
                          callback: ()=> {
                            item.site_name=
                            this.setState(
                              {
                                editRecord: item,
                                editModal: true
                              }
                            )
                          }
                        });

                      }}>编辑</a>
                  <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <Popconfirm placement="topRight" title={ `确定要删除${item.name}吗?`}
                          onConfirm={()=>this.handleRemove(item.id)}>
                <a href="">删除</a>
              </Popconfirm>
            }

            <ul >
              {this.renderTreeNodes(item.children)}
            </ul>
          </li>

        );
      }
      return <li key={item.id}>
        <Popover className="flow-meter-popover" content={this.renderPopiver(item)} title={title}>
          {this.renderItem(item)}
        </Popover>
        {
          this.state.showAddBtn &&
          <span>
                      <a href="javascript:;" onClick={()=> {
                        const {dispatch} = this.props;
                        dispatch({
                          type: 'flow_meter_sites/fetchAll',
                          payload: {
                            return: 'all',
                          },
                          callback: ()=> {
                            this.setState(
                              {
                                editRecord: item,
                                editModal: true
                              }
                            )
                          }
                        });

                      }}>编辑</a>
                  <span className="ant-divider"/>
                </span>
        }
        {
          this.state.showdelBtn &&
          <Popconfirm placement="topRight" title={ `确定要删除"${item.number}"吗?`}
                      onConfirm={()=>this.handleRemove(item.id)}>
            <a href="">删除</a>
          </Popconfirm>
        }
      </li>

    });
  }
  renderSiteNodes = (data) => {
    console.log(data)
    return data.map((item) => {
      const title = '流量计站点名称 : ' + item.name;
      return(
        <Panel header={title} key={item.id}>
          <ul className="no-border">
            <li>
              <Popover  content={this.renderSitePopiver(item)} title={title}>
                {this.renderSiteItem(item)}
              </Popover>
              {
                this.state.showAddSiteBtn &&
                <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editSiteRecord: item,
                            editSiteModal: true
                          }
                        )
                      }}>编辑</a>
                  <span className="ant-divider"/>
                </span>
              }
              {
                this.state.showdelSiteBtn &&
                <Popconfirm placement="topRight" title={ `确定要删除"${item.name}"吗?`}
                            onConfirm={()=>this.handleRemoveSite(item.id)}>
                  <a href="">删除</a>
                </Popconfirm>
              }

              <ul >
                {this.renderTreeNodes(item.flow_meters.data)}
              </ul>
            </li>
          </ul>
        </Panel>
      )
    });
  }
  render() {
    const {flow_meter_sites: {data, meta, allData}, manufacturers} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={[{name: '运行管理'}, {name: '流量计管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            showAddSiteBtn={this.state.showAddSiteBtn}
                            showAddBtn={this.state.showAddBtn }
                            clickAddSite={()=>{
                              this.setState({addSiteModal: true})
                            }}
                            clickAdd={()=> {
                              const {dispatch} = this.props;
                              const that=this;
                              dispatch({
                                type: 'flow_meter_sites/fetchAll',
                                payload: {
                                  return: 'all'
                                },
                                callback:()=>{
                                  that.setState({addModal: true})
                                }
                              });
                            }}/>
                  </div>
                </div>
                <div className="DMA-content">
                  <div className="tree well">
                    <Alert
                      className="tree-alert"
                      message="红色边框为反向流量计"
                      type="error"
                      closable
                    />

                    <Collapse >
                          {this.renderSiteNodes(data)}
                      </Collapse>
                  </div>
                </div>
                <Pagination meta={meta} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          destroyOnClose={true}
          title="添加流量计"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false})}
        >
          <AddOrEditForm flow_meter_sites={allData} manufacturers={manufacturers.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          destroyOnClose={true}
          title="添加流量计站点"
          visible={this.state.addSiteModal}
          onOk={this.handleAddSite}
          onCancel={() => this.setState({addSiteModal: false})}
        >
          <AddOrEditSiteForm  wrappedComponentRef={(inst) => this.siteFormRef = inst}/>
        </Modal>
        <Modal
          title="修改流量计"
          destroyOnClose={true}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <AddOrEditForm  flow_meter_sites={allData} manufacturers={manufacturers.data} editRecord={this.state.editRecord}
                         wrappedComponentRef={(inst) => this.editFormRef = inst}/>

        </Modal>
        <Modal
          destroyOnClose={true}
          title="修改流量计站点"
          visible={this.state.editSiteModal}
          onOk={this.handleEditSite}
          onCancel={() => this.setState({editSiteModal: false})}
        >
          <AddOrEditSiteForm  editRecord={this.state.editSiteRecord}  wrappedComponentRef={(inst) => this.editSiteFormRef = inst}/>
        </Modal>
      </Layout>
    );
  }
}

export default FlowMeter
