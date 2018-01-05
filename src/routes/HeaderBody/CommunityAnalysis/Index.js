import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Button, Layout, message} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../../../components/DefaultSearch/index'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
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
    console.log('加载区域', area)
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
      {title: '水表编号', width: 120, dataIndex: 'name', key: 'name', fixed: 'left',},
      {title: '水表类型', width: 120, dataIndex: 'age', key: 'age', fixed: 'left'},
      {title: '集中器编号', dataIndex: 'address', key: '1', width: 120,},
      {title: '安装地址', dataIndex: 'address', key: '2', width: 150,},
      {title: '上次抄见', dataIndex: 'address', key: '3', width: 120,},
      {title: '上次抄见时间', dataIndex: 'address', key: '4', width: 200,},
      {title: '本次抄见', dataIndex: 'set', key: '5', width: 120,},
      {title: '本次抄见时间', dataIndex: 'address', key: '6', width: 200},
      {title: '应收水量', dataIndex: 'address', key: '7'},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 283,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record.id)}>点抄 901F</Button>
              <Button type="primary" disabled size='small' onClick={()=>this.operate(record.id)}>点抄 90EF</Button>
              <Button type="danger" size='small' onClick={()=>this.operate(record.id)}>停用</Button>
              <Button type="primary" disabled size='small' onClick={()=>this.operate(record.id)}>关阀</Button>
            </div>
          )
        }
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '小区水量分析'}]}>
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
                  className='meter-table'
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
