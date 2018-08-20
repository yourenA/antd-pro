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
      concentrator_offline_abnormality_is_open: {},
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
        concentrator_offline_abnormality_is_open: find(response.data.data, function (o) {
          return o.name === 'concentrator_offline_abnormality_is_open'
        }),
      },function () {
        const {form} = that.props;
        that.setState({
          disabled: that.state.concentrator_offline_abnormality_is_open.value==='1'?false:true,
        })
        form.setFieldsValue({
          concentrator_offline_abnormality_is_open: that.state.concentrator_offline_abnormality_is_open.value==='1'?true:false,
        });
      })

    })
  }

  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    // form.resetFields();
    form.setFieldsValue({
      concentrator_offline_abnormality_is_open: that.state.concentrator_offline_abnormality_is_open.value==='1'?true:false,
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
              concentrator_offline_abnormality_is_open:values.concentrator_offline_abnormality_is_open?'1':'-1',
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
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '集中器离线异常报警设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Form style={{maxWidth: '500px', margin: '0 auto'}} >

                  <FormItem
                    {...formItemLayoutWithLabel}
                    label={this.state.concentrator_offline_abnormality_is_open.display_name}

                  >
                    {getFieldDecorator('concentrator_offline_abnormality_is_open', {valuePropName: 'checked'})(
                      <Switch />
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
