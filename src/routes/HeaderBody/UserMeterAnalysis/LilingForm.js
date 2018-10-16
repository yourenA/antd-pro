/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, TreeSelect,DatePicker } from 'antd';
import {connect} from 'dva';
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
import moment from 'moment'
@connect(state => ({
}))
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
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const company_code = sessionStorage.getItem('company_code');
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem label={ '结算日期'}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('date', {
            initialValue: moment(),

          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
