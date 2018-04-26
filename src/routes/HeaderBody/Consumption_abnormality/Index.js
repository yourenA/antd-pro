import React, {PureComponent} from 'react';
import { Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  consumption_abnormality: state.consumption_abnormality
}))
class Consumption_abnormality extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      manufacturer_id: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      member_number: '',
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
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      area_id: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'consumption_abnormality/fetch',
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
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      // area: this.state.area
    })
  }

  render() {
    const {consumption_abnormality: {data, meta, loading}, dma} = this.props;
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
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
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number', fixed: 'left',},
      {title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number',},
      {title: '水表序号', width: 80, dataIndex: 'meter_index', key: 'meter_index',},
      {title: '日期', dataIndex: 'date', width: 120,  key: 'date',},
      {title: '当天水表读值', width: 120, dataIndex: 'today_value', key: 'today_value'},
      {title: '昨天水表读值', width: 120, dataIndex: 'yesterday_value', key: 'yesterday_value'},
      {title: '用水量', width: 100,dataIndex: 'difference_value', key: 'difference_value'},
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number',},
      {title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name'},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address'},

    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '用水量异常报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search
                             dma={dma}
                            initRange={this.state.initRange}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                           />
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
                  rowKey={record => record.uuidkey}
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

export default Consumption_abnormality
