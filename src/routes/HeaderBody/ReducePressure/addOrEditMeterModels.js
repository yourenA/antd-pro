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
        sm: {span: 12},
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
             减压阀编号
            </span>
        )}
      >
        {getFieldDecorator('name', {
          initialValue: this.props.editRecord ? this.props.editRecord.name : '',
        })(
          <Input />
        )}
      </FormItem>

        <FormItem

          {...formItemLayoutWithLabel}
          label="减压阀IMEI"
        >
          {getFieldDecorator('size_type',{
            initialValue: this.props.editRecord ? this.props.editRecord.size_type.toString() : '1',

          })(
            <Input />
          )}
        </FormItem>
        <FormItem

          {...formItemLayoutWithLabel}
          label={(
            <span>
             减压阀地址
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem

        {...formItemLayoutWithLabel}
        label={(
          <span>
               球阀1输出状态
            </span>
        )}>
        {getFieldDecorator('manufacturer_id', {
          initialValue: this.props.editRecord ? this.props.editRecord.size_type.toString() : '1',
        })(
          <RadioGroup>
            <Radio value="1">开</Radio>
            <Radio value="2">关</Radio>
          </RadioGroup>
        )}
      </FormItem>
        <FormItem

          {...formItemLayoutWithLabel}
          label={(
            <span>
               球阀2输出状态
            </span>
          )}>
          {getFieldDecorator('manufacturer_id', {
            initialValue: this.props.editRecord ? this.props.editRecord.size_type.toString() : '1',
          })(
            <RadioGroup>
              <Radio value="1">开</Radio>
              <Radio value="2">关</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
