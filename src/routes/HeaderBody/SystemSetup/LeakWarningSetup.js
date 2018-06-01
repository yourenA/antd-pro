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
      leak_abnormality_is_open: {},
      leak_abnormality_value: {},
      leak_abnormality_hours: {}
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=leak_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        leak_abnormality_is_open: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_is_open'
        }),
        leak_abnormality_value: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_value'
        }),
        leak_abnormality_hours: find(response.data.data, function (o) {
          return o.name === 'leak_abnormality_hours'
        }),
      },function () {
        const {form} = that.props;
        that.setState({
          disabled: that.state.leak_abnormality_is_open.value==='1'?false:true,
        })
        form.setFieldsValue({
          leak_abnormality_is_open: that.state.leak_abnormality_is_open.value==='1'?true:false,
          leak_abnormality_hours: that.state.leak_abnormality_hours.value,
          leak_abnormality_value: that.state.leak_abnormality_value.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      leak_abnormality_is_open: that.state.leak_abnormality_is_open.value==='1'?true:false,
      leak_abnormality_hours: that.state.leak_abnormality_hours.value,
      leak_abnormality_value: that.state.leak_abnormality_value.value,
    });
  }
  changeOpen = (value)=> {
    console.log('open', value)
    request(`/configs`, {
      method: 'PATCH',
      data: {
        leak_abnormality_is_open:value?'1':'-1'
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        if(value){
          message.success('开启漏水异常报警成功')
        }else{
          message.success('关闭漏水异常报警成功')
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
              leak_abnormality_hours:values.leak_abnormality_hours,
              leak_abnormality_value:values.leak_abnormality_value
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success('修改漏水异常报警成功')
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
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '漏水异常报警设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '500px', margin: '0 auto'}} onSubmit={this.handleSubmit}>

                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.leak_abnormality_is_open.display_name}

                  >
                    {getFieldDecorator('leak_abnormality_is_open', {valuePropName: 'checked'})(
                      <Switch onChange={this.changeOpen}/>
                    )}
                  </FormItem>

                  <FormItem
                    label={this.state.leak_abnormality_value.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('leak_abnormality_value', {})(
                      <Input  disabled={this.state.disabled}/>
                    )}
                  </FormItem>
                  <FormItem
                    label={this.state.leak_abnormality_hours.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('leak_abnormality_hours', {})(
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
