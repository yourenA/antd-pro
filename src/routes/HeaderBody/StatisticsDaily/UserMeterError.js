import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message,Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
@connect(state => ({
  meter_daily_errors: state.meter_daily_errors,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initDate:moment(new Date(), 'YYYY-MM-DD'),
      date: '',
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    this.handleSearch({
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values) => {
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
    this.setState({
      date: values.date,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      date: this.state.date,
    })
  }


  render() {
    const {meter_daily_errors: {data, meta, loading}} = this.props;
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
      {title: '户表号', width:  '25%', dataIndex: 'meter_number', key: 'meter_number'},
      {title: '弧标索引', width:  '25%', dataIndex: 'meter_index', key: 'meter_index'},
      {title: '错误类型', dataIndex: 'status', key: 'status' ,render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.status_explain}

        </p>
      )},
    ];
    return (
      <PageHeaderLayout title="异常分析 " breadcrumb={[{name: '异常分析 '}, {name: '统计日报'}, {name: '户表错误'}]}>
        <Card bordered={false} style={{margin: '-24px -24px 0'}}>
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
            loading={false}
            rowKey={record => record.meter_number}
            dataSource={data}
            columns={columns}
            scroll={{y: this.state.tableY}}
            pagination={false}
            size="small"
          />
          <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                      current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                      style={{marginTop: '10px'}} onChange={this.handPageChange}/>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default FunctionContent
