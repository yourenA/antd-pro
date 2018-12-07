/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button, Switch} from 'antd';
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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" style={{overflow: 'hidden'}}>
        <Row>
          <FormItem label={"温度传感器编号"}>
            {getFieldDecorator('number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label={"地址"}>
            {getFieldDecorator('address')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {(this.props.showAddBtn)?<Button  type="primary"   onClick={this.props.clickAdd} icon='plus'>添加</Button>:null}

          </FormItem>
          <FormItem label="打开操作栏" style={{float: 'right'}}>
            <Switch defaultChecked={localStorage.getItem('canOperateTemperature') === 'true' ? true : false}
                    onChange={(checked)=> {
                      localStorage.setItem('canOperateTemperature', checked);
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
