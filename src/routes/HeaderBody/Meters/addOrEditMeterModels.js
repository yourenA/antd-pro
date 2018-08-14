/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber,DatePicker,Switch } from 'antd';
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
              水表号
            </span>
          )}
        >
          {getFieldDecorator('number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message: '水表号不能为空'}],
          })(
            <Input disabled={this.props.editRecord ? true : false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              水表类型
            </span>
          )}>
          {getFieldDecorator('meter_model_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.meter_model_id,label:this.props.editRecord.meter_model_name}:{key:'',label:''},
            rules: [{required: true, message: '水表类型不能为空'}],
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
              生产日期
            </span>
          )}>
          {getFieldDecorator('manufactured_at', {
            initialValue: (this.props.editRecord&&this.props.editRecord.manufactured_at)?moment(this.props.editRecord.manufactured_at):null,
          })(
            <DatePicker allowClear={false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              安装日期
            </span>
          )}>
          {getFieldDecorator('installed_at', {
            initialValue: (this.props.editRecord&&this.props.editRecord.installed_at)?moment(this.props.editRecord.installed_at):null,
          })(
            <DatePicker allowClear={false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              初始水量
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
          {...formItemLayoutWithLabel}
          label={(
            <span>
              是否阀控
            </span>
          )}>
          {getFieldDecorator('is_valve', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.is_valve.toString(),label:this.props.editRecord.is_valve_explain}:{key:'',label:''},
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
          label="阀门状态"
        >
          {getFieldDecorator('valve_status',
            { initialValue: this.props.editRecord ? (this.props.editRecord.valve_status===1?true:false) : false
              ,valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              电池寿命
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
          {...formItemLayoutWithLabel}
          label={(
            <span>
              条码
            </span>
          )}
        >
          {getFieldDecorator('barcode', {
            initialValue: this.props.editRecord ? this.props.editRecord.barcode : '',
          })(
            <Input />
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
            initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
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
