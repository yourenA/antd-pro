/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button, Icon} from 'antd';
import moment from 'moment'
import find from 'lodash/find'
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile?false:true,
    };
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
      console.log(fieldsValue)
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
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
    const hot_difference_value=this.props.meta.aggregator?find(this.props.meta.aggregator.temperature_type_difference_values,function (o) {
      return o.name==='热水表'
    }).difference_value:0;
    const cold_difference_value=this.props.meta.aggregator?find(this.props.meta.aggregator.temperature_type_difference_values,function (o) {
      return o.name==='冷水表'
    }).difference_value:0;
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
          <FormItem label="水表编号"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('meter_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="户号"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('member_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="用户名称"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('real_name')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="安装地址"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('install_address')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          {/* <FormItem label="创建时间">
           {getFieldDecorator('range-time-picker', {
           initialValue: this.props.initRange ? this.props.initRange : '',
           })(
           <RangePicker allowClear={this.props.initRange ? false : true}/>
           )}
           </FormItem>*/}
          <FormItem >
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? '收起' : '展开'}条件 <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {/* {this.props.showAddBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
          </FormItem>
          <FormItem label="冷水表用水量">
            <Input value={cold_difference_value} style={{width:'173px'}} readOnly addonAfter="吨" />
          </FormItem>
          <FormItem label="热水表用水量">
            <Input value={hot_difference_value} style={{width:'173px'}} readOnly addonAfter="吨" />
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
