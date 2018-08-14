/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber,DatePicker,Switch,Tooltip,Icon } from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
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
              旧水表号
            </span>
          )}
        >
          {getFieldDecorator('old_meter_number', {
            initialValue:  this.props.editRecord.number,
            rules: [{required: true, message: '水表号不能为空'}],
          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              旧水表最后水量
            </span>
          )}
        >
          {getFieldDecorator('last_water', {
            initialValue: 0,
            rules: [{required: true, message: '旧水表最后水量不能为空'}],
          })(
            <InputNumber min={0} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表号
            </span>
          )}
        >
          {getFieldDecorator('new_meter_number', {
            rules: [{required: true, message: '新水表号不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表初始水量
            </span>
          )}
        >
          {getFieldDecorator('initial_water', {
            initialValue:0,
            rules: [{required: true, message: '新水表初始水量不能为空'}],
          })(
            <InputNumber min={0}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表厂商代码
            </span>
          )}
        >
          {getFieldDecorator('new_meter_manufacturer_prefix', {
            initialValue:  this.props.editRecord.manufacturer_prefix,
            rules: [{required: true, message: '新水表厂商代码不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表集中器号&nbsp;
              <Tooltip title="如果为空则默认为旧表集中器号">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('concentrator_number', {
            initialValue:  this.props.editRecord.concentrator_number,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表集中器通道号&nbsp;
              <Tooltip title="如果为空则默认为旧表集中器通道号">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('channel', {
            initialValue:  this.props.editRecord.channel,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表序号&nbsp;
              <Tooltip title="如果为空则默认为旧表序号">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('meter_index', {
            initialValue:  this.props.editRecord.index,
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              新水表类型
            </span>
          )}>
          {getFieldDecorator('meter_model_id', {
            initialValue:{key:this.props.editRecord.meter_model_id,label:this.props.editRecord.meter_model_name},
          })(
            <Select labelInValue={true} >
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
              新水表是否阀控
            </span>
          )}>
          {getFieldDecorator('is_valve', {
            initialValue:{key: this.props.editRecord.is_valve,label: this.props.editRecord.is_valve_explain},
          })(
            <Select labelInValue={true} >
              { [{key:1,label:'是'},{key:-1,label:'否'}].map((item, key) => {
                return (
                  <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              备注
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
