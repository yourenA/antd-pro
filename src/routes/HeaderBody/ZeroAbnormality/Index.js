import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Badge, Button, Modal} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import {routerRedux} from 'dva/router';
import moment from 'moment';
import Detail from './../UserMeterAnalysis/Detail'
import uuid from 'uuid/v4'
import {renderIndex} from '../../../utils/utils'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  zero_abnormality: state.zero_abnormality,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      // initDate: moment(new Date(), 'YYYY-MM-DD'),
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      date: '',
      area_id: '',
      member_number:'',
      concentrator_number:'',
      meter_number:'',
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'dma/fetchAll',
      payload: {
        return: 'all'
      },
      callback: ()=> {
        that.changeTableY()
      }
    });
    this.handleSearch({
      area_id: '',
      page: 1,
      // date: moment(this.state.initDate).format('YYYY-MM-DD'),
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 +20)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      area_id: '',
      page: 1,
      member_number:'',
      concentrator_number:'',
      meter_number:'',
      // date: moment(this.state.initDate).format('YYYY-MM-DD'),
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values, cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'zero_abnormality/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if (cb)cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      area_id: this.state.area_id,
      page: page,
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      // date: this.state.date,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
    })
  }

  operate = (record)=> {
    this.setState({
      show_member_number: record.member_number,
      editModal: true
    })
  }

  render() {
    const {zero_abnormality: {data, meta, loading}, dma} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number'},
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表号', width: 100, dataIndex: 'meter_number', key: 'meter_number'},
      {title: '姓名', dataIndex: 'real_name', width: 100, key: 'real_name'},
      {title: '日期', width: 100, dataIndex: 'date', key: 'date'},
      {title: '持续时间(天)', width: 100, dataIndex: 'duration_days', key: 'duration_days'},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address'},
      {
        title: '查询历史状况',
        key: 'operation',
        width: 110,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}>详细信息</Button>
            </div>
          )
        }
      },
    ];
    const {dispatch}=this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析 " breadcrumb={[{name: '异常分析 '}, {name: '零流量异常报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch
                      setWarningRule={()=> {
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/zero_warning_setup`));
                      }}
                      dma={dma} handleSearch={this.handleSearch}
                      handleFormReset={this.handleFormReset} initDate={this.state.initDate}
                      initRange={this.state.initRange}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  loading={loading}
                  scroll={{x:1000}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>

              </Card>
              <Modal
                width="750px"
                key={ Date.parse(new Date())}
                title={`${this.state.show_member_number} 详细信息`}
                visible={this.state.editModal}
                onOk={this.handleEdit}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail member_number={this.state.show_member_number} ended_at={this.state.ended_at}
                        started_at={this.state.started_at}/>
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default FunctionContent
