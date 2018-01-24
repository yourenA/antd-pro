/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input ,InputNumber,Radio,TreeSelect,Select,DatePicker} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class EditUserArchives extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
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
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="户号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message: '户号不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
      {/*  {this.props.editRecord ?null: <FormItem
          label="集中器编号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('concentrator_number', {
            initialValue: this.props.editRecord?this.props.editRecord.concentrator_number : '',
            rules: [{required: true, message: '集中器编号不能为空'}],
          })(
            <Select >
              { this.props.concentrators.map(item => <Option key={item.id} value={item.number}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>}*/}
        <FormItem
          label="水表号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('meter_number', {
            initialValue: this.props.editRecord ? this.props.editRecord.meter_number : '',
            rules: [{required: true, message: '水表号不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        {this.props.editRecord ?null:  <FormItem
          label="水表序号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('meter_index', {
            initialValue: this.props.editRecord ? this.props.editRecord.meter_index : '',
            rules: [{required: true, message: '水表序号不能为空'}],
          })(
            <InputNumber />
          )}
        </FormItem>}
        {this.props.editRecord ?null: <FormItem
          label="台区"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('distribution_area', {
            initialValue: this.props.editRecord ? this.props.editRecord.distribution_area : '',
            rules: [{required: true, message: '台区不能为空'}],
          })(
            <Input />
          )}
        </FormItem>}
        {this.props.editRecord ?null: <FormItem
          label="表册"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('statistical_forms', {
            initialValue: this.props.editRecord ? this.props.editRecord.statistical_forms : '',
            rules: [{required: true, message: '表册不能为空'}],
          })(
            <Input />
          )}
        </FormItem>}
        <FormItem
          label="用户名称"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('real_name', {
            initialValue: this.props.editRecord ? this.props.editRecord.real_name : '',
            rules: [{required: true, message: '真实姓名不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              安装地址
            </span>
          )}
        >
          {getFieldDecorator('address', {
            initialValue: this.props.editRecord ? this.props.editRecord.address : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="邮箱地址"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('email', {
            initialValue: this.props.editRecord ? this.props.editRecord.email : '',
            rules: [{required: true, message: '邮箱地址不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="电话"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('phone', {
            initialValue: this.props.editRecord ? this.props.editRecord.phone : '',
            rules: [{required: true, message: '电话不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
    {/*    <FormItem
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
              treeDefaultExpandAll={true}
            >
              {this.renderTreeNodes(this.props.area)}
            </TreeSelect>
          )}
        </FormItem>*/}
        <FormItem
          label="身份证号码"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('id_card', {
            initialValue: this.props.editRecord ? this.props.editRecord.id_card : '',
            rules: [{required: true, message: '身份证号码不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="性别"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('sex', {
            initialValue: this.props.editRecord ? this.props.editRecord.sex : '保密',
            rules: [{required: true, message: '性别不能为空'}],
          })(
            <RadioGroup>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
              <Radio value="保密">保密</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          label="抄表员"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('reader', {
            initialValue: this.props.editRecord ? this.props.editRecord.reader : '',
          })(
            <Input />
          )}
        </FormItem>
        {this.props.editRecord ?null:  <FormItem
          label="初始水量"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('initial_water', {
            initialValue: this.props.editRecord ? this.props.editRecord.initial_water : '',
          })(
            <InputNumber />
          )}
        </FormItem>}
        {this.props.editRecord ?null:   <FormItem
          label="历史读数"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('historical_value', {
            initialValue: this.props.editRecord ? this.props.editRecord.historical_value : '',
          })(
            <InputNumber />
          )}
        </FormItem>}
        {this.props.editRecord ?null:     <FormItem
          label="换表记录"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('is_change', {
            initialValue: {key:'-1',label:'未换'},
          })(
            <Select labelInValue={true} >
              { [{key:1,label:'已换'},{key:-1,label:'未换'}].map((item, key) => {
                return (
                  <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>}
        {this.props.editRecord ?null:   <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              安装日期
            </span>
          )}>
          {getFieldDecorator('installed_at', {
            initialValue: (this.props.editRecord&&this.props.editRecord.installed_at)?moment(this.props.editRecord.installed_at):null,
          })(
            <DatePicker allowClear={false}/>
          )}
        </FormItem>}

      </Form>
    </div>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
