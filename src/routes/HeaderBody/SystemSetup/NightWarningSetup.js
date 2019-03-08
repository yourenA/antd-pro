/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Radio, Layout, Card, Button, Input, message, TimePicker, Switch} from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
import moment from 'moment'
const {Content} = Layout;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {injectIntl} from 'react-intl';
@injectIntl
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      data: [],
      night_abnormality_alarm_level: {},
      night_abnormality_started_at: {},
      night_abnormality_ended_at: {},
      night_abnormality_value: {}
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=night_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        night_abnormality_alarm_level: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_alarm_level'
        }),
        night_abnormality_started_at: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_started_at'
        }),
        night_abnormality_ended_at: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_ended_at'
        }),
        night_abnormality_value: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_value'
        }),
      },function () {
        const {form} = that.props;
        // that.setState({
        //   disabled: that.state.night_abnormality_alarm_level.value==='1'?false:true,
        // })
        form.setFieldsValue({
          night_abnormality_alarm_level: that.state.night_abnormality_alarm_level.value,
          night_abnormality_started_at: moment(that.state.night_abnormality_started_at.value, that.format),
          night_abnormality_ended_at: moment(that.state.night_abnormality_ended_at.value, that.format),
          night_abnormality_value: that.state.night_abnormality_value.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      night_abnormality_alarm_level: that.state.night_abnormality_alarm_level.value,
      night_abnormality_started_at: moment(that.state.night_abnormality_started_at.value, that.format),
      night_abnormality_ended_at: moment(that.state.night_abnormality_ended_at.value, that.format),
      night_abnormality_value: that.state.night_abnormality_value.value,
    });
  }
  handleSubmit=()=>{
    const that=this;
    this.props.form.validateFields({ force: true },
      (err, values) => {
        console.log('values',values)
        if (!err) {
          request(`/configs`, {
            method: 'PATCH',
            data: {
              night_abnormality_alarm_level:values.night_abnormality_alarm_level,
              night_abnormality_started_at:moment( values.night_abnormality_started_at).format(this.format),
              night_abnormality_ended_at:moment( values.night_abnormality_ended_at).format(this.format),
              night_abnormality_value:values.night_abnormality_value

            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              const {intl:{formatMessage}} = that.props;
              message.success(
                formatMessage(
                  {id: 'intl.operate_successful'},
                  {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.night_warning_setup'})}
                )
              )
            }
          })
        }
      }
    );
  }
  render() {
    const {intl:{formatMessage}} = this.props;
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
    var arr = new Array(60);
    for(let i = 0;i < arr.length;i++){
      arr[i]=i;
    }
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };
    const {getFieldDecorator,} = this.props.form;
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理"  breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.system_setting'})},
              {name: formatMessage({id: 'intl.night_warning_setup'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '550px', margin: '0 auto'}} onSubmit={this.handleSubmit}>

                  {/*<FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.night_abnormality_alarm_level.display_name}

                  >
                    {getFieldDecorator('night_abnormality_alarm_level', {valuePropName: 'checked'})(
                      <Switch />
                    )}
                  </FormItem>*/}
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.night_abnormality_started_at.display_name}>
                    {getFieldDecorator('night_abnormality_started_at', {})(
                      <TimePicker format={this.format}  disabledMinutes={()=>{return arr;}}/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.night_abnormality_ended_at.display_name}>
                    {getFieldDecorator('night_abnormality_ended_at', {})(
                      <TimePicker format={this.format} disabledMinutes={()=>{return arr;}}/>
                    )}
                  </FormItem>

                  <FormItem
                    label={this.state.night_abnormality_value.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('night_abnormality_value', {})(
                      <Input  />
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
                    <Button onClick={this.handleFormReset} >{formatMessage({id: 'intl.reset'})}</Button>
                    <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSubmit} >{formatMessage({id: 'intl.submit'})}</Button>
                  </FormItem>

                </Form>
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
