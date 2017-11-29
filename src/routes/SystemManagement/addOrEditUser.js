/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select} from 'antd';
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
              姓名
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '姓名不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label="性别"
        >
          {getFieldDecorator('radio-group',{
            initialValue: this.props.editRecord ? this.props.editRecord.name : 'man',
            rules: [{required: true, message: '性别必选'}],
          })(
            <RadioGroup>
              <Radio value="man">男</Radio>
              <Radio value="felman">女</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
              label="部门"
              {...formItemLayoutWithLabel}>
              {getFieldDecorator('policy_id', {
                initialValue: this.props.editRecord?{key:this.props.editRecord.policy_id.toString(),label:this.props.editRecord.policy_name}:{key:'',label:''},
                rules: [{required: true, message: '请选择策略'}],
              })(
                <Select labelInValue={true} >
                  { [].map((item, key) => {
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
              电话
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '姓名不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              工号
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '姓名不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              账号
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '姓名不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
