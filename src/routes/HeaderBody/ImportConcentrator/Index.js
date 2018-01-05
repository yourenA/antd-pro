/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select,Layout,Card,Button } from 'antd';
import {connect} from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Sider from './Sider'
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
          <Sider/>
          <Content style={{background:'#fff'}}>
            <div className="content">
              <PageHeaderLayout title="运行管理" breadcrumb={[{name: '运行管理'}, {name: '导入集中器'}]}>
                <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                  <Form style={{maxWidth:'500px' ,margin:'0 auto'}} onSubmit={this.handleSubmit}>
                    <FormItem
                      {...formItemLayoutWithLabel}
                      label="服务器"
                    >
                      {getFieldDecorator('old_password', {
                      })(
                        <p>http://120.76.229.53/9004/</p>
                      )}
                    </FormItem>
                    <FormItem
                      label="集中器"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password', {
                      })(
                        <Select labelInValue={true}>
                          { [{id:1,name:'2016'},{id:112,name:'201fafa6'},{id:1123,name:'20faw16'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      label="新服务器"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('new_password_confirmation', {
                      })(
                        <Select labelInValue={true}>
                          { [{id:1,name:'2016'},{id:112,name:'201fafa6'},{id:1123,name:'20faw16'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                      wrapperCol={ {
                        offset: 7,
                      }}>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button style={{marginLeft: 8}}  type="primary" htmlType="submit">确定</Button>
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
