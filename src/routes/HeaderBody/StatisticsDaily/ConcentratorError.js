import React, {PureComponent} from 'react';
import { Table, Card, Layout, message,Badge} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './ConcentratorErrorSearch'
import {connect} from 'dva';
import moment from 'moment';
import uuid from 'uuid/v4'
@connect(state => ({
  concentrator_daily_errors: state.concentrator_daily_errors,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initDate:moment(new Date(), 'YYYY-MM-DD'),
      date: '',
      concentrator_number:''
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    this.handleSearch({
      concentrator_number:'',
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      concentrator_number:'',
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values) => {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrator_daily_errors/fetch',
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
    this.handleSearch({
      concentrator_number:this.state.concentrator_number,
      page: page,
      date: this.state.date,

    })
  }


  render() {
    const {concentrator_daily_errors: {data, meta, loading}} = this.props;
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
      {title: '集中器编号', width: '25%', dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '离线时间', width:  '30%', dataIndex: 'offlines', key: 'offlines'},
      {title: '错误类型', dataIndex: 'status', key: 'status' ,render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.status_explain}
        </p>
      )},
      {title: '安装地址', width:  '25%', dataIndex: 'install_address', key: 'install_address'},

    ];
    return (
      <PageHeaderLayout title="异常分析 " breadcrumb={[{name: '异常分析 '}, {name: '统计日报'}, {name: '集中器错误'}]}>
        <Card bordered={false} style={{margin: '-16px -16px 0'}}>
          <div className='tableList'>
            <div className='tableListForm'>
              <DefaultSearch inputText="集中器编号" dateText="发送时间" handleSearch={this.handleSearch}
                             handleFormReset={this.handleFormReset} initDate={this.state.initDate}/>
            </div>
          </div>
          <Table
            className='meter-table'
            loading={false}
            rowKey={record => record.uuidkey}
            dataSource={data}
            columns={columns}
            scroll={{y: this.state.tableY}}
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
