/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,message,Input,Button,Switch,Select,Radio} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import {injectIntl} from 'react-intl';
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      const values = {
        display_type:fieldsValue.display_type,
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

          <FormItem label={formatMessage({id: 'intl.display_type'})}>
            {getFieldDecorator('display_type',{
              initialValue:  'all',
            })(
              <RadioGroup>
                <RadioButton value="all">{formatMessage({id: 'intl.all'})}</RadioButton>
                <RadioButton value="only_enabled">{formatMessage({id: 'intl.enable'})}</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">{formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{formatMessage({id: 'intl.reset'})}</Button>
            {(this.props.showAddBtn)?<Button  style={{marginLeft: 8}}   type="primary"   onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>:null}
          </FormItem>
          <FormItem  label={formatMessage({id: 'intl.open_operating_bar'})}  style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateServer')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateServer',checked);
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
