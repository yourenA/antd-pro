/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, TreeSelect, Switch} from 'antd';
import {connect} from 'dva';
import find from 'lodash/find'
const FormItem = Form.Item;

import request from '../../../utils/request';
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meters:[],
      consumption_abnormality_special_meters:{}
    };
  }
  getState=()=>{
    return this.state.consumption_abnormality_special_meters
  }
  componentDidMount() {
    const that=this;
    if (this.props.findChildFunc) {
      this.props.findChildFunc(this.getState);
    }

    request(`/configs?groups[]=consumption_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        consumption_abnormality_special_meters: find(response.data.data, function (o) {
          return o.name === 'consumption_abnormality_special_meters'
        }),
      })

    })
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
    const {getFieldDecorator} = this.props.form;
    let initValue=0
    const that=this
    if(this.state.consumption_abnormality_special_meters.value){
      const exit=find(this.state.consumption_abnormality_special_meters.value,function (o) {
        return o.number===that.props.editRecord.number
      })
      if(exit){
        initValue=exit.value
      }
    }
    return (
      <div>
        <Form >
          <FormItem label={'水表号'}  {...formItemLayoutWithLabel2}>
            {getFieldDecorator('meter_number',{
              initialValue: this.props.editRecord.number
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
                报警值
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue: initValue,
              rules: [{required: true, message:'报警值不能为空'}],
            })(
              <InputNumber min={0} style={{width:'100%'}} addonAfter="m³"/>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
