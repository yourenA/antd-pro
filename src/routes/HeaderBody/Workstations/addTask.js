/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,TimePicker  } from 'antd';
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
    const {intl:{formatMessage}} = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="model-form">
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'选择通道'}
          >
            {getFieldDecorator('channel',{
              initialValue: '0',
            })(
              <RadioGroup>
                <Radio value="0">通道1</Radio>
                <Radio value="1">通道2</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'选择任务'}
          >
            {getFieldDecorator('task',{
              initialValue: 'open_valve_tasks',
            })(
              <RadioGroup>
                <Radio value="open_valve_tasks">定时开阀</Radio>
                <Radio value="close_valve_tasks">定时关阀</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label= {'时间'}
          >
            {getFieldDecorator('time',{
              initialValue: moment('00:00', 'HH:mm'),
            })(
              <TimePicker  format={ 'HH:mm'}   minuteStep={15}/>
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
