import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Tooltip,Badge,Button  } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Detail from './../UserMeterAnalysis/Detail'
import MemberDetail from './MemberDetail'
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import ResizeableTable from './../../../components/ResizeableTitle/RowSpanIndex'
import debounce from 'lodash/throttle'
import {renderIndex, ellipsis2,renderRowSpan,parseRowSpanData2,parseRowSpanData3,getPreDay} from './../../../utils/utils'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  member_consumption: state.member_consumption,
  global: state.global,

}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      query: '',
      meter_number: '',
      member_number: '',
      real_name: '',
      install_address: '',
      page: 1,
      initPage:1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      memberModal:false,
      changeModal: false,
      area: '',
      per_page:30,
      canLoadByScroll:true,
    }
  }

  componentDidMount() {
    this.changeTableY();
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))

  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable=()=>{
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      if(this.state.canLoadByScroll){
        const {member_consumption: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            meter_number:this.state.meter_number,
            member_number:this.state.member_number,
            real_name:this.state.real_name,
            install_address: this.state.install_address,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            per_page:this.state.per_page,

          },function () {
            that.setState({
              canLoadByScroll:true,
            })
          },true)
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
  }
  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number:'',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number:this.state.meter_number ,
        member_number: this.state.member_number,
        real_name:this.state.real_name,
        install_address:this.state.install_address,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
        per_page:this.state.per_page
      })
    })
  }
  changeConcentrator = (concentrator_number,parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id:parent_village_id,
      concentrator_number:concentrator_number
    }, function(){
      this.handleSearch({
        page: 1,
        meter_number:this.state.meter_number ,
        member_number: this.state.member_number,
        real_name:this.state.real_name,
        install_address:this.state.install_address,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
        per_page:this.state.per_page
      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      real_name:'',
      // concentrator_number:'',
      install_address: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      per_page:30
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys:[]
    })
    dispatch({
      type: fetchAndPush?'member_consumption/fetchAndPush':'member_consumption/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if(!fetchAndPush){
          that.setState({
            initPage:values.page
          })
        }
        if(cb)cb();
      }
    });
  }
  handPageChange = (page)=> {
    const that=this;
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name:this.state.real_name,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:this.state.per_page
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name:this.state.real_name,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:per_page
      // area: this.state.area
    })
  }
  operate = (record)=> {
    this.setState({
      edit_meter_number: record.meter_number,
      editModal: true
    })
  }
  operateMember = (record)=> {
    this.setState({
      edit_member_number: record.member_number,
      memberModal: true
    })
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const {member_consumption: {data,meta,  loading}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    // const resetMeterData=parseRowSpanData2(data)
    const resetMeterData=parseRowSpanData3(data)
    const {isMobile} =this.props.global;
    const columns = [
      { title: formatMessage({id: 'intl.user_number'}), width: 90, dataIndex: 'member_number', key: 'member_number',  fixed: isMobile?'':'left',  render: (val, record, index) => {
        const children= (
          ellipsis2(val, 90)
        )
        return renderRowSpan(children,record)
      } },
      { title:  formatMessage({id: 'intl.user_name'}), dataIndex: 'real_name', key: 'real_name' ,width: 80,   render: (val, record, index) => {
        const children= (
          ellipsis2(val, 80)
        )
        return renderRowSpan(children,record)
      } },
      { title: formatMessage({id: 'intl.install_address'}), dataIndex: 'install_address', key: 'install_address' ,width: 100,   render: (val, record, index) => {
        const children=  (
          ellipsis2(val, 100)
        )
        return renderRowSpan(children,record)
      }},
      { title:  formatMessage({id: 'intl.Temperature_medium_type'}), width: 100, dataIndex: 'temperature_type_explain', key: 'temperature_type_explain' , render: (text, record, index) => {
        return ellipsis2(text, 100)
      }},

      { title:  formatMessage({id: 'intl.water_meter_number'}), width: 110, dataIndex: 'meter_number', key: 'meter_number',render: (val, record, index) => {
        return ellipsis2(val, 110)
      } },
      { title:  formatMessage({id: 'intl.water_meter_type'}), width: 105, dataIndex: 'meter_model_name', key: 'meter_model_name' , render: (text, record, index) => {
        return ellipsis2(text, 105)
      }},
      { title:  formatMessage({id: 'intl.water_consumption'}), dataIndex: 'difference_value', key: 'difference_value' ,width: 120,  render: (val, record, index) => {
        return ellipsis2(val, 120)
      }},
      {title: formatMessage({id: 'intl.latest_reading'}), dataIndex: 'latest_value', key: 'latest_value', width: 100,render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:  formatMessage({id: 'intl.latest_reading_time'}), dataIndex: 'latest_collected_date', key: 'latest_collected_date', width: 110,render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      {title: formatMessage({id: 'intl.previous_reading'}), dataIndex: 'previous_value', key: 'previous_value', width: 100,render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:  formatMessage({id: 'intl.previous_reading_time'}), dataIndex: 'previous_collected_date', key: 'previous_collected_date', width: 110,render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      { title:  formatMessage({id: 'intl.concentrator_number'}), dataIndex: 'concentrator_number', key: 'concentrator_number' ,width: 90,render: (val, record, index) => {
        return ellipsis2(val, 90)
      } },
      { title:  formatMessage({id: 'intl.water_meter_index'}), width: 80, dataIndex: 'meter_index', key: 'meter_index' ,render: (val, record, index) => {
        return ellipsis2(val, 80)
      }},
      { title:  formatMessage({id: 'intl.concentrator_number'}), dataIndex: 'concentrator_serial_number', key: 'concentrator_serial_number' ,width: 120,render: (val, record, index) => {
        return ellipsis2(val, 120)
      } },
      { title:  formatMessage({id: 'intl.concentrator_protocols'}), dataIndex: 'protocols', key: 'protocols' ,width: 100 ,render: (val, record, index) => {
        return ellipsis2(val.join('|'), 100)
      }},
      {title:  formatMessage({id: 'intl.meter_enabled_date'}), width: 120, dataIndex: 'meter_enabled_date', key: 'meter_enabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title: formatMessage({id: 'intl.meter_enabled_value'}), width: 120, dataIndex: 'meter_enabled_value', key: 'meter_enabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title:  formatMessage({id: 'intl.meter_disabled_date'}), width: 120, dataIndex: 'meter_disabled_date', key: 'meter_disabled_date', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      {title:  formatMessage({id: 'intl.meter_disabled_value'}), width: 120, dataIndex: 'meter_disabled_value', key: 'meter_disabled_value', render: (text, record, index) => {
        return ellipsis2(text, 120)
      }},
      { title:  formatMessage({id: 'intl.reader'}), dataIndex: 'reader', key: 'reader',  render: (val, record, index) => {
        return renderRowSpan(val,record)
      }},
      {
        title:  formatMessage({id: 'intl.meter_history_data'}),
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (val, record, index) => {
          return (
            <div >
              <Button type="primary" size='small' onClick={()=>this.operate(record)} style={{width:'105px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap'}}>{record.meter_number}{ formatMessage({id: 'intl.details'})}</Button>
            </div>
          )
        }
      },
      {
        title:  formatMessage({id: 'intl.user_history_data'}),
        key: 'operation2',
        fixed: 'right',
        width: 110,
        render: (val, record, index) => {
          const children= (
            <div>
              <Button style={{background:'#26a69a',color:'#fff'}} size='small' onClick={()=>this.operateMember(record)}>{ formatMessage({id: 'intl.detail'})}</Button>
            </div>
          )
          return renderRowSpan(children,record)
        }
      }
    ];
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}  siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: formatMessage({id: 'intl.data_analysis'})},{name:formatMessage({id: 'intl.user_meter_volume'})}]}>
              <Card bordered={false} style={{margin:'-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            isMobile={isMobile}
                            meta={meta}
                            initRange={this.state.initRange}
                            per_page={this.state.per_page}
                            village_id={this.state.village_id}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                    />
                  </div>
                </div>
                {/*<ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={resetMeterData} columns={columns} rowKey={record => record.myId}
                                 scroll={{x: 3000, y: this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table no-interval'}
                />*/}
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={resetMeterData} columns={columns} rowKey={record => record.myId}
                                 scroll={{x: 3000, y: this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table no-interval'}
                />
               {/* <Table
                  className='meter-table no-interval'
                  loading={loading}
                  rowKey={record => record.myId}
                  dataSource={resetMeterData}
                  columns={columns}
                  scroll={{ x: 2310,y: this.state.tableY }}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
            <Modal
              width="750px"
              key={ Date.parse(new Date())}
              title={`水表 ${this.state.edit_meter_number} 详细信息 (红色柱状图表示当天错报,黄色表示当天漏报)`}
              visible={this.state.editModal}
              onOk={this.handleEdit}
              onCancel={() => this.setState({editModal: false})}
            >
              <Detail meter_number={this.state.edit_meter_number} ended_at={this.state.ended_at}
                      started_at={this.state.started_at}/>
            </Modal>
            <Modal
              width="80%"
              key={ Date.parse(new Date())+1}
              title={`用户 ${this.state.edit_member_number}`}
              visible={this.state.memberModal}
              onOk={this.handleEdit}
              onCancel={() => this.setState({memberModal: false})}
            >
              <MemberDetail member_number={this.state.edit_member_number} ended_at={this.state.ended_at}
                      started_at={this.state.started_at}/>
            </Modal>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
