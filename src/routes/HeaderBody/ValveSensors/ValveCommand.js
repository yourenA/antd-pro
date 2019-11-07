/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, InputNumber} from 'antd';
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
        sm: {span: 8},
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
               {formatMessage({id: 'intl.install_address'})}
            </span>
          )}
        >
          {getFieldDecorator('address', {
            initialValue: this.props.editRecord ? this.props.editRecord.address : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.install_address'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.valve_sensors_number'})}
            </span>
          )}
        >
          {getFieldDecorator('meter_number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.valve_sensors_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.current__value'})}
            </span>
          )}
        >
          {getFieldDecorator('target_value', {
            initialValue: this.props.editRecord ? this.props.editRecord.current_value : '',
          })(
            <Input
              disabled={true}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.value'})}
            </span>
          )}
        >
          {getFieldDecorator('value', {
            initialValue: this.props.editRecord ? parseFloat(this.props.editRecord.target_value).toString()==='NaN'?'': parseFloat(this.props.editRecord.target_value): '',
            rules: [{required: true, message:  formatMessage({id: 'intl.value'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <InputNumber
              min={0}
              max={100}
              formatter={value => `${value}%`}
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
