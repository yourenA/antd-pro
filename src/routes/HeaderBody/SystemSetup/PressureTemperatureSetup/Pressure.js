/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, InputNumber, Card, Button, Input, message, TimePicker, Switch} from "antd";
import {connect} from "dva";
import request from "./../../../../utils/request";
import find from "lodash/find";
const FormItem = Form.Item;
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      disabled: false,
      data: [],
      minimum_pressure_value: {},
      maximum_pressure_value: {},
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=pressure_sensor_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        minimum_pressure_value: find(response.data.data, function (o) {
          return o.name === 'minimum_pressure_value'
        }),
        maximum_pressure_value: find(response.data.data, function (o) {
          return o.name === 'maximum_pressure_value'
        }),
      },function () {
        const {form} = that.props;
        form.setFieldsValue({
          minimum_pressure_value: that.state.minimum_pressure_value.value,
          maximum_pressure_value: that.state.maximum_pressure_value.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      minimum_pressure_value: that.state.minimum_pressure_value.value,
      maximum_pressure_value: that.state.maximum_pressure_value.value,
    });
  }
  handleSubmit=()=>{
    this.props.form.validateFields({ force: true },
      (err, values) => {
        console.log('values',values)
        if (!err) {
          request(`/configs`, {
            method: 'PATCH',
            data: {
              minimum_pressure_value:values.minimum_pressure_value,
              maximum_pressure_value:values.maximum_pressure_value
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success('修改压力传感器设置成功')
            }
          })
        }
      }
    );
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      }
    };

    const {getFieldDecorator,} = this.props.form;
    return (
      <Form style={{maxWidth: '500px', margin: '0 auto'}} >

        <FormItem
          label={this.state.minimum_pressure_value.display_name}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('minimum_pressure_value', {})(
            <InputNumber />
          )}
        </FormItem>
        <FormItem
          label={this.state.maximum_pressure_value.display_name}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('maximum_pressure_value', {})(
            <InputNumber />
          )}
        </FormItem>
        <FormItem
          wrapperCol={ {
            offset: 8,
          }}>
          <Button onClick={this.handleFormReset} >重置</Button>
          <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSubmit} >确定</Button>
        </FormItem>
      </Form>
    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
