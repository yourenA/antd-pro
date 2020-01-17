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
              手机号
            </span>
                )}>
                {getFieldDecorator('meter_model_ids', {
                  rules: [{required: true, message: '手机号'+ formatMessage({id: 'intl.can_not_be_empty'})}],
                })(
                  <Input/>
                )}
              </FormItem>
          }


          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
              {formatMessage({id: 'intl.remark'})}
                  </span>
            )}
          >
            {getFieldDecorator('remark', {
              initialValue:  this.props.editModelRecord ? this.props.editModelRecord.value :'1',

            })(
              <Input/>
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
