import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Button, Layout,message,Modal} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import Detail from './Detail'
import moment from 'moment'
import './index.less'
const { Content} = Layout;
@connect(state => ({
  endpoints: state.endpoints,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY:0,
      query: '',
      page: 1,
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at:'',
      ended_at:'',
      editModal:false,
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
    this.setState({editModal:true})
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
      { title: '户号', width: 150, dataIndex: 'name', key: 'name',    fixed: 'left', },
      { title: '用户名称', width: 150, dataIndex: 'age', key: 'age', fixed: 'left' },
      { title: '用户地址', dataIndex: 'address', key: '1' ,width: 180, },
      { title: '集中器编号', dataIndex: 'address', key: '2' ,width: 140,},
      { title: '水表编号', dataIndex: 'address', key: '3' ,width: 140,},
      { title: '水表厂商', dataIndex: 'address', key: '4' ,width: 120,},
      { title: '上次读数(T)', dataIndex: 'set', key: '5',width: 100,},
      { title: '上次读数时间', dataIndex: 'address', key: '6',width: 180},
      { title: '本次读数(T)', dataIndex: 'set', key: '51',width: 100,},
      { title: '本次读数时间', dataIndex: 'address', key: '614',width: 180},
      { title: '用水量(T)', dataIndex: 'address', key: '615',width: 100},
      { title: '状态', dataIndex: 'address', key: '616',width: 100},
      { title: '抄表员', dataIndex: 'address', key: '617',width: 120},
      { title: '台区', dataIndex: 'address', key: '618',width: 100},
      { title: '表册', dataIndex: 'address', key: '619'},
      {
        title: '查询历史状况',
        key: 'operation',
        fixed: 'right',
        width: 110,
        render: (val, record, index) => {
          return(
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record.id)}>详细信息</Button>
            </div>
            )
        }
      },
    ];
    console.log('tabY',this.state.tableY)
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '户表水量分析'}]}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search  wrappedComponentRef={(inst) => this.formRef = inst} handleSearch={this.handleSearch} handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
                  </div>
                </div>
                <Table
                  rowClassName={function (record, index) {
                    if(record.description===''){
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={{ x: 2150, y: this.state.tableY }}
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
        <Modal
          key={ Date.parse(new Date())}
          title="详细信息"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
          <Detail />
        </Modal>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
