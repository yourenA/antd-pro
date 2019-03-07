/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,Row,Input,Button,Switch} from 'antd';
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
        query: fieldsValue.query,
      };
      this.props.handleSearch({...values,page:1,per_page:this.props.per_page})
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
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
            <FormItem  label={formatMessage({id: 'intl.username'})}>
              {getFieldDecorator('query')(
                <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
              )}
            </FormItem>
            <FormItem   >
              <Button type="primary" htmlType="submit">{formatMessage({id: 'intl.search'})}</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{formatMessage({id: 'intl.reset'})}</Button>
              {this.props.showAddBtn&& <Button type="primary"  style={{marginLeft: 8}} onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>}
            </FormItem>
          <FormItem   label={formatMessage({id: 'intl.open_operating_bar'})}   style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateuser')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateuser',checked);
              this.props.changeShowOperate()
            }} />
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
