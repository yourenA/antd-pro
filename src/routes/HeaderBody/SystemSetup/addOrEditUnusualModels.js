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
            this.props.editModelRecord?null:
              <FormItem
                {...formItemLayoutWithLabel2}
                label={(
                  <span>
              水表类型
            </span>
                )}>
                {getFieldDecorator('meter_model_id', {
                  initialValue: {key:'',label:''},
                  rules: [{required: true, message: '水表类型不能为空'}],
                })(
                  <Select labelInValue={true} >
                    { this.props.meter_models.data.map((item, key) => {
                      return (
                        <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      )
                    }) }
                  </Select>
                )}
              </FormItem>
          }


          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
              水表类型异常判断值
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue:  this.props.editModelRecord ? this.props.editModelRecord.value :0,
              rules: [{required: true, message: '判断值不能为空'}],
            })(
              <InputNumber  min={0}/>
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
