import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Row,Col,Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import Sider from './Sider'
import find from 'lodash/find'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import AddOrEditVendor from './addOrEditVendor'
import debounce from 'lodash/throttle'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  manufacturers:state.manufacturers,
  vendor_meter: state.vendor_meter,
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
      started_at: moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD').format('YYYY-MM-DD'),
      ended_at:  moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
      editModal: false,
      addModal: false,
      per_page:30,
      canLoadByScroll: true,
      manufacturer_ids:[],
      maxWidth:0
    }
  }

  componentDidMount() {
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

    // this.handleSearch({
    //   page: 1,
    //   started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
    //   ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    //   manufacturer_ids:[],
    //   per_page:30,
    // },this.changeTableY)
    console.log('123')
    this.setState({
      maxWidth: document.querySelector('.ant-card-body').offsetWidth-32
    },function () {
      console.log('maxWidth',this.state.maxWidth)
    })
  }
  componentWillUnmount() {

    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 55 )
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
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      manufacturer_ids:this.state.manufacturer_ids
    })
  }
  handleSearch = (values,cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'vendor_meter/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        },function () {
          console.log(this.state.manufacturer_ids)
        })
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
    let {vendor_meter: {data, meta, loading}} = this.props;
    const columns = [
      {
        title: '采集时间',
        dataIndex: 'date',
        width: 100,
        className:'white-bg',
      },
    ];
    let tableX=100
    if(data[0]&&data[0].manufacturers){
      for(let i=0;i<data[0].manufacturers.length;i++){
        let name=data[0].manufacturers[i].name
        columns.push( {
          title: name,
          className:`vendor-meter${i%4+1}`,
          children: [
            {
              title: '水表总量',
              dataIndex:`total_count${i+1}`,
              width: 70,
              className:`vendor-meter${i%4+1}`,
              render:(text,record)=>{
                const findByName=find(record.manufacturers,(o)=>o.name===name)
                return findByName?findByName.total_count:''
              }
            },
            {
              title: '正常抄读数',
              dataIndex:`normal_count${i+1}`,
              className:`vendor-meter${i%4+1}`,
              width: 90,
              render:(text,record)=>{
                const findByName=find(record.manufacturers,(o)=>o.name===name)
                return findByName?findByName.normal_count:''
              }
            },
            {
              title: '异常数量',
              dataIndex:`abnormality_count${i+1}`,
              className:`vendor-meter${i%4+1}`,
              width: 70,
              render:(text,record)=>{
                const findByName=find(record.manufacturers,(o)=>o.name===name)
                return findByName?findByName.abnormality_count:''
              }
            },
            {
              title: '抄读率',
              dataIndex: `normal_rate${i+1}`,
              className:`vendor-meter${i%4+1}`,
              width: 60,
              render:(text,record)=>{
                const findByName=find(record.manufacturers,(o)=>o.name===name)
                return findByName?findByName.normal_rate:''
              }
            },
          ]
        },)
      }
      tableX=100+(data[0].manufacturers.length*290)
    }

    return (
      <Layout className="layout">
        <Sider changeTableY={this.changeTableY} location={this.props.history.location} handleSearch={this.handleSearch} started_at={this.state.started_at} ended_at={this.state.ended_at}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="运行管理 " breadcrumb={[{name: formatMessage({id: 'intl.data_analysis'})}, {name:formatMessage({id: 'intl.vendor_meter_statistics'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
               <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch  handleSearch={this.handleSearch}
                                    per_page={this.state.per_page}
                                    manufacturer_ids={this.state.manufacturer_ids}
                                    handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                    showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}/>
                  </div>
                </div>
                <Table
                  style={{color: '#fff',maxWidth:this.state.maxWidth+'px'}}
                  className="custom-small-table meter-table"
                  loading={loading}
                  rowKey={'date'}
                  dataSource={data}
                  columns={columns}
                  pagination={false}
                  size="small"
                  scroll={{x: tableX, y: this.state.tableY}}
                />

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
            destroyOnClose={true}
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
