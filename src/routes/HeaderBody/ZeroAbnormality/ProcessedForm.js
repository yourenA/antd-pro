/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, InputNumber  } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }
  componentDidMount() {
  }
  render() {
    const {intl:{formatMessage}} = this.props;
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
        {
          this.props.meter_number&&
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.water_meter_number'})}
            </span>
            )}
          >
            {getFieldDecorator('meter_number', {
              initialValue: this.props.meter_number,
            })(
              <Input disabled/>
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.not_reminder_days'})}
            </span>
          )}
        >
          {getFieldDecorator('not_reminder_days', {
            initialValue:this.props.not_reminder_days?this.props.not_reminder_days:"1",
          })(
            <InputNumber/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.remark'})}
            </span>
          )}
        >
          {getFieldDecorator('remark', {
            initialValue:'',
          })(
            <TextArea rows={3} />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default AddPoliciesFormWrap;
