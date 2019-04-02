/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Cascader,DatePicker,TreeSelect } from 'antd';
import {connect} from 'dva';
import request from "./../../../utils/request";

const Option= Select.Option
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData:[]
    };
  }
  componentDidMount() {
    const that = this;
    request(`/${this.props.type==='valve'?'liquid_sensors':'valve_sensors'}`, {
      method: 'GET',
      query: {
        return:'all'
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        selectData:response.data.data
      })

    })
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
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const renderSelect=this.state.selectData.map((item,index)=>{
      return   <Option value={item.number} key={index}>{item.number}</Option>
    })
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        {
          this.props.type==='valve'?
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              {formatMessage({id: 'intl.valve_sensors_number'})}
            </span>
            )}
          >
            {getFieldDecorator('valve_sensor_number', {
              initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            })(
              <Input disabled/>
            )}
          </FormItem>:
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              {formatMessage({id: 'intl.liquid_sensors_number'})}
            </span>
              )}
            >
              {getFieldDecorator('liquid_sensor_number', {
                initialValue: this.props.editRecord ? this.props.editRecord.number : '',
              })(
                <Input disabled/>
              )}
            </FormItem>

        }

        {
          this.props.type==='valve'?
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              {formatMessage({id: 'intl.liquid_sensors_number'})}
            </span>
              )}
            >
              {getFieldDecorator('liquid_sensor_number', {
                initialValue: this.props.editRecord ? this.props.editRecord.liquid_sersor_number : '',
              })(
                <Select allowClear>
                  {renderSelect}
                </Select>
              )}
            </FormItem>:
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              {formatMessage({id: 'intl.valve_sensors_number'})}
            </span>
              )}
            >
              {getFieldDecorator('valve_sensor_number', {
                initialValue: this.props.editRecord ? this.props.editRecord.valve_sersor_number : '',
              })(
                <Select allowClear>
                  {renderSelect}
                </Select>
              )}
            </FormItem>

        }
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
