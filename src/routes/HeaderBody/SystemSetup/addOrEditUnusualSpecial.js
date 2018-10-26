/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, DatePicker, Switch} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const that = this;
  }


  render() {
    const formItemLayoutWithLabel2 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 8},
      }
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form >
          {
            this.props.editSpecialRecord ? null :
              <FormItem
                {...formItemLayoutWithLabel2}
                label={(
                  <span>
              水表号
            </span>
                )}>
                {getFieldDecorator('meter_number', {
                  initialValue: this.props.editSpecialRecord ? this.props.editSpecialRecord.meter_number : "",
                  rules: [{required: true, message: '水表号不能为空'}],
                })(
                  <Input disabled={this.props.editSpecialRecord ? true:false}   />
                )}
              </FormItem>
          }


          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
              水表异常判断值
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue: this.props.editSpecialRecord ? this.props.editSpecialRecord.value : 0,
              rules: [{required: true, message: '判断值不能为空'}],
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
