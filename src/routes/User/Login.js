import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert ,Select,message} from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const Option = Select.Option;
@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account',
    companiesList:[]
  }

  componentDidMount() {
    const that=this;
   /* request(`/available_companies`,{
      method:'GET',
      params:{
        return:'all'
      }
    }).then((response)=>{
      console.log('response',response)
      that.setState({
        companiesList:response.data.data
      })
    })*/
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSwitch = (key) => {

    this.setState({
      type: key,
    });
  }

  onGetCaptcha = () => {
    message.info('该功能暂未开通！')
    return false
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  handleSubmit = (e) => {
    console.log('submit')
    e.preventDefault();
    const { type } = this.state;
    this.props.form.validateFields({ force: true },
      (err, values) => {
        console.log('values')
        if (!err) {
          console.log('type',type)
          this.props.dispatch({
            type: `login/${type}Submit`,
            payload: {
              ...values,
              // company_id:values.company_id.key,
            },
          });
        }
      }
    );
  }
  handleChange=(value)=>{
    localStorage.setItem('organization',JSON.stringify(value))
  }
  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
     {/*     <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="账户密码登录" key="account">
              {
                login.status === 'error' &&
                login.type === 'account' &&
                login.submitting === false &&
                this.renderMessage('账户或密码错误')
              }
              /!*<FormItem
              >
                {getFieldDecorator('company_id', {
                  onChange: this.handleChange,
                  initialValue: localStorage.getItem('organization')?{key:JSON.parse(localStorage.getItem('organization')).key,label:JSON.parse(localStorage.getItem('organization')).label}:{key:'0',label:'系统'},
                  rules: [
                    {required: true, message: '请选择机构'},
                  ],
                })(
                  <Select labelInValue={true}  size="large">
                    { this.state.companiesList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                  </Select>
                )}
              </FormItem>*!/

            </TabPane>
            <TabPane tab="手机号登录" key="mobile">
              {
                login.status === 'error' &&
                login.type === 'mobile' &&
                login.submitting === false &&
                this.renderMessage('验证码错误')
              }
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: type === 'mobile', message: '请输入手机号！',
                  }, {
                    pattern: /^1\d{10}$/, message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                    placeholder="手机号"
                  />
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('captcha', {
                      rules: [{
                        required: type === 'mobile', message: '请输入验证码！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className={styles.prefixIcon} />}
                        placeholder="验证码"
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </TabPane>
          </Tabs>*/}
      {/*    <FormItem>
            {getFieldDecorator('company_name', {
              initialValue:company_name,
              rules: [{
                required: type === 'account', message: '请输入机构名称！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="home" className={styles.prefixIcon}
                             />}
                placeholder="机构名称"
              />
            )}
          </FormItem>*/}
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{
                required: type === 'account', message: '请输入用户名！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: type === 'account', message: '请输入密码！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder="密码"
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
           {/* {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}>自动登录</Checkbox>
            )}
            <a className={styles.forgot} href="">忘记密码</a>*/}
            <Button size="large"  className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
        <div className={styles.other}>
          {/*其他登录方式*/}
          {/* 需要加到 Icon 中 */}
         {/* <span className={styles.iconAlipay} />
          <span className={styles.iconTaobao} />
          <span className={styles.iconWeibo} />*/}
          {/*<Link className={styles.register} to="/user/register">注册账户</Link>*/}
        </div>
      </div>
    );
  }
}
