import React, { PureComponent } from 'react';
import { Tabs,DatePicker,Button,Table,Badge,Modal ,message,Alert} from 'antd';
import {connect} from 'dva';
import forEach from 'lodash/forEach'
const {RangePicker} = DatePicker;
const ButtonGroup = Button.Group;
import {getTimeDistance,disabledDate,errorNumber,renderIndex} from './../../../utils/utils';
import request from './../../../utils/request'
import moment from 'moment'
const TabPane = Tabs.TabPane;
@connect(state => ({
  member_meter_data: state.member_meter_data,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.state = {
      Data:[],
      date: moment(new Date(), 'YYYY-MM-DD')
    }
  }
  componentDidMount() {
    const that=this;
    this.setState({
    },function () {
      that.fetch(that.state.date)
    });

  }

  fetch=(date)=>{
    const that=this;
    request(`/liquid_sensor_data/${this.props.number}`,{
      method:'GET',
      params:{
        date:date.format("YYYY-MM-DD"),
      }
    }).then((response)=>{

      console.log(response);
      if(response.status===200){
        this.setState({
          date:date,
          Data:response.data.data
        })
        that.dynamic(response.data.data)
      }

    });
  }
  dynamic=(data1)=>{
    const data=[...data1].reverse();
    let uploaded_at=[];
    let value=[];
    let errDataIndex=[];
    for(let i=0;i<data.length;i++){
      uploaded_at.push(data[i].uploaded_at);
      value.push(data[i].value);
      if(value.status===-2){
        errDataIndex.push(i)
      }
    }
    console.log('errDataIndex',errDataIndex)
    this.myChart = this.echarts.init(document.querySelector('.liquid-history'));
    var option = {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        bottom: 90
      },
      dataZoom: [{
        type: 'inside'
      }, {
        type: 'slider'
      }],
      xAxis: {
        data: uploaded_at,
        silent: false,
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        },
        name: '时间',
      },
      yAxis: {
        splitArea: {
          show: false
        },
        name: '单位0.01米',
        max:this.props.maxValue
      },
      series: [{
        type: 'bar',
        data: value,
        // Set `large` for large data amount
        large: true,
        itemStyle:{
          normal:{
            color: function(value) {
              if(errDataIndex.indexOf(value.dataIndex)>=0){
                return '#c23531'
              }else{
                return '#3398DB'
              }
            }
          }

          // {
          //   color:'#2f4554',
          // }
        },
      }]
    };



    const that=this;
    that.myChart.setOption(option);
  }

  render() {
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
      {title: '时间', dataIndex: 'uploaded_at', key: 'uploaded_at'},
      {title: '液位实际值', dataIndex: 'value', key: 'value'},
      {
        title: '状态', dataIndex: 'status', key: 'status',
        render: (val, record, index) => {
          let status='success';
          let explain='';
          switch (val){
            case -2:
              status='error'
              explain='错报'
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
         选择日期:<DatePicker
            value={this.state.date}
            allowClear={false}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            style={{width: 150}}
            placeholder="选择日期"
            onChange={(e)=>this.fetch(e)}
          />
          <Tabs defaultActiveKey="1">
            <TabPane tab="折线图" key="1">   <div className="liquid-history" style={{width:'100%',height:'500px'}}></div></TabPane>
            <TabPane tab="表格" key="2">
              <Table
                className={'meter-table'}
                bordered
                columns={columns}
                dataSource={this.state.Data}
                pagination={false}
                size="small"
                rowKey={record => record.uploaded_at}
              />
            </TabPane>
          </Tabs>

        </div>
      </div>
    );
  }
}

export default Detail
