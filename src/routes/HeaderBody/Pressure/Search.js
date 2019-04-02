/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button, Switch} from 'antd';
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" style={{overflow: 'hidden'}}>
        <Row >
          <FormItem label={formatMessage({id: 'intl.display_type'})}>
            {getFieldDecorator('number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.install_address'})}>
            {getFieldDecorator('address')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit">{formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{formatMessage({id: 'intl.reset'})}</Button>
            {(this.props.showAddBtn)?<Button  type="primary"   onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>:null}

          </FormItem>
          <FormItem label={formatMessage({id: 'intl.open_operating_bar'})} style={{float: 'right'}}>
            <Switch defaultChecked={localStorage.getItem('canOperatePressure') === 'true' ? true : false}
                    onChange={(checked)=> {
                      localStorage.setItem('canOperatePressure', checked);
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
