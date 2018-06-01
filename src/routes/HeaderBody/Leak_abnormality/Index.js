import React, {PureComponent} from 'react';
import { Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import { routerRedux } from 'dva/router';
import find from 'lodash/find'
import uuid from 'uuid/v4'
import {renderIndex} from './../../../utils/utils'
import Detail from './Detail'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  leak_abnormality: state.leak_abnormality
}))
class Leak_abnormality extends PureComponent {
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
      concentrator_number:'',
      meter_number:'',
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
      member_number: '',
      concentrator_number:'',
      meter_number:'',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }

  handleSearch = (values) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'leak_abnormality/fetch',
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
      member_number: this.state.member_number,
      concentrator_number: this.state.concentrator_number,
      meter_number: this.state.meter_number,
      // area: this.state.area
    })
  }
  operate = (record)=> {
    this.setState({
      member_number:record.member_number,
      meter_values: record.meter_values,
      editModal: true
    })
  }
  render() {
    const {leak_abnormality: {data, meta, loading}, dma} = this.props;
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
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
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number',},
      {title: '用户名称', width: 100, dataIndex: 'real_name', key: 'real_name'},
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表编号', width: 100, dataIndex: 'meter_number', key: 'meter_number',},
      {title: '水表序号', width: 80, dataIndex: 'meter_index', key: 'meter_index',},
      {title: '异常开始时间', dataIndex: 'date',   key: 'date', width: 150,},
      {title: '安装地址', dataIndex: 'install_address',   key: 'install_address',},
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
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析" breadcrumb={[{name: '异常分析'}, {name: '漏水异常报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search
                      setWarningRule={()=>{
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/leak_warning_setup`));
                      }}
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
                  scroll={{x: 950}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} handPageChange={this.handPageChange}/>
              </Card>

              <Modal
                width="750px"
                key={ Date.parse(new Date())}
                title={`${this.state.member_number} 当天水量`}
                visible={this.state.editModal}
                onOk={this.handleEdit}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail meter_values={this.state.meter_values}/>
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Leak_abnormality
