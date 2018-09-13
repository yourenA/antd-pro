
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
      key: 'name',
    }, {
        title: '上传时间',
        dataIndex: 'created_at',
        key: 'addres2s',
        width:130,
        render: (val, record, index) => {
          return ellipsis2(val, 130)
        }
      }, {
      title: '压力传感器号',
      dataIndex: 'number',
      width:80,
      render: (val, record, index) => {
        let text=''
        if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
          text=record.pressure_sensors_analysis[0].pressure_sensor_number
        }
        return ellipsis2(text, 80)
      },
      key: 'age',
    },{
      title: '压力值',
      dataIndex: 'number',
      width:80,
      render: (val, record, index) => {
        let text=''
        if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
          text=record.pressure_sensors_analysis[0].pressure_value
        }
        return ellipsis2(text, 80)
      },
      key: 'ag2e',
    }, {
      title: '温度传感器号',
      dataIndex: 'number',
      width:80,
      render: (val, record, index) => {
        let text=''
        if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
          text=record.temperature_sensors_analysis[0].temperature_sensor_number
        }
        return ellipsis2(text, 80)
      },
      key: 'address',
    },{
      title: '温度',
      dataIndex: 'number',
      render: (val, record, index) => {
        let text=''
        if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
          text=record.temperature_sensors_analysis[0].temperature_value
        }
        return ellipsis2(text, 80)
      },
      key: 'ag3e1',
    },];
    const that=this;
    return (
      <div>
        <ResizeableTable
          customIndex={true}
          columns={columns} dataSource={this.props.data}
          className={'meter-table'}
          rowKey={record => record.number}
          size="small"
          scroll={{x:1230,y:213}}
          pagination={false}
          meta={this.props.meta}
          history={this.props.history}
          rowClassName={function (record, index) {
            console.log('record',record)
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
