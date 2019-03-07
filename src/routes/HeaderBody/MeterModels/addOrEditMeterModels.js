/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber } from 'antd';
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
      <Form onSubmit={this.handleSubmit} className="model-form">
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.water_meter_type'})}
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message:formatMessage({id: 'intl.water_meter_type'})+formatMessage({id: 'intl.can_not_be_empty'}) }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label=  {formatMessage({id: 'intl.size_type'})}
        >
          {getFieldDecorator('size_type',{
            initialValue: this.props.editRecord ? this.props.editRecord.size_type.toString() : '1',
            rules: [{required: true, message:formatMessage({id: 'intl.size_type'})+formatMessage({id: 'intl.can_not_be_empty'}) }],

          })(
            <RadioGroup>
              <Radio value="1">{formatMessage({id: 'intl.small_meter'})}</Radio>
              <Radio value="2">{formatMessage({id: 'intl.big_meter'})}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.vendor_name'})}
            </span>
          )}>
          {getFieldDecorator('manufacturer_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.manufacturer_id,label:this.props.editRecord.manufacturer_name}:{key:'',label:''},
            rules: [{required: true, message:formatMessage({id: 'intl.vendor_name'})+formatMessage({id: 'intl.can_not_be_empty'}) }],
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
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.output_type'})}
        >
          {getFieldDecorator('output_type',{
            initialValue: this.props.editRecord ? this.props.editRecord.output_type.toString() : '1',
            rules: [{required: true, message:formatMessage({id: 'intl.output_type'})+formatMessage({id: 'intl.can_not_be_empty'}) }],
          })(
            <RadioGroup>
              <Radio value="1">{formatMessage({id: 'intl.wired'})}</Radio>
              <Radio value="2">{formatMessage({id: 'intl.wireless'})}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.can_valve'})}
            </span>
          )}>
          {getFieldDecorator('is_control', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.is_control.toString(),label:this.props.editRecord.is_control_explain}:{key:'',label:''},
            rules: [{required: true, message:formatMessage({id: 'intl.can_valve'})+formatMessage({id: 'intl.can_not_be_empty'}) }],
          })(
            <Select labelInValue={true} >
              { [{key: 1, label: formatMessage({id: 'intl.yes'})}, {key: -1, label: formatMessage({id: 'intl.no'})}].map((item, key) => {
                return (
                  <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.temperature_type'})}
        >
          {getFieldDecorator('temperature_type',{
            initialValue: this.props.editRecord ? this.props.editRecord.temperature_type.toString() : '1',
            rules: [{required: true, message:formatMessage({id: 'intl.temperature_type'})+formatMessage({id: 'intl.can_not_be_empty'}) }],

          })(
            <RadioGroup>
              <Radio value="1">{formatMessage({id: 'intl.cold_water_meter'})}</Radio>
              <Radio value="2">{formatMessage({id: 'intl.hot_water_meter'})}</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.bore'})}
            </span>
          )}
        >
          {getFieldDecorator('bore', {
            initialValue: this.props.editRecord ? this.props.editRecord.bore : '',
          })(
            <InputNumber  />
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.battery_life'})}
            </span>
          )}
        >
          {getFieldDecorator('service_life', {
            initialValue: this.props.editRecord ? this.props.editRecord.service_life : '',
          })(
            <InputNumber  />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.baud_rate'})}
            </span>
          )}
        >
          {getFieldDecorator('baud_rate', {
            initialValue: this.props.editRecord ? this.props.editRecord.baud_rate : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.down_protocol'})}
            </span>
          )}
        >
          {getFieldDecorator('down_protocol', {
            initialValue: this.props.editRecord ? this.props.editRecord.down_protocol : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.unit'})}
            </span>
          )}
        >
          {getFieldDecorator('unit', {
            initialValue: this.props.editRecord ? this.props.editRecord.unit : '',
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
