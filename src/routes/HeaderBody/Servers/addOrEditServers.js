/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber, } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
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
               {formatMessage({id: 'intl.server_ip'})}
            </span>
          )}
        >
          {getFieldDecorator('ip', {
            initialValue: this.props.editRecord ? this.props.editRecord.ip : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.server_ip'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.server_port'})}
            </span>
          )}
        >
          {getFieldDecorator('port', {
            initialValue: this.props.editRecord ? this.props.editRecord.port : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.server_port'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <InputNumber />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
