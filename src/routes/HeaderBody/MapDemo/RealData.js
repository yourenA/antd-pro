
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {ellipsis2,renderIndex} from './../../../utils/utils'

@connect(state => ({
  global: state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.data !== this.props.data)){
      console.log('更新table')
    }
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 35,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(this.props.meta, 1, index)
        }
      },{
      title: '集中器号',
      dataIndex: 'number',
      fixed: 'left',
      width:70,
      render: (val, record, index) => {
        return ellipsis2(val, 70)
      },
      key: 'number',
    }, {
        title: '上传时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width:130,
        render: (val, record, index) => {
          return ellipsis2(val, 130)
        }
      }, {
      title: '压力传感器号',
      dataIndex: 'pressure_number',
      width:90,
      render: (val, record, index) => {
        let text=''
        if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
          text=record.pressure_sensors_analysis[0].pressure_sensor_number
        }
        return ellipsis2(text, 90)
      },
      key: 'pressure_number',
    },{
      title: '压力值',
      dataIndex: 'pressure_value',
      width:50,
      render: (val, record, index) => {
        let text=''
        if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
          text=record.pressure_sensors_analysis[0].pressure_value
        }
        return ellipsis2(text, 50)
      },
      key: 'pressure_value',
    }, {
        title: '压力状态',
        dataIndex: 'pressure_status',
        width:60,
        render: (val, record, index) => {
          let text=''
          if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
            text=record.pressure_sensors_analysis[0].pressure_value_status===-1?'异常':'正常'
          }
          return ellipsis2(text, 60)
        },
        key: 'pressure_status',
      },{
      title: '温度传感器号',
      dataIndex: 'temperature_number',
      width:90,
      render: (val, record, index) => {
        let text=''
        if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
          text=record.temperature_sensors_analysis[0].temperature_sensor_number
        }
        return ellipsis2(text, 90)
      },
      key: 'temperature_number',
    },{
      title: '温度',
        width:60,
        dataIndex: 'temperature_value',
      render: (val, record, index) => {
        let text=''
        if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
          text=record.temperature_sensors_analysis[0].temperature_value
        }
        return ellipsis2(text, 60)
      },
      key: 'temperature_value',
    },{
        title: '温度状态',
        dataIndex: 'temperature_status',
        render: (val, record, index) => {
          let text=''
          if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
            text=record.temperature_sensors_analysis[0].pressure_value_status===-1?'异常':'正常'
          }
          return ellipsis2(text, 80)
        },
        key: 'temperature_status',
      }];
    const that=this;
    return (
      <div>
        <ResizeableTable
          customIndex={true}
          columns={columns} dataSource={this.props.data}
          className={'meter-table'}
          rowKey={record => record.number}
          size="small"
          scroll={{x:1000,y:213}}
          pagination={false}
          meta={this.props.meta}
          history={this.props.history}
          rowClassName={function (record, index) {
            if(record.pressure_sensors_analysis && record.pressure_sensors_analysis.length>0 && record.pressure_sensors_analysis[0].pressure_value_status===-1){
              return 'error'
            }
            if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0 && record.temperature_sensors_analysis[0].temperature_value_status===-1){
              return 'error'
            }
            return ''

          {/*  if (!record.bool2 && record.number===that.state.selected) {
              return 'error selected'
            }else if (record.bool2 && record.number===that.state.selected) {
              return 'selected'
            }else if(!record.bool2){
              return 'error'
            }else{
              return ''
            }*/}
          }}

          onRow={(record) => {
            return {
              onClick: () => {
                this.setState({selected:record.number})
                this.props.changeConcentrator(record)
              },       // 点击行
            };
          }}
        />
      </div>
    );
  }
}

export default UserMeterAnalysis
