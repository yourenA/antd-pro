import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip,Row,Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData,renderIndex2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
  global:state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage:1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll:true,
      expandedRowKeys:[]
      // concentrator_number:''
    }
  }

  componentDidMount() {
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }
  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable=()=>{
    console.log('scroll')
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop',scrollTop)
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      console.log('到达底部');
      if(this.state.canLoadByScroll){
        const {village_meter_data: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            install_address: this.state.install_address,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            // area: this.state.area
          },true,function () {
            that.setState({
              canLoadByScroll:true,
            })
          })
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
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
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number:'',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number:this.state.meter_number ,
        member_number: this.state.member_number,
        install_address:this.state.install_address,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
      })
    })
  }
  changeConcentrator = (concentrator_number,parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:parent_village_id,
      concentrator_number:concentrator_number
    }, function(){
      this.handleSearch({
        page: 1,
        meter_number:this.state.meter_number ,
        member_number: this.state.member_number,
        install_address:this.state.install_address,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,

      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number:'',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  delayering=(data,layer=0)=>{
    if(!data) return null;
    return data.map((item) => {
      item.layer=layer
      if(item.children){
        this.setState({
          expandedRowKeys:[item.village_id,...this.state.expandedRowKeys]
        })
        return this.delayering(item.children,layer+1)
      }
      return item
    });
  }
  handleSearch = (values,fetchAndPush=false,cb) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys:[]
    })
    dispatch({
      type: fetchAndPush?'village_meter_data/fetchAndPush':'village_meter_data/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        const {village_meter_data: {data }} = that.props;
        that.delayering(data);
        that.setState({
          ...values,
        })
        if(!fetchAndPush){
          that.setState({
            initPage:values.page
          })
        }
        if(cb)cb()
      }
    });
  }
  handPageChange = (page)=> {
    const that=this;
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

  render() {
    const {village_meter_data: {data, meta, loading}, concentrators, meters} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'index',
      //   key: 'index',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta, this.state.initPage, index)
      //   }
      // },
      {title: '小区名称',  dataIndex: 'village_name', key: 'village_name',width:'40%'},
      {title: '用户数量',  dataIndex: 'member_count', key: 'member_count',width:'30%',  render: (val, record, index) => {
        // console.log('record',record)
        // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft:`${parseInt(record.layer)*25}px`}}>{val}</span>
        )
      }},
      {title: '小区总用水量(T)', dataIndex: 'total_difference_value', key: 'total_difference_value',width:'30%',
        render: (val, record, index) => {
          // console.log('record',record)
          // console.log('record.layer*25',record.layer+25)
        return (
          <span style={{paddingLeft:`${parseInt(record.layer)*25}px`}}>{val}</span>
        )
      }},
    ];
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider
                showConcentrator={false}
                changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '数据分析'}, {name: '小区水量分析'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                  <div className='tableList'>
                    <div className='tableListForm'>
                      <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                              initRange={this.state.initRange}
                              village_id={this.state.village_id}
                              handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                              showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                              clickAdd={()=>this.setState({addModal: true})}/>
                    </div>
                  </div>
                  <Table
                    className='meter-table'
                    loading={loading}
                    rowKey={record => record.village_id}
                    dataSource={data}
                    expandedRowKeys={this.state.expandedRowKeys}
                    onExpand={(expanded, record)=>{
                      const index=Array.indexOf(this.state.expandedRowKeys, record.village_id);
                      if(expanded){
                        this.setState(
                          update(this.state, {
                            expandedRowKeys: {
                              $push: [record.village_id],
                            },
                          }),
                        )
                      }else{
                        this.setState(
                          update(this.state, {
                            expandedRowKeys: {
                              $splice: [[index, 1]],
                            },
                          }),
                        )
                      }

                    }}
                    columns={columns}
                    scroll={{y: isMobile?document.body.offsetHeight-200:this.state.tableY}}
                    pagination={false}
                    size="small"
                  />

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
