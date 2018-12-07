/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,Col,Input,Button,Switch} from 'antd';
import moment from 'moment'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
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
      const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        size_type: fieldsValue.size_type===true?'2':'',
        /*started_at: rangeTimeValue ? moment(rangeTimeValue[0]).format('YYYY-MM-DD') : '',
        ended_at: rangeTimeValue ? moment(rangeTimeValue[1]).format('YYYY-MM-DD') : '',*/
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
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');

    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row>
            {/*<FormItem label="集中器编号">
              {getFieldDecorator('query')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>*/}
          {
            company_code==='mys'&&
            <FormItem label="只显示大表集中器">
              {getFieldDecorator('size_type',{
                valuePropName: 'checked',
                initialValue:false,
              })(
                <Switch  />
              )}
            </FormItem>
          }
          <FormItem>
            {company_code==='mys'&&<Button type="primary" htmlType="submit">查询</Button>}
            {company_code==='mys'&&<Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>}
            {(this.props.showAddBtn)?<Button  type="primary"   onClick={this.props.clickAdd} icon='plus'>添加</Button>:null}
          </FormItem>
          <FormItem  label="打开操作栏" style={{float:'right'}} className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateConcentrator')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateConcentrator',checked);
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
