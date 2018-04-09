import React, {PureComponent} from 'react';
import {
  Pagination,
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
  Col
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './../OnlyAdd'
import Sider from './DMASider'
import {connect} from 'dva';
import AddOrEditForm from './addOrEditFlowMeter'
import moment from 'moment'
import find from 'lodash/find'
import uuid from 'uuid/v4'
import request from '../../../utils/request';
import './index.less'
const Panel = Collapse.Panel;
const {Content} = Layout;
@connect(state => ({
  flow_meters: state.flow_meters,
  manufacturers: state.manufacturers,

}))
class FlowMeter extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'flow_meter_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'flow_meter_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      area_id: '',
      editModal: false,
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
      }
    });
    window.addEventListener('resize', this.changeTableY)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.changeTableY)
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.DMA-content').offsetTop - (68 + 54 + 17)
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
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      install_address: '',
    })
  }

  handleSearch = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'flow_meters/fetch',
      payload: {
        ...values,
        return: 'all',
        // page: values.page,
        area_id: values.area_id ? values.area_id : this.state.area_id,

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
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
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
      },
      callback: function () {
        message.success('添加流量计成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          return: 'all',
          // page:1,
          area_id: that.state.area_id
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
        id: this.state.editRecord.id
      },
      callback: function () {
        message.success('修改流量计成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
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
        that.handleSearch({
          return: 'all',
          // page:1,
          area_id: that.state.area_id
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
        <Row className="item">
          <Col span={12} className="popover-item-name">流量计编号 :</Col>
          <Col span={12}> {item.number}</Col>
        </Row>
        <Row className="item">
          <Col span={12} className="popover-item-name">生产厂家 :</Col>
          <Col span={12}> {item.manufacturer_name}</Col>
        </Row>
        <Row className="item">
          <Col span={12} className="popover-item-name">地理信息编码 :</Col>
          <Col span={12}> {item.geo_code}</Col>
        </Row >
        <Row className="item">
          <Col span={12} className="popover-item-name">是否正向流量 :</Col>
          <Col span={12}> {item.is_forward_explain}</Col>
        </Row >
        <Row className="item">
          <Col span={12} className="popover-item-name">DMA分区名称 :</Col>
          <Col span={12}> {item.area_name}</Col>
        </Row >
        <Row className="item">
          <Col span={12} className="popover-item-name">创建时间 :</Col>
          <Col span={12}> {item.created_at}</Col>
        </Row >
        <Row className="item">
          <Col span={12} className="popover-item-name">地址 :</Col>
          <Col span={12}> {item.address}</Col>
        </Row >
        <Row className="item">
          <Col span={12} className="popover-item-name">备注 :</Col>
          <Col span={12}> {item.remark}</Col>
        </Row >
      </div>
    )
  }
  renderItem = (item)=> {
    const number = item.number;
    const name = item.name;
    const area_name = item.area_name;
    return (
      <span className="icon-wrap">
        <span>
           <span> <i className="fa"/>DMA分区名称 : {area_name}</span>
           <span> <i className="famen"/>流量计名称 : {name}</span>
           <span> <i className="name"/>流量计编号 : {number}</span><br/>
        </span>
      </span>
    )
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title = '流量计名称 : ' + item.name;
      if (item.children.length > 0) {
        return (
          <li key={item.id}>
            <Popover className="flow-meter-popover" content={this.renderPopiver(item)} title={title}>
              {this.renderItem(item)}
            </Popover>
            {
              this.state.showAddBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        const {dispatch} = this.props;
                        dispatch({
                          type: 'flow_meters/fetchAll',
                          payload: {
                            return: 'all',
                            area_id: item.area_id,
                          },
                          callback:()=>{
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
        <Popover  className="flow-meter-popover"  content={this.renderPopiver(item)} title={title}>
          {this.renderItem(item)}
        </Popover>
        {
          this.state.showAddBtn &&
          <span>
                      <a href="javascript:;" onClick={()=> {
                        const {dispatch} = this.props;
                        dispatch({
                          type: 'flow_meters/fetchAll',
                          payload: {
                            return: 'all',
                            area_id: item.area_id,
                          },
                          callback:()=>{
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
      </li>

    });
  }

  render() {
    const {flow_meters: {data, meta, loading}, manufacturers} = this.props;
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
                            showAddBtn={this.state.showAddBtn }
                            clickAdd={()=>{
                                  this.setState({addModal: true})
                            }}/>
                  </div>
                </div>
                <div className="DMA-content" style={{height: this.state.tableY + 'px', overflow: 'auto'}}>
                  <div className="tree well">
                    <ul className="no-border">
                      <li>
                          <span className="icon-wrap">
                           <span>
                              <span> <i className="fa"/>{this.state.nowArea}</span>
                           </span>
                         </span>

                        <ul >
                          {this.renderTreeNodes(data)}
                        </ul>
                      </li>
                    </ul>
                  </div>
                  {/*
                   <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                   current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                   style={{marginTop: '10px'}} onChange={this.handPageChange}/>*/}
                </div>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Modal
          title="添加流量计"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false})}
        >
          <AddOrEditForm manufacturers={manufacturers.data} wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          title="修改DMA分区"
          destroyOnClose={true}
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <AddOrEditForm manufacturers={manufacturers.data} editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>

        </Modal>
      </Layout>
    );
  }
}

export default FlowMeter
