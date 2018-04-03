/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select,Input,TreeSelect,Cascader} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
class AddConcentrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderTreeSelect=(data)=>{
    return data.map((item)=>{
      if(item.children){
        this.renderTreeSelect(item.children)
      }
      item.value=item.id;
      item.label=item.name
      return item
    })
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
       {/* <FormItem
          label="服务器地址"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('server_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.server_id,label:this.props.editRecord.server_ip}:{key:'',label:''},
            rules: [{required: true, message: '服务器地址为空'}],
          })(
            <Select labelInValue={true}>
              { this.props.servers.map(item => <Option key={item.id} value={item.id}>{item.ip}</Option>) }
            </Select>
          )}
        </FormItem>*/}
        <FormItem
          label="集中器类型"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('concentrator_model_id', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.concentrator_model_id,label:this.props.editRecord.concentrator_model_name}:{key:'',label:''},
            rules: [{required: true, message: '集中器类型不能为空'}],
          })(
            <Select labelInValue={true}  disabled={this.props.editRecord ?true:false}>
              { this.props.concentrator_models.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              集中器编号
            </span>
          )}
        >
          {getFieldDecorator('number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message: '集中器编号不能为空'}],
          })(
            <Input disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              硬件编号
            </span>
          )}
        >
          {getFieldDecorator('serial_number', {
            initialValue: this.props.editRecord ? this.props.editRecord.serial_number : '',
            rules: [{required: true, message: '硬件编号不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        {
          this.props.editRecord?
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              安装小区
            </span>
            )}>
            {getFieldDecorator('village_id', {
              initialValue: this.props.editRecord.village_name,
            })(
              <Input disabled={true}/>
            )}
          </FormItem>:
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
                <Cascader options={this.renderTreeSelect(this.props.area)} placeholder="请选择"/>
              )}
            </FormItem>


        }

        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              安装地址
            </span>
          )}
        >
          {getFieldDecorator('install_address', {
            initialValue: this.props.editRecord ? this.props.editRecord.install_address : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              是否统计
            </span>
          )}>
          {getFieldDecorator('is_count', {
            initialValue: this.props.editRecord?{key:this.props.editRecord.is_count.toString(),label:this.props.editRecord.is_count===1?'是':'否'}:{key:'1',label:'是'},
          })(
            <Select labelInValue={true} >
              { [{key:1,label:'是'},{key:-1,label:'否'}].map((item, key) => {
                return (
                  <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                )
              }) }
            </Select>
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
        {
          this.props.editRecord?null:
            <FormItem
              style={{color:'red'}}
              label="提示"
              {...formItemLayoutWithLabel}>
              <div>添加集中器会同时对集中器进行初始化</div>
            </FormItem>
        }

      </Form>
    </div>
    );
  }
}

const AddConcentratorFormWrap = Form.create()(AddConcentrator);
export default connect()(AddConcentratorFormWrap);
