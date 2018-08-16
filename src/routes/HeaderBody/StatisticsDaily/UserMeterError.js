import React, {PureComponent} from 'react';
import { Table, Card, Layout, message,Badge} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import {renderIndex,ellipsis2} from './../../../utils/utils'
import moment from 'moment'
import { routerRedux} from 'dva/router';
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
@connect(state => ({
  meter_daily_errors: state.meter_daily_errors,
  global:state.global,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initPage:1,
      initDate:moment(new Date(), 'YYYY-MM-DD'),
      date:  moment(moment(new Date(), 'YYYY-MM-DD')).format('YYYY-MM-DD'),
      concentrator_number:'',
      meter_number:'',
      member_number: '',
      display_type: 'all',
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_daily_errors/fetch',
      payload: {
        page: 1,
        concentrator_number:'',
        meter_number:'',
        member_number: '',
        display_type: 'all',
        date: moment(this.state.initDate).format('YYYY-MM-DD'),
      },
      callback:function () {
        that.changeTableY()
      }
    });
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
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
        const {meter_daily_errors: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            concentrator_number:this.state.concentrator_number,
            meter_number:this.state.meter_number,
            member_number: this.state.member_number,
            display_type: this.state.display_type,
            date: this.state.date,
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
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      concentrator_number:'',
      meter_number:'',
      member_number: '',
      display_type: 'all',
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    console.log('values',values)
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'meter_daily_errors/fetchAndPush': 'meter_daily_errors/fetch',
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
    console.log(this.state.date)
    this.handleSearch({
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      member_number: this.state.member_number,
      display_type: this.state.display_type,
      page: page,
      date: this.state.date,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      member_number: this.state.member_number,
      display_type: this.state.display_type,
      page: 1,
      date: this.state.date,
      per_page:per_page
    })
  }
  render() {
    const {meter_daily_errors: {data, meta, loading},dispatch} = this.props;
    const company_code = sessionStorage.getItem('company_code');
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
      {title: '集中器编号', width:200, dataIndex: 'concentrator_number', key: 'concentrator_number'
        , render: (val, record, index) => {
        return (
          <p  className="link" onClick={()=>{
            dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/concentrator_unusual_analysis?concentrator=${val}&date=${this.state.date}`));
          }} >{val}</p>
        )
      }},
      {title: '户号', width: 200, dataIndex: 'member_number', key: 'member_number',
        render: (val, record, index) => {
          return ellipsis2(val, 200)
        }},
      {title: '水表编号', width: 200, dataIndex: 'meter_number', key: 'meter_number',
        render: (val, record, index) => {
          return ellipsis2(val, 200)
        }},
      {title: '错误类型', dataIndex: 'status', key: 'status' ,render:(val, record, index) => (
        <p>
          <Badge status={val===-1?"warning":"error"} />{record.status_explain}
        </p>
      )},
    ];
    const {isMobile} =this.props.global;
    return (
      <PageHeaderLayout title="异常分析 " breadcrumb={[{name: '异常分析 '}, {name: '统计日报'}, {name: '户表错误'}]}>
        <Card bordered={false} style={{margin: '-16px -16px 0'}}>
          <div className='tableList'>
            <div className='tableListForm'>
              <DefaultSearch inputText="集中器编号" dateText="发送时间" handleSearch={this.handleSearch}
                             per_page={this.state.per_page}   handleFormReset={this.handleFormReset} initDate={this.state.initDate}/>
            </div>
          </div>
          <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                           dataSource={data} columns={columns} rowKey={record => record.meter_number}
                           scroll={isMobile?{x:600}:{y: this.state.tableY}}
                           history={this.props.history}
                           className={'meter-table padding-6'}
          />
       {/*   <Table
            rowClassName={function (record, index) {
              if (record.description === '') {
                return 'error'
              }
            }}
            className='meter-table'
            loading={loading}
            rowKey={record => record.meter_number}
            dataSource={data}
            columns={columns}
            scroll={isMobile?{x:600}:{y: this.state.tableY}}
            //scroll={{y: this.state.tableY}}
            pagination={false}
            size="small"
          />*/}
          <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  meta={meta} handPageChange={this.handPageChange}/>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default FunctionContent
