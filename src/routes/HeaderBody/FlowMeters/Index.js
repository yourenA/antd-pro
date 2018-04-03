import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Popconfirm, Layout, message, Modal, Button, Icon, Collapse, Popover,Row ,Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './../OnlyAdd'
import Sider from './../Sider'
import {connect} from 'dva';
import AddOrEditForm from './addOrEditFlowMeter'
import moment from 'moment'
import find from 'lodash/find'
import uuid from 'uuid/v4'
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
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'flow_meter_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
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
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.DMA-content').offsetTop - (68 + 54 + 17)
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
      type: 'flow_meters/fetch',
      payload: {
        page: values.page,
        village_id: values.village_id ? values.village_id : this.state.village_id,
        // ...values,
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
  renderPopiver = (item)=> {
    return (
      <div className="popover">
        <Row className="item">
          <Col span={8}>生产厂家 :</Col>
          <Col span={16}> {item.manufacturer_name}</Col>
        </Row>
        <Row className="item">
          <Col span={8}>创建时间 :</Col>
          <Col span={16}> {item.created_at}</Col>
        </Row >
        <Row  className="item">
          <Col span={8}>来源小区 :</Col>
          <Col span={16}>  {
            item.villages.length > 0 ?
              item.villages.map((item2, index)=> {
                return (
                  <p className="source" key={index}>
                    {item2.name}
                  </p>
                )
              }) : null
          }</Col>
        </Row>
        <Row className="item">
          <Col span={8}>创建时间 :</Col>
          <Col span={16}> {item.created_at}</Col>
        </Row >
      </div>
    )
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title = item.number;
      if (item.is_root === 1) {
        return (
          <Panel header={title} key={item.id}>
            <div className="tree well">
              <ul className="no-border">
                <li>
                  <Popover content={this.renderPopiver(item)} title={title}>
                    <span><i className="famen"/> {title}</span>
                  </Popover>
                  <ul >
                    {this.renderTreeNodes(item.children)}
                  </ul>
                </li>
              </ul>
            </div>
          </Panel>
        );
      }
      if (item.children.length > 0) {
        return (
          <li key={item.id}>
            <Popover content={this.renderPopiver(item)} title={title}>
              <span><i className="famen"/> {title}</span>
            </Popover>
            <ul >
              {this.renderTreeNodes(item.children)}
            </ul>
          </li>

        );
      }
      return <li key={item.id}>
        <Popover content={this.renderPopiver(item)} title={title}>
          <span><i className="famen"/> {title}</span>
        </Popover>
      </li>

    });
  }

  render() {
    const {flow_meters: {data, meta, loading}, manufacturers} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number', fixed: 'left',},
      {title: '户号', width: 80, dataIndex: 'member_number', key: 'member_number'},
      {title: '应收水量', width: 100, dataIndex: 'difference_value', key: 'difference_value'},
      {title: '上次抄见时间', dataIndex: 'previous_collected_at', key: 'previous_collected_at', width: 160,},
      {title: '上次抄见', dataIndex: 'previous_value', key: 'previous_value', width: 120,},
      {title: '本次抄见时间', dataIndex: 'latest_collected_at', key: 'latest_collected_at', width: 160,},
      {title: '本次抄见', dataIndex: 'latest_value', key: 'latest_value', width: 120,},
      {title: '水表类型', width: 130, dataIndex: 'meter_model_name', key: 'meter_model_name',},
      {title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number', width: 100,},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address',},

      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 300,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>message.info('该功能暂未开通')}>点抄 901F</Button>
              <Button type="primary" disabled size='small' onClick={()=>message.info('该功能暂未开通')}>点抄 90EF</Button>
              {/*<Button type="danger" size='small' onClick={()=>message.info('该功能暂未开通')}>停用</Button>*/}
              <Button type="primary" disabled size='small' onClick={()=>message.info('该功能暂未开通')}>关阀</Button>
            </div>
          )
        }
      },
    ];
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
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <div className="DMA-content" style={{height: this.state.tableY + 'px', overflow: 'auto'}}>
                  {
                    data.length>0&&
                    <Collapse >
                      {this.renderTreeNodes(data)}
                    </Collapse>
                  }

                  <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                              current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                              style={{marginTop: '10px'}} onChange={this.handPageChange}/>
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
      </Layout>
    );
  }
}

export default FlowMeter
