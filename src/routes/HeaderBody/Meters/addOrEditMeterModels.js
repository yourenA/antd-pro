/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, DatePicker, Switch,Tooltip,Icon} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
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
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.water_meter_number'})}
            </span>
            )}
          >
            {getFieldDecorator('number', {
              initialValue: this.props.editRecord ? this.props.editRecord.number : '',
              rules: [{required: true, message:  formatMessage({id: 'intl.water_meter_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.water_meter_type'})}
            </span>
            )}>
            {getFieldDecorator('meter_model_id', {
              initialValue: this.props.editRecord ? {
                key: this.props.editRecord.meter_model_id,
                label: this.props.editRecord.meter_model_name
              } : {key: '', label: ''},
              rules: [{required: true, message: formatMessage({id: 'intl.water_meter_type'})+formatMessage({id: 'intl.can_not_be_empty'})}],
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
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.user_name'})}
            </span>
            )}
          >
            {getFieldDecorator('real_name', {
              initialValue: this.props.editRecord ? this.props.editRecord.real_name : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.vendor_code'})}
            </span>
            )}
          >
            {getFieldDecorator('manufacturer_prefix', {
              initialValue: this.props.editRecord ? this.props.editRecord.manufacturer_prefix : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.manufactured_date'})}
            </span>
            )}>
            {getFieldDecorator('manufactured_at', {
              initialValue: (this.props.editRecord && this.props.editRecord.manufactured_at) ? moment(this.props.editRecord.manufactured_at) : null,
            })(
              <DatePicker allowClear={false}/>
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.installed_date'})}
            </span>
            )}>
            {getFieldDecorator('installed_at', {
              initialValue: (this.props.editRecord && this.props.editRecord.installed_at) ? moment(this.props.editRecord.installed_at) : null,
            })(
              <DatePicker allowClear={false}/>
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.install_address'})}
            </span>
            )}
          >
            {getFieldDecorator('address', {
              initialValue: this.props.editRecord ? this.props.editRecord.install_address : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.initial_value'})}
            </span>
            )}
          >
            {getFieldDecorator('initial_water', {
              initialValue: this.props.editRecord ? this.props.editRecord.initial_water : '0.00',
            })(
              <InputNumber />
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
            {getFieldDecorator('is_valve', {
              initialValue: this.props.editRecord ? {
                key: this.props.editRecord.is_valve.toString(),
                label: this.props.editRecord.is_valve_explain
              } : {key: '', label: ''},
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
            (company_code !== 'hy') &&
            <FormItem
              style={{width:'50%',display:'inline-block'}}
              {...formItemLayoutWithLabel}
              label={formatMessage({id: 'intl.valve_status'})}
            >
              {getFieldDecorator('valve_status',
                {
                  initialValue: this.props.editRecord ? (this.props.editRecord.valve_status === 1 ? true : false) : false
                  , valuePropName: 'checked'
                })(
                <Switch />
              )}
            </FormItem>
          }

          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.battery_life'})}
            </span>
            )}
          >
            {getFieldDecorator('battery_life', {
              initialValue: this.props.editRecord ? this.props.editRecord.battery_life : '0',
            })(
              <InputNumber  />
            )}
          </FormItem>

          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.remark'})}
            </span>
            )}
          >
            {getFieldDecorator('remark', {
              initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width:'50%',display:'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.barcode'})}
            </span>
            )}
          >
            {getFieldDecorator('barcode', {
              initialValue: this.props.editRecord ? this.props.editRecord.barcode : '',
            })(
              <Input />
            )}
          </FormItem>
          {
            (company_code === 'hy') && <FormItem
              style={{width:'50%',display:'inline-block'}}
              {...formItemLayoutWithLabel}
              label={(
                <span>
              {formatMessage({id: 'intl.open_operating_bar'})}排序号  <Tooltip title="请输入数字或'N','N'表示不指定排序">
                <Icon type="question-circle-o" />
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
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
