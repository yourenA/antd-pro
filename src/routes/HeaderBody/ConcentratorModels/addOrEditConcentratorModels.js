/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Checkbox} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
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
    const plainOptions = ['901F', '90EF'];
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
             {formatMessage({id: 'intl.type_coding'})}
            </span>
          )}
        >
          {getFieldDecorator('code', {
            initialValue: this.props.editRecord ? this.props.editRecord.code : '',
            rules: [{required: true, message:formatMessage({id: 'intl.type_coding'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.concentrator_type'})}
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: formatMessage({id: 'intl.type_coding'})+formatMessage({id: 'intl.can_not_be_empty'})}],
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
          )}>
          {getFieldDecorator('manufacturer_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.manufacturer_id,label:this.props.editRecord.manufacturer_name}:{key:'',label:''},
            rules: [{required: true, message:formatMessage({id: 'intl.vendor_name'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Select labelInValue={true} >
              { this.props.manufacturers.map((item, key) => {
                return (
                  <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.concentrator_protocols'})}
            </span>
          )}
        >
          {getFieldDecorator('protocols', {
            initialValue: this.props.editRecord ? this.props.editRecord.protocols : [],
            rules: [{required: true, message:formatMessage({id: 'intl.concentrator_protocols'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <CheckboxGroup options={plainOptions}   />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
