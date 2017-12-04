/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input,  Select} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
class OrganizationForm extends Component {
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
    const {getFieldDecorator,} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
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
            rules: [{required: true, message: '目的地值不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="描述"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('description', {
            initialValue: this.props.editRecord ? this.props.editRecord.description : '',
          })(
            <Input type="textarea" autosize={{minRows: 3, maxRows: 6}}/>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(OrganizationForm);
export default connect()(AddPoliciesFormWrap);
