/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, TreeSelect, Switch} from 'antd';
import {connect} from 'dva';
import find from 'lodash/find'
const FormItem = Form.Item;

import request from '../../../utils/request';
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  sider_regions: state.sider_regions,
}))
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
    const {sider_regions:{data}}=this.props;
    const {intl:{formatMessage}} = this.props;
    const formItemLayoutWithLabel2 = {
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
    let initValue=0
    const that=this
    if(this.state.consumption_abnormality_special_meters.value){
      const exit=find(this.state.consumption_abnormality_special_meters.value,function (o) {
        return o.number===that.props.meter_number
      })
      if(exit){
        initValue=exit.value
      }
    }
    return (
      <div>
        <Form >
          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
                 {formatMessage({id: 'intl.judgment_value'})}
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue: initValue,
              rules: [{required: true, message: formatMessage({id: 'intl.judgment_value'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
