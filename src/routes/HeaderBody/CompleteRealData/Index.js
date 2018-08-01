import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Pagination from './../../../components/Pagination/Index'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import find from 'lodash/find'
import uuid from 'uuid/v4'
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
    console.log('scroll')
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop', scrollTop)
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      console.log('到达底部');
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
    const {complete_real_data: {data, meta, loading}, concentrators, meters} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    let hoursColumns=[];
    for(let i=0;i<24;i++){
      hoursColumns.push({title: `${i}点使用量(m³)`, dataIndex: `fmv${i}`, key:`fmv${i}`, width: 130, render: (text, record, index) => {
        return ellipsis2(record['body'][`fmv${i}`],120)
      }})
    }
    let columnsWidth = 0;
    const columnsData = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta, this.state.initPage, index)
        }
      },
      {title: '户号', width: 80, dataIndex: 'member_number', fixed: 'left'},
      {title: '用户名称', dataIndex: 'real_name', key: 'real_name', width: 80, fixed: 'left',},
      {title: '水表编号', width: 80, dataIndex: 'meter_number', key: 'meter_number', fixed: 'left',},
      {title: '当前正累计流量(m³)', dataIndex: 'value', key: 'value', width: 160, render: (text, record, index) => {
        return ellipsis2(text,130)
      }},
      ...hoursColumns,
      {title: '集中器协议', dataIndex: 'protocols', key: 'protocols', width: 90,render: (val, record, index) => {

        return ellipsis2(val.join('|'), 90)
      }},
      {title: '集中器类型', dataIndex: 'concentrator_model_name', key: 'concentrator_model_name', width: 100,},
      {title: '水表类型', dataIndex: 'meter_model_name', key: 'meter_model_name', width: 100,},
      {title: '集中器编号', dataIndex: 'concentrator_number', key: 'concentrator_number', width: 90,},
      {title: '采集时间', dataIndex: 'collected_at', key: 'collected_at', width: 160,},
      {title: '上传时间', dataIndex: 'uploaded_at', key: 'uploaded_at', width: 160,},
      {title: '水表序号', dataIndex: 'meter_index', key: 'meter_index', width: 80,},

      {title: '当前负累积流量(m³)', dataIndex: 'meter_revalue', key: 'meter_revalue', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].meter_revalue,130)
      }},
      {title: '水表时间', dataIndex: 'meter_time', key: 'meter_time', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].meter_time,160)
      }},
      {title: '流量超量程(m³)', dataIndex: 'flow_up', key: 'flow_up', width: 130, render: (text, record, index) => {
        return ellipsis2(record['body'].flow_up,100)
      }},
      {title: '流量超量程时间', dataIndex: 'flow_up_time', key: 'flow_up_time', width: 135, render: (text, record, index) => {
        return ellipsis2(record['body'].flow_up_time,135)
      }},
      {title: '温度报警(℃)', dataIndex: 'temp_up', key: 'temp_up', width: 100, render: (text, record, index) => {
        return ellipsis2(record['body'].temp_up,100)
      }},
      {title: '温度报警时间', dataIndex: 'temp_up_time', key: 'temp_up_time', width: 135, render: (text, record, index) => {
        return ellipsis2(record['body'].temp_up_time,135)
      }},
      {title: '上盖被打开报警时间', dataIndex: 'cover_is_opened', key: 'cover_is_opened', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].cover_is_opened,160)
      }},
      {title: '空管报警时间', dataIndex: 'empty_pipe_alarm', key: 'empty_pipe_alarm', width: 135, render: (text, record, index) => {
        return ellipsis2(record['body'].empty_pipe_alarm,135)
      }},
      {title: '电池低电压报警时间', dataIndex: 'low_voltage', key: 'low_voltage', width: 160, render: (text, record, index) => {
        return ellipsis2(record['body'].low_voltage,160)
      }},
      {title: '反向流量曾达到值(m³)', dataIndex: 'reflow_up', key: 'reflow_up', width: 170, render: (text, record, index) => {
        return ellipsis2(record['body'].reflow_up,150)
      }},
      {title: '反向流量报警时间', dataIndex: 'reflow_up_time', key: 'reflow_up_time', width: 145, render: (text, record, index) => {
        return ellipsis2(record['body'].reflow_up_time,145)
      }},
      {title: '0点总流量数据', dataIndex: 'point0_freeze_value', key: 'point0_freeze_value', width: 120, render: (text, record, index) => {
        return ellipsis2(record['body'].point0_freeze_value,115)
      }},

      {title: '1#电池电压(V)', dataIndex: 'cell_voltage_1', key: 'cell_voltage_1', width: 110, render: (text, record, index) => {
        if(record['body'].cell_voltage_1){
          return ellipsis2(record['body'].cell_voltage_1+'V',100)
        }else{
          return ''
        }
      }},
      {title: '2#电池电压(V)', dataIndex: 'cell_voltage_2', key: 'cell_voltage_2', width: 115, render: (text, record, index) => {
        if(record['body'].cell_voltage_2){
          return ellipsis2(record['body'].cell_voltage_2+'V',100)
        }else{
          return ''
        }
      }},
      {title: 'LoRa电池电压(V)', dataIndex: 'cell_voltage_lora', key: 'cell_voltage_lora', width: 140, render: (text, record, index) => {
        if(record['body'].cell_voltage_lora){
          return ellipsis2(record['body'].cell_voltage_lora+'V',100)
        }else{
          return ''
        }
      }},
      {title: '水温(℃)', dataIndex: 'water_temperature', key: 'water_temperature', width: 80, render: (text, record, index) => {
        return ellipsis2(record['body'].water_temperature,50)
      }},
      {title: '信号强度', dataIndex: 'signal', key: 'signal',  width: 100,render: (text, record, index) => {
        return ellipsis2(record['body'].signal,70)
      }},
      {title: '阀门状态', dataIndex: 'state_valve', key: 'state_valve',  width: 100,render: (text, record, index) => {
        let showText='';
        if(record['body'].state_valve=='0'){
          showText='开'
        }else if(record['body'].state_valve=='1'){
          showText='关'
        }else if(record['body'].state_valve=='11'){
          showText='异常'
        }
        return ellipsis2(showText,90)
      }},
      {title: '电池状态', dataIndex: 'state_voltage_level', key: 'state_voltage_level', width: 100, render: (text, record, index) => {
        let showText='';
        if(record['body'].state_voltage_level=='0'){
          showText='正常'
        }else if(record['body'].state_voltage_level=='1'){
          showText='欠压'
        }
        return ellipsis2(showText,90)
      }},
      {title: '温度传感器', dataIndex: 'state_temperature_sensor', key: 'state_temperature_sensor',width: 110, render: (text, record, index) => {
        let showText='';
        if(record['body'].state_temperature_sensor=='0'){
          showText='正常'
        }else if(record['body'].state_temperature_sensor=='1'){
          showText='故障'
        }
        return ellipsis2(showText,90)
      }},
      {title: '电子铅封', dataIndex: 'state_elock', key: 'state_elock',  render: (text, record, index) => {
        let showText='';
        if(record['body'].state_elock=='0'){
          showText='正常'
        }else if(record['body'].state_elock=='1'){
          showText='被打开过'
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
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
               siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '完整实时数据'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            per_page={this.state.per_page}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.uuidkey}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: columnsWidth+100, y: isMobile ? document.body.offsetHeight - 200 : this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        {/*  <Modal
         key={ Date.parse(new Date())}
         title="添加用户档案"
         visible={this.state.addModal}
         onOk={this.handleAdd}
         onCancel={() => this.setState({addModal:false})}
         >
         <AddOREditUserArchives  wrappedComponentRef={(inst) => this.formRef = inst} concentrators={concentrators.data} meters={meters.data}  />
         </Modal>
         <Modal
         key={ Date.parse(new Date())+1}
         title="编辑用户档案"
         visible={this.state.editModal}
         onOk={this.handleEdit}
         onCancel={() => this.setState({editModal:false})}
         >
         <AddOREditUserArchives  wrappedComponentRef={(inst) => this.editFormRef = inst} concentrators={concentrators.data} meters={meters.data}  editRecord={this.state.editRecord} />
         </Modal>*/}

      </Layout>
    );
  }
}

export default UserMeterAnalysis
