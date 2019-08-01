/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Switch,TreeSelect } from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { SHOW_PARENT } = TreeSelect;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  sider_regions: state.sider_regions,
  manufacturers: state.manufacturers,
  concentrators: state.concentrators,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustom:false
    };
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'manufacturers/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'concentrators/fetch',
      payload: {
        return: 'all'
      }
    });
    if(this.props.editRecord&&this.props.editRecord.management_data.type){
      this.setState({
        showCustom:this.props.editRecord.management_data.type==='custom'
      })
    }
  }
  changeRadio=(e)=>{
    if(e.target.value==='all'){
      this.setState({
        showCustom:false
      })
    }else{
      this.setState({
        showCustom:true
      })
    }
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
    const {intl:{formatMessage}} = this.props;
    const {sider_regions:{data},manufacturers,concentrators}=this.props;
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
               {formatMessage({id: 'intl.username'})}
            </span>
          )}
        >
          {getFieldDecorator('username', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.username'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input disabled={ this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.real_name'})}
            </span>
          )}
        >
          {getFieldDecorator('real_name', {
            initialValue: this.props.editRecord ? this.props.editRecord.real_name : '',
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.telephone'})}
            </span>
          )}
        >
          {getFieldDecorator('mobile', {
            initialValue: this.props.editRecord ? this.props.editRecord.mobile : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.email'})}
            </span>
          )}
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '邮箱地址错误',
            }, {
            }],
            initialValue: this.props.editRecord ? this.props.editRecord.email : '',
          })(
            <Input />
          )}
        </FormItem>
       {/* {
          this.props.editRecord?
          null
          :  <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              密码
            </span>
              )}
            >
              {getFieldDecorator('password', {
                initialValue: '',
              })(
                <Input />
              )}
            </FormItem>

        }*/}
        {
          (this.props.editRecord&&this.props.editRecord.lock===2)?null
            :
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
               {formatMessage({id: 'intl.role_name'})}
            </span>
              )}>
              {getFieldDecorator('role_id', {
                initialValue: this.props.editRecord?{key:this.props.editRecord.role_id,label:this.props.editRecord.role_display_name}:{key:'',label:''},
                rules: [{required: true, message:  formatMessage({id: 'intl.role_name'})+formatMessage({id: 'intl.can_not_be_empty'})}],
              })(
                <Select labelInValue={true} >
                  { this.props.usergroup.map((item, key) => {
                    return (
                      <Option key={item.id} disabled={item.status===-1?true:false} value={item.id.toString()}>{item.display_name}</Option>
                    )
                  }) }
                </Select>
              )}
            </FormItem>
        }
        <FormItem
          label="可管理数据"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('type', {
            initialValue: this.props.editRecord ? this.props.editRecord.management_data.type : 'all',
          })(
            <RadioGroup onChange={this.changeRadio} >
              <Radio value="all">全部</Radio>
              <Radio value="custom">自定义</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          this.state.showCustom&&
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              自定义小区
            </span>
            )}>
            {getFieldDecorator('villages', {
              initialValue: this.props.editRecord?this.props.editRecord.management_data.custom_rules?this.props.editRecord.management_data.custom_rules.villages:[]:[],
            })(
              <TreeSelect
                allowClear
                treeDefaultExpandAll={false}
                treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              >
                {this.renderTreeNodes(data)}
              </TreeSelect>
            )}
          </FormItem>
        }
        {
          this.state.showCustom &&
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              自定义厂商
            </span>
            )}>
            {getFieldDecorator('manufacturers', {
              initialValue: this.props.editRecord?this.props.editRecord.management_data.custom_rules?this.props.editRecord.management_data.custom_rules.manufacturers:[]:[],
            })(
              <Select   mode="multiple" >
                {manufacturers.data.map((item, key) => {
                  return (
                    <Option key={item.id}  value={item.id.toString()}>{item.name}</Option>
                  )
                }) }
              </Select>
            )}
          </FormItem>
        }
        {
          this.state.showCustom &&
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              自定义集中器
            </span>
            )}>
            {getFieldDecorator('concentrators', {
              initialValue: this.props.editRecord?this.props.editRecord.management_data.custom_rules?this.props.editRecord.management_data.custom_rules.concentrators:[]:[],
            })(
              <Select   mode="multiple" >
                {concentrators.data.map((item, key) => {
                  return (
                    <Option key={item.id}  value={item.number}>{item.number}</Option>
                  )
                }) }
              </Select>
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.is_telephone_notify'})}
        >
          {getFieldDecorator('is_sms_notify', {
            initialValue: this.props.editRecord ? (this.props.editRecord.is_sms_notify===1?true:false) : false,
            valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.is_email_notify'})}
        >
          {getFieldDecorator('is_email_notify',
            { initialValue: this.props.editRecord ? (this.props.editRecord.is_email_notify===1?true:false) : false
              ,valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);


