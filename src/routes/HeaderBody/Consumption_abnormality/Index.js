import React, {PureComponent} from 'react';
import { Table, Card, Badge, Layout, message, Modal, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './../Leak_abnormality/Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import { routerRedux } from 'dva/router';
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
import Detail from './../UserMeterAnalysis/Detail'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import debounce from 'lodash/throttle'
import ProcessedForm from './../ZeroAbnormality/ProcessedForm'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  dma: state.dma,
  consumption_abnormality: state.consumption_abnormality,
  global: state.global,
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

      initPage:1,
      initRange:  [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      member_number:'',
      concentrator_number:'',
      meter_number:'',
      area_id: '',
      per_page:30,
      canLoadByScroll:true,
      display_type:'only_unprocessed',
      processed_model:false,
      editRecord:{},
      selectedRowKeys: [],
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
      member_number:'',
      concentrator_number:'',
      meter_number:'',
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
        const {consumption_abnormality: {meta}} = this.props;
        if(this.state.page<meta.pagination.total_pages){
          this.setState({
            canLoadByScroll:false,
          })
          this.handleSearch({
            page: this.state.page+1,
            area_id: this.state.area_id,
            member_number:this.state.member_number,
            concentrator_number:this.state.concentrator_number,
            meter_number:this.state.meter_number,
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
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop -(68 + 54 + 50 + 38 +5)
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
      member_number:'',
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
      type:fetchAndPush?'consumption_abnormality/fetchAndPush': 'consumption_abnormality/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if(!fetchAndPush){
          that.setState({
            initPage:values.page,
            selectedRowKeys:[]
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
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      per_page:this.state.per_page,
      display_type:this.state.display_type
      // area: this.state.area
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      area_id: this.state.area_id,
      page: 1,
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type:this.state.display_type,
      per_page:per_page
      // area: this.state.area
    })
  }
  processed=(abnormality_type)=>{
    const that = this;
    const {dispatch} = this.props;
    const formValues =this.ProcessedForm.props.form.getFieldsValue();
    console.log('formValues',formValues);
    let meter_numbers=[]
    if(!formValues.meter_number){
      for(let i=0;i<this.state.selectedRowKeys.length;i++){
        meter_numbers.push(this.state.selectedRowKeys[i].split('@')[0])
      }
    }else{
      meter_numbers=[formValues.meter_number]
    }
    dispatch({
      type:'zero_abnormality/processed',
      payload: {
        abnormality_type:4,
        meter_numbers:meter_numbers,
        not_reminder_days:String(formValues.not_reminder_days),
        remark:formValues.remark
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: '', type: formatMessage({id: 'intl.confirm_exception'})}
          )
        )
        if(!formValues.meter_number){
            that.setState({
              selectedRowKeys:[]
            })
        }
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
  operate = (record)=> {
    this.setState({
      show_meter_number: record.meter_number,
      editModal: true
    })
  }
  render() {
    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {intl:{formatMessage}} = this.props;
    const {consumption_abnormality: {data, meta, loading}, dma} = this.props;
    for(let i=0;i<data.length;i++){
      data[i].uuidkey=uuid()
    }
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
      {title:formatMessage({id: 'intl.today_value'}) , width: 120, dataIndex: 'today_value', key: 'today_value', render: (val, record, index) => {
        return ellipsis2(val, 120)
      }},
      {title:formatMessage({id: 'intl.yesterday_value'}) , width: 120, dataIndex: 'yesterday_value', key: 'yesterday_value', render: (val, record, index) => {
        return ellipsis2(val, 120)
      }},
      {title: formatMessage({id: 'intl.water_consumption'}), width: 100,dataIndex: 'difference_value', key: 'difference_value', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title:formatMessage({id: 'intl.install_address'}) , dataIndex: 'install_address',width: 150, key: 'install_address', render: (val, record, index) => {
        return ellipsis2(val, 150)
      }},
      {title:formatMessage({id: 'intl.remark'}) , dataIndex: 'remark', key: 'remark'},
      {
        title:formatMessage({id: 'intl.operate'}) ,
        key: 'operation',
        fixed:'right',
        width: 150,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}>  {formatMessage({id: 'intl.details'})}</Button>
              {this.state.display_type==='only_unprocessed'&&
              <Button type="primary" size='small'  className="btn-cyan" onClick={()=>this.setState({processed_model:true,editRecord:record})}>
                {formatMessage({id: 'intl.confirm_abnormal'})}
              </Button>}
            </div>
          )
        }
      },

    ];
    const {dispatch}=this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="异常分析"   breadcrumb={[{name: formatMessage({id: 'intl.abnormal_analysis'})},
              {name: formatMessage({id: 'intl.water_consumption_abnormal_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search
                      selectedRowKeys={this.state.selectedRowKeys}
                      setWarningRule={()=>{
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/unusual_water`));
                      }}
                      isMobile={isMobile}
                      per_page={this.state.per_page}
                      processed={()=>{
                        this.setState({
                          processed_model:true,
                          editRecord:{}
                        })
                      }}
                      dma={dma}
                            initRange={this.state.initRange}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                           />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns}
                                 rowKey={record => `${record.meter_number}@${record.date}`}
                                 scroll={{x:1800,y: this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table'}
                                 rowSelection={rowSelection}
                />
                <Pagination  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} meta={meta} handPageChange={this.handPageChange}/>
              </Card>
              <Modal
                destroyOnClose={true}
                title={formatMessage({id: 'intl.confirm_exception'})}
                visible={this.state.processed_model}
                onOk={()=>this.processed('4')}
                onCancel={() => this.setState({processed_model: false})}
              >
                <ProcessedForm meter_number={this.state.editRecord.meter_number}  wrappedComponentRef={(inst) => this.ProcessedForm = inst}/>
              </Modal>
              <Modal
                width="800px"
                destroyOnClose={true}
                title={`${ formatMessage({id: 'intl.water_meter_number'})} ${this.state.show_meter_number} ${ formatMessage({id: 'intl.details'})}${ formatMessage({id: 'intl.detail_info'})}`}
                visible={this.state.editModal}
                onOk={this.handleEdit}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail meter_number={this.state.show_meter_number} ended_at={this.state.ended_at}
                        started_at={this.state.started_at}/>
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Consumption_abnormality
