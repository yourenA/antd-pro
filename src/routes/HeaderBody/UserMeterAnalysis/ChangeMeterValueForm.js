/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  InputNumber, TreeSelect,DatePicker } from 'antd';
import {connect} from 'dva';
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
import moment from 'moment'
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
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
        <FormItem label={formatMessage({id: 'intl.water_meter_number'})}  {...formItemLayoutWithLabel}>
          {getFieldDecorator('meter_number',{
            initialValue: this.props.meter_number
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label={formatMessage({id: 'intl.start'})}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('started_at', {
            initialValue: moment(),

          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem label={formatMessage({id: 'intl.end'})}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('ended_at', {
            initialValue: moment(),
          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem label={formatMessage({id: 'intl.meter_reading'})}   {...formItemLayoutWithLabel}>
          {getFieldDecorator('value')(
            <InputNumber placeholder={formatMessage({id: 'intl.please_input'})}/>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
