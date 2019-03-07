/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select} from 'antd';
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
        sm: {span: 7},
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
              {formatMessage({id: 'intl.vendor_number'})}
            </span>
          )}
        >
          {getFieldDecorator('code', {
            initialValue: this.props.editRecord ? this.props.editRecord.code : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.vendor_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
             {formatMessage({id: 'intl.vendor_name'})}
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.vendor_name'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
             {formatMessage({id: 'intl.vendor_contact'})}
            </span>
          )}
        >
          {getFieldDecorator('contact', {
            initialValue: this.props.editRecord ? this.props.editRecord.contact : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
             {formatMessage({id: 'intl.vendor_phone'})}
            </span>
          )}
        >
          {getFieldDecorator('phone', {
            initialValue: this.props.editRecord ? this.props.editRecord.phone : '',
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
