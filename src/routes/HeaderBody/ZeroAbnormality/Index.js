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
import {renderIndex,ellipsis2} from '../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import ProcessedForm from './ProcessedForm'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  zero_abnormality: state.zero_abnormality,
  global: state.global,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initPage:1,
      // initDate: moment(new Date(), 'YYYY-MM-DD'),
      initRange:  [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      date: '',
      area_id: '',
      member_number:'',
      concentrator_number:'',
      meter_number:'',
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
        const {zero_abnormality: {meta}} = this.props;
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
      per_page:30,
      display_type:'only_unprocessed',
    })
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'zero_abnormality/fetchAndPush': 'zero_abnormality/fetch',
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
      member_number:this.state.member_number,
      concentrator_number:this.state.concentrator_number,
      meter_number:this.state.meter_number,
      // date: this.state.date,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
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
      show_meter_number: record.meter_number,
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
        message.success("确认异常成功")
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
    const {zero_abnormality: {data, meta, loading}, dma} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const {isMobile} =this.props.global;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   fixed: 'left',
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {title: '户号', width: 100, dataIndex: 'member_number', key: 'member_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: '集中器编号', width: 100, dataIndex: 'concentrator_number', key: 'concentrator_number', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: '水表号', width: 110, dataIndex: 'meter_number', key: 'meter_number', render: (val, record, index) => {
        return ellipsis2(val, 110)
      }},
      {title: '姓名', dataIndex: 'real_name', width: 100, key: 'real_name', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: '日期', width: 100, dataIndex: 'date', key: 'date', render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: '安装地址', dataIndex: 'install_address',width: 150,  key: 'install_address', render: (val, record, index) => {
        return ellipsis2(val, 150)
      }},
      {title: '持续时间(天)', dataIndex: 'duration_days', key: 'duration_days',width: 100, render: (val, record, index) => {
        return ellipsis2(val, 100)
      }},
      {title: '备注', dataIndex: 'remark', key: 'remark'},
      {
        title: '操作',
        key: 'operation',
        fixed:'right',
        width: 170,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record)}>详细信息</Button>
              {this.state.display_type==='only_unprocessed'&&<Button type="primary" size='small'  className="btn-cyan" onClick={()=>this.setState({processed_model:true,editRecord:record})}>确认异常</Button>}
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
                      isMobile={isMobile}
                      setWarningRule={()=> {
                        dispatch(routerRedux.push(`/${company_code}/main/system_manage/system_setup/zero_warning_setup`));
                      }}
                      per_page={this.state.per_page}
                      dma={dma} handleSearch={this.handleSearch}
                      handleFormReset={this.handleFormReset} initDate={this.state.initDate}
                      initRange={this.state.initRange}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                 scroll={{x:1800,y: this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table'}
                />
                {/*<Table
                  className='meter-table'
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  loading={loading}
                  scroll={{x:1000,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  meta={meta} handPageChange={this.handPageChange}/>

              </Card>
              <Modal
                width="750px"
                key={ Date.parse(new Date())}
                title={`${this.state.show_meter_number}  详细信息 (红色柱状图表示当天错报,黄色表示当天漏报)`}
                visible={this.state.editModal}
                onOk={this.handleEdit}
                onCancel={() => this.setState({editModal: false})}
              >
                <Detail meter_number={this.state.show_meter_number} ended_at={this.state.ended_at}
                        started_at={this.state.started_at}/>
              </Modal>
              <Modal
                key={ Date.parse(new Date())+1}
                title={`确认异常`}
                visible={this.state.processed_model}
                onOk={()=>this.processed('1')}
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
