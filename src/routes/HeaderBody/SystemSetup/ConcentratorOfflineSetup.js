/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, Layout, Card, Button, Radio, message, TimePicker, Switch} from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
import moment from 'moment'
const {Content} = Layout;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      disabled: false,
      data: [],
      concentrator_offline_abnormality_alarm_level: {},
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=concentrator_offline_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data,
        concentrator_offline_abnormality_alarm_level: find(response.data.data, function (o) {
          return o.name === 'concentrator_offline_abnormality_alarm_level'
        }),
      },function () {
        const {form} = that.props;
        that.setState({
          disabled: that.state.concentrator_offline_abnormality_alarm_level.value,
        })
        form.setFieldsValue({
          concentrator_offline_abnormality_alarm_level: that.state.concentrator_offline_abnormality_alarm_level.value,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      concentrator_offline_abnormality_alarm_level: that.state.concentrator_offline_abnormality_alarm_level.value,
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
              concentrator_offline_abnormality_alarm_level:values.concentrator_offline_abnormality_alarm_level,
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success('修改集中器离线异常报警成功')
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
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '集中器离线异常报警设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '550px', margin: '0 auto'}} >

               {/*   <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.concentrator_offline_abnormality_alarm_level.display_name}

                  >
                    {getFieldDecorator('concentrator_offline_abnormality_alarm_level', {valuePropName: 'checked'})(
                      <Switch />
                    )}
                  </FormItem>*/}
                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.concentrator_offline_abnormality_alarm_level.display_name}
                  >
                    {getFieldDecorator('concentrator_offline_abnormality_alarm_level')(
                      <RadioGroup>
                        <Radio style={radioStyle} value="1">弹框报警及导航栏提示</Radio>
                        <Radio style={radioStyle} value="2">导航栏提示</Radio>
                        <Radio style={radioStyle} value="3">无</Radio>
                      </RadioGroup>
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
