import React, {PureComponent, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Badge,
  Button,
  Form,
  Table,
  Tabs,
  DatePicker,Icon,Modal
} from 'antd';
import {ellipsis2,timeStamp,todayLastSecond} from './../../../utils/utils';
import find from 'lodash/find'
import MyPagination from './../../../components/MyPagination/index'
import filter from 'lodash/filter'
import findIndex from 'lodash/findIndex'
import request from './../../../utils/request';
// import ChartData from "./ChartData";
const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ loading}) => ({
}))
@Form.create()
class BasicList extends PureComponent {
  constructor(props) {
    super(props);
    console.log('this.props',this.props)
    this.id=this.props.id
    this.name=this.props.name
    this.permissions = JSON.parse(localStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'location_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'location_delete'}),
      visible: false,
      done: false,
      page: 1,
      per_page: 30,
      name: '',
      number: '',
      status: '',
      editRecord: {},
      started_at: moment().format('YYYY-MM-DD 00:00:00'),
      ended_at: todayLastSecond(),
      chartModal: false,chartData:[],chartKey:'',
      tabPanes:[{
        name:'设备信息',
        key:'device'
      },{
        name:'传感器',
        key:'sensor'
      },
        {
        name:'数字输入',
        key:'digital_input'
      },
      //   {
      //   name:'数字输出',
      //   key:'digital_output'
      // },
        {
        name:'球阀',
        key:'ball_valve'
      },{
        name:'Modbus',
        key:'modbus'
      }],
      online_logs:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],
        loading:false,
      },
      device_0:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],
        loading:false,
      },
      sensor_0:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      sensor_1:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      sensor_2:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      sensor_3:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      modbus_0:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      modbus_1:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      modbus_2:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      modbus_3:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      digital_input_0:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      digital_input_1:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      digital_output_0:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      digital_output_1:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      ball_valve_0:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
      ball_valve_1:{
        meta: {total: 0, per_page: 0,current_page:1},
        data:[],loading:false,
      },
    };
  }


  componentDidMount() {
    console.log('config_data',this.props.config_data)
    this.setState({
      tableY: document.querySelector('.table-page').offsetHeight - 195
    })
    const config_data=this.props.config_data;
    let tabPanes=this.state.tabPanes;
    // this.fetchLog({
    //   page:1,
    //   per_page:20,
    // })
    this.fetch({
      type:'device',
      channel:0,
      page:1,
      per_page:30,
    })
    for(let i=0;i<2;i++){
      this.fetch({
        type:'digital_input',
        channel:i,
        page:1,
        per_page:30,
      })
    }
    for(let i=0;i<4;i++){
      this.fetch({
        type:'sensor',
        channel:i,
        page:1,
        per_page:30,
      })
    }
    for(let i=0;i<4;i++){
      this.fetch({
        type:'modbus',
        channel:i,
        page:1,
        per_page:30,
      })
    }
  }
  fetch=(params)=>{
    const that=this;
    this.setState({
      [`${params.type}_${params.channel}`]:{
        meta:this.state[`${params.type}_${params.channel}`].meta,
        data:this.state[`${params.type}_${params.channel}`].data,
        loading:true
      }
    })
    ///operation_logs
    request(`/workstations/${this.id}/historical_data`, {
    // request(`/operation_logs`, {
      method: 'GET',
      params:{
        ...params,
        started_at:this.state.started_at,
        ended_at:this.state.ended_at,
      }
    }).then(response=>{

      if(response.status===200){
        that.setState({
          [`${params.type}_${params.channel}`]:{
            meta:{total: response.data.total, per_page: response.data.per_page,current_page:response.data.current_page},
            data:response.data.data,
            loading:false
          }
        })
      }
    });
  }
  fetchLog=(params)=>{
    const that=this;
    this.setState({
      online_logs:{
        meta:this.state.online_logs.meta,
        data:this.state.online_logs.data,
        loading:true
      }
    })
    ///operation_logs
    request(`/rtus/${this.id}/online_logs`, {
      // request(`/operation_logs`, {
      method: 'GET',
      params:{
        ...params,
        started_at:this.state.started_at,
        ended_at:this.state.ended_at,
      }
    }).then(response=>{

      if(response.status===200){
        that.setState({
          online_logs:{
            meta:response.data.meta,
            data:response.data.data,
            loading:false
          }
        })
      }
    });
  }
  resize = ()=> {
    this.setState({
      tableY: document.querySelector('.table-page').offsetHeight - 205
    })
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    window.removeEventListener('resize', this.resize)
  }



  renderSimpleForm() {

    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline" className="search-form">
        <FormItem label={
          '开始日期'
        }>
          {getFieldDecorator('started_at', {initialValue: moment(moment().format('YYYY-MM-DD 00:00:00'))})(<DatePicker allowClear={false}
                                                                                 showTime={{ format: 'HH:mm:ss' }}
                                                                                 format="YYYY-MM-DD"/>)}
        </FormItem>
        <FormItem label={
          '结束日期'
        }>
          {getFieldDecorator('ended_at', {initialValue: moment(todayLastSecond())})(<DatePicker allowClear={false}
                                                                               showTime={{ format: 'HH:mm:ss' }}
                                                                               format="YYYY-MM-DD"/>)}
        </FormItem>
        <FormItem >
          <Button type="primary" icon='search' onClick={()=> {
            const {form} = this.props;
            form.validateFields((err, fieldsValue) => {
              if (err) return;

              const values = {
                ...fieldsValue,
              };
              this.setState({
                started_at: fieldsValue.started_at.format('YYYY-MM-DD HH:mm:ss'),
                ended_at: fieldsValue.ended_at.format('YYYY-MM-DD HH:mm:ss'),
              },function () {
                // this.fetchLog({
                //   page:1,
                //   per_page:30,
                // })
                this.fetch({
                  type:'device',
                  channel:0,
                  page:1,
                  per_page:30,

                })
                for(let i=0;i<4;i++){
                  this.fetch({
                    type:'sensor',
                    channel:i,
                    page:1,
                    per_page:30,

                  })
                  this.fetch({
                    type:'modbus',
                    channel:i,
                    page:1,
                    per_page:30,

                  })
                }
                for(let i=0;i<2;i++){

                  this.fetch({
                    type:'digital_input',
                    channel:i,
                    page:1,
                    per_page:30,

                  })
                  this.fetch({
                    type:'digital_output',
                    channel:i,
                    page:1,
                    per_page:30,

                  })
                  this.fetch({
                    type:'ball_valve',
                    channel:i,
                    page:1,
                    per_page:30,

                  })
                }
              })


            });
          }}>
            查询
          </Button>
          <Button style={{marginLeft: 8}} icon='redo' onClick={this.handleFormReset}>
            重置
          </Button>

        </FormItem>

      </Form>
    );
  }

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.setState({
      started_at: moment().format('YYYY-MM-DD 00:00:00'),
      ended_at: todayLastSecond(),
    },function () {
      this.fetch({
        type:'device',
        channel:0,
        page:1,
        per_page:30,
      })
      for(let i=0;i<4;i++){
        this.fetch({
          type:'sensor',
          channel:i,
          page:1,
          per_page:30,

        })
        this.fetch({
          type:'modbus',
          channel:i,
          page:1,
          per_page:30,
        })
      }
      for(let i=0;i<2;i++){

        this.fetch({
          type:'digital_input',
          channel:i,
          page:1,
          per_page:30,
        })
        this.fetch({
          type:'digital_output',
          channel:i,
          page:1,
          per_page:30,
        })
        this.fetch({
          type:'ball_valve',
          channel:i,
          page:1,
          per_page:30,
        })
      }
    })

  }

  render() {
    const that=this
    return <div>
      <div className="table-page history-page" style={{height:'600px'}}>
        <div >
          <div >{this.renderSimpleForm()}</div>
          <Tabs className={'left-tab'} defaultActiveKey="devices_history" tabPosition={'left'} style={{height:this.state.tableY+120+'px'}}>
            {[{name:'设备日志',key:'devices_history'},{name:'采集日志',key:'get_history'}].map((mainitem,index) => {
              return  <TabPane tab={mainitem.name} key={index}>
                <Tabs defaultActiveKey={'online_logs'} size={"small"} style={{paddingLeft:'10px'}}>

                  {
                    this.state.tabPanes.map((item,index)=>{
                      let renderTab=''
                      if(item.key==='online_logs'&&mainitem.key==='devices_history'){
                        renderTab=  <TabPane tab={item.name} key={item.key}>
                          <div>
                            <Table
                              style={{color: '#fff'}}
                              className={`custom-small-table ${this.state[`online_logs`].data.length===0&&'custom-small-table2'}`}
                              loading={this.state[`online_logs`].loading}
                              rowKey={'id'}
                              dataSource={this.state.online_logs.data}
                              columns={[
                                {
                                  title: '采集时间',
                                  dataIndex: 'created_at',
                                  width: '50%',
                                  render: (text, record) => (
                                    ellipsis2(text.slice(5),160)
                                  )
                                },
                                {
                                  title: '状态',
                                  dataIndex: 'status',
                                  render: (text, record) => {
                                    let color='',value='';
                                    switch (Number(record.status)) {
                                      case 1:
                                        color='green';
                                        value='上线';
                                        break;
                                      case -1:
                                        color='red';
                                        value='下线';
                                        break;

                                    }
                                    return <Badge color={color} text={value} />
                                  }

                                },
                              ]}
                              pagination={false}
                              size="small"
                              scroll={{x: true, y: this.state.tableY}}
                            />
                            <MyPagination className="history-pagination" searchCondition={{
                            }} meta={this.state[`online_logs`].meta} handleSearch={this.fetchLog}/>
                          </div>

                        </TabPane>
                      }
                      if(item.key==='device'&&mainitem.key==='devices_history'){
                        renderTab=<TabPane tab={item.name} key={item.key}>
                          <div >
                            <Table
                              style={{color: '#fff'}}
                              className={`custom-small-table ${this.state[`device_0`].data.length===0&&'custom-small-table2'}`}
                              loading={this.state[`device_0`].loading}
                              rowKey={'id'}
                              dataSource={this.state.device_0.data}
                              columns={[
                                {
                                  title: '采集时间',
                                  dataIndex: 'collected_at',
                                  width: 160,
                                  render: (text, record) => (
                                    ellipsis2(text.slice(5),160)
                                  )
                                },
                                {
                                  title: '运行时间(秒)',
                                  dataIndex: 'uptime',
                                  width: 150,
                                  render: (text, record) => (
                                    ellipsis2(timeStamp(record.data.uptime),130)
                                  )
                                },
                                {
                                  title: '重置原因',
                                  dataIndex: 'reset_reason',
                                  width: 80,
                                  render: (text, record) => (
                                    ellipsis2(record.data.reset_reason,80)
                                  )
                                },
                                {
                                  title:<span>供电电压(V)</span>,
                                  dataIndex: 'supply_voltage',
                                  width: 150,
                                  render: (text, record) => (
                                    ellipsis2((record.data.supply_voltage/1000).toFixed(3),100)
                                  )
                                },
                                {
                                  title: <span>信号质量(dbm)</span>,
                                  dataIndex: 'network_signal_quality',
                                  render: (text, record) => (
                                    ellipsis2(record.data.network_signal_quality,100)
                                  )
                                },
                              ]}
                              pagination={false}
                              size="small"
                              scroll={{x: true, y: this.state.tableY}}
                            />
                            <MyPagination className="history-pagination" searchCondition={{
                              type:item.key,
                              channel:0,
                            }} meta={this.state[`${item.key}_0`].meta} handleSearch={this.fetch}/>
                          </div>

                        </TabPane>
                      }
                      if(item.key==='sensor'&&mainitem.key==='get_history'){
                        renderTab=[0,1,2,3].map((item2,index2)=>{
                          return  Boolean(that.props.config_data.sensor[index2].type)&&
                            <TabPane tab={that.props.config_data.sensor[index2].alias} key={item.key+index2}>
                              <div key={index2}>
                                <Table
                                  style={{color: '#fff'}}
                                  className={`custom-small-table ${this.state[`sensor_${index2}`].data.length===0&&'custom-small-table2'}`}
                                  loading={this.state[`${item.key}_${index2}`].loading}
                                  rowKey={'id'}
                                  dataSource={this.state[`sensor_${index2}`].data}
                                  columns={[
                                    {
                                      title: '采集时间',
                                      dataIndex: 'collected_at',
                                      width: 150,
                                      render: (text, record) => (
                                        ellipsis2(text.slice(5),150)
                                      )
                                    },
                                    {
                                      title: '状态',
                                      dataIndex: 'status',
                                      width: 150,
                                      render: (text, record) => {
                                        let color='',value='';
                                        switch (Number(record.data.status)) {
                                          case 0:
                                            color='green';
                                            value='正常';
                                            break;
                                          case 1:
                                            color='purple';
                                            value='过压';
                                            break;
                                          case 2:
                                            color='orange';
                                            value='欠压';
                                            break;
                                          case 3:
                                            color='red';
                                            value='故障';
                                            break;

                                        }
                                        return <Badge color={color} text={value} />
                                      }

                                    },
                                    {
                                      title: <span>压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                        this.setState({
                                          title:'压力(MPa)',
                                          chartData:this.state[`sensor_${index2}`].data,
                                          chartKey:'value',
                                          chartModal:true
                                        })
                                      }
                                      }/></span>,
                                      dataIndex: 'value',
                                      render: (text, record) => (
                                        ellipsis2(record.data.value,115)
                                      )
                                    },
                                  ]}
                                  pagination={false}
                                  size="small"
                                  scroll={{x: true, y:this.state.tableY}}
                                />
                                <MyPagination className="history-pagination" searchCondition={{
                                  type:item.key,
                                  channel:index2,
                                }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                              </div>
                            </TabPane>
                        });

                      /*  renderTab=<TabPane tab={item.name} key={item.key}>
                          {

                            [0,1,2,3].map((item2,index2)=>{
                              let tabName=that.props.config_data.sensor[index2].type;
                              if(that.props.config_data.sensor[index2].type==='sensor001') {
                                tabName = `传感器-${index2 + 1} : 0-1.6Mpa压力传感器`
                              }
                              return  Boolean(that.props.config_data.sensor[index2].type)&&
                                <div style={{width:'50%',height:'50%',display:'inline-block',paddingRight:'12px',verticalAlign: "top"}} key={index2}>
                                  <Table
                                    style={{color: '#fff'}}
                                    title={() => `${tabName}`}
                                    className={`custom-small-table ${this.state[`sensor_${index2}`].data.length===0&&'custom-small-table2'}`}
                                    loading={this.state[`${item.key}_${index2}`].loading}
                                    rowKey={'id'}
                                    dataSource={this.state[`sensor_${index2}`].data}
                                    columns={[
                                      {
                                        title: '采集时间',
                                        dataIndex: 'collected_at',
                                        width: 150,
                                        render: (text, record) => (
                                          ellipsis2(text.slice(5),120)
                                        )
                                      },
                                      {
                                        title: '状态',
                                        dataIndex: 'status',
                                        width: 150,
                                        render: (text, record) => {
                                          let color='',value='';
                                          switch (Number(record.data.status)) {
                                            case 0:
                                              color='green';
                                              value='正常';
                                              break;
                                            case 1:
                                              color='purple';
                                              value='过压';
                                              break;
                                            case 2:
                                              color='orange';
                                              value='欠压';
                                              break;
                                            case 3:
                                              color='red';
                                              value='故障';
                                              break;

                                          }
                                          return <Badge color={color} text={value} />
                                        }

                                      },
                                      {
                                        title: <span>压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`传感器-${index2+1} 压力(MPa)`,
                                            chartData:this.state[`sensor_${index2}`].data,
                                            chartKey:'value',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        dataIndex: 'value',
                                        render: (text, record) => (
                                          ellipsis2(record.data.value,115)
                                        )
                                      },
                                    ]}
                                    pagination={false}
                                    size="small"
                                    scroll={{x: true, y:filter( that.props.config_data.sensor,function (o) {
                                        return  o.type
                                      }).length>2?(this.state.tableY-140)/2: this.state.tableY-40}}
                                  />
                                  <MyPagination className="history-pagination" searchCondition={{
                                    type:item.key,
                                    channel:index2,
                                  }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                                </div>
                            })
                          }

                        </TabPane>*/
                      }
                      if(item.key==='digital_input'&&mainitem.key==='get_history'){
                        renderTab=[0,1].map((item2,index2)=>{
                          let levelTitle=''
                          if(that.props.config_data.digital_input[index2].type==='DigitalInput001') {
                            levelTitle='水流指示器状态'
                          }else if(that.props.config_data.digital_input[index2].type==='DigitalInput002') {
                            levelTitle='液位状态'
                          }else if(that.props.config_data.digital_input[index2].type==='DigitalInput003') {
                            levelTitle='井盖状态'
                          }
                          return  Boolean(that.props.config_data.digital_input[index2].type)&&
                            <TabPane tab={that.props.config_data.digital_input[index2].alias} key={item.key+index2}>
                              <div key={index2}>
                                <Table
                                  style={{color: '#fff'}}
                                  className={`custom-small-table ${this.state[`digital_input_${index2}`].data.length===0&&'custom-small-table2'}`}
                                  loading={this.state[`${item.key}_${index2}`].loading}
                                  rowKey={'id'}
                                  dataSource={this.state[`digital_input_${index2}`].data}
                                  columns={[
                                    {
                                      title: '采集时间',
                                      dataIndex: 'collected_at',
                                      width: 150,
                                      render: (text, record) => (
                                        ellipsis2(text.slice(5),150)
                                      )
                                    },
                                    {
                                      title: levelTitle,
                                      dataIndex: 'level',
                                      width: 150,
                                      render: (text, record) => {
                                        if(that.props.config_data.digital_input[index2].type==='DigitalInput001') {
                                          return Number(record.data.level)===1? <Badge color="#f50" text="无水" />: <Badge color="#87d068" text="有水" />
                                        }else if(that.props.config_data.digital_input[index2].type==='DigitalInput002') {
                                          return Number(record.data.level)===1? <Badge color="#87d068" text="正常" />: <Badge color="#f50" text="过高" />
                                        }else if(that.props.config_data.digital_input[index2].type==='DigitalInput003') {
                                          return Number(record.data.level)===1? <Badge color="#f50" text="关闭" />: <Badge color="#87d068" text="打开" />
                                        }

                                      }
                                    },
                                    {
                                      title: '报警',
                                      dataIndex: 'alarm',
                                      render: (text, record) => (
                                        Number(record.data.alarm===1)? <Badge color="#f50" text="报警" />: <Badge color="#87d068" text="不报警" />
                                      )
                                    },
                                  ]}
                                  pagination={false}
                                  size="small"
                                  scroll={{x: true, y: this.state.tableY-40}}
                                />
                                <MyPagination className="history-pagination" searchCondition={{
                                  type:item.key,
                                  channel:index2,
                                }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                              </div>
                            </TabPane>
                        })
                        /*renderTab=<TabPane tab={item.name} key={item.key}>
                          {
                            [0,1].map((item2,index2)=>{
                              let tabName=that.props.config_data.digital_input[index2].type;
                              if(that.props.config_data.digital_input[index2].type==='flow_indicator') {
                                tabName = `数字输入-${index2 + 1} : 水流指示器`
                              }
                              return   Boolean(that.props.config_data.digital_input[index2].type)&&
                                <div style={{width:'50%',height:'50%',display:'inline-block',paddingRight:'12px',verticalAlign: "top"}} key={index2}>
                                  <Table
                                    style={{color: '#fff'}}
                                    className={`custom-small-table ${this.state[`digital_input_${index2}`].data.length===0&&'custom-small-table2'}`}
                                    loading={this.state[`${item.key}_${index2}`].loading}
                                    rowKey={'id'}
                                    dataSource={this.state[`digital_input_${index2}`].data}
                                    columns={[
                                      {
                                        title: '采集时间',
                                        dataIndex: 'collected_at',
                                        width: 150,
                                        render: (text, record) => (
                                          ellipsis2(text.slice(5),120)
                                        )
                                      },
                                      {
                                        title: '水流指示器状态',
                                        dataIndex: 'level',
                                        width: 150,
                                        render: (text, record) => (
                                          Number(record.data.level)===1? <Badge color="#f50" text="无水" />: <Badge color="#87d068" text="有水" />
                                        )
                                      },
                                      {
                                        title: '报警',
                                        dataIndex: 'alarm',
                                        render: (text, record) => (
                                          Number(record.data.alarm===1)? <Badge color="#f50" text="报警" />: <Badge color="#87d068" text="不报警" />
                                        )
                                      },
                                    ]}
                                    pagination={false}
                                    size="small"
                                    scroll={{x: true, y: this.state.tableY-40}}
                                  />
                                  <MyPagination className="history-pagination" searchCondition={{
                                    type:item.key,
                                    channel:index2,
                                  }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                                </div>
                            })
                          }

                        </TabPane>*/
                      }
                      if(item.key==='ball_valve'&&mainitem.key==='get_history') {
                        renderTab = [0, 1].map((item2, index2) => {
                          return Boolean(that.props.config_data.ball_valve[index2]&&that.props.config_data.ball_valve[index2].type) &&
                            <TabPane tab={that.props.config_data.ball_valve_[index2].alias} key={item.key+index2}>
                              <div key={index2}>
                                <Table
                                  style={{ color: '#fff' }}
                                  className={`custom-small-table ${this.state[`ball_valve_${index2}`].data.length === 0 && 'custom-small-table2'}`}
                                  loading={this.state[`${item.key}_${index2}`].loading}
                                  rowKey={'id'}
                                  dataSource={this.state[`ball_valve_${index2}`].data}
                                  columns={[
                                    {
                                      title: '采集时间',
                                      dataIndex: 'collected_at',
                                      width: 150,
                                      render: (text, record) => (
                                        ellipsis2(text.slice(5), 150)
                                      )
                                    },
                                    {
                                      title: '状态',
                                      dataIndex: 'status',
                                      width: 150,
                                      render: (text, record) => (
                                        Number(record.data.status) === 0 ? <Badge color="#f50" text="关"/> :
                                          <Badge color="#87d068" text="开"/>
                                      )
                                    },
                                    {
                                      title: '位置',
                                      width: 150,
                                      dataIndex: 'position',
                                      render: (text, record) => {
                                        let color = '', value = ''
                                        switch (Number(record.data.position)) {
                                          case 0:
                                            value = '关';
                                            color = '#f50';
                                            break;
                                          case 1:
                                            value = '开';
                                            color = '#87d068';
                                            break;
                                          case 2:
                                            value = '移动中';
                                            color = '#108ee9';
                                            break;
                                          case 3:
                                            value = '故障';
                                            color = 'yellow';
                                            break;

                                        }
                                        return <Badge color={color} text={value}/>
                                      }
                                    },
                                    {
                                      title: '故障标志',
                                      dataIndex: 'fault_sign',
                                    },
                                  ]}
                                  pagination={false}
                                  size="small"
                                  scroll={{ x: true, y: this.state.tableY - 40 }}
                                />
                                <MyPagination className="history-pagination" searchCondition={{
                                  type: item.key,
                                  channel: index2,
                                }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                              </div>
                            </TabPane>
                        })
                      }
                      if(item.key==='modbus'&&mainitem.key==='get_history'){
                        let column=[];
                        let width=true;
                        renderTab = [0, 1,2,3].map((item2, index2) => {
                          if(that.props.config_data.modbus[index2].type==='SCL-61D-GTE50'||that.props.config_data.modbus[index2].type==='SCL-61D-LT50'){
                            width=1100;
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: '状态',
                                dataIndex: 'data_length',
                                width: 70,
                                render: (text, record) => (
                                  Number(record.data.data_length)>0?  <Badge color="#87d068" text="" />:<Badge color="#f50" text="" />
                                )
                              },
                              {
                                title: <span>瞬时流量(m³/h)</span>,
                                dataIndex: 'instantaneous_flow',
                                width: 125,
                                render: (text, record) => (
                                  ellipsis2(record.data.instantaneous_flow,120)
                                )
                              },
                              {
                                title: <span>正累计流量(m³)</span>,
                                width: 125,
                                dataIndex: 'positive_cumulative_flow',
                                render: (text, record) => (
                                  ellipsis2(record.data.positive_cumulative_flow,120)
                                )
                              },
                              {
                                title: '正累计运行时间(小时)',
                                dataIndex: 'positive_running_time',
                                width: 140,
                                render: (text, record) => (
                                  ellipsis2(record.data.positive_running_time,140)
                                  // ellipsis2(record.data.positive_running_time,100)
                                )
                              },
                              {
                                title: <span>负累计流量(m³)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                  this.setState({
                                    title:`Modbus-${index2+1} 负累计流量(m³)`,
                                    chartData:this.state[`modbus_${index2}`].data,
                                    chartKey:'reverse_cumulative_flow',
                                    chartModal:true
                                  })
                                }
                                }/></span>,
                                dataIndex: 'reverse_cumulative_flow',
                                width: 125,
                                render: (text, record) => (
                                  ellipsis2(record.data.reverse_cumulative_flow,120)
                                )
                              },
                              {
                                title: '负累计运行时间(小时)',
                                dataIndex: 'reverse_running_time',
                                width: 140,
                                render: (text, record) => (
                                  ellipsis2(record.data.reverse_running_time,140)
                                  // ellipsis2(record.data.reverse_running_time,100)
                                )
                              },
                              {
                                title: <span>压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                  this.setState({
                                    title:`Modbus-${index2+1} 压力(MPa)`,
                                    chartData:this.state[`modbus_${index2}`].data,
                                    chartKey:'pressure_value',
                                    chartModal:true
                                  })
                                }
                                }/></span>,
                                dataIndex: 'pressure_value',
                                width: 95,
                                render: (text, record) => (
                                  ellipsis2(record.data.pressure_value,95)
                                )
                              },
                              {
                                title: '诊断信息代码',
                                dataIndex: 'code',
                                render: (text, record) => (
                                  ellipsis2(record.data.code,100)
                                )
                              },
                            ]
                          }
                          if(that.props.config_data.modbus[index2].type==='SCL-61D-LT50') {
                            width = 1100;
                          }
                          if(that.props.config_data.modbus[index2].type==='PLC') {
                            width = true;
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: <span>压力限定值(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                  this.setState({
                                    title:`Modbus-${index2+1} 压力限定值(MPa)`,
                                    chartData:this.state[`modbus_${index2}`].data,
                                    chartKey:'pressure_limit_value',
                                    chartModal:true
                                  })
                                }
                                }/></span>,
                                width: 150,
                                dataIndex: 'pressure_limit_value',
                                render: (text, record) => (
                                  ellipsis2(record.data.pressure_limit_value,100)
                                )
                              },
                              {
                                title: <span>阀后压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                  this.setState({
                                    title:`Modbus-${index2+1} 阀后压力(MPa)`,
                                    chartData:this.state[`modbus_${index2}`].data,
                                    chartKey:'downstream_pressure_value',
                                    chartModal:true
                                  })
                                }
                                }/></span>,
                                width: 150,
                                dataIndex: 'downstream_pressure_value',
                                render: (text, record) => (
                                  ellipsis2(record.data.downstream_pressure_value,100)
                                )
                              },
                              {
                                title: '上腔球阀状态',
                                dataIndex: 'up_valve_status',
                                width: 150,
                                render: (text, record) => (
                                  Number(record.data.up_valve_status)>0?  <Badge color="#87d068" text="开" />:<Badge color="#f50" text="关" />
                                )
                              },
                              {
                                title: '下腔球阀状态',
                                dataIndex: 'down_valve_status',
                                width: 150,
                                render: (text, record) => (
                                  Number(record.data.down_valve_status)>0?  <Badge color="#87d068" text="开" />:<Badge color="#f50" text="关" />
                                )
                              },
                              {
                                title: '状态',
                                dataIndex: 'data_length',
                                render: (text, record) => (
                                  Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                )
                              },
                            ]
                          }
                          if(that.props.config_data.modbus[index2].type==='PCM380L'){
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: <span>压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                  this.setState({
                                    title:`Modbus-${index2+1} 压力(MPa)`,
                                    chartData:this.state[`modbus_${index2}`].data,
                                    chartKey:'pressure_value',
                                    chartModal:true
                                  })
                                }
                                }/></span>,
                                dataIndex: 'pressure_value',
                                render: (text, record) => (
                                  ellipsis2(record.data.pressure_value,100)
                                )
                              },
                              {
                                title: '状态',
                                dataIndex: 'data_length',
                                render: (text, record) => (
                                  Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                )
                              },
                            ]
                          }
                          if(that.props.config_data.modbus[index2].type==='DOUBLE-VALVE-PLC'){
                            width = 2800;
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: '蝶阀1',
                                children: [
                                  {
                                    title: <span>动作</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve1_status',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve1_status)) {
                                        case 1:
                                          return <Badge color="#87d068" text="开" />
                                        case 2:
                                          return <Badge color="#f50" text="停" />
                                        case 4:
                                          return <Badge color="#f50" text="关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>位置</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve1_position',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve1_position)) {
                                        case 1:
                                          return <Badge color="#87d068" text="全开" />
                                        case 2:
                                          return <Badge color="#f50" text="全关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>故障标记</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve1_fault',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve1_fault)) {
                                        case 1:
                                          return <Badge color="#f50" text="故障" />
                                        case 0:
                                          return <Badge color="#87d068" text="正常" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                ]
                              },
                              {
                                title: '蝶阀2',
                                children: [
                                  {
                                    title: <span>动作</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve2_status',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve2_status)) {
                                        case 1:
                                          return <Badge color="#87d068" text="开" />
                                        case 2:
                                          return <Badge color="#f50" text="停" />
                                        case 4:
                                          return <Badge color="#f50" text="关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>位置</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve2_position',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve2_position)) {
                                        case 1:
                                          return <Badge color="#87d068" text="全开" />
                                        case 2:
                                          return <Badge color="#f50" text="全关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>故障标记</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve2_fault',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve2_fault)) {
                                        case 1:
                                          return <Badge color="#f50" text="故障" />
                                        case 0:
                                          return <Badge color="#87d068" text="正常" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                ]
                              },
                              {
                                title: '蝶阀3',
                                children: [
                                  {
                                    title: <span>动作</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve3_status',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve3_status)) {
                                        case 1:
                                          return <Badge color="#87d068" text="开" />
                                        case 2:
                                          return <Badge color="#f50" text="停" />
                                        case 4:
                                          return <Badge color="#f50" text="关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>位置</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve3_position',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve3_position)) {
                                        case 1:
                                          return <Badge color="#87d068" text="全开" />
                                        case 2:
                                          return <Badge color="#f50" text="全关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>故障标记</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve3_fault',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve3_fault)) {
                                        case 1:
                                          return <Badge color="#f50" text="故障" />
                                        case 0:
                                          return <Badge color="#87d068" text="正常" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                ]
                              },
                              {
                                title: '蝶阀4',
                                children: [
                                  {
                                    title: <span>动作</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve4_status',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve4_status)) {
                                        case 1:
                                          return <Badge color="#87d068" text="开" />
                                        case 2:
                                          return <Badge color="#f50" text="停" />
                                        case 4:
                                          return <Badge color="#f50" text="关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>位置</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve4_position',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve4_position)) {
                                        case 1:
                                          return <Badge color="#87d068" text="全开" />
                                        case 2:
                                          return <Badge color="#f50" text="全关" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                  {
                                    title: <span>故障标记</span>,
                                    width: 80,
                                    dataIndex: 'butterfly_valve4_fault',
                                    render: (text, record) => {
                                      switch (Number(record.data.butterfly_valve4_fault)) {
                                        case 1:
                                          return <Badge color="#f50" text="故障" />
                                        case 0:
                                          return <Badge color="#87d068" text="正常" />
                                        default:
                                          return ""
                                      }
                                    }
                                  },
                                ]
                              },

                              {
                                title: <span>减压阀压力设置值(MPa)</span>,
                                width: 165,
                                dataIndex: 'pressure_valve_pressure_limit_value',
                                render: (text, record) => {
                                  return record.data.pressure_valve_pressure_limit_value
                                }
                              },
                              {
                                title: '减压阀1',
                                children: [
                                  {
                                    title: <span>阀前压力值(MPa)</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve1_upstream_pressure_value',
                                    render: (text, record) => {
                                      return record.data.pressure_valve1_upstream_pressure_value
                                    }
                                  },
                                  {
                                    title: <span>阀后压力值(MPa)</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve1_downstream_pressure_value',
                                    render: (text, record) => {
                                      return record.data.pressure_valve1_downstream_pressure_value
                                    }
                                  },
                                  {
                                    title: <span>上腔球阀全开标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve1_upper_valve_fully_open_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve1_upper_valve_fully_open_sign
                                    }
                                  },
                                  {
                                    title: <span>上腔球阀全关标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve1_upper_valve_fully_close_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve1_upper_valve_fully_close_sign
                                    }
                                  },
                                  {
                                    title: <span>下腔球阀全开标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve1_lower_valve_fully_open_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve1_lower_valve_fully_open_sign
                                    }
                                  },
                                  {
                                    title: <span>下腔球阀全关标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve1_lower_valve_fully_close_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve1_lower_valve_fully_close_sign
                                    }
                                  },
                                ]
                              },
                              {
                                title: '减压阀2',
                                children: [
                                  {
                                    title: <span>阀前压力值(MPa)</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve2_upstream_pressure_value',
                                    render: (text, record) => {
                                      return record.data.pressure_valve2_upstream_pressure_value
                                    }
                                  },
                                  {
                                    title: <span>阀后压力值(MPa)</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve2_downstream_pressure_value',
                                    render: (text, record) => {
                                      return record.data.pressure_valve2_downstream_pressure_value
                                    }
                                  },
                                  {
                                    title: <span>上腔球阀全开标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve2_upper_valve_fully_open_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve2_upper_valve_fully_open_sign
                                    }
                                  },
                                  {
                                    title: <span>上腔球阀全关标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve2_upper_valve_fully_close_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve2_upper_valve_fully_close_sign
                                    }
                                  },
                                  {
                                    title: <span>下腔球阀全开标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve2_lower_valve_fully_open_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve2_lower_valve_fully_open_sign
                                    }
                                  },
                                  {
                                    title: <span>下腔球阀全关标志</span>,
                                    width: 120,
                                    dataIndex: 'pressure_valve2_lower_valve_fully_close_sign',
                                    render: (text, record) => {
                                      return record.data.pressure_valve2_lower_valve_fully_close_sign
                                    }
                                  },
                                ]
                              },
                              {
                                title: '状态',
                                dataIndex: 'data_length',
                                render: (text, record) => (
                                  Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                )
                              },
                            ]
                          }
                          //没有温度
                          if(that.props.config_data.modbus[index2].type==='CHEMITEC-50-SERIES'){
                            width=true;
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: '测量值1',
                                dataIndex: 'measure_value1',
                                width:120,
                                render: (text, record) => (
                                  ellipsis2(record.data.measure_value1,120)
                                )
                              },
                              {
                                title: '测量值2',
                                dataIndex: 'measure_value2',
                                width:120,
                                render: (text, record) => (
                                  ellipsis2(record.data.measure_value2,120)
                                )
                              },
                              {
                                title: '测量值3',
                                dataIndex: 'measure_value3',
                                width:120,
                                render: (text, record) => (
                                  ellipsis2(record.data.measure_value3,120)
                                )
                              },
                              {
                                title: '测量值4',
                                dataIndex: 'measure_value4',
                                width:120,
                                render: (text, record) => (
                                  ellipsis2(record.data.measure_value4,120)
                                )
                              },
                              {
                                title: '状态',
                                dataIndex: 'data_length',
                                render: (text, record) => (
                                  Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                )
                              },
                            ]
                          }
                          if(that.props.config_data.modbus[index2].type==='Modbus007'){
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: <span>PH值(pH)</span>,
                                width: 100,
                                dataIndex: 'ph',
                                render: (text, record) => {
                                  if(that.props.config_data.modbus[index2].channel1_type==1){
                                    return record.data.measure_value1;
                                  }else if(that.props.config_data.modbus[index2].channel2_type==1){
                                    return record.data.measure_value2;
                                  }else if(that.props.config_data.modbus[index2].channel3_type==1){
                                    return record.data.measure_value3;
                                  }else if(that.props.config_data.modbus[index2].channel4_type==1){
                                    return record.data.measure_value4;
                                  }else{
                                    return  ""
                                  }

                                },
                              },
                              {
                                title: <span>浊度(NTU)</span>,
                                width: 120,
                                dataIndex: 'instantaneous_flow',
                                render: (text, record) => {
                                  if(that.props.config_data.modbus[index2].channel1_type==2){
                                    return record.data.measure_value1;
                                  }else if(that.props.config_data.modbus[index2].channel2_type==2){
                                    return record.data.measure_value2;
                                  }else if(that.props.config_data.modbus[index2].channel3_type==2){
                                    return record.data.measure_value3;
                                  }else if(that.props.config_data.modbus[index2].channel4_type==2){
                                    return record.data.measure_value4;
                                  }else{
                                    return  ""
                                  }
                                },
                              },
                              {
                                title: <span>溶氧(ppm)</span>,
                                width: 120,
                                dataIndex: 'positive_cumulative_flow',
                                render: (text, record) => {
                                  if(that.props.config_data.modbus[index2].channel1_type==3){
                                    return record.data.measure_value1;
                                  }else if(that.props.config_data.modbus[index2].channel2_type==3){
                                    return record.data.measure_value2;
                                  }else if(that.props.config_data.modbus[index2].channel3_type==3){
                                    return record.data.measure_value3;
                                  }else if(that.props.config_data.modbus[index2].channel4_type==3){
                                    return record.data.measure_value4;
                                  }else{
                                    return  ""
                                  }
                                },
                              },
                              {
                                title: <span>电导率(μS/CM)</span>,
                                dataIndex: 'positive_running_time',
                                render: (text, record) => {
                                  if(that.props.config_data.modbus[index2].channel1_type==4){
                                    return record.data.measure_value1;
                                  }else if(that.props.config_data.modbus[index2].channel2_type==4){
                                    return record.data.measure_value2;
                                  }else if(that.props.config_data.modbus[index2].channel3_type==4){
                                    return record.data.measure_value3;
                                  }else if(that.props.config_data.modbus[index2].channel4_type==4){
                                    return record.data.measure_value4;
                                  }else{
                                    return  ""
                                  }
                                },
                              },
                            ]
                            column.push({
                              title: '状态',
                              dataIndex: 'data_length',
                              render: (text, record) => (
                                Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                              )
                            })
                            width=true
                          }
                          if(that.props.config_data.modbus[index2].type==='Modbus008'){
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              }
                            ]
                            for(let i=0;i<8;i++){
                              column.push({
                                title: <span>AIN{i}(mA)</span>,
                                dataIndex: `ain${i}`,
                                width: 100,
                                render: (text, record) => (
                                  ellipsis2(record.data[`ain${i}`],100)
                                )
                              },)
                            }
                            for(let i=0;i<2;i++){
                              column.push({
                                title: <span>DA{i}(mA)</span>,
                                dataIndex: `da${i}`,
                                width: 100,
                                render: (text, record) => (
                                  ellipsis2(record.data[`da${i}`],100)
                                )
                              },)
                            }
                            column.push({
                              title: '状态',
                              dataIndex: 'data_length',
                              render: (text, record) => (
                                Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                              )
                            })
                            width=1300
                          }
                          //Modbus009
                          if(that.props.config_data.modbus[index2].type==='Modbus009'){
                            width=true;
                            column=[
                              {
                                title: '采集时间',
                                dataIndex: 'collected_at',
                                width: 150,
                                render: (text, record) => (
                                  ellipsis2(text.slice(5),150)
                                )
                              },
                              {
                                title: '瞬时流量',
                                dataIndex: 'instantaneous_flow',
                                width:120,
                                render: (text, record) => (
                                  ellipsis2(record.data.instantaneous_flow,120)
                                )
                              },
                              {
                                title: '正累计流量',
                                dataIndex: 'cumulative_flow',
                                width:120,
                                render: (text, record) => (
                                  ellipsis2(record.data.cumulative_flow,120)
                                )
                              },
                              {
                                title: '状态',
                                dataIndex: 'data_length',
                                render: (text, record) => (
                                  Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                )
                              },
                            ]
                          }
                          return Boolean(that.props.config_data.modbus[index2].type) &&
                            <TabPane tab={that.props.config_data.modbus[index2].alias} key={item.key+index2}>
                              <div >
                                <Table
                                  style={{color: '#fff'}}
                                  className={`custom-small-table ${this.state[`modbus_${index2}`].data.length===0&&'custom-small-table2'}`}
                                  loading={this.state[`${item.key}_${index2}`].loading}
                                  rowKey={'id'}
                                  dataSource={this.state[`modbus_${index2}`].data}
                                  columns={column}
                                  pagination={false}
                                  size="small"
                                  scroll={{x: width, y: this.props.config_data.modbus[index2].type==='DOUBLE-VALVE-PLC'?this.state.tableY-30:this.state.tableY}}
                                />
                                <MyPagination className="history-pagination" searchCondition={{
                                  type:item.key,
                                  channel:index2,
                                }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                              </div>
                            </TabPane>
                        })

                    /*    const defaultKey=findIndex(that.props.config_data.modbus,function (o) {
                          return o.type
                        })
                        console.log('defaultKey',defaultKey)
                        renderTab=<TabPane tab={item.name} key={item.key}>
                          {
                            defaultKey>=0&&
                            <Tabs size={'small'} className={'no-padding'} defaultActiveKey={defaultKey.toString()}>
                              {
                                that.props.config_data.modbus.map((item2,index2)=>{
                                  let column=[];
                                  let width=true;
                                  let tabName=that.props.config_data.modbus[index2].type;
                                  if(that.props.config_data.modbus[index2].type==='SCL-61D-GTE50'||that.props.config_data.modbus[index2].type==='SCL-61D-LT50'){
                                    width=1100;
                                    tabName = `Modbus-${index2+1}:汇中 SCL-61D(管径≥50mm)`
                                    column=[
                                      {
                                        title: '采集时间',
                                        dataIndex: 'collected_at',
                                        width: 120,
                                        render: (text, record) => (
                                          ellipsis2(text.slice(5),120)
                                        )
                                      },
                                      {
                                        title: '状态',
                                        dataIndex: 'data_length',
                                        width: 70,
                                        render: (text, record) => (
                                          Number(record.data.data_length)>0?  <Badge color="#87d068" text="" />:<Badge color="#f50" text="" />
                                        )
                                      },
                                      {
                                        title: <span>瞬时流量(m³/h)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 瞬时流量(m³/h)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'instantaneous_flow',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        dataIndex: 'instantaneous_flow',
                                        width: 125,
                                        render: (text, record) => (
                                          ellipsis2(record.data.instantaneous_flow,120)
                                        )
                                      },
                                      {
                                        title: <span>正累计流量(m³)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 正累计流量(m³)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'positive_cumulative_flow',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        width: 125,
                                        dataIndex: 'positive_cumulative_flow',
                                        render: (text, record) => (
                                          ellipsis2(record.data.positive_cumulative_flow,120)
                                        )
                                      },
                                      {
                                        title: '正累计运行时间(小时)',
                                        dataIndex: 'positive_running_time',
                                        width: 150,
                                        render: (text, record) => (
                                          ellipsis2(record.data.positive_running_time,150)
                                          // ellipsis2(record.data.positive_running_time,100)
                                        )
                                      },
                                      {
                                        title: <span>负累计流量(m³)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 负累计流量(m³)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'reverse_cumulative_flow',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        dataIndex: 'reverse_cumulative_flow',
                                        width: 125,
                                        render: (text, record) => (
                                          ellipsis2(record.data.reverse_cumulative_flow,120)
                                        )
                                      },
                                      {
                                        title: '负累计运行时间(小时)',
                                        dataIndex: 'reverse_running_time',
                                        width: 140,
                                        render: (text, record) => (
                                          ellipsis2(record.data.reverse_running_time,140)
                                          // ellipsis2(record.data.reverse_running_time,100)
                                        )
                                      },
                                      {
                                        title: <span>压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 压力(MPa)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'pressure_value',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        dataIndex: 'pressure_value',
                                        width: 95,
                                        render: (text, record) => (
                                          ellipsis2(record.data.pressure_value,95)
                                        )
                                      },
                                      {
                                        title: '诊断信息代码',
                                        dataIndex: 'code',
                                        render: (text, record) => (
                                          ellipsis2(record.data.code,100)
                                        )
                                      },
                                    ]
                                  }
                                  if(that.props.config_data.modbus[index2].type==='SCL-61D-LT50') {
                                    width = 1100;
                                    tabName = `Modbus-${index2+1}:汇中 SCL-61D(管径<50mm)`
                                  }
                                  if(that.props.config_data.modbus[index2].type==='PLC') {
                                    width = 1100;
                                    tabName = `Modbus-${index2+1}:电动球阀`;
                                    column=[
                                      {
                                        title: '采集时间',
                                        dataIndex: 'collected_at',
                                        width: 120,
                                        render: (text, record) => (
                                          ellipsis2(text.slice(5),120)
                                        )
                                      },
                                      {
                                        title: <span>压力限定值(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 压力限定值(MPa)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'pressure_limit_value',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        width: 150,
                                        dataIndex: 'pressure_limit_value',
                                        render: (text, record) => (
                                          ellipsis2(record.data.pressure_limit_value,100)
                                        )
                                      },
                                      {
                                        title: <span>阀后压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 阀后压力(MPa)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'downstream_pressure_value',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        width: 150,
                                        dataIndex: 'downstream_pressure_value',
                                        render: (text, record) => (
                                          ellipsis2(record.data.downstream_pressure_value,100)
                                        )
                                      },
                                      {
                                        title: '上腔球阀状态',
                                        dataIndex: 'up_valve_status',
                                        width: 150,
                                        render: (text, record) => (
                                          Number(record.data.up_valve_status)>0?  <Badge color="#87d068" text="开" />:<Badge color="#f50" text="关" />
                                        )
                                      },
                                      {
                                        title: '下腔球阀状态',
                                        dataIndex: 'down_valve_status',
                                        width: 150,
                                        render: (text, record) => (
                                          Number(record.data.down_valve_status)>0?  <Badge color="#87d068" text="开" />:<Badge color="#f50" text="关" />
                                        )
                                      },
                                      {
                                        title: '状态',
                                        dataIndex: 'data_length',
                                        render: (text, record) => (
                                          Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                        )
                                      },
                                    ]
                                  }
                                  if(that.props.config_data.modbus[index2].type==='PCM380L'){
                                    tabName=`Modbus-${index2+1}:压力传感器`
                                    column=[
                                      {
                                        title: '采集时间',
                                        dataIndex: 'collected_at',
                                        width: 120,
                                        render: (text, record) => (
                                          ellipsis2(text.slice(5),120)
                                        )
                                      },
                                      {
                                        title: <span>压力(MPa)<Icon type="area-chart" className={'title-icon'} onClick={()=>{
                                          this.setState({
                                            title:`Modbus-${index2+1} 压力(MPa)`,
                                            chartData:this.state[`modbus_${index2}`].data,
                                            chartKey:'pressure_value',
                                            chartModal:true
                                          })
                                        }
                                        }/></span>,
                                        dataIndex: 'pressure_value',
                                        render: (text, record) => (
                                          ellipsis2(record.data.pressure_value,100)
                                        )
                                      },
                                      {
                                        title: '状态',
                                        dataIndex: 'data_length',
                                        render: (text, record) => (
                                          Number(record.data.data_length)>0?  <Badge color="#87d068" text="正常" />:<Badge color="#f50" text="错报" />
                                        )
                                      },
                                    ]
                                  }
                                  return  Boolean(that.props.config_data.modbus[index2].type) &&
                                    <TabPane tab={`${tabName}`}  key={index2}>

                                      <div >
                                        <Table
                                          style={{color: '#fff'}}
                                          className={`custom-small-table ${this.state[`modbus_${index2}`].data.length===0&&'custom-small-table2'}`}
                                          loading={this.state[`${item.key}_${index2}`].loading}
                                          rowKey={'id'}
                                          dataSource={this.state[`modbus_${index2}`].data}
                                          columns={column}
                                          pagination={false}
                                          size="small"
                                          scroll={{x: width, y: this.state.tableY-40}}
                                        />
                                        <MyPagination className="history-pagination" searchCondition={{
                                          type:item.key,
                                          channel:index2,
                                        }} meta={this.state[`${item.key}_${index2}`].meta} handleSearch={this.fetch}/>
                                      </div>
                                    </TabPane>
                                })
                              }
                            </Tabs>
                          }
                        </TabPane>*/
                      }
                      return renderTab
                    })
                  }
                </Tabs>
              </TabPane>
            })}
          </Tabs>


        </div>
      </div>
    {/*  <Modal
        title={false}
        destroyOnClose
        visible={this.state.chartModal}
        closable={false}
        footer={false}
        centered
        width={'900px'}
        onCancel={()=> {
          this.setState({chartModal: false,chartData:[],chartKey:''});
        }}
      >
        <ChartData chartData={this.state.chartData}  chartKey={this.state.chartKey} title={this.state.title}/>
      </Modal>*/}
    </div>
  }
}

export default BasicList;
