import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Badge,Modal,Button } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import { routerRedux } from 'dva/router';
import {connect} from 'dva';
import Sider from './../EmptySider'
import moment from 'moment';
import {renderIndex,ellipsis2} from './../../../utils/utils'
import Detail from './Detail'
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
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      date: '',
      area_id: '',
      concentrator_number: '',
      meter_number: '',
      member_number: '',
      editModal: false,
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
      concentrator_number: '',
      meter_number: '',
      member_number: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 +5)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      area_id: '',
      page: 1,
      concentrator_number: '',
      meter_number: '',
      member_number: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
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
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      concentrator_number: this.state.concentrator_number,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
    })
  }

  operate = (record)=> {
    this.setState({
      member_number:record.member_number,
      abnormality_hours: record.abnormality_hours,
      difference_values: record.difference_values,
      editModal: true
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
        width: 50,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number',float:'left'},
      {title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name'},
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表编号', width: 110, dataIndex: 'meter_number', key: 'meter_number',},
      {title: '水表序号', width: 80, dataIndex: 'meter_index', key: 'meter_index',},
      {title: '安装地址', dataIndex: 'install_address', width: 100,  key: 'install_address', render: (val, record, index) => {
        return ellipsis2(val,100)
      }},
      {title: '日期', dataIndex: 'date',   key: 'date', width: 100,
       },
      {title: '异常时间', dataIndex: 'abnormality_hours',   key: 'abnormality_hours',
        render: (val, record, index) => {
          const parseVal=val.join(',');
          return ellipsis2(parseVal,100)
        }},
      {
        title: '当天水表读数',
        key: 'operation',
        fixed: 'right',
        width: 110,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}>当天水表读数</Button>
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
            <PageHeaderLayout title="异常分析 " breadcrumb={[{name: '异常分析 '}, {name: '夜间异常流量报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch
                      setWarningRule={()=>{
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/night_warning_setup`));
                      }}
                      dma={dma} handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  rowKey={record => record.uuidkey}
                  loading={loading}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1050,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>

              </Card>
              <Modal
                width="750px"
                key={ Date.parse(new Date())}
                title={`${this.state.member_number} 当天用水量 (红色表示异常时间)`}
                visible={this.state.editModal}
                onOk={() => this.setState({editModal: false})}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail abnormality_hours={this.state.abnormality_hours} difference_values={this.state.difference_values}/>
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default FunctionContent