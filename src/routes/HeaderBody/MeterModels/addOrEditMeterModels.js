/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber } from 'antd';
import {connect} from 'dva';
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
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
              名称
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '名称不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label="输出类型"
        >
          {getFieldDecorator('output_type',{
            initialValue: this.props.editRecord ? this.props.editRecord.output_type.toString() : '1',
            rules: [{required: true, message: '输出类型不能为空'}],
          })(
            <RadioGroup>
              <Radio value="1">有线</Radio>
              <Radio value="2">无线</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
              生产厂家
            </span>
          )}>
          {getFieldDecorator('manufacturer_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.manufacturer_id,label:this.props.editRecord.manufacturer_name}:{key:'',label:''},
            rules: [{required: true, message: '生产厂家不能为空'}],
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
          label="温度介质类型"
        >
          {getFieldDecorator('temperature_type',{
            initialValue: this.props.editRecord ? this.props.editRecord.temperature_type.toString() : '1',
            rules: [{required: true, message: '温度介质类型不能为空'}],

          })(
            <RadioGroup>
              <Radio value="1">冷水表</Radio>
              <Radio value="2">热水表</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
              是否阀控
            </span>
          )}>
          {getFieldDecorator('is_control', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.is_control.toString(),label:this.props.editRecord.is_control_explain}:{key:'',label:''},
            rules: [{required: true, message: '是否阀控不能为空'}],
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
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
              口径
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
              使用年限
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
              波特率
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
              下行协议
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
              单位
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
