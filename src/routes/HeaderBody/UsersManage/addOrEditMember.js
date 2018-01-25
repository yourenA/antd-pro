/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Switch } from 'antd';
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
              账号
            </span>
          )}
        >
          {getFieldDecorator('username', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
            rules: [{required: true, message: '账号不能为空'}],
          })(
            <Input disabled={ this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              名字
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
          {...formItemLayoutWithLabel}
          label={(
            <span>
              电话
            </span>
          )}
        >
          {getFieldDecorator('mobile', {
            initialValue: this.props.editRecord ? this.props.editRecord.mobile : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              邮箱
            </span>
          )}
        >
          {getFieldDecorator('email', {
            initialValue: this.props.editRecord ? this.props.editRecord.email : '',
          })(
            <Input />
          )}
        </FormItem>
        {
          this.props.editRecord?
          null
          :  <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              密码
            </span>
              )}
            >
              {getFieldDecorator('password', {
                initialValue: '',
              })(
                <Input />
              )}
            </FormItem>

        }
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              权限
            </span>
          )}>
          {getFieldDecorator('role_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.role_id,label:this.props.editRecord.role_display_name}:{key:'',label:''},
            rules: [{required: true, message: '权限不能为空'}],
          })(
            <Select labelInValue={true} >
              { this.props.usergroup.map((item, key) => {
                return (
                  <Option key={item.id} value={item.id.toString()}>{item.display_name}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label="电话通知"
        >
          {getFieldDecorator('is_sms_notify', {
            initialValue: this.props.editRecord ? (this.props.editRecord.is_sms_notify===1?true:false) : false,
            valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label="电邮通知"
        >
          {getFieldDecorator('is_email_notify',
            { initialValue: this.props.editRecord ? (this.props.editRecord.is_email_notify===1?true:false) : false
              ,valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
