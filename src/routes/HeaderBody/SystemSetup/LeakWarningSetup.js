/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Radio, Layout, Card, Button, Input, message, TimePicker, Switch} from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
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
      leak_abnormality_alarm_level: {},
      leak_abnormality_value: {},
      leak_abnormality_hours: {}
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=leak_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        leak_abnormality_alarm_level: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_alarm_level'
        }),
        leak_abnormality_value: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_value'
        }),
        leak_abnormality_hours: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_hours'
        }),
      },function () {
        const {form} = that.props;
        form.setFieldsValue({
          leak_abnormality_alarm_level: that.state.leak_abnormality_alarm_level.value,
          leak_abnormality_hours: that.state.leak_abnormality_hours.value,
          leak_abnormality_value: that.state.leak_abnormality_value.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      leak_abnormality_alarm_level: that.state.leak_abnormality_alarm_level.value,
      leak_abnormality_hours: that.state.leak_abnormality_hours.value,
      leak_abnormality_value: that.state.leak_abnormality_value.value,
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
              leak_abnormality_alarm_level:values.leak_abnormality_alarm_level,
              leak_abnormality_hours:values.leak_abnormality_hours,
              leak_abnormality_value:values.leak_abnormality_value
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              const {intl:{formatMessage}} = that.props;
              message.success(
                formatMessage(
                  {id: 'intl.operate_successful'},
                  {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.leak_warning_setup'})}
                )
              )
            }
          })
        }
      }
    );
  }
  render() {
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
    const {getFieldDecorator,} = this.props.form;
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };
    const {intl:{formatMessage}} = this.props;
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理"   breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.system_setting'})},
              {name: formatMessage({id: 'intl.leak_warning_setup'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '550px', margin: '0 auto'}} onSubmit={this.handleSubmit}>

                {/*  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.leak_abnormality_alarm_level.display_name}

                  >
                    {getFieldDecorator('leak_abnormality_alarm_level', {valuePropName: 'checked'})(
                      <Switch />
                    )}
                  </FormItem>*/}

                  <FormItem
                    label={this.state.leak_abnormality_value.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('leak_abnormality_value', {})(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem
                    label={this.state.leak_abnormality_hours.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('leak_abnormality_hours', {})(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.leak_abnormality_alarm_level.display_name}
                  >
                    {getFieldDecorator('leak_abnormality_alarm_level')(
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
