/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, InputNumber  } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;

class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }
  componentDidMount() {
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              水表号
            </span>
          )}
        >
          {getFieldDecorator('meter_number', {
            initialValue: this.props.meter_number,
          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              几天内不再提醒
            </span>
          )}
        >
          {getFieldDecorator('not_reminder_days', {
            initialValue:this.props.not_reminder_days?this.props.not_reminder_days:"1",
          })(
            <InputNumber/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              备注
            </span>
          )}
        >
          {getFieldDecorator('remark', {
            initialValue:'',
          })(
            <TextArea rows={3} />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default AddPoliciesFormWrap;
