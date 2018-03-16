import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
@connect(state => ({
  endpoints: state.endpoints,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      query: '',
      page: 1,
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    console.log(moment(this.state.initRange[0]).format('YYYY-MM-DD'))
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'endpoints/fetch',
    //   payload: {
    //     page: 1,
    //     started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
    //     ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    //   }
    // });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'endpoints/fetch',
    //   payload: {
    //     started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
    //     ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    //   },
    // });
    this.setState({
      page: 1,
      query: '',
      started_at: '',
      ended_at: '',
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'endpoints/fetch',
    //   payload: {
    //     ...values,
    //   },
    // });

    this.setState({
      query: values.query,
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at
    })
  }

  operate = (id)=> {
    console.log(id)
    message.success(id)
  }

  render() {
    const {endpoints: {data, meta, loading}} = this.props;
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
      {title: '集中器编号', width: 150, dataIndex: 'name', key: 'name'},
      {title: '操作', width: 150, dataIndex: 'age', key: 'age'},
      {title: '状态', dataIndex: 'addreseews', key: 'faff2', width: 150},
      {title: '发送时间', dataIndex: 'addddress', key: 'fa2', width: 150},
      {title: '协议', dataIndex: 'addressfae', key: '2ff', width: 150},
      {title: '参数', dataIndex: 'address2', key: '4',
        render: (val, record, index) => (
          <p className='text-ellipsis'>
            {val}
          </p>
        ),},
    ];
    return (
      <PageHeaderLayout title="运行管理 " breadcrumb={[{name: '运行管理 '}, {name: '指令和状态查看'}, {name: '功能函数'}]}>
        <Card bordered={false} style={{margin: '-16px -16px 0'}}>
          <div className='tableList'>
            <div className='tableListForm'>
              <DefaultSearch inputText="集中器编号" dateText="发送时间" handleSearch={this.handleSearch}
                             handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
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
            rowKey={record => record.id}
            dataSource={[]}
            columns={columns}
            scroll={{x: 1600, y: this.state.tableY}}
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
