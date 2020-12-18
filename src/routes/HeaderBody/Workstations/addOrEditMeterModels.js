/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
@injectIntl
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="model-form">
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             名称
            </span>
            )}
          >
            {getFieldDecorator('name', {
              initialValue: this.props.editRecord ? this.props.editRecord.name : '',
              rules: [{required: true, message:'名称必填' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             IMEI
            </span>
            )}
          >
            {getFieldDecorator('imei', {
              initialValue: this.props.editRecord ? this.props.editRecord.imei : '',
              rules: [{required: true, message:'IMEI必填' }],
            })(
              <Input disabled={Boolean(this.props.editRecord)}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             地址
            </span>
            )}
          >
            {getFieldDecorator('address', {
              initialValue: this.props.editRecord ? this.props.editRecord.address : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'减压阀通道1'}
          >
            {getFieldDecorator('enable_1',{
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.ball_valve[0].enable.toString() : '1',
            })(
              <RadioGroup>
                <Radio value="1">启用</Radio>
                <Radio value="0">禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'通道1输出状态'}
          >
            {getFieldDecorator('parameter1_1',{
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.ball_valve[0].parameter1.toString() : '1',
            })(
              <RadioGroup>
                <Radio value="1">开</Radio>
                <Radio value="0">关</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             通道1正常上传间隔(秒)
            </span>
            )}
          >
            {getFieldDecorator('normal_upload_interval_1', {
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.ball_valve[0].normal_upload_interval  : '3600',
            })(
              <InputNumber style={{width:'100%'}} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'减压阀通道2'}
          >
            {getFieldDecorator('enable_2',{
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.ball_valve[1].enable.toString() : '1',
            })(
              <RadioGroup>
                <Radio value="1">启用</Radio>
                <Radio value="0">禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'通道2输出状态'}
          >
            {getFieldDecorator('parameter1_2',{
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.ball_valve[1].parameter1.toString() : '1',
            })(
              <RadioGroup>
                <Radio value="1">开</Radio>
                <Radio value="0">关</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             通道2正常上传间隔(秒)
            </span>
            )}
          >
            {getFieldDecorator('normal_upload_interval_2', {
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.ball_valve[1].normal_upload_interval : '3600',
            })(
              <InputNumber style={{width:'100%'}} />
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
