import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Button, Layout,message,Modal} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import EditUserArchives from './EditUserArchives'
import Sider from './../Sider'
import {connect} from 'dva';
import ChangeTable from './ChangeTable'
import moment from 'moment'
import './index.less'
const { Content} = Layout;
@connect(state => ({
  members: state.members,
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
      changeModal:false,
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
    console.log('values',values)
    const {dispatch} = this.props;
    dispatch({
      type: 'members/fetch',
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


  handleChangeTable=()=>{
    const formValues =this.ChangeTableformRef.props.form.getFieldsValue();
    console.log(formValues)
  }
  render() {
    const {members: {data, meta, loading}} = this.props;
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
      { title: '水表编号', width: 100, dataIndex: 'name', key: 'name',    fixed: 'left', },
      { title: '户号', width: 150, dataIndex: 'age', key: 'age'},
      { title: '用户名称', dataIndex: 'address', key: '1' ,width: 150, },
      { title: '地址', dataIndex: 'address', key: '2' ,width: 180,},
      { title: '联系电话', dataIndex: 'address', key: '3' ,width: 150,},
      { title: '身份证号', dataIndex: 'address', key: '4' ,width: 150,},
      { title: '抄表员', dataIndex: 'set', key: '5',width: 120,},
      { title: '台区', dataIndex: 'address', key: '6',width: 100},
      { title: '表册', dataIndex: 'set', key: '51',width: 100,},
      { title: '用户创建时间', dataIndex: 'address', key: '614'},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (val, record, index) => {
          return(
            <div>
              <Button type="primary" size='small' onClick={()=>this.setState({
                editRecord:record,
                editModal:true
              })}>编辑</Button>
              <Button type="primary" size='small' onClick={()=>this.setState({
                editRecord:record,
                changeModal:true
              })}>换表</Button>
            </div>
            )
        }
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}   siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="运行管理" breadcrumb={[{name: '运行管理'}, {name: '用户管理'}]}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search handleSearch={this.handleSearch}
                            wrappedComponentRef={(inst) => this.formRef = inst}
                            handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
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
                  scroll={{ x: 1550, y: this.state.tableY }}
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
          key={ Date.parse(new Date())+1}
          title="编辑"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal:false})}
        >
          <EditUserArchives editRecord={this.state.editRecord} />
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="换表"
          visible={this.state.changeModal}
          onOk={this.handleChangeTable}
          onCancel={() => this.setState({changeModal:false})}
        >
          <ChangeTable  wrappedComponentRef={(inst) => this.ChangeTableformRef = inst}/>
        </Modal>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
