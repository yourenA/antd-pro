import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Button, Layout, message,Badge} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../../../components/DefaultSearch/index'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import './index.less'
const {Content} = Layout;
@connect(state => ({
  endpoints: state.endpoints,
}))
class CommunityAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      query: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      area: '',
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }

  siderLoadedCallback = (area)=> {
    this.setState({
      area
    })
    this.handleSearch({
      page: 1,
      query: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      area: area
    })
  }

  changeArea = (area)=> {
    this.formRef.props.form.resetFields()
    this.handleSearch({
      page: 1,
      query: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      area: area
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      query: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      area: this.state.area
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'endpoints/fetch',
      payload: {
        area: values.area? values.area:this.state.area,
        ...values,
      },
    });

    this.setState({
      query: values.query,
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page,
      area:values.area? values.area:this.state.area,
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      area: this.state.area
    })
  }

  operate = (id)=> {
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
      {title: '集中器编号', width: 150, dataIndex: 'name', key: 'name', fixed: 'left',},
      {title: '生产厂商', width: 150, dataIndex: 'age', key: 'age'},
      {title: '安装位置', dataIndex: 'address', key: '1123', width: 150,},
      {title: '日期', dataIndex: 'address', key: '2123',},
      {title: '0', dataIndex: 'address', key: '0', width: 40, render: (val, record, index) => {
        return (
          <span  title="成功">
             <Badge status="success"/>
          </span>
        )
      }},
      {title: '1', dataIndex: 'address', key: '1', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '2', dataIndex: 'address', key: '2', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '3', dataIndex: 'address', key: '3', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '4', dataIndex: 'address', key: '4', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '5', dataIndex: 'address', key: '5', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '6', dataIndex: 'address', key: '6', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '7', dataIndex: 'address', key: '7', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '8', dataIndex: 'address', key: '8', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '9', dataIndex: 'address', key: '9', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '10', dataIndex: 'address', key: '10', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '11', dataIndex: 'address', key: '11', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '12', dataIndex: 'address', key: '12', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '13', dataIndex: 'address', key: '13', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '14', dataIndex: 'address', key: '14', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '15', dataIndex: 'address', key: '15', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '16', dataIndex: 'address', key: '16', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '17', dataIndex: 'address', key: '17', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '18', dataIndex: 'address', key: '18', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '19', dataIndex: 'address', key: '19', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '20', dataIndex: 'address', key: '20', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '21', dataIndex: 'address', key: '21', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '22', dataIndex: 'address', key: '22', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
      {title: '23', dataIndex: 'address', key: '23', width: 40, render: (val, record, index) => {
        return (
          <Badge status="success" />
        )
      }},
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '集中器异常分析'}]}>
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch   wrappedComponentRef={(inst) => this.formRef = inst}
                                     handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                                   initRange={this.state.initRange}/>
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if (record.description === '') {
                      return 'error'
                    }
                  }}
                  className='meter-table error-analysis'
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
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
          </div>
        </Content>
      </Layout>
    );
  }
}

export default CommunityAnalysis
