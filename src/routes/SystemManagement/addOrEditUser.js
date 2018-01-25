/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(state => ({
  usergroup: state.usergroup,
}))
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
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          label="用户组"
          {...formItemLayoutWithLabel}>
          {getFieldDecorator('role_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.role_id.toString(),label:this.props.editRecord.role_display_name}:{key:'',label:''},
            rules: [{required: true, message: '请选择用户组'}],
          })(
            <Select labelInValue={true} >
              { this.props.usergroup.data.map((item, key) => {
                return (
                  <Option key={item.id} value={item.id.toString()}>{item.display_name}</Option>
                )
              }) }
            </Select>
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
          {getFieldDecorator('job_number', {
            initialValue: this.props.editRecord ? this.props.editRecord.job_number : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              姓名
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
          label="性别"
        >
          {getFieldDecorator('sex',{
            initialValue: this.props.editRecord ? this.props.editRecord.sex : '保密',
          })(
            <RadioGroup>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
              <Radio value="保密">保密</Radio>
            </RadioGroup>
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


      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
