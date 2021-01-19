/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber,Slider   } from 'antd';
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
            label={(
              <span>
             DA0输出
            </span>
            )}
          >
            {getFieldDecorator('da0', {
              initialValue: this.props.editRecord ? this.props.da0 : 4,
              rules: [{required: true, message:'数据上传间隔必填' }],
            })(
              <Slider
                tooltipVisible={true}
                tipFormatter={(value)=>`${value}%`}
                marks={{
                  0: '0',
                  20: '20',
                  40: '40',
                  60: '60',
                  80: '80',
                  100: '100',
                }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             DA1输出
            </span>
            )}
          >
            {getFieldDecorator('da1', {
              initialValue: this.props.editRecord ? this.props.da1 : '20',
              rules: [{required: true, message:'da1必填' }],
            })(
              <Slider
                tooltipVisible={true}
                tipFormatter={(value)=>`${value}%`}
                marks={{
                  0: '0',
                  20: '20',
                  40: '40',
                  60: '60',
                  80: '80',
                  100: '100',
                }}
              />
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
