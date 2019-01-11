/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,Row,Input,Button,Switch,DatePicker} from 'antd';
import {disabledDate} from './../../../utils/utils'
import moment from 'moment'
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
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
        month: fieldsValue['month'] ? moment( fieldsValue['month']).format('YYYY-MM') : '',
      };
      console.log('values',values)
      this.props.handleSearch({...values,page:1,per_page:this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
            <FormItem  label={"月份"}>
              {getFieldDecorator('month', {
                initialValue: this.props.month ? moment(this.props.month) : '',
              })(
                <MonthPicker
                  disabledDate={disabledDate}
                />
              )}
            </FormItem>
            <FormItem   >
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </FormItem>
          <FormItem  label="打开操作栏" style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateImage')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateImage',checked);
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
