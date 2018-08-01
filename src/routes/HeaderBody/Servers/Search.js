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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={16}>

          <FormItem label="显示">
            {getFieldDecorator('display_type',{
              initialValue:  'all',
            })(
              <RadioGroup>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="only_enabled">启用</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {(this.props.showAddBtn)?<Button  style={{marginLeft: 8}}   type="primary"   onClick={this.props.clickAdd} icon='plus'>添加</Button>:null}
          </FormItem>
          <FormItem  label="打开操作栏" style={{float:'right'}}>
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
