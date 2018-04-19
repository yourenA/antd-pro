/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, Layout, Card, Button, Input, message, TimePicker, Switch} from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
import moment from 'moment'
const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      disabled: false,
      data: [],
      zero_abnormality_is_open: {},
      zero_abnormality_days: {}
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=zero_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        zero_abnormality_is_open: find(response.data.data, function (o) {
          return o.name === 'zero_abnormality_is_open'
        }),
        zero_abnormality_days: find(response.data.data, function (o) {
          return o.name === 'zero_abnormality_days'
        }),
      },function () {
        const {form} = that.props;
        that.setState({
          disabled: that.state.zero_abnormality_is_open.value==='1'?false:true,
        })
        form.setFieldsValue({
          zero_abnormality_is_open: that.state.zero_abnormality_is_open.value==='1'?true:false,
          zero_abnormality_days: that.state.zero_abnormality_days.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      zero_abnormality_is_open: that.state.zero_abnormality_is_open.value==='1'?true:false,
      zero_abnormality_days: that.state.zero_abnormality_days.value,
    });
  }
  changeOpen = (value)=> {
    console.log('open', value)
    request(`/configs`, {
      method: 'PATCH',
      data: {
        zero_abnormality_is_open:value?'1':'-1'
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        if(value){
          message.success('开启零流量异常流量报警成功')
        }else{
          message.success('关闭零流量异常流量报警成功')
        }
        this.setState({
          disabled:!value
        })
      }
    })
  }
  handleSubmit=()=>{
    this.props.form.validateFields({ force: true },
      (err, values) => {
        console.log('values',values)
        if (!err) {
          request(`/configs`, {
            method: 'PATCH',
            data: {
              zero_abnormality_days:values.zero_abnormality_days
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success('修改零流量异常流量报警成功')
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
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '零水量异常报警设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '500px', margin: '0 auto'}} onSubmit={this.handleSubmit}>

                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.zero_abnormality_is_open.display_name}

                  >
                    {getFieldDecorator('zero_abnormality_is_open', {valuePropName: 'checked'})(
                      <Switch onChange={this.changeOpen}/>
                    )}
                  </FormItem>

                  <FormItem
                    label={this.state.zero_abnormality_days.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('zero_abnormality_days', {})(
                      <Input  disabled={this.state.disabled}/>
                    )}
                  </FormItem>
                  <FormItem
                    wrapperCol={ {
                      offset: 10,
                    }}>
                    <Button onClick={this.handleFormReset}  disabled={this.state.disabled}>重置</Button>
                    <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSubmit}  disabled={this.state.disabled}>确定</Button>
                  </FormItem>
                </Form>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>

    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
