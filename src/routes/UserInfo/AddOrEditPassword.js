import React, {Component} from 'react';
import {Form, Input, Button, message, } from 'antd';
const FormItem = Form.Item;
class EditPassword extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

      }
    });
  };

  render() {
    const formItemLayout = {
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
      <Form onSubmit={this.handleSubmit} >
        <FormItem
          label="用户名"
          {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: localStorage.getItem('username') || sessionStorage.getItem('username')
          })(
            <Input disabled={true}/>
          )}
        </FormItem>
        <FormItem
          label="旧密码"
          {...formItemLayout}>
          {getFieldDecorator('old_password', {})(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          label="新密码"
          {...formItemLayout}>
          {getFieldDecorator('new_password', {})(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          label="重复新密码"
          {...formItemLayout}>
          {getFieldDecorator('new_password_confirmation', {})(
            <Input type="password"/>
          )}
        </FormItem>
      </Form>

    );
  }
}

const EditPasswordWrap = Form.create()(EditPassword);

export default EditPasswordWrap;
