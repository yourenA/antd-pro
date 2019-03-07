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
    const {getFieldDecorator} = this.props.form;
    const {intl:{formatMessage}} = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
           {/* <FormItem  label={this.props.inputText?this.props.inputText:"名称"}>
              {getFieldDecorator('query')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>*/}
            <FormItem   >
              {/*<Button type="primary" htmlType="submit">查询</Button>*/}
              {/*<Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>*/}
              {this.props.showAddBtn&& <Button type="primary" onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>}
            </FormItem>
          <FormItem  label={formatMessage({id: 'intl.open_operating_bar'})}   style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateUserGroup')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateUserGroup',checked);
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
