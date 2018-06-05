import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Row,Col,Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../EmptySider'
import find from 'lodash/find'
import {renderIndex} from './../../../utils/utils'
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
      page: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
   /* dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return:'all'
      }
    });*/
    this.handleSearch({
      page: 1,
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    },this.changeTableY)
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values,cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'vendor_concentrator/fetch',
      payload: {
        ...values,
      },
    });
    if(cb) cb()
    this.setState({
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }
  render() {
    let {vendor_concentrator: {data, meta, loading}} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '厂商名称', width: '25%',dataIndex: 'manufacturer_name', key: 'manufacturer_name'},
      {title: '集中器优良率', dataIndex: 'concentrator_excellent_rate', key: 'concentrator_excellent_rate',
        render:(val,record)=>{
          const parserVal=parseFloat(val)
          if(typeof parserVal === 'number' && !isNaN(parserVal) ){
            return(
              <div style={{paddingRight:'20px'}}>
                <Progress percent={parseFloat(parserVal)} size="small" />
              </div>
            )
          }else{
            return val
          }
        }
      }


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
                                    showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.manufacturer_id}
                  dataSource={data}
                  columns={columns}
                  scroll={{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>
              {/*  <Row gutter={16}>
                  <Col span={10}>
                    <Guage data={data}></Guage>
                  </Col>
                  <Col span={14}>
                    <Table
                      className='meter-table'
                      loading={loading}
                      rowKey={record => record.id}
                      dataSource={data}
                      columns={columns}
                      scroll={{y: this.state.tableY}}
                      pagination={false}
                      size="small"
                    />
                    <Pagination meta={meta} handPageChange={this.handPageChange}/>
                  </Col>
                </Row>*/}

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
