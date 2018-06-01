import React, {PureComponent} from 'react';
import { Table, Card, Button, Layout, message, Modal} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import DetailSearch from './DetailSearch'
import AddConcentrator from './AddOrEditConcentrator'
import Sider from './../Sider'
import {renderIndex} from './../../../utils/utils'
import {connect} from 'dva';
import Detail from './Detail'
import moment from 'moment'
import find from 'lodash/find'
import './index.less'
const {Content} = Layout;
@connect(state => ({
  concentrator_water: state.concentrator_water,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.timer=null;
    this.state = {
      showCommandBtn: find(this.permissions, {name: 'user_send_command'}),
      tableY: 0,
      meter_number: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      area: '',
      showArea: true,
      clickCommand:[],
      time:new Date().getTime()
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    this.handleSearch({
      page: 1,
      meter_number: '',
    })
    const that=this;
    this.timer=setInterval(function () {
      that.setState({
        // disabled:false
        time:new Date().getTime()
      })
    },10000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrator_water/fetch',
      payload: {
        ...values,
        id:this.props.concentratorId
      },
    });

    this.setState({
      meter_number: values.meter_number,
      page: values.page,
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
    })
  }
  read_multiple_901f=(command)=>{
    console.log('集抄：',this.props.concentratorNumber)
    const {dispatch} = this.props;
    sessionStorage.setItem(`concentrator_number-${command}-${this.props.concentratorNumber}`,new Date().getTime())
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.props.concentratorNumber,
        feature:'runonce_upload_multiple_timing',
        protocol:command
      },
      callback:()=>{
        message.success('发送指令成功')
      }
    });
  }
  read_single_901f=(command,meter_number)=>{
    console.log('点抄：',meter_number)
    this.setState({
      // disabled:false
      time:new Date().getTime()
    })
    sessionStorage.setItem(`meter_number-${command}-${meter_number}`,new Date().getTime())
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        meter_number,
        feature:'upload_single',
        protocol:command
      },
      callback:()=>{
        message.success('发送指令成功')
      }
    });
  }
  render() {
    const {concentrator_water: {data, meta, loading}} = this.props;
    const that=this;
    const command=this.props.protocols.split('|');
    const renderComandRecord=(record)=>{
      const renderCommandBtn=command.map((item,index)=>{
        const clickTime=sessionStorage.getItem(`meter_number-${item}-${record.meter_number}`)
        const isLoading=clickTime&&this.state.time-clickTime<120000
        return(
          <Button loading={isLoading} key={index} type="primary" size="small" style={{marginLeft: 8}} onClick={()=>{that.read_single_901f(item,record.meter_number)}}>{isLoading?'正在':''}{item.toUpperCase()}点抄</Button>
        )
      })
      return renderCommandBtn
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta,this.state.page,index)
        }
      },
      {title: '水表号', width: 100, dataIndex: 'meter_number', key: 'meter_number'},
      {title: '水表类型', dataIndex: 'meter_model_name', key: 'meter_model_name', width:  150, },
      {title: '用户名称', dataIndex: 'real_name', key: 'real_name', width:  '15%',},
      {title: '小区名称', dataIndex: 'village_name', key: 'village_name', width: '15%',},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address',},
      {
        title: '操作',
        key: 'operation',
        width: 190,
        render: (val, record, index) => {
          return (
            <div>
              {this.state.showCommandBtn&&renderComandRecord(record)}
            </div>
          )
        }
      },
    ];
    return (

      <div>
        <div className='tableList'>
          <div className='tableListForm'>
            <DetailSearch protocols={this.props.protocols} concentratorNumber={this.props.concentratorNumber} wrappedComponentRef={(inst) => this.formRef = inst}
                          showCommandBtn={this.state.showCommandBtn} onBack={this.props.handleBack}
                          handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                          read_multiple_901f={this.read_multiple_901f} initRange={this.state.initRange}/>
          </div>
        </div>
        <Table
          key={ Date.parse(new Date()) + 1}
          rowClassName={function (record, index) {
            if (record.description === '') {
              return 'error'
            }
          }}
          className='meter-table'
          loading={loading}
          rowKey={record => record.meter_number}
          dataSource={data}
          columns={columns}
          //scroll={{ y: this.state.tableY}}
          pagination={false}
          size="small"
        />
        <Pagination meta={meta} handPageChange={this.handPageChange}/>
        <Modal
          title="添加集中器"
          visible={this.state.addModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({addModal: false})}
        >
          <AddConcentrator />
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="集中器指令:集中器编号"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <Detail />
        </Modal>
      </div>


    );
  }
}

export default UserMeterAnalysis
