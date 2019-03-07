/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, Layout, Card, Button, Input, message, Radio, Switch} from "antd";
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
      zero_abnormality_alarm_level: {},
      zero_abnormality_days: {}
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=zero_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        zero_abnormality_alarm_level: find(response.data.data, function (o) {
          return o.name === 'zero_abnormality_alarm_level'
        }),
        zero_abnormality_days: find(response.data.data, function (o) {
          return o.name === 'zero_abnormality_days'
        }),
      },function () {
        const {form} = that.props;
        form.setFieldsValue({
          zero_abnormality_alarm_level: that.state.zero_abnormality_alarm_level.value,
          zero_abnormality_days: that.state.zero_abnormality_days.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      zero_abnormality_alarm_level: that.state.zero_abnormality_alarm_level.value,
      zero_abnormality_days: that.state.zero_abnormality_days.value,
    });
  }
  handleSubmit=()=>{
    this.props.form.validateFields({ force: true },
      (err, values) => {
        console.log('values',values)
        if (!err) {
          request(`/configs`, {
            method: 'PATCH',
            data: {
              zero_abnormality_alarm_level:values.zero_abnormality_alarm_level,
              zero_abnormality_days:values.zero_abnormality_days
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success('修改零流量异常流量报警成功')
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
              {name: formatMessage({id: 'intl.zero_warning_setup'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '550px', margin: '0 auto'}} onSubmit={this.handleSubmit}>

         {/*         <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.zero_abnormality_alarm_level.display_name}

                  >
                    {getFieldDecorator('zero_abnormality_alarm_level', {valuePropName: 'checked'})(
                      <Switch/>
                    )}
                  </FormItem>*/}

                  <FormItem
                    label={this.state.zero_abnormality_days.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('zero_abnormality_days', {})(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.zero_abnormality_alarm_level.display_name}
                  >
                    {getFieldDecorator('zero_abnormality_alarm_level')(
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
