
/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Icon, Input, Button,TreeSelect} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile ? false : true,
    };
  }

  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  }
  componentDidMount() {
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const date = fieldsValue['date'];
      const values = {
        ...fieldsValue,
        started_at:  fieldsValue['started_at'] ? moment( fieldsValue['started_at']).format('YYYY-MM-DD') : '',
        ended_at:  fieldsValue['ended_at']  ? moment( fieldsValue['ended_at']).format('YYYY-MM-DD') : '',
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
    const company_code = sessionStorage.getItem('company_code');
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={16}>
          <FormItem label={this.props.dateText ? this.props.dateText : '开始时间'}>
            {getFieldDecorator('started_at', {
              initialValue: this.props.initRange ? this.props.initRange[0] : '',
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem label={this.props.dateText ? this.props.dateText : '结束时间'}>
            {getFieldDecorator('ended_at', {
              initialValue: this.props.initRange ? this.props.initRange[1] : '',
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem label="户号" style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('member_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="集中器编号" style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('concentrator_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="水表编号"  style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('meter_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem>
            {this.props.isMobile && <Button type="primary" onClick={this.toggle} style={{marginRight: 8}}>
              {this.state.expand ? '收起' : '展开'}条件 <Icon type={this.state.expand ? 'up' : 'down'}/>
            </Button>}
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.props.setWarningRule}>设置报警规则</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
