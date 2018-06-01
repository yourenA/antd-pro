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
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {sider_regions:{data}}=this.props;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
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
       {/* {this.props.editRecord ?null: <FormItem
          style={{width:'50%',display:'inline-block'}}
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
          style={{width:'50%',display:'inline-block'}}
          label="表册"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('statistical_forms', {
            initialValue: this.props.editRecord ? this.props.editRecord.statistical_forms : '',
            rules: [{required: true, message: '表册不能为空'}],
          })(
            <Input />
          )}
        </FormItem>}*/}
        <FormItem
          label="用户名称"
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('real_name', {
            initialValue: this.props.editRecord ? this.props.editRecord.real_name : '',
          })(
            <Input />
          )}
        </FormItem>
      {/*  <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              安装小区
            </span>
          )}>
          {getFieldDecorator('village_id', {
          })(
            <TreeSelect
              treeDefaultExpandAll={true}
            >
              {this.renderTreeNodes(data)}
            </TreeSelect>
          )}
        </FormItem>*/}
        <FormItem
          {...formItemLayoutWithLabel}
          style={{width:'50%',display:'inline-block'}}
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
          style={{width:'50%',display:'inline-block'}}
          label="邮箱地址"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('email', {
            initialValue: this.props.editRecord ? this.props.editRecord.email : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          label="电话"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('phone', {
            initialValue: this.props.editRecord ? this.props.editRecord.phone : '',
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
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('id_card', {
            initialValue: this.props.editRecord ? this.props.editRecord.id_card : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="性别"
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('sex', {
            initialValue: this.props.editRecord ? this.props.editRecord.sex : '保密',
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
          style={{width:'50%',display:'inline-block'}}
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
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('initial_water', {
            initialValue: this.props.editRecord ? this.props.editRecord.initial_water : '',
          })(
            <InputNumber />
          )}
        </FormItem>}
        {this.props.editRecord ?null:   <FormItem
          style={{width:'50%',display:'inline-block'}}
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
          style={{width:'50%',display:'inline-block'}}
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
          style={{width:'50%',display:'inline-block'}}
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
