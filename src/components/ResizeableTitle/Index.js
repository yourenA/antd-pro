import {Table, Badge, Switch, Progress} from 'antd';
import React, {PureComponent} from 'react';
import {Resizable} from 'react-resizable';
import {renderIndex, ellipsis2,renderErrorData} from './../../utils/utils'

const ResizeableTitle = (props) => {
  const {onResize, width, ...restProps} = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

export default class Demo extends React.Component {
  state = {
    columns: this.props.customIndex?this.props.columns:[
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(this.props.meta, this.props.initPage, index)
        }
      },
      ...this.props.columns
    ]
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  componentWillReceiveProps(nextProps) {
  /*  if(this.props.columns!=nextProps.columns){
      this.setState({
        columns: nextProps.columns
      })
    }*/
    if (this.props.canOperate !== undefined && nextProps.canOperate !== this.props.canOperate) {
      if (nextProps.canOperate) {
        this.state.columns.push(this.props.operate)
        this.setState({
          columns: this.state.columns
        })
      } else {
        this.state.columns.pop()
        this.setState({
          columns: this.state.columns
        })
      }
    }
  }

  handleResize = index => (e, {size}) => {
    this.setState(({columns}) => {
      const nextColumns = [...columns];
      if (nextColumns[index].title === '序号') {
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
          render: (val, record, index) => {
            return renderIndex(this.props.meta, this.props.initPage, index)
          }
        };
      } else {
        const pathname = this.props.history.location.pathname.split('/');
        switch (pathname[pathname.length - 1]) {
          case 'concentrator_manage':
            switch (nextColumns[index].dataIndex) {
              case 'number':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    return <p className="link" onClick={()=>this.props.showConcentrator(record)}>
                      {val}
                    </p>
                  }
                };
                break;

              case 'is_online':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let status = "success";
                    let status_text = "是";
                    switch (val) {
                      case  1:
                        status = 'success';
                        status_text = "是";
                        break;
                      case  -1:
                        status = 'error';
                        status_text = "否";
                        break;
                      case  -2:
                        status = 'warning';
                        status_text = "休眠";
                        break;
                    }
                    return (
                      <p>
                        <Badge status={status}/>{status_text}
                      </p>
                    )
                  }
                };
                break;
              case 'villages':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let transVal = val.map((item, index)=> {
                      return <span key={index}>{ellipsis2(item.name, size.width)}<br/></span>

                    })
                    return <span>{transVal}</span>
                  }
                };
                break;
              case 'sleep_hours':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let transVal = val;
                    transVal.sort(function (a, b) {
                      return a - b
                    })
                    return ellipsis2(transVal.join(','), size.width)
                  }
                };
                break;
              case 'is_count':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    return (
                      <p>
                        <Badge status={val === 1 ? "success" : "error"}/>{val === 1 ? "是" : "否"}
                      </p>
                    )
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'servers_manage':
            switch (nextColumns[index].dataIndex) {
              case 'status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    return (
                      <p>
                        <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}

                      </p>
                    )
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'user_manage':
            switch (nextColumns[index].dataIndex) {
              case 'is_sms_notify':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => (
                    <Switch checked={record.is_sms_notify === 1 ? true : false}/>
                  )
                };
                break;
              case 'is_email_notify':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => (
                    <Switch checked={record.is_email_notify === 1 ? true : false}/>
                  )
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'water_meter_search':
            switch (nextColumns[index].dataIndex) {
              case 'is_control':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => (
                    <p>
                      <Badge status={val === 1 ? "success" : "error"}/>{record.is_control_explain}

                    </p>
                  )
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'water_meter_manage':
            switch (nextColumns[index].dataIndex) {
              case 'is_valve':
              case 'valve_status':
              case 'status':
              case 'voltage_status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'concentrator_type_search':
            switch (nextColumns[index].dataIndex) {
              case 'protocols':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (text, record, index) => {
                    return ellipsis2(text.join('|'), size.width)
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'concentrator_unusual_analysis':
            switch (nextColumns[index].dataIndex) {
              case 'upload_meter_rate':
              case 'normal_meter_rate':
              case 'hours_status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'meter_unusual_analysis':
            switch (nextColumns[index].dataIndex) {
              case 'concentrator_number':
              case 'status':
              case 'consumption':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              case 'protocols':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    if (val) {
                      return ellipsis2(val.join('|'), size.width)
                    } else {
                      return ''
                    }
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'concentrator_error':
            switch (nextColumns[index].dataIndex) {
              case 'concentrator_number':
              case 'status':
              case 'upload_meter_rate':
              case 'normal_meter_rate':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'user_meter_error':
            switch (nextColumns[index].dataIndex) {
              case 'concentrator_number':
              case 'status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'leak_abnormality':
          case 'night_abnormality':
            switch (nextColumns[index].dataIndex) {
              case 'abnormality_hours':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record, index) => {
                    const parseVal=val.join(',');
                    return ellipsis2(parseVal,size.width)
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'complete_realData':
            switch (nextColumns[index].dataIndex) {
              case 'fmv':
              case 'meter_revalue':
              case 'meter_time':
              case 'flow_up':
              case 'flow_up_time':
              case 'temp_up':
              case 'temp_up_time':
              case 'cover_is_opened':
              case 'empty_pipe_alarm':
              case 'low_voltage':
              case 'reflow_up':
              case 'reflow_up_time':
              case 'point0_freeze_value':
              case 'signal':
              case 'water_temperature':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record) => {
                    return ellipsis2(record['body'][nextColumns[index].key],size.width)
                  }
                };
                break;
              case 'cell_voltage_1':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record) => {
                    if(record['body'].cell_voltage_1){
                      return ellipsis2(record['body'].cell_voltage_1+'V',size.width)
                    }else{
                      return ''
                    }
                  }
                };
                break;
              case 'cell_voltage_2':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record) => {
                    if(record['body'].cell_voltage_2){
                      return ellipsis2(record['body'].cell_voltage_2+'V',size.width)
                    }else{
                      return ''
                    }
                  }
                };
                break;
              case 'cell_voltage_lora':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record) => {
                    if(record['body'].cell_voltage_lora){
                      return ellipsis2(record['body'].cell_voltage_lora+'V',size.width)
                    }else{
                      return ''
                    }
                  }
                };
                break;
              case 'state_valve':
              case 'state_voltage_level':
              case 'state_temperature_sensor':
              case 'state_elock':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              case 'protocols':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record) => {
                    return ellipsis2(val.join('|'),  size.width)
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'user_meter_analysis':
            switch (nextColumns[index].dataIndex) {
              case 'latest_value':
              case 'previous_value':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render:  (val, record) => {
                    return ellipsis2(renderErrorData(val), size.width)
                  }
                };
                break;
              case 'status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          case 'map_demo':
            switch (nextColumns[index].dataIndex) {
              case 'pressure_number':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let text=''
                    if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
                      text=record.pressure_sensors_analysis[0].pressure_sensor_number
                    }
                    return ellipsis2(text, size.width)
                  },
                };
                break;
              case 'pressure_value':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let text=''
                    if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
                      text=record.pressure_sensors_analysis[0].pressure_value
                    }
                    return ellipsis2(text, size.width)
                  },
                };
                break;
              case 'pressure_status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let text=''
                    if(record.pressure_sensors_analysis&&record.pressure_sensors_analysis.length>0){
                      text=record.pressure_sensors_analysis[0].pressure_value_status===-1?'异常':'正常'
                    }
                    return ellipsis2(text, 60)
                  },
                };
                break;
              case 'temperature_number':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let text=''
                    if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
                      text=record.temperature_sensors_analysis[0].temperature_sensor_number
                    }
                    return ellipsis2(text, size.width)
                  },
                };
                break;
              case 'temperature_value':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let text=''
                    if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
                      text=record.temperature_sensors_analysis[0].temperature_value
                    }
                    return ellipsis2(text, size.width)
                  },
                };
                break;
              case 'temperature_status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    let text=''
                    if(record.temperature_sensors_analysis && record.temperature_sensors_analysis.length>0){
                      text=record.temperature_sensors_analysis[0].pressure_value_status===-1?'异常':'正常'
                    }
                    return ellipsis2(text, 60)
                  },
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render ? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;
          default:
            nextColumns[index] = {
              ...nextColumns[index],
              width: size.width,
              render: nextColumns[index].render ? (val, record, index) => {
                return ellipsis2(val, size.width)

              } : (val, record, index) => {
                return (
                {val}
                )
              }
            };
        }
       }
      return {columns: nextColumns};
    });
  };

  render() {
    let dataSource = this.props.dataSource;
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Table
        className={this.props.className ? this.props.className : 'meter-table'}
        bordered
        components={this.components}
        columns={columns}
        dataSource={dataSource}
        scroll={this.props.scroll}
        pagination={false}
        size="small"
        loading={this.props.loading}
        rowKey={this.props.rowKey}
        rowClassName={this.props.rowClassName && this.props.rowClassName}
        onRow={this.props.onRow}
        onChange={this.props.onChange}
        rowSelection={this.props.rowSelection && this.props.rowSelection}
      />
    );
  }
}
