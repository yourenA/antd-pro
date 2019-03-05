import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Row,Col,Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './../EmptySider'
import find from 'lodash/find'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import AddOrEditVendor from './addOrEditVendor'
import debounce from 'lodash/throttle'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  manufacturers:state.manufacturers,
  vendor_concentrator: state.vendor_concentrator,
}))
@injectIntl
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
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

    this.handleSearch({
      page: 1,
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      per_page:30,
    },this.changeTableY)
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
        const {vendor_concentrator: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page:this.state.per_page,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at
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
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'vendor_concentrator/fetchAndPush':'vendor_concentrator/fetch',
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
      per_page:this.state.per_page,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page:per_page,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    let {vendor_concentrator: {data, meta, loading}} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {title: formatMessage({id: 'intl.vendor_name'}), width: 200,dataIndex: 'manufacturer_name', key: 'manufacturer_name'
        , render: (val, record, index) => {
        return ellipsis2(val,200)
      }},
      {title: formatMessage({id: 'intl.concentrator_excellent_rate'}), dataIndex: 'concentrator_excellent_rate', key: 'concentrator_excellent_rate',
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
            <PageHeaderLayout title="运行管理 " breadcrumb={[{name: formatMessage({id: 'intl.data_analysis'})}, {name:formatMessage({id: 'intl.vendor_concentrator_statistics'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
               <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch  handleSearch={this.handleSearch}
                                    per_page={this.state.per_page}
                                    handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                    showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.manufacturer_id}
                                 scroll={{ y: this.state.tableY}}
                                 history={this.props.history}
                                 canOperate={this.state.canOperate}
                />
               {/* <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.manufacturer_id}
                  dataSource={data}
                  columns={columns}
                  scroll={{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
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
