/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber,DatePicker,TimePicker  } from 'antd';
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
    this.format = 'HH:mm';
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
    var arr = new Array(60);
    for(let i = 0;i < arr.length;i++){
      arr[i]=i;
    }
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
            label="开始时间">
            {getFieldDecorator('started_at', {
              initialValue:  this.props.editModelRecord ? moment(this.props.editModelRecord.started_at,'HH:mm') :moment('00:00:00', 'HH:mm'),
            })(
              <TimePicker format={this.format}  disabledMinutes={()=>{return arr;}}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel2}
            label="结束时间">
            {getFieldDecorator('ended_at', {
              initialValue:  this.props.editModelRecord ?  moment(this.props.editModelRecord.ended_at,'HH:mm') :moment('00:00:00','HH:mm'),

            })(
              <TimePicker format={this.format} disabledMinutes={()=>{return arr;}}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
              {formatMessage({id: 'intl.judgment_value'})}
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue:  this.props.editModelRecord ? this.props.editModelRecord.value :1,
              rules: [{required: true, message: formatMessage({id: 'intl.judgment_value'})+ formatMessage({id: 'intl.can_not_be_empty'})}],

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
