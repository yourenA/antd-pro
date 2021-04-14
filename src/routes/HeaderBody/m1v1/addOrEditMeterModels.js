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
        sm: {span: 10},
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
             安装地址
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
            label={(
              <span>
             modbus#1数据上传间隔(秒)
            </span>
            )}
          >
            {getFieldDecorator('upload_interval', {
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.modbus[0].upload_interval : '600',
              rules: [{required: true, message:'数据上传间隔必填' }],
            })(
              <InputNumber style={{width:'100%'}} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             modbus#2数据上传间隔(秒)
            </span>
            )}
          >
            {getFieldDecorator('upload_interval2', {
              initialValue: this.props.editRecord ? this.props.editRecord.hardware_configs.modbus[1].upload_interval : '600',
              rules: [{required: true, message:'数据上传间隔必填' }],
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
