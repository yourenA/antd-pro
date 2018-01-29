/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select,Layout,Card,Button ,Input,message} from 'antd';
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
              <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '短信通知设置'}]}>
                <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                  <Form style={{maxWidth:'500px' ,margin:'0 auto'}} onSubmit={this.handleSubmit}>
                    <FormItem
                      {...formItemLayoutWithLabel}
                      label="短信平台"
                    >
                      {getFieldDecorator('old_password2', {
                      })(
                        <p>容联．云通讯</p>
                      )}
                    </FormItem>
                    <FormItem
                      label="服务主机"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password3', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="端口"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password4', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="SID"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password5', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="TOKEN"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password6', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="APP ID"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password7', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      label="模板 ID"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password8', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                    <FormItem
                      wrapperCol={ {
                        offset: 7,
                      }}>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button style={{marginLeft: 8}}  type="primary" onClick={()=>message.info('暂未开通该功能')}>确定</Button>
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
