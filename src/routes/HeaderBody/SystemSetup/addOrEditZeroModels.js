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
import {injectIntl} from 'react-intl';
@injectIntl
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
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };
    const {intl:{formatMessage}} = this.props;
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
              {formatMessage({id: 'intl.water_meter_type'})}
            </span>
                )}>
                {getFieldDecorator('meter_model_ids', {
                  rules: [{required: true, message: formatMessage({id: 'intl.water_meter_type'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
                })(
                  <Select labelInValue={true}   mode="multiple">
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
                异常判断连续天数
                  </span>
            )}
          >
            {getFieldDecorator('days', {
              initialValue:  this.props.editModelRecord ? this.props.editModelRecord.days :2,
              rules: [{required: true, message:'异常判断连续天数'+ formatMessage({id: 'intl.can_not_be_empty'})}],

            })(
              <InputNumber  min={2}/>
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
