/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input} from 'antd';
import {connect} from 'dva';
import {injectIntl} from 'react-intl';
const FormItem = Form.Item;

@injectIntl
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
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
          label={formatMessage({id: 'intl.old_password'})}
        >
          {getFieldDecorator('old_password', {
          })(
            <Input  type='password'/>
          )}
        </FormItem>
        <FormItem
          label={formatMessage({id: 'intl.new_password'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('new_password', {
          })(
            <Input  type='password' />
          )}
        </FormItem>
        <FormItem
          label={formatMessage({id: 'intl.repeat_password'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('new_password_confirmation', {
          })(
            <Input type='password'/>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
