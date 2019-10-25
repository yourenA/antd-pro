import React, {PureComponent} from 'react';
import { Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch  from './Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import { routerRedux } from 'dva/router';
import find from 'lodash/find'
import ProcessedForm from './../ZeroAbnormality/ProcessedForm'
import uuid from 'uuid/v4'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import Detail from './Detail'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import request from "./../../../utils/request";
import debounce from 'lodash/throttle'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  dma: state.dma,
  leak_abnormality: state.leak_abnormality,
  global: state.global,
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
      initPage:1,
      initRange:  [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      member_number: '',
      concentrator_number:'',
      meter_number:'',
      area_id: '',
      per_page:30,
      canLoadByScroll:true,
      display_type:'only_unprocessed',
      processed_model:false,
      editRecord:{},
      leak_abnormality_value:'',
      leak_abnormality_hours:'',
      leak_abnormality_special_meters:[]
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
    request(`/configs?groups[]=leak_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        leak_abnormality_value: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_value'
        }).value,
        leak_abnormality_hours: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_hours'
        }).value,
        leak_abnormality_special_meters: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_special_meters'
        }).value,
      })
    })
    this.handleSearch({
      area_id: '',
      page: 1,
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
    console.log('scroll')
    const scrollTop=document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight=document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight=document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop',scrollTop)
    const that=this;
    if(scrollTop+offsetHeight>scrollHeight-300){
      console.log('到达底部');
      if(this.state.canLoadByScroll){
        const {leak_abnormality: {meta}} = this.props;
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
      page: 1,
      area_id: '',
      member_number: '',
      concentrator_number:'',
      meter_number:'',
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
      type:fetchAndPush?'leak_abnormality/fetchAndPush': 'leak_abnormality/fetch',
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
      member_number: this.state.member_number,
      concentrator_number: this.state.concentrator_number,
      meter_number: this.state.meter_number,
      per_page:this.state.per_page,
      display_type:this.state.display_type,
      // area: this.state.area
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
      show_meter_number:record.meter_number,
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
    const {leak_abnormality: {data, meta, loading}, dma} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const {isMobile} =this.props.global;
    const columns = [
      {title: formatMessage({id: 'intl.water_meter_number'}), width: 100, dataIndex: 'meter_number', key: 'meter_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: formatMessage({id: 'intl.user_name'}),  dataIndex: 'real_name', key: 'real_name', width: 100, render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:formatMessage({id: 'intl.install_address'}) , dataIndex: 'install_address',width: 150, key: 'install_address', render: (val, record, index) => {
        return ellipsis2(val, 150)
      }},
      {title: formatMessage({id: 'intl.date'}), dataIndex: 'date', width: 100,  key: 'date', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},

      {title:formatMessage({id: 'intl.abnormality_hours'}), dataIndex: 'abnormality_hours',  width: 150,  key: 'abnormality_hours',
        render: (val, record, index) => {
          const parseVal=val.join(',');
          return ellipsis2(parseVal,150)
        }},
      {title:'漏水报警值/小时数' , width: 140, dataIndex: 'number', key: 'number', render: (val, record, index) => {
        let value=this.state.leak_abnormality_value
        for(let i=0;i<this.state.leak_abnormality_special_meters.length;i++){
          if(record.meter_number===this.state.leak_abnormality_special_meters[i].number){
            value=this.state.leak_abnormality_special_meters[i].value;
            break
          }
        }
        return `${value} / ${this.state.leak_abnormality_hours}`
      }},
      {title:formatMessage({id: 'intl.user_number'}) , width: 100, dataIndex: 'member_number', key: 'member_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:formatMessage({id: 'intl.concentrator_number'}) , width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:formatMessage({id: 'intl.remark'}) , dataIndex: 'remark', key: 'remark'},
      {
        title:formatMessage({id: 'intl.operate'}) ,
        key: 'operation',
        fixed:'right',
        width: 170,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}> {formatMessage({id: 'intl.details'})}</Button>
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
              {name: formatMessage({id: 'intl.water_leak_abnormal_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch
                      setWarningRule={()=>{
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/leak_warning_setup`));
                      }}
                      isMobile={isMobile}
                      per_page={this.state.per_page}
                      dma={dma} handleSearch={this.handleSearch}
                      handleFormReset={this.handleFormReset} initRange={this.state.initRange}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                 scroll={{x:1500,y: this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table'}
                />
              {/*  <Table
                  className='meter-table'
                  rowKey={record => record.uuidkey}
                  loading={loading}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1050,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>

              </Card>
              <Modal
                width="750px"
                destroyOnClose={true}
                title={`${ formatMessage({id: 'intl.water_meter_number'})} ${this.state.show_meter_number} (红色表示出现漏水异常)`}
                visible={this.state.editModal}
                onOk={() => this.setState({editModal: false})}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail abnormality_hours={this.state.abnormality_hours} difference_values={this.state.difference_values}/>
              </Modal>
              <Modal
                destroyOnClose={true}
                title={ formatMessage({id: 'intl.confirm_abnormal'})}
                visible={this.state.processed_model}
                onOk={()=>this.processed('2')}
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

export default Leak_abnormality
