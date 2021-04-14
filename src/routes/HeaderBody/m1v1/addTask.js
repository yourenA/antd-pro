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
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    console.log('this.props.da0',this.props.da0)
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="model-form">
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             阀门状态
            </span>
            )}
          >
            {getFieldDecorator('da0', {
              initialValue: this.props.editRecord ? this.props.da0<12?4:20 : 4,
              rules: [{required: true, message:'阀门状态必填' }],
            })(
              <Select
                style={{width:'100%'}}
              >
                {[{id:4,name:'关'},{id:20,name:'开'}].map((item, index2) => {
                  return <Option key={index2} value={item.id}>{item.name}</Option>;
                })}
              </Select>,
            )}
          </FormItem>
        </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
