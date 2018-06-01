/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,message,Input,Button,Switch,Select,TreeSelect} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
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
        ...fieldsValue,
        started_at:  fieldsValue['started_at'] ? moment( fieldsValue['started_at']).format('YYYY-MM-DD') : '',
        ended_at:  fieldsValue['ended_at']  ? moment( fieldsValue['ended_at']).format('YYYY-MM-DD') : '',
      };
      this.props.handleSearch({...values,page:1})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  renderDMATreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children&&item.children.length>0) {
        return (
          <TreeNode value={item.id}  title={item.name} key={item.id}>
            {this.renderDMATreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
    });
  }
  render() {
    const company_code = sessionStorage.getItem('company_code');
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={16}>
          {
            company_code==='hy'&&
            <FormItem
              label='DMA分区'>
              {getFieldDecorator('area_id', {
              })(
                <TreeSelect
                  style={{width:'100px'}}
                  allowClear
                >
                  {this.renderDMATreeNodes(this.props.dma.allData)}
                </TreeSelect>
              )}
            </FormItem>
          }
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
          <FormItem  label={"户号"}>
            {getFieldDecorator('member_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem  label={"集中器编号"}>
            {getFieldDecorator('concentrator_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem  label={"水表号"}>
            {getFieldDecorator('meter_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem>
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
