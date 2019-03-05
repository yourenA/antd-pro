import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, DatePicker, Row, Col, Alert ,Select,message} from 'antd';
import styles from './Login.less';
import {injectIntl,FormattedMessage} from 'react-intl';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const Option = Select.Option;
@connect(state => ({
  login: state.login,
}))
@Form.create()
@injectIntl
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account',
    companiesList:[]
  }

  componentDidMount() {
    const that=this;
    const { location } = this.props;
    console.log(this.props.location.pathname.split('/'))
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
    const company_code=this.props.location.pathname.split('/')
    console.log('company_code',company_code)
    console.log(this.props.location.pathname)
    this.props.form.validateFields({ force: true },
      (err, values) => {
        console.log('values')
        if (!err) {
          console.log('type',type)
          const {login:{preUrl}}=this.props
          this.props.dispatch({
            type: `login/${type}Submit`,
            payload: {
              ...values,
              preUrl,
              company_code:company_code.length===2?'hy':company_code[company_code.length-1]==='null'?'hy':company_code[company_code.length-1]
              // company_id:values.company_id.key,
            },
            callback:()=>{

            }
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
    const { form, login,intl:{formatMessage} } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{
                required: type === 'account', message:formatMessage({id: 'intl.please_input'})+formatMessage({id: 'intl.username'}),
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder={formatMessage({id: 'intl.username'})}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: type === 'account', message:formatMessage({id: 'intl.please_input'})+formatMessage({id: 'intl.password'}),
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={styles.prefixIcon} />}
                type="password"
                placeholder={formatMessage({id: 'intl.password'})}
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
            <Button size="large"  className={styles.submit} type="primary" htmlType="submit">
              <FormattedMessage id="intl.sign_in"/>
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
