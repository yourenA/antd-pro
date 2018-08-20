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
      data: [],
      night_abnormality_is_open: {},
      night_abnormality_started_at: {},
      night_abnormality_ended_at: {},
      night_abnormality_value: {}
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=night_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        night_abnormality_is_open: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_is_open'
        }),
        night_abnormality_started_at: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_started_at'
        }),
        night_abnormality_ended_at: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_ended_at'
        }),
        night_abnormality_value: find(response.data.data, function (o) {
          return o.name === 'night_abnormality_value'
        }),
      },function () {
        const {form} = that.props;
        // that.setState({
        //   disabled: that.state.night_abnormality_is_open.value==='1'?false:true,
        // })
        form.setFieldsValue({
          night_abnormality_is_open: that.state.night_abnormality_is_open.value==='1'?true:false,
          night_abnormality_started_at: moment(that.state.night_abnormality_started_at.value, that.format),
          night_abnormality_ended_at: moment(that.state.night_abnormality_ended_at.value, that.format),
          night_abnormality_value: that.state.night_abnormality_value.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      night_abnormality_is_open: that.state.night_abnormality_is_open.value==='1'?true:false,
      night_abnormality_started_at: moment(that.state.night_abnormality_started_at.value, that.format),
      night_abnormality_ended_at: moment(that.state.night_abnormality_ended_at.value, that.format),
      night_abnormality_value: that.state.night_abnormality_value.value,
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
              night_abnormality_is_open:values.night_abnormality_is_open?'1':'-1',
              night_abnormality_started_at:moment( values.night_abnormality_started_at).format(this.format),
              night_abnormality_ended_at:moment( values.night_abnormality_ended_at).format(this.format),
              night_abnormality_value:values.night_abnormality_value

            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success('修改夜间异常流量报警成功')
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
    var arr = new Array(60);
    for(let i = 0;i < arr.length;i++){
      arr[i]=i;
    }
    const {getFieldDecorator,} = this.props.form;
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '夜间流量异常报警设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '500px', margin: '0 auto'}} onSubmit={this.handleSubmit}>

                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.night_abnormality_is_open.display_name}

                  >
                    {getFieldDecorator('night_abnormality_is_open', {valuePropName: 'checked'})(
                      <Switch />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.night_abnormality_started_at.display_name}>
                    {getFieldDecorator('night_abnormality_started_at', {})(
                      <TimePicker format={this.format}  disabledMinutes={()=>{return arr;}}/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.night_abnormality_ended_at.display_name}>
                    {getFieldDecorator('night_abnormality_ended_at', {})(
                      <TimePicker format={this.format} disabledMinutes={()=>{return arr;}}/>
                    )}
                  </FormItem>

                  <FormItem
                    label={this.state.night_abnormality_value.display_name}
                    {...formItemLayoutWithLabel}
                  >
                    {getFieldDecorator('night_abnormality_value', {})(
                      <Input  />
                    )}
                  </FormItem>
                  <FormItem
                    wrapperCol={ {
                      offset: 10,
                    }}>
                    <Button onClick={this.handleFormReset} >重置</Button>
                    <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSubmit} >确定</Button>
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
