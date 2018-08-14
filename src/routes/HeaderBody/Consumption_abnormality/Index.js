import React, {PureComponent} from 'react';
import { Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import { routerRedux } from 'dva/router';
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  consumption_abnormality: state.consumption_abnormality
}))
class Consumption_abnormality extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      manufacturer_id: '',
      page: 1,
      initPage:1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      member_number:'',
      concentrator_number:'',
      meter_number:'',
      area_id: '',
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'dma/fetchAll',
      payload: {
        return: 'all'
      },
      callback:()=>{
        that.changeTableY()
      }
    });
    this.handleSearch({
      area_id: '',
      page: 1,
      member_number:'',
      concentrator_number:'',
      meter_number:'',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      per_page:30
    })
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
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
        const {consumption_abnormality: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            area_id: this.state.area_id,
            member_number:this.state.member_number,
            concentrator_number:this.state.concentrator_number,
            meter_number:this.state.meter_number,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
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
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop -(68 + 54 + 50 + 38 +5)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      area_id: '',
      member_number:'',
      concentrator_number:'',
      meter_number:'',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      per_page:30
    })
  }

  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'consumption_abnormality/fetchAndPush': 'consumption_abnormality/fetch',
      payload: {
        ...values,
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
      area_id: this.state.area_id,
      page: page,
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:this.state.per_page
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      area_id: this.state.area_id,
      page: 1,
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:per_page
      // area: this.state.area
    })
  }
  render() {
    const {consumption_abnormality: {data, meta, loading}, dma} = this.props;
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.initPage,index)
        }
      },
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number',},
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表编号', width: 110, dataIndex: 'meter_number', key: 'meter_number',},
      {title: '水表序号', width: 80, dataIndex: 'meter_index', key: 'meter_index',},
      {title: '日期', dataIndex: 'date', width: 120,  key: 'date',},
      {title: '今天水表读值', width: 120, dataIndex: 'today_value', key: 'today_value'},
      {title: '昨天水表读值', width: 120, dataIndex: 'yesterday_value', key: 'yesterday_value'},
      {title: '用水量', width: 100,dataIndex: 'difference_value', key: 'difference_value'},
      {title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address', render: (val, record, index) => {
        return ellipsis2(val, 150)
      }},

    ];
    const {dispatch}=this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '用水量异常报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search
                      setWarningRule={()=>{
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/unusual_water`));
                      }}
                      per_page={this.state.per_page}
                      dma={dma}
                            initRange={this.state.initRange}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                           />
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if (record.description === '') {
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1250,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Consumption_abnormality
