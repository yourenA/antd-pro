import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Pagination from './../../../components/Pagination/Index'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import ResizeableTable from './../../../components/ResizeableTitle/Index'

import find from 'lodash/find'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
// import 'rsuite-table/lib/less/index.less'
import {getPreDay, renderIndex, renderErrorData, ellipsis2} from './../../../utils/utils'
// import './index.less'
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  complete_real_data: state.complete_real_data,
  global: state.global,
}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      real_name: '',
      page: 1,
      initPage: 1,
      initRange:[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      display_type: 'only_latest',
      per_page:30,
      canLoadByScroll: true,
      // concentrator_number:''
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }

  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }

  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {complete_real_data: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            meter_number: this.state.meter_number,
            member_number: this.state.member_number,
            real_name: this.state.real_name,
            ended_at: this.state.ended_at,
            started_at: this.state.started_at,
            per_page:this.state.per_page,
            // area: this.state.area
          }, function () {
            that.setState({
              canLoadByScroll: true,
            })
          }, true)
        }
      }
    }
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    }, function () {
      if (localStorage.getItem('locale') === 'en') {
        this.setState({
          tableY: this.state.tableY - 20
        })
      }
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        real_name: this.state.real_name,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD'),
        display_type: this.state.display_type,
        per_page:this.state.per_page
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        real_name: this.state.real_name,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at:this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD') ,
        display_type: this.state.display_type,
        per_page:this.state.per_page

      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number:'',
      real_name: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      display_type: 'only_latest',
      per_page:30
    })
  }

  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    console.log('village_id', this.state.village_id)
    dispatch({
      type: fetchAndPush ? 'complete_real_data/fetchAndPush' : 'complete_real_data/fetch',
      payload: {

        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
        if (!fetchAndPush) {
          that.setState({
            initPage: values.page
          })
        }
        if (cb)cb()
      }
    });
  }
  handPageChange = (page)=> {
    const that = this;
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type: this.state.display_type,
      per_page:this.state.per_page
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      real_name: this.state.real_name,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      display_type: this.state.display_type,
      per_page:per_page
      // area: this.state.area
    })
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const {complete_real_data: {data, meta, loading}, concentrators, meters} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    let hoursColumns=[];
    for(let i=0;i<24;i++){
      hoursColumns.push({title:  formatMessage({id: 'intl.use_volume'},{number: i}), dataIndex: `fmv`, key:`fmv${i}`, width: 130, render: (text, record, index) => {
        return ellipsis2(record['body'][`fmv${i}`],120)
      }})
    }
    let columnsWidth = 0;
    const {isMobile} =this.props.global;
    const columnsData = [
      // {
      //   title: '序号',
      //   dataIndex: 'index',
      //   width: 50,
      //   fixed: 'left',
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta, this.state.initPage, index)
      //   }
      // },
      {title: formatMessage({id: 'intl.user_number'}), width: 80, dataIndex: 'member_number', fixed: 'left', render: (text, record, index) => {
        return ellipsis2(text,80)
      }},
      {title:  formatMessage({id: 'intl.user_name'}), dataIndex: 'real_name', key: 'real_name', width: 80, fixed:isMobile?'':'left', render: (text, record, index) => {
        return ellipsis2(text,80)
      }},
      {title:  formatMessage({id: 'intl.water_meter_number'}), width: 80, dataIndex: 'meter_number', key: 'meter_number', fixed: isMobile?'':'left', render: (text, record, index) => {
        return ellipsis2(text,80)
      },},
      {title:  formatMessage({id: 'intl.positive_cumulative_flow'}), dataIndex: 'value', key: 'value', width: 160, render: (text, record, index) => {
        return ellipsis2(text,160)
      }},
      ...hoursColumns,
      {title:  formatMessage({id: 'intl.concentrator_protocols'}), dataIndex: 'protocols', key: 'protocols', width: 100,render: (val, record, index) => {

        return ellipsis2(val.join('|'), 100)
      }},
      {title:  formatMessage({id: 'intl.concentrator_type_manage'}), dataIndex: 'concentrator_model_name', key: 'concentrator_model_name', width: 100, render: (text, record, index) => {
        return ellipsis2(text,100)
      }},
      {title:  formatMessage({id: 'intl.meter_type_manage'}), dataIndex: 'meter_model_name', key: 'meter_model_name', width: 100, render: (text, record, index) => {
        return ellipsis2(text,100)
      },},
      {title:  formatMessage({id: 'intl.concentrator_number'}), dataIndex: 'concentrator_number', key: 'concentrator_number', width: 90, render: (text, record, index) => {
        return ellipsis2(text,90)
      },},
      {title:  formatMessage({id: 'intl.collected_at'}), dataIndex: 'collected_at', key: 'collected_at', width: 160, render: (text, record, index) => {
        return ellipsis2(text,160)
      },},
      {title: formatMessage({id: 'intl.uploaded_at'}), dataIndex: 'uploaded_at', key: 'uploaded_at', width: 160, render: (text, record, index) => {
        return ellipsis2(text,160)
      },},
      {title:  formatMessage({id: 'intl.water_meter_index'}), dataIndex: 'meter_index', key: 'meter_index', width: 80, render: (text, record, index) => {
        return ellipsis2(text,80)
      },},

      {title: formatMessage({id: 'intl.negative_cumulative_flow'}), dataIndex: 'meter_revalue', key: 'meter_revalue', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].meter_revalue,130)
      }},
      {title: formatMessage({id: 'intl.meter_time'}), dataIndex: 'meter_time', key: 'meter_time', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].meter_time,160)
      }},
      {title: formatMessage({id: 'intl.flow_over_range'}), dataIndex: 'flow_up', key: 'flow_up', width: 130, render: (text, record, index) => {
        return ellipsis2(record['body'].flow_up,100)
      }},
      {title: formatMessage({id: 'intl.flow_over_range_time'}), dataIndex: 'flow_up_time', key: 'flow_up_time', width: 135, render: (text, record, index) => {
        return ellipsis2(record['body'].flow_up_time,135)
      }},
      {title: formatMessage({id: 'intl.temp_over_range'}) , dataIndex: 'temp_up', key: 'temp_up', width: 100, render: (text, record, index) => {
        return ellipsis2(record['body'].temp_up,100)
      }},
      {title:  formatMessage({id: 'intl.temp_over_range_time'}), dataIndex: 'temp_up_time', key: 'temp_up_time', width: 135, render: (text, record, index) => {
        return ellipsis2(record['body'].temp_up_time,135)
      }},
      {title:  formatMessage({id: 'intl.cover_opened_alarm_time'}), dataIndex: 'cover_is_opened', key: 'cover_is_opened', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].cover_is_opened,160)
      }},
      {title: formatMessage({id: 'intl.empty_pipe_alarm_time'}), dataIndex: 'empty_pipe_alarm', key: 'empty_pipe_alarm', width: 135, render: (text, record, index) => {
        return ellipsis2(record['body'].empty_pipe_alarm,135)
      }},
      {title:  formatMessage({id: 'intl.low_voltage_alarm_time'}), dataIndex: 'low_voltage', key: 'low_voltage', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].low_voltage,160)
      }},
      {title:  formatMessage({id: 'intl.reverse_flow_reach_value'}), dataIndex: 'reflow_up', key: 'reflow_up', width: 180, render: (text, record, index) => {
        return ellipsis2(record['body'].reflow_up,170)
      }},
      {title:  formatMessage({id: 'intl.reverse_flow_alarm_time'}), dataIndex: 'reflow_up_time', key: 'reflow_up_time', width: 145, render: (text, record, index) => {
        return ellipsis2(record['body'].reflow_up_time,145)
      }},
      {title:  formatMessage({id: 'intl.0_clock_total_flow_data'}), dataIndex: 'point0_freeze_value', key: 'point0_freeze_value', width: 120, render: (text, record, index) => {
        return ellipsis2(record['body'].point0_freeze_value,115)
      }},

      {title:  formatMessage({id: 'intl.battery_voltage'},{number: '1#'}), dataIndex: 'cell_voltage_1', key: 'cell_voltage_1', width: 110, render: (text, record, index) => {
        if(record['body'].cell_voltage_1){
          return ellipsis2(record['body'].cell_voltage_1+'V',100)
        }else{
          return ''
        }
      }},
      {title:  formatMessage({id: 'intl.battery_voltage'},{number: '2#'}), dataIndex: 'cell_voltage_2', key: 'cell_voltage_2', width: 115, render: (text, record, index) => {
        if(record['body'].cell_voltage_2){
          return ellipsis2(record['body'].cell_voltage_2+'V',100)
        }else{
          return ''
        }
      }},
      {title:   formatMessage({id: 'intl.battery_voltage'},{number: 'LoRa'}), dataIndex: 'cell_voltage_lora', key: 'cell_voltage_lora', width: 140, render: (text, record, index) => {
        if(record['body'].cell_voltage_lora){
          return ellipsis2(record['body'].cell_voltage_lora+'V',100)
        }else{
          return ''
        }
      }},
      {title:  formatMessage({id: 'intl.water_temperature'}), dataIndex: 'water_temperature', key: 'water_temperature', width: 100, render: (text, record, index) => {
        return ellipsis2(record['body'].water_temperature,100)
      }},
      {title:  formatMessage({id: 'intl.signal_strength'}), dataIndex: 'signal', key: 'signal',  width: 100,render: (text, record, index) => {
        return ellipsis2(record['body'].signal,70)
      }},
      {title:formatMessage({id: 'intl.valve_status'}) , dataIndex: 'state_valve', key: 'state_valve',  width: 100,render: (text, record, index) => {
        let showText='';
        if(record['body'].state_valve==0){
          showText=formatMessage({id: 'intl.yes'})
        }else if(record['body'].state_valve==1){
          showText=formatMessage({id: 'intl.no'})
        }else if(record['body'].state_valve==3){
          showText=formatMessage({id: 'intl.abnormal'})
        }
        return ellipsis2(showText,90)
      }},
      {title:formatMessage({id: 'intl.battery_voltage_state'}), dataIndex: 'state_voltage_level', key: 'state_voltage_level', width: 100, render: (text, record, index) => {
        let showText='';
        if(record['body'].state_voltage_level=='0'){
          showText=formatMessage({id: 'intl.only_normal'})
        }else if(record['body'].state_voltage_level=='1'){
          showText=formatMessage({id: 'intl.abnormal'})
        }
        return ellipsis2(showText,90)
      }},
      {title: formatMessage({id: 'intl.temperature_sensor'}), dataIndex: 'state_temperature_sensor', key: 'state_temperature_sensor',width: 110, render: (text, record, index) => {
        let showText='';
        if(record['body'].state_temperature_sensor=='0'){
          showText=formatMessage({id: 'intl.only_normal'})
        }else if(record['body'].state_temperature_sensor=='1'){
          showText=formatMessage({id: 'intl.fault'})
        }
        return ellipsis2(showText,90)
      }},
      {title: formatMessage({id: 'intl.electronic_seal'}), dataIndex: 'state_elock', key: 'state_elock',  render: (text, record, index) => {
        let showText='';
        if(record['body'].state_elock=='0'){
          showText=formatMessage({id: 'intl.only_normal'})
        }else if(record['body'].state_elock=='1'){
          showText=formatMessage({id: 'intl.was_opened'})
        }
        return ellipsis2(showText,90)
      }},

    ];
    const lastWidth = 100;
    const columns = columnsData.map((item, index)=> {
      columnsWidth += item.width || lastWidth;
      return {
        ...item, render: item.render ? item.render :
          (val, record, index) => {
            return ellipsis2(val, item.width || lastWidth)
          },
      }
    });
    // console.log('columnsWidth',columnsWidth)
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: formatMessage({id: 'intl.data_analysis'})}, {name:  formatMessage({id: 'intl.real_time_data'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            per_page={this.state.per_page}
                            isMobile={isMobile}
                    handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                                 scroll={{x: columnsWidth+1000, y: isMobile ? document.body.offsetHeight - 200 : this.state.tableY}}
                                 history={this.props.history}
                                 className={'meter-table'}
                />
               {/* <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: columnsWidth+100, y: isMobile ? document.body.offsetHeight - 200 : this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
