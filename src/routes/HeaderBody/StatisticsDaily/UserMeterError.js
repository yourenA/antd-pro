import React, {PureComponent} from 'react';
import { Table, Card, Layout, message,Badge} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import {renderIndex} from './../../../utils/utils'
import moment from 'moment'
import { routerRedux} from 'dva/router';
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
      initDate:moment(new Date(), 'YYYY-MM-DD'),
      date:  moment(moment(new Date(), 'YYYY-MM-DD')).format('YYYY-MM-DD'),
      concentrator_number:'',
      meter_number:'',
      member_number: '',
      display_type: 'all',
    }
  }

  componentDidMount() {
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
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      concentrator_number:'',
      meter_number:'',
      member_number: '',
      display_type: 'all',
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values) => {
    console.log('values',values)
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_daily_errors/fetch',
      payload: {
        ...values,
      },
      callback:function () {
        that.setState({
          ...values,
        })
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
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '集中器编号', width: '20%', dataIndex: 'concentrator_number', key: 'concentrator_number'
        , render: (val, record, index) => {
        return (
          <p  className="link" onClick={()=>{
            dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/concentrator_unusual_analysis?concentrator=${val}`));
          }} >{val}</p>
        )
      }},
      {title: '户号', width:  '20%', dataIndex: 'member_number', key: 'member_number'},
      {title: '水表编号', width:  '20%', dataIndex: 'meter_number', key: 'meter_number'},
      {title: '水表序号', width:  '20%', dataIndex: 'meter_index', key: 'meter_index'},
      {title: '错误类型', dataIndex: 'status', key: 'status' ,render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.status_explain}
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
                             handleFormReset={this.handleFormReset} initDate={this.state.initDate}/>
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
            rowKey={record => record.meter_number}
            dataSource={data}
            columns={columns}
            scroll={isMobile?{x:600}:{y: this.state.tableY}}
            //scroll={{y: this.state.tableY}}
            pagination={false}
            size="small"
          />
          <Pagination meta={meta} handPageChange={this.handPageChange}/>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default FunctionContent
