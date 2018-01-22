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
          {...formItemLayoutWithLabel}
          label={(
            <span>
              类别
            </span>
          )}
        >
          {getFieldDecorator('type', {
            initialValue: this.props.editRecord ? this.props.editRecord.type : '',
            rules: [{required: true, message: '类别不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
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
          {...formItemLayoutWithLabel}
          label={(
            <span>
              是否阀控
            </span>
          )}>
          {getFieldDecorator('is_control', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.is_control.toString(),label:this.props.editRecord.is_control_explain}:{key:'',label:''},
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
