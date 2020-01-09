/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Cascader,DatePicker,TreeSelect } from 'antd';
import {connect} from 'dva';
import moment from 'moment'
import request from "./../../../utils/request";
const TreeNode = TreeSelect.TreeNode;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concentrators:this.props.editRecord ?[{id:this.props.editRecord.concentrator_number,number:this.props.editRecord.concentrator_number}]:[]
    };
  }
  onChangeCasader=(value)=>{
    console.log('value',value);
    const that=this;
    const {form} = this.props;
    form.setFieldsValue({ concentrator_number:''}),
      request(`/concentrators`, {
        method: 'get',
        params: {
          village_id:value
        }
      }).then((response)=> {
        console.log(response);
        that.setState({
          concentrators:response.data.data
        })
      })
  }
 /* renderTreeSelect=(data)=>{
    return data.map((item)=>{
      if(item.children){
        this.renderTreeSelect(item.children)
      }
      item.value=item.id;
      item.label=item.name
      return item
    })
  }*/
  renderTreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return  <TreeNode value={item.id}  title={item.name} key={item.id} />
    });
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              远程电控阀门编号
            </span>
          )}
        >
          {getFieldDecorator('number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message: '远程电控阀门编号不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              远程电控阀门序号
            </span>
          )}
        >
          {getFieldDecorator('index', {
            initialValue: this.props.editRecord ? this.props.editRecord.index : '',
            rules: [{required: true, message: '远程电控阀门序号不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              远程电控阀门名称
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              规格
            </span>
          )}
        >
          {getFieldDecorator('specification', {
            initialValue: this.props.editRecord ? this.props.editRecord.specification : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              安装小区
            </span>
          )}>
          {getFieldDecorator('village_id', {
            rules: [{required: true, message: '安装小区不能为空'}],
            initialValue: this.props.editRecord?this.props.editRecord.village_id:'',
          })(
            <TreeSelect
              onChange={this.onChangeCasader}
              treeDefaultExpandAll={true}
            >
              {this.renderTreeNodes(this.props.sider_regions.data)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem
          label="集中器编号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('concentrator_number', {
            initialValue:  this.props.editRecord ? this.props.editRecord.concentrator_number : '',
            rules: [{required: true, message: '集中器编号不能为空'}],
          })(
            <Select >
              { this.state.concentrators.map(item => <Option key={item.id} value={item.number}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              开始使用日期
            </span>
          )}>
          {getFieldDecorator('enabled_date', {
            initialValue: (this.props.editRecord&&this.props.editRecord.enabled_date)?moment(this.props.editRecord.enabled_date):moment(),
          })(
            <DatePicker allowClear={false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              备注
            </span>
          )}
        >
          {getFieldDecorator('remark', {
            initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
