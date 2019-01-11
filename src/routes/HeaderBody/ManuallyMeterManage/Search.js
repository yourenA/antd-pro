/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button, Switch,Icon,Radio,Popconfirm ,message} from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import {connect} from 'dva';
const FormItem = Form.Item;

@connect(state => ({
}))
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile?false:true,
    };
  }
  componentDidMount() {
    const that=this;
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
    const {expand}=this.state
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" style={{overflow: 'hidden'}}>
        <Row >
       {/*   <FormItem label="显示"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('display_type',{
              initialValue:  'all',
            })(
              <RadioGroup>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="only_without_village">只显示还没有选择小区监控表</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
          </FormItem>*/}
          {this.props.showAddBtn &&<FormItem   >
            <Button type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>
          </FormItem>
          }
          <FormItem label="打开操作栏" style={{float: 'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateManuallyMeter') === 'true' ? true : false}
                    onChange={(checked)=> {
                      localStorage.setItem('canOperateManuallyMeter', checked);
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
