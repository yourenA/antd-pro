import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './Sider'
const { Content} = Layout;
@connect(state => ({
  manufacturers: state.manufacturers,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      query: '',
      page: 1,
      started_at: '',
      ended_at: '',
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        page: 1,
      }
    });
  }

  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
      },
    });
    this.setState({
      page: 1,
      query: '',
      started_at: '',
      ended_at: '',
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        ...values,
      },
    });

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

  render() {
    const {manufacturers: {data, meta, loading}} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '厂商编号', width: '15%', dataIndex: 'code', key: 'code'},
      {title: '厂商名称', width: '15%', dataIndex: 'name', key: 'name'},
      {title: '集中器数量', dataIndex: 'concentrator_count', key: 'concentrator_count', width: '15%'},
      {title: '水表数量', dataIndex: 'meter_count', key: 'meter_count', width: '15%'},
      {title: '厂商电话', dataIndex: 'phone', key: 'phone', width: '15%'},
      {
        title: '联系人', dataIndex: 'contact', key: 'contact',
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '厂商查询'}]} >
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="厂商名称" dateText="发送时间" handleSearch={this.handleSearch}
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
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={{ y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                            current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                            style={{marginTop: '10px'}} onChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default FunctionContent
