/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select,Layout,Card,Button,Input,message } from 'antd';
import {connect} from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const { Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator,} = this.props.form;
    return (
        <Layout className="layout">
          <Content style={{background:'#fff'}}>
            <div className="content">
              <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '邮箱通知设置'}]}>
                <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                  <Form style={{maxWidth:'500px' ,margin:'0 auto'}} onSubmit={this.handleSubmit}>
                    <FormItem
                      label="SMTP 服务主机"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="端口"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password2', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="SSL 认证"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password3', {
                      })(
                        <Select labelInValue={true}>
                          { [{id:1,name:'是'},{id:112,name:'否'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      label="账号名称"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password4', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="密码"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password5', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      wrapperCol={ {
                        offset: 7,
                      }}>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button style={{marginLeft: 8}}  type="primary"  onClick={()=>message.info('暂未开通该功能')}>确定</Button>
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
