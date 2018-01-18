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
              地址名称
            </span>
          )}
        >
          {getFieldDecorator('code', {
            initialValue: this.props.editRecord ? this.props.editRecord.code : '',
            rules: [{required: true, message: '编号不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        {!this.props.editRecord?
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              上级名称
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
          </FormItem>:
        null}

      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
