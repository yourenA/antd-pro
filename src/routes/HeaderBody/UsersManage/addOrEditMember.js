/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Switch } from 'antd';
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
        sm: {span: 7},
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
               {formatMessage({id: 'intl.username'})}
            </span>
          )}
        >
          {getFieldDecorator('username', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.username'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input disabled={ this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.real_name'})}
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
               {formatMessage({id: 'intl.telephone'})}
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
               {formatMessage({id: 'intl.email'})}
            </span>
          )}
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '邮箱地址错误',
            }, {
            }],
            initialValue: this.props.editRecord ? this.props.editRecord.email : '',
          })(
            <Input />
          )}
        </FormItem>
       {/* {
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

        }*/}
        {
          (this.props.editRecord&&this.props.editRecord.lock===2)?null
            :
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
               {formatMessage({id: 'intl.role_name'})}
            </span>
              )}>
              {getFieldDecorator('role_id', {
                initialValue: this.props.editRecord?{key:this.props.editRecord.role_id,label:this.props.editRecord.role_display_name}:{key:'',label:''},
                rules: [{required: true, message:  formatMessage({id: 'intl.role_name'})+formatMessage({id: 'intl.can_not_be_empty'})}],
              })(
                <Select labelInValue={true} >
                  { this.props.usergroup.map((item, key) => {
                    return (
                      <Option key={item.id} disabled={item.status===-1?true:false} value={item.id.toString()}>{item.display_name}</Option>
                    )
                  }) }
                </Select>
              )}
            </FormItem>
        }

        <FormItem
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.is_telephone_notify'})}
        >
          {getFieldDecorator('is_sms_notify', {
            initialValue: this.props.editRecord ? (this.props.editRecord.is_sms_notify===1?true:false) : false,
            valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.is_email_notify'})}
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


