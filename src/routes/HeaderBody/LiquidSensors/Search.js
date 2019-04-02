/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button, Switch,Icon,Modal,Popconfirm ,message} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
}))
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile?false:true,
      time:new Date().getTime()
    };
  }
  componentDidMount() {
    const that=this;
  }
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.props.handleSearch({...values, page: 1,per_page:this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {expand}=this.state
    const {getFieldDecorator} = this.props.form;
    const that=this;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" style={{overflow: 'hidden'}}>
        <Row >
          <FormItem label={formatMessage({id: 'intl.liquid_sensors_number'})}>
            {getFieldDecorator('number')(
              <Input placeholder=""/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.install_address'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('address')(
              <Input placeholder=""/>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit">{formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{formatMessage({id: 'intl.reset'})}</Button>
            {this.props.showAddBtn &&
            <Button type="primary" style={{marginLeft: 8}} onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.open_operating_bar'})}  style={{float: 'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateliquidSnsors') === 'true' ? true : false}
                    onChange={(checked)=> {
                      localStorage.setItem('canOperateliquidSnsors', checked);
                      this.props.changeShowOperate()
                    }}/>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
