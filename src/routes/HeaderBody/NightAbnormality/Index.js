import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Badge,Modal,Button } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../Leak_abnormality/Search'
import { routerRedux } from 'dva/router';
import {connect} from 'dva';
import Sider from './../EmptySider'
import moment from 'moment';
import {renderIndex,ellipsis2} from './../../../utils/utils'
import Detail from './Detail'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import ProcessedForm from './../ZeroAbnormality/ProcessedForm'
import uuid from 'uuid/v4'
import debounce from 'lodash/throttle'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  dma: state.dma,
  night_abnormality: state.night_abnormality,
  global: state.global,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initPage:1,
      initRange:  [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      date: '',
      area_id: '',
      concentrator_number: '',
      meter_number: '',
      member_number: '',
      editModal: false,
      per_page:30,
      canLoadByScroll:true,
      display_type:'only_unprocessed',
      processed_model:false,
      editRecord:{}
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
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
      per_page:30,
      display_type:'only_unprocessed'
    })
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
        const {night_abnormality: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            area_id: this.state.area_id,
            page: this.state.page+1,
            member_number:this.state.member_number,
            concentrator_number:this.state.concentrator_number,
            meter_number:this.state.meter_number,
            // date: this.state.date,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            per_page:this.state.per_page,
            display_type:this.state.display_type,
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
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 +5)
    }, function () {
      if (sessionStorage.getItem('locale') === 'en') {
        this.setState({
          tableY: this.state.tableY - 20
        })
      }
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
      per_page:30,
      display_type:'only_unprocessed',
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'night_abnormality/fetchAndPush': 'night_abnormality/fetch',
      payload: {
        ...values,
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
        if(cb) cb()
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
      per_page:this.state.per_page,
      display_type:this.state.display_type,
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      area_id: this.state.area_id,
      page: 1,
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      // date: this.state.date,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:per_page,
      display_type:this.state.display_type,
    })
  }
  operate = (record)=> {
    this.setState({
      show_member_number:record.member_number,
      abnormality_hours: record.abnormality_hours,
      difference_values: record.difference_values,
      editModal: true
    })
  }
  processed=(abnormality_type)=>{
    const that = this;
    const {dispatch} = this.props;
    const formValues =this.ProcessedForm.props.form.getFieldsValue();
    console.log('formValues',formValues);
    dispatch({
      type:'zero_abnormality/processed',
      payload: {
        abnormality_type:abnormality_type,
        ...formValues,
        not_reminder_days:String(formValues.not_reminder_days)
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: '', type: formatMessage({id: 'intl.confirm_exception'})}
          )
        )
        that.setState({
          processed_model:false
        })
        that.handleSearch({
          area_id: that.state.area_id,
          page: that.state.page,
          member_number:that.state.member_number,
          concentrator_number:that.state.concentrator_number,
          meter_number:that.state.meter_number,
          // date: that.state.date,
          ended_at: that.state.ended_at,
          started_at: that.state.started_at,
          per_page:that.state.per_page,
          display_type:that.state.display_type,
        })
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {night_abnormality: {data, meta, loading}, dma} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const {isMobile} =this.props.global;
    const columns = [
      {title:formatMessage({id: 'intl.user_number'}) , width: 100, dataIndex: 'member_number', key: 'member_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: formatMessage({id: 'intl.user_name'}),  dataIndex: 'real_name', key: 'real_name', width: 100, render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:formatMessage({id: 'intl.concentrator_number'}) , width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: formatMessage({id: 'intl.water_meter_number'}), width: 110, dataIndex: 'meter_number', key: 'meter_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: formatMessage({id: 'intl.date'}), dataIndex: 'date', width: 120,  key: 'date', render: (val, record, index) => {
        return ellipsis2(val, 120)
      }},
      {title:formatMessage({id: 'intl.install_address'}) , dataIndex: 'install_address',width: 150, key: 'install_address', render: (val, record, index) => {
        return ellipsis2(val, 150)
      }},
      {title:formatMessage({id: 'intl.abnormality_hours'}), dataIndex: 'abnormality_hours',  width: 150,  key: 'abnormality_hours',
        render: (val, record, index) => {
          const parseVal=val.join(',');
          return ellipsis2(parseVal,150)
        }},

      {title:formatMessage({id: 'intl.remark'}) , dataIndex: 'remark', key: 'remark'},
      {
        title:formatMessage({id: 'intl.operate'}) ,
        key: 'operation',
        fixed:'right',
        width: 80,
        render: (val, record, index) => {
          return (
            <div>
              {this.state.display_type==='only_unprocessed'&&<Button type="primary" size='small'  className="btn-cyan" onClick={()=>this.setState({processed_model:true,editRecord:record})}>
                {formatMessage({id: 'intl.confirm_abnormal'})}
              </Button>}
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
            <PageHeaderLayout title="异常分析 "   breadcrumb={[{name: formatMessage({id: 'intl.abnormal_analysis'})},
              {name: formatMessage({id: 'intl.night_consumption_abnormal_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch
                      setWarningRule={()=>{
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/night_warning_setup`));
                      }}
                      isMobile={isMobile}
                      per_page={this.state.per_page}
                      dma={dma} handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                 scroll={{x:1400,y: this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table'}
                />
             {/*   <Table
                  className='meter-table'
                  rowKey={record => record.uuidkey}
                  loading={loading}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1050,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>

              </Card>
              <Modal
                width="750px"
                key={ Date.parse(new Date())}
                title={`${this.state.show_member_number} 当天用水量 (红色表示异常时间)`}
                visible={this.state.editModal}
                onOk={() => this.setState({editModal: false})}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail abnormality_hours={this.state.abnormality_hours} difference_values={this.state.difference_values}/>
              </Modal>
              <Modal
                key={ Date.parse(new Date())+1}
                title={`确认异常`}
                visible={this.state.processed_model}
                onOk={()=>this.processed('3')}
                onCancel={() => this.setState({processed_model: false})}
              >
                <ProcessedForm meter_number={this.state.editRecord.meter_number}  wrappedComponentRef={(inst) => this.ProcessedForm = inst}/>
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default FunctionContent
