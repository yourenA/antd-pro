import React, { PureComponent } from 'react';
import { Tabs,DatePicker,Button,Table,Badge,Modal } from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;
import {getTimeDistance,disabledDate,errorNumber,renderIndex} from './../../../utils/utils';
import request from './../../../utils/request'
import moment from 'moment'
import ChangeMeterValueForm from './ChangeMeterValueForm'
const TabPane = Tabs.TabPane;
@connect(state => ({
  member_meter_data: state.member_meter_data,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.myChart2=null;
    this.state = {
      Data:[],
      rangePickerValue: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
    }
  }
  componentDidMount() {
    const that=this;
    this.setState({
    },function () {
      that.fetch()
    });

  }
  fetch=()=>{
    const that=this;
    request(`/member_meter_data/${this.props.meter_number}`,{
      method:'GET',
      params:{
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),
        return:'all'
      }
    }).then((response)=>{
      console.log(response);
      this.setState({
        Data:response.data
      })
      that.dynamic(response.data)
    });
  }
  dynamic=(data)=>{
    let Date=[];
    let Data=[];
    let diffData=[];
    let errDataIndex=[];
    let warmDataIndex=[]
    forEach(data,(value,index)=>{
      Date.push(value.date);
      if(value.value.toString().indexOf(errorNumber)>=0){
        Data.push('-')
      }else{
        Data.push(value.value)
      }
      if(value.status===-2){
        errDataIndex.push(index)
      }else if(value.status===-1){
        warmDataIndex.push(index)
      }
      diffData.push(value.difference_value)
    })
    console.log('errDataIndex',errDataIndex)
    console.log('warmDataIndex',warmDataIndex)
    this.myChart = this.echarts.init(document.querySelector('.month-analysis'));
    let option = {
      tooltip: {
        trigger: 'axis' //只显示一条线
      },
      toolbox: {
        show: false,
        feature: {
          dataView: {readOnly: false},
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
        },
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      xAxis:  {
        // type: 'category',
        // boundaryGap: false,//坐标轴两边留白策略.默认为 true，这时候刻度只是作为分隔线
        silent: false,
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false},
        data:Date
      },
      yAxis:  [
        {
          type: 'value',
          name: '水表读数',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#1890ff'
            }
          },
        },
        {
          type: 'value',
          name: '用水量',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#c23531'
            }
          },
        },
      ],
      series: [
        {
          name:'水表读数',
          type:'bar',
          data:Data,
          itemStyle:{
            normal:{
              color: function(value) {
                if(errDataIndex.indexOf(value.dataIndex)>=0){
                  return '#c23531'
                } else if(warmDataIndex.indexOf(value.dataIndex)>=0) {
                  return '#faad14'
                }else{
                  return '#1890ff'
                }
              }
            }

            // {
            //   color:'#2f4554',
            // }
          },
        },
        {
          name:'用水量',
          type:'line',
          yAxisIndex: 1,
          data:diffData,
          smooth: true,
          itemStyle:{
            normal: {
              color: '#c23531',
            }
          }
        },

      ]
    };



    const that=this;
    that.myChart.setOption(option);
  }
  isActive(type) {
    const {rangePickerValue} = this.state;
    const value = getTimeDistance(type);
    console.log('value',value)
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return false;
    }
    if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day')) {
      return true;
    }
  }
  handleRangePickerChange = (datePickerValue,type) => {
    const that=this;
    if(type==='start'){
      this.setState({
        rangePickerValue:[datePickerValue,this.state.rangePickerValue[1]],
      },function () {
        that.fetch()
      });
    }else{
      this.setState({
        rangePickerValue:[this.state.rangePickerValue[0],datePickerValue],
      },function () {
        that.fetch()
      });
    }
  }
  selectDate = (type) => {
    const that=this;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    },function () {
      that.fetch()
    });

  }
  handleEditMeterValue=()=>{
    const that = this;
    const formValues =this.ChangeMeterValueForm.props.form.getFieldsValue();
    that.fetch()
  }
  render() {
    const Data=[...this.state.Data].reverse()
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return (index+1)
        }
      },
      {title: '日期', dataIndex: 'date', key: 'date'},
      {title: '水表读数', dataIndex: 'value', key: 'value'},
      {title: '用水量', dataIndex: 'difference_value', key: 'difference_value'},
      {
        title: '状态', dataIndex: 'status', key: 'status', width: 70,
        render: (val, record, index) => {
          let status='success';
          let explain='';
          switch (val){
            case -2:
              status='error'
              explain='错报'
              break;
            case -1:
              status='warning'
              explain='漏报'

              break;
            default:
              status='success'
              explain='正常'
          }
          return (
            <p>
              <Badge status={status}/>{explain}
            </p>
          )
        }
      },
    ];
    return (
      <div>
        <div >
         <ButtonGroup>
            <Button  onClick={() => this.selectDate('week')} type={this.isActive('week')?'primary':''}>本周</Button>
            <Button  onClick={() => this.selectDate('month')} type={this.isActive('month')?'primary':''}>本月</Button>
            <Button  onClick={() => this.selectDate('year')} type={this.isActive('year')?'primary':''}>本年</Button>
          </ButtonGroup>

          <DatePicker
            value={this.state.rangePickerValue[0]}
            allowClear={false}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder="开始日期"
            onChange={(e)=>this.handleRangePickerChange(e,'start')}
          />
          <DatePicker
            allowClear={false}
            value={this.state.rangePickerValue[1]}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder="结束日期"
            onChange={(e)=>this.handleRangePickerChange(e,'end')}
          />
          {/*<RangePicker
            disabledDate={disabledDate}
            value={this.state.rangePickerValue}
            onChange={this.handleRangePickerChange}
            style={{width: 256}}
          />*/}
        </div>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.props.showExtra && false? <Button type="primary" onClick={()=>{this.setState({editMeterValueModal:true})}}>Extra Action</Button>:null} >
          <TabPane tab="折线图" key="1">  <div className="month-analysis"></div></TabPane>
          <TabPane tab="表格" key="2">
            <Table
              className={'meter-table'}
              bordered
              columns={columns}
              dataSource={Data}
              pagination={false}
              size="small"
              rowKey={record => record.date}
            />
          </TabPane>
        </Tabs>
        <Modal
          destroyOnClose={true}
          title={``}
          visible={this.state.editMeterValueModal}
          onOk={this.handleEditMeterValue}
          onCancel={() => this.setState({editMeterValueModal: false})}
        >
          <ChangeMeterValueForm meter_number={this.props.meter_number}  wrappedComponentRef={(inst) => this.ChangeMeterValueForm = inst}/>
        </Modal>
      </div>
    );
  }
}

export default Detail
