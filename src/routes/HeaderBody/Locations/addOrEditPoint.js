/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber, } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;

class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
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
              水表数量
            </span>
          )}
        >
          {getFieldDecorator('meter_count', {
            initialValue: this.props.editRecord ? this.props.editRecord.meter_count : '',
            rules: [{required: true, message: '水表数量不能为空'}],
          })(
            <Input />
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
            initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
