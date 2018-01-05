import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Button, Layout,message,Modal} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from '../../../components/DefaultSearch/index'
import AddConcentrator from './AddConcentrator'
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
      initRange:[moment(new Date().getFullYear()+'-'+new  Date().getMonth()+1+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at:'',
      ended_at:'',
      editModal:false,
      addModal:false,
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

  operate=(id)=>{
    console.log(id)
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
      { title: '集中器编号', width: 180, dataIndex: 'name', key: 'name',    fixed: 'left', },
      { title: '集中器类型', width: 140, dataIndex: 'age', key: 'age'},
      { title: '硬件编号', dataIndex: 'address', key: '1' ,width: 180, },
      { title: '地址', dataIndex: 'address', key: '2' ,width: 240,},
      { title: '在线状态', dataIndex: 'address', key: '3' ,width: 120,},
      { title: '本轮登录时间', dataIndex: 'address', key: '4' ,width: 180,},
      { title: '最后访问时间', dataIndex: 'set', key: '5',width: 180,},
      { title: '水表总数', dataIndex: 'address', key: '6',width: 120},
      { title: '上行报文（指令）', dataIndex: 'set', key: '51',width: 180,},
      { title: '下行报文（指令）', dataIndex: 'address', key: '614',width: 180},
      { title: '是否做统计日报', dataIndex: 'address', key: '615'},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 180,
        render: (val, record, index) => {
          return(
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record.id)}>编辑</Button>
              <Button type="danger" size='small' onClick={()=>this.operate(record.id)}>删除</Button>
              <Button type="primary" size='small' onClick={()=>this.operate(record.id)}>指令</Button>
            </div>
            )
        }
      },
    ];
    console.log('tabY',this.state.tableY)
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}   siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={[{name: '运行管理'}, {name: '集中器管理'}]}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.formRef = inst}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
                  </div>
                  <div className='tableListOperator'>
                    <Button icon="plus" type="primary" onClick={() => this.setState({addModal:true})}>添加</Button>
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
                  scroll={{ x: 2050, y: this.state.tableY }}
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
          title="添加集中器"
          visible={this.state.addModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({addModal:false})}
        >
          <AddConcentrator />
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="集中器指令:集中器编号"
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
