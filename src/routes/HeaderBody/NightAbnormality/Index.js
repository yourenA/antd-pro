import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Badge} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import moment from 'moment';
import uuid from 'uuid/v4'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  night_abnormality: state.night_abnormality,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initDate: moment(new Date(), 'YYYY-MM-DD'),
      date: '',
      area_id: ''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'dma/fetchAll',
      payload: {
        return: 'all'
      },
      callback:()=>{
        that.changeTableY()
      }
    });
    this.handleSearch({
      area_id: '',
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 17 + 45)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      area_id: '',
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'night_abnormality/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        })
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      area_id: this.state.area_id,
      page: page,
      date: this.state.date,
    })
  }


  render() {
    const {night_abnormality: {data, meta, loading}, dma} = this.props;
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
      {title: '户号', width: 120, dataIndex: 'member_number', key: 'member_number'},
      {title: '集中器编号', width: 120, dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表号', width:120, dataIndex: 'meter_number', key: 'meter_number'},
      {title: '水表序号', width:120, dataIndex: 'meter_index', key: 'meter_index'},
      {title: '抄见时间', width:180, dataIndex: 'collected_at', key: 'collected_at'},
      {title: '抄见数值', width: 100, dataIndex: 'meter_value', key: 'meter_value'},
      {title: '超出报警数值', width:150, dataIndex: 'overflow_value', key: 'overflow_value'},
      {title: '姓名', dataIndex: 'real_name',width: 120, key: 'real_name'},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address'},

    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析 " breadcrumb={[{name: '异常分析 '}, {name: '夜间异常流量报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch dma={dma} handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initDate={this.state.initDate}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={false}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1200, y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default FunctionContent
