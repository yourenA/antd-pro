/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, Tooltip, Icon} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
@injectIntl
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const company_code = sessionStorage.getItem('company_code');

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.old'}) + formatMessage({id: 'intl.water_meter_number'})}
            </span>
            )}
          >
            {getFieldDecorator('old_meter_number', {
              initialValue: this.props.editRecord.number,
              rules: [{
                required: true,
                message: formatMessage({id: 'intl.old'}) + formatMessage({id: 'intl.water_meter_number'}) + formatMessage({id: 'intl.can_not_be_empty'})
              }],
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                {formatMessage({id: 'intl.old'}) + formatMessage({id: 'intl.water_meter_number'}) + formatMessage({id: 'intl.last_reading'})}
            </span>
            )}
          >
            {getFieldDecorator('last_water', {
              initialValue: 0,
              rules: [{
                required: true,
                message: formatMessage({id: 'intl.old'}) + formatMessage({id: 'intl.water_meter_number'})
                + formatMessage({id: 'intl.last_reading'}) + formatMessage({id: 'intl.can_not_be_empty'})
              }],
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.water_meter_number'})}
            </span>
            )}
          >
            {getFieldDecorator('new_meter_number', {rules: [{
              required: true,
              message: formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.water_meter_number'}) + formatMessage({id: 'intl.can_not_be_empty'})
            }]})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                  {formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'}) + formatMessage({id: 'intl.initial_value'})}
            </span>
            )}
          >
            {getFieldDecorator('initial_water', {
              initialValue: 0,
              rules: [{
                required: true,
                message: formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'}) + +formatMessage({id: 'intl.initial_value'}) + formatMessage({id: 'intl.can_not_be_empty'})
              }],
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                 {formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'}) + formatMessage({id: 'intl.vendor_code'})}
            </span>
            )}
          >
            {getFieldDecorator('new_meter_manufacturer_prefix', {
              initialValue: this.props.editRecord.manufacturer_prefix,
              rules: [{
                required: true, message: formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'})
                + formatMessage({id: 'intl.vendor_code'}) + " " + formatMessage({id: 'intl.can_not_be_empty'})
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                {formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'}) + formatMessage({id: 'intl.concentrator_number'})}&nbsp;
                <Tooltip title={formatMessage({id: 'intl.the_default_is'})}>
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
            )}
          >
            {getFieldDecorator('concentrator_number', {
              initialValue: this.props.editRecord.concentrator_number,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                {formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'}) + formatMessage({id: 'intl.channel'})}
            </span>
            )}
          >
            {getFieldDecorator('channel', {
              initialValue: this.props.editRecord.channel,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                {formatMessage({id: 'intl.new'})  + formatMessage({id: 'intl.water_meter_index'})}
            </span>
            )}
          >
            {getFieldDecorator('meter_index', {
              initialValue: this.props.editRecord.index,
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             {formatMessage({id: 'intl.new'})  + formatMessage({id: 'intl.water_meter_type'})}
            </span>
            )}>
            {getFieldDecorator('meter_model_id', {
              initialValue: {key: this.props.editRecord.meter_model_id, label: this.props.editRecord.meter_model_name},
            })(
              <Select labelInValue={true}>
                { this.props.meter_models.map((item, key) => {
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
                             {formatMessage({id: 'intl.new'}) + formatMessage({id: 'intl.meter'}) + formatMessage({id: 'intl.can_valve'})}
            </span>
            )}>
            {getFieldDecorator('is_valve', {
              initialValue: {key: this.props.editRecord.is_valve, label: this.props.editRecord.is_valve_explain},
            })(
              <Select labelInValue={true}>
                { [{key: 1, label: formatMessage({id: 'intl.yes'})}, {key: -1, label: formatMessage({id: 'intl.no'})}].map((item, key) => {
                  return (
                    <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                  )
                }) }
              </Select>
            )}
          </FormItem>
          {
            (company_code === 'hy') && <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              新水表排序号  <Tooltip title="请输入数字或'N','N'表示不指定排序">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
              )}
            >
              {getFieldDecorator('sort_number', {
                initialValue: this.props.editRecord ? this.props.editRecord.sort_number : '',
              })(
                <Input />
              )}
            </FormItem>
          }
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                {formatMessage({id: 'intl.remark'})}
            </span>
            )}
          >
            {getFieldDecorator('remark', {
              initialValue: '',
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
