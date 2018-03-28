import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm,Modal,Row,Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Guage from './../HomePage/AreaSupplyList'
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditVendor from './addOrEditVendor'
const {Content} = Layout;
@connect(state => ({
  manufacturers:state.manufacturers,
  vendor_concentrator: state.vendor_concentrator,
}))
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'manufacturer_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'manufacturer_delete'}),
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      tableY: 0,
      manufacturer_id: '',
      page: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return:'all'
      }
    });
    this.handleSearch({
      manufacturer_id: '',
      page: 1,
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    },function () {
      this.setState({
        tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
      })
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      manufacturer_id: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'vendor_concentrator/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      manufacturer_id:values.manufacturer_id,
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      manufacturer_id: this.state.manufacturer_id,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }
  render() {
    const {vendor_concentrator: {data, meta, loading},manufacturers} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '厂商名称', dataIndex: 'name', key: 'name'},
      {title: '集中器数量', dataIndex: 'concentrator_count', key: 'concentrator_count'},
      {title: '昨天上报率', dataIndex: 'concentrator_count2', key: 'concentrator_count2'},
      {title: '工况总计', dataIndex: 'concentrator_count3', key: 'concentrator_count3'},
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="运行管理 " breadcrumb={[{name: '运行管理 '}, {name: '厂商-集中器统计'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch  handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                    manufacturers={manufacturers.data} showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
                  </div>
                </div>
                <Row gutter={16}>
                  <Col span={10}>
                    <Guage></Guage>
                  </Col>
                  <Col span={14}>
                    <Table
                      rowClassName={function (record, index) {
                        if (record.description === '') {
                          return 'error'
                        }
                      }}
                      className='meter-table'
                      loading={loading}
                      rowKey={record => record.concentrator_number}
                      dataSource={data}
                      columns={columns}
                      scroll={{y: this.state.tableY}}
                      pagination={false}
                      size="small"
                    />
                    <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                                current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                                style={{marginTop: '10px'}} onChange={this.handPageChange}/>
                  </Col>
                </Row>

              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title="添加厂商"
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditVendor   wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            key={ Date.parse(new Date())}
            title="修改厂商"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditVendor editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
