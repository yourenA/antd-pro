/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {
  Form,
  Select,
  Layout,
  Card,
  Button,
  Input,
  message,
  Radio,
  Switch,
  TimePicker,
  Modal,
  Tabs,
  Icon,
  InputNumber,
  Popconfirm
} from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import forEach from "lodash/forEach";
import filter from "lodash/filter";
import AddOrEditUnusualModels from './addOrEditNightModels'
import AddOrEditUnusualSpecial from './addOrEditNightSpecial'
import moment from 'moment'
const {Content} = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  meter_models: state.meter_models,
}))
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      night_abnormality_alarm_level: {},
      night_abnormality_value: {},
      night_abnormality_started_at: {},
      night_abnormality_ended_at: {},
      night_abnormality_meter_models: {},
      night_abnormality_special_meters: {},
      searchInputValue: '',
      searchSpecialValue: '',
      tableY: 0,
      hadEditModel: false,
      hadEditSpecial: false,

    }
  }

  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        return: 'all'
      }
    });
    request(`/configs?groups[]=night_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      this.changeTableY()
      that.setState({
        night_abnormality_alarm_level: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_alarm_level'
        }),
        night_abnormality_value: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_value'
        }),
        night_abnormality_started_at: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_started_at'
        }),
        night_abnormality_ended_at: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_ended_at'
        }),
        night_abnormality_meter_models: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_meter_models'
        }),
        night_abnormality_special_meters: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_special_meters'
        }),
      }, function () {
        const {form} = that.props;
        form.setFieldsValue({
          night_abnormality_alarm_level: that.state.night_abnormality_alarm_level.value,
          night_abnormality_value: that.state.night_abnormality_value.value,
          night_abnormality_started_at: moment(that.state.night_abnormality_started_at.value, that.format),
          night_abnormality_ended_at: moment(that.state.night_abnormality_ended_at.value, that.format),

        });
      })

    })
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.system-tabs').offsetTop - (68 + 54 + 50 + 60 + 17)
    })
  }
  handleFormReset = () => {
    const {form} = this.props;
    const that = this;
    form.setFieldsValue({
      night_abnormality_alarm_level: that.state.night_abnormality_alarm_level.value,
      night_abnormality_value: that.state.night_abnormality_value.value,
      night_abnormality_started_at: moment(that.state.night_abnormality_started_at.value, that.format),
      night_abnormality_ended_at: moment(that.state.night_abnormality_ended_at.value, that.format),
    });
  }
  handleSubmit = ()=> {
    const that = this;
    this.props.form.validateFields({force: false},
      (err, values) => {
        console.log('values', values)
        request(`/configs`, {
          method: 'PATCH',
          data: {
            night_abnormality_alarm_level: values.night_abnormality_alarm_level,
            night_abnormality_value: values.night_abnormality_value,
            night_abnormality_started_at: moment(values.night_abnormality_started_at).format(this.format),
            night_abnormality_ended_at: moment(values.night_abnormality_ended_at).format(this.format),
          }
        }).then((response)=> {
          console.log(response);

          if (response.status === 200) {
            const {intl:{formatMessage}} = that.props;
            message.success(`${formatMessage({id: 'intl.edit'})} ${this.state.night_abnormality_value.display_name} ${formatMessage({id: 'intl.successful'})}`)
          }
        })
      }
    );
  }
  handleSubmitModel = ()=> {
    const that = this;
    const {intl:{formatMessage}} = that.props;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log(formValues)
    if (formValues.meter_model_ids.length === 0) {
      message.error(`${formatMessage({id: 'intl.water_meter_type'})}${formatMessage({id: 'intl.can_not_be_empty'})}`)
      return false
    }
    if (formValues.value === undefined) {
      message.error(`${formatMessage({id: 'intl.judgment_value'})}${formatMessage({id: 'intl.can_not_be_empty'})}`)
      return false
    }

    let newModels = [];
    for (let i = 0; i < formValues.meter_model_ids.length; i++) {
      const isExit = find(this.state.night_abnormality_meter_models.value, function (o) {
        return o.id === formValues.meter_model_ids[i].key;
      });
      if (isExit) {
        message.error(`${ formValues.meter_model_ids[i].label}${formatMessage({id: 'intl.already_exists'})}`)
        return false
      } else {
        newModels.push({
          id: formValues.meter_model_ids[i].key,
          value: formValues.value,
          started_at: moment(formValues.started_at).format(this.format),
          ended_at: moment(formValues.ended_at).format(this.format),
          name: formValues.meter_model_ids[i].label,
        })
      }
    }
    this.state.night_abnormality_meter_models.value = [...newModels, ...this.state.night_abnormality_meter_models.value]

    this.setState({
      hadEditModel: true,
      modelModal: false,
      night_abnormality_meter_models: this.state.night_abnormality_meter_models
    })


  }
  handleSubmitEditModel = ()=> {
    const {intl:{formatMessage}} = this.props;
    const formValues = this.EditformRef.props.form.getFieldsValue();
    if (formValues.value === undefined) {
      message.error(`${formatMessage({id: 'intl.judgment_value'})}${formatMessage({id: 'intl.can_not_be_empty'})}`)
      return false
    }
    const that = this;
    const editIndex = findIndex(this.state.night_abnormality_meter_models.value, function (o) {
      return o.id === that.state.editModelRecord.id;
    });
    console.log('editIndex', editIndex)
    this.state.night_abnormality_meter_models.value[editIndex].value = formValues.value;
    this.state.night_abnormality_meter_models.value[editIndex].started_at = moment(formValues.started_at).format(this.format);
    this.state.night_abnormality_meter_models.value[editIndex].ended_at = moment(formValues.ended_at).format(this.format);


    this.setState({
      hadEditModel: true,
      night_abnormality_meter_models: this.state.night_abnormality_meter_models,
      editModelModal: false,
    })

    return false
  }
  handleRemoveModel = (id)=> {
    const {intl:{formatMessage}} = this.props;
    const deleteIndex = findIndex(this.state.night_abnormality_meter_models.value, function (o) {
      return o.id === id;
    });
    console.log('deleteIndex', deleteIndex)
    if (deleteIndex !== -1) {
      const night_abnormality_meter_models = this.state.night_abnormality_meter_models.value.splice(deleteIndex, 1)
      console.log(night_abnormality_meter_models)
      console.log(this.state.night_abnormality_meter_models.value)

      this.setState({
        hadEditModel: true,
        night_abnormality_meter_models: this.state.night_abnormality_meter_models
      })

    }
  }

  saveModel = ()=> {
    forEach(this.state.night_abnormality_meter_models.value, function (item, index) {
      delete item.name
    });
    const that = this
    request(`/configs`, {
      method: 'PATCH',
      data: {
        night_abnormality_meter_models: this.state.night_abnormality_meter_models.value
      }
    }).then((response)=> {
      console.log(response);
      if (response.status === 200) {
        this.setState({})
        message.success('保存成功')
        that.setState({
          night_abnormality_meter_models: find(response.data.data, function (o) {
            return o.name === 'night_abnormality_meter_models'
          }),
          hadEditModel: false
        });
      }
    })
  }
  handleSubmitSpecial = ()=> {
    const that = this;
    const {intl:{formatMessage}} = that.props;
    const formValues = this.specialFormRef.props.form.getFieldsValue();
    console.log(formValues)
    if (formValues.meter_numbers.length === 0) {
      message.error(`${formatMessage({id: 'intl.water_meter_number'})}${formatMessage({id: 'intl.can_not_be_empty'})}`)
      return false
    }
    if (formValues.value === undefined) {
      message.error(`${formatMessage({id: 'intl.judgment_value'})}${formatMessage({id: 'intl.can_not_be_empty'})}`)
      return false
    }
    let newMeters = [];

    for (let i = 0; i < formValues.meter_numbers.length; i++) {
      const isExit = find(this.state.night_abnormality_special_meters.value, function (o) {
        return o.number === formValues.meter_numbers[i];
      });
      if (isExit) {
        message.error(`${ formValues.meter_numbers[i]}${formatMessage({id: 'intl.already_exists'})}`)
        return false
      } else {
        newMeters.push({
          number: formValues.meter_numbers[i].split('@')[1],
          value: formValues.value,
          started_at: moment(formValues.started_at).format(this.format),
          ended_at: moment(formValues.ended_at).format(this.format),
          name: formValues.meter_numbers[i].split('@')[0],
        })
      }
    }

    this.state.night_abnormality_special_meters.value = [...newMeters, ...this.state.night_abnormality_special_meters.value]

    this.setState({
      hadEditSpecial: true,
      specialModal: false,
      night_abnormality_special_meters: this.state.night_abnormality_special_meters
    })

  }

  handleRemoveSpecial = (number)=> {
    const that = this;
    const {intl:{formatMessage}} = that.props;
    const deleteIndex = findIndex(this.state.night_abnormality_special_meters.value, function (o) {
      return o.number === number;
    });
    console.log('deleteIndex', deleteIndex)
    if (deleteIndex !== -1) {
      const night_abnormality_special_meters = this.state.night_abnormality_special_meters.value.splice(deleteIndex, 1)
      console.log(night_abnormality_special_meters)
      console.log(this.state.night_abnormality_special_meters.value)
      this.setState({
        hadEditSpecial: true,
        night_abnormality_special_meters: this.state.night_abnormality_special_meters
      })

    }
  }
  handleSubmitEditSpecial = ()=> {
    const that = this;
    const {intl:{formatMessage}} = that.props;
    const formValues = this.specialEditFormRef.props.form.getFieldsValue();
    if (formValues.value === undefined) {
      message.error(`${formatMessage({id: 'intl.judgment_value'})}${formatMessage({id: 'intl.can_not_be_empty'})}`)
      return false
    }
    const editIndex = findIndex(this.state.night_abnormality_special_meters.value, function (o) {
      return o.number === that.state.editSpecialRecord.number;
    });
    console.log('editIndex', editIndex)
    this.state.night_abnormality_special_meters.value[editIndex].value = formValues.value;
    this.state.night_abnormality_special_meters.value[editIndex].started_at = moment(formValues.started_at).format(this.format);
    this.state.night_abnormality_special_meters.value[editIndex].ended_at = moment(formValues.ended_at).format(this.format);

    this.setState({
      hadEditSpecial: true,
      editSpecialModal: false,
      night_abnormality_special_meters: this.state.night_abnormality_special_meters
    })
  }
  saveSpecial = ()=> {
    const that = this
    forEach(this.state.night_abnormality_special_meters.value, function (item, index) {
      delete item.name;
      delete item.id
    });
    request(`/configs`, {
      method: 'PATCH',
      data: {
        night_abnormality_special_meters: this.state.night_abnormality_special_meters.value
      }
    }).then((response)=> {
      console.log(response);
      if (response.status === 200) {
        message.success('保存成功')
        that.setState({
          night_abnormality_special_meters: find(response.data.data, function (o) {
            return o.name === 'night_abnormality_special_meters'
          }),
          hadEditSpecial: false
        });
      }
    })
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {meter_models}=this.props
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      }
    };
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };
    var arr = new Array(60);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i;
    }
    const {getFieldDecorator,} = this.props.form;
    const that = this;
    const Special_dataSource = this.state.night_abnormality_special_meters.value ? filter(this.state.night_abnormality_special_meters.value, function (o) {
      return o.number.indexOf(that.state.searchInputValue) >= 0
    }) : []
    const Models_dataSource = this.state.night_abnormality_meter_models.value ? this.state.night_abnormality_meter_models.value : []
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.system_setting'})},
              {name: formatMessage({id: 'intl.leak_warning_setup'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs defaultActiveKey="1" className="system-tabs alarm-tabs">
                  <TabPane tab={this.state.night_abnormality_value.display_name} key="1">
                    <Form style={{maxWidth: '550px', margin: '0 auto'}} onSubmit={this.handleSubmit}>
                      <FormItem
                        label={this.state.night_abnormality_value.display_name}
                        {...formItemLayoutWithLabel}
                      >
                        {getFieldDecorator('night_abnormality_value', {})(
                          <InputNumber style={{width: 160}}/>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutWithLabel}
                        label={this.state.night_abnormality_started_at.display_name}>
                        {getFieldDecorator('night_abnormality_started_at', {})(
                          <TimePicker format={this.format} disabledMinutes={()=> {
                            return arr;
                          }}/>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutWithLabel}
                        label={this.state.night_abnormality_ended_at.display_name}>
                        {getFieldDecorator('night_abnormality_ended_at', {})(
                          <TimePicker format={this.format} disabledMinutes={()=> {
                            return arr;
                          }}/>
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutWithLabel}
                        label={this.state.night_abnormality_alarm_level.display_name}
                      >
                        {getFieldDecorator('night_abnormality_alarm_level')(
                          <RadioGroup>
                            <Radio style={radioStyle} value="1">{formatMessage({id: 'intl.alarm_level1'})}</Radio>
                            <Radio style={radioStyle} value="2">{formatMessage({id: 'intl.alarm_level2'})}</Radio>
                            <Radio style={radioStyle} value="3">{formatMessage({id: 'intl.alarm_level3'})}</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                      <FormItem
                        wrapperCol={ {
                          offset: 10,
                        }}>
                        <Button onClick={this.handleFormReset}>{formatMessage({id: 'intl.reset'})}</Button>
                        <Button style={{marginLeft: 8}} type="primary"
                                onClick={this.handleSubmit}>{formatMessage({id: 'intl.submit'})}</Button>
                      </FormItem>
                    </Form>
                  </TabPane>
                  <TabPane tab={this.state.night_abnormality_meter_models.display_name} key="2">
                    <div>
                      <div style={{margin: '0 0 10px 0'}}>
                        <Button onClick={() => {
                          this.setState({
                            modelModal: true
                          })
                        }} type="primary">
                          <Icon type="plus"/>{formatMessage({id: 'intl.add_meter_type_abnormal_rule'})}
                        </Button>
                        {
                          this.state.hadEditModel &&
                          <Button
                            type="primary"
                            style={{float: 'right'}}
                            onClick={this.saveModel}
                          >
                            保存
                          </Button>
                        }
                      </div>
                      <div className="alarm-tabs-content"
                           style={{background: this.state.hadEditModel ? '#fce4d6' : '#e2efda'}}>
                        {
                          Models_dataSource.map((item, index)=> {
                            return <div key={index} className="alarm-item">
                              <h2 title={item.name}><Icon type="appstore" style={{marginRight: '5px'}}/>{item.name}</h2>
                              <p className="alarm-item-value">起始时间 : <span >{item.started_at}-{item.ended_at}</span></p>
                              <p className="alarm-item-value">异常报警值 : <span >{item.value}</span> m³</p>
                              <div className="alarm-item-edit">
                                <Popconfirm
                                  title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                                  onConfirm={()=> this.handleRemoveModel(item.id)}>
                                  <Button size="small" type="dashed"
                                  >  {formatMessage({id: 'intl.delete'})}</Button>
                                </Popconfirm>
                                <Button size="small" type="dashed" onClick={()=> {
                                  this.setState({
                                    editModelRecord: item,
                                    editModelModal: true
                                  })
                                }}>{formatMessage({id: 'intl.edit'})}</Button>
                              </div>
                            </div>
                          })
                        }
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab={this.state.night_abnormality_special_meters.display_name} key="3"
                           style={{background: this.state.hadEditSpecial ? '#fce4d6' : '#e2efda'}}>
                    <div style={{margin: '0 0 10px 0', overflow: 'hidden'}}>
                      <Input placeholder={formatMessage({id: 'intl.water_meter_number'})}
                             style={{width: '150px', marginRight: '10px'}} onChange={(e)=> {
                        this.setState({
                          searchInputValue: e.target.value,
                        })
                      }} value={this.state.searchInputValue}/>
                      <Button onClick={() => {
                        this.setState({
                          specialModal: true
                        })
                      }} type="primary">
                        <Icon type="plus"/> {formatMessage({id: 'intl.add_meter_abnormal_rule'})}
                      </Button>
                      {
                        this.state.hadEditSpecial &&
                        <Button
                          type="primary"
                          style={{float: 'right'}}
                          onClick={this.saveSpecial}
                        >
                          保存
                        </Button>
                      }
                    </div>
                    <div className="alarm-tabs-content">
                      {
                        Special_dataSource.map((item, index)=> {
                          return <div key={index} className="alarm-item">
                            <h2 title={item.name}><Icon type="user" style={{marginRight: '5px'}}/>{item.name}</h2>
                            <p className="alarm-item-number">水表号:{item.number}</p>
                            <p className="alarm-item-value">起始时间 : <span >{item.started_at}-{item.ended_at}</span></p>
                            <p className="alarm-item-value">异常报警值 : <span >{item.value}</span> m³</p>
                            <div className="alarm-item-edit">
                              <Popconfirm
                                title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                                onConfirm={()=> this.handleRemoveSpecial(item.number)}>
                                <Button size="small" type="dashed"
                                >  {formatMessage({id: 'intl.delete'})}</Button>
                              </Popconfirm>
                              <Button size="small" type="dashed" onClick={()=> {
                                this.setState({
                                  editSpecialRecord: item,
                                  editSpecialModal: true
                                })
                              }}>{formatMessage({id: 'intl.edit'})}</Button>
                            </div>
                          </div>
                        })
                      }
                    </div>


                  </TabPane>
                </Tabs>
                <Modal
                  title={formatMessage({id: 'intl.add'}) + " " + this.state.night_abnormality_meter_models.display_name}
                  visible={this.state.modelModal}
                  onOk={this.handleSubmitModel}
                  onCancel={() => this.setState({modelModal: false})}
                >
                  <AddOrEditUnusualModels meter_models={meter_models}
                                          wrappedComponentRef={(inst) => this.formRef = inst}/>
                </Modal>
                <Modal
                  key={ Date.parse(new Date()) + 1}
                  title={formatMessage({id: 'intl.edit'}) + " " + this.state.night_abnormality_meter_models.display_name}
                  visible={this.state.editModelModal}
                  onOk={this.handleSubmitEditModel}
                  onCancel={() => this.setState({editModelModal: false, editModelRecord: {}})}
                >
                  <AddOrEditUnusualModels meter_models={meter_models} editModelRecord={this.state.editModelRecord}
                                          wrappedComponentRef={(inst) => this.EditformRef = inst}/>
                </Modal>
                <Modal
                  title={formatMessage({id: 'intl.add'}) + " " + this.state.night_abnormality_special_meters.display_name}
                  visible={this.state.specialModal}
                  onOk={this.handleSubmitSpecial}
                  onCancel={() => this.setState({specialModal: false})}
                >
                  <AddOrEditUnusualSpecial wrappedComponentRef={(inst) => this.specialFormRef = inst}/>
                </Modal>
                <Modal
                  key={ Date.parse(new Date()) + 2}
                  title={formatMessage({id: 'intl.edit'}) + " " + this.state.night_abnormality_special_meters.display_name}
                  visible={this.state.editSpecialModal}
                  onOk={this.handleSubmitEditSpecial}
                  onCancel={() => this.setState({editSpecialModal: false, editSpecialRecord: {}})}
                >
                  <AddOrEditUnusualSpecial editSpecialRecord={this.state.editSpecialRecord}
                                           wrappedComponentRef={(inst) => this.specialEditFormRef = inst}/>
                </Modal>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
