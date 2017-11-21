/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, message, Tooltip, Select,Button} from 'antd';
import AddOrEditStrategy from './addOrEditStrategy.js';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStrategy:false
    };
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.cb({name:values.name,policy_id:values.policy_id.key})
        }
      }
    );
  }
  handleChange = (value)=> {
    console.log(value);
    const selectValue = value ? value.key : '';
     if (selectValue === 'newStrategy') {
      this.setState({
        newStrategy: true,
      })
    } else {
      this.setState({
        newStrategy: false,
      })
    }
  };
  addStrategy=(values)=>{
    const that=this;
    const {form,dispatch,endpoint_id} = this.props;
    dispatch({
      type: 'strategy/add',
      payload: {
        data: {
          ...values,
          endpoint_id
        },
      },
      callback: function (data) {
        message.success('添加策略成功');
        dispatch({
          type: 'strategy/fetch',
          payload: {
            endpoint_id,
            return:'all'
          }
        });
        form.setFieldsValue({
          policy_id: {key:data.id.toString(),label:data.name},
        });
        that.setState({
          newStrategy: false,
        })
      }
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
    const newformItemsWrap = ()=> {
      if (this.state.newStrategy) {
        return (
          <fieldset>
            <legend><Icon type="plus-square" />新建策略</legend>
            <AddOrEditStrategy  cb={this.addStrategy} addInDevice={true}/>
          </fieldset>
        )
      }
      else {
        return (
          null
        )
      }
    };
    console.log('addInDevice',this.props.addInDevice)
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              名称&nbsp;
              <Tooltip title="名称由英文字母（a-z，不区分大小写）、数字（0-9）、下划线“_”以及连字符“-”（即中横线）构成，不能使用空格及特殊字符（如！、$、&、?等）。“-” 不能单独或连续使用，不能放在开头或结尾。">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '名称不能为空'}],
          })(
            <Input  disabled={this.props.editRecord ?true:false}/>
          )}
        </FormItem>
        {
          this.props.addInDevice ?
            <FormItem
              label="策略"
              {...formItemLayoutWithLabel}>
              {getFieldDecorator('policy_id', {
                rules: [{required: true, message: '请选择策略'}],
                onChange: this.handleChange,
              })(
                <Select labelInValue={true} >
                  <Option value='newStrategy'>新建</Option>
                  { this.props.strategy.map((item, key) => {
                    return (
                      <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                    )
                  }) }
                </Select>
              )}
            </FormItem>
            :
            <FormItem
              label="策略"
              {...formItemLayoutWithLabel}>
              {getFieldDecorator('policy_id', {
                initialValue: this.props.editRecord?{key:this.props.editRecord.policy_id.toString(),label:this.props.editRecord.policy_name}:{key:'',label:''},
                rules: [{required: true, message: '请选择策略'}],
              })(
                <Select labelInValue={true} >
                  { this.props.strategy.map((item, key) => {
                    return (
                      <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                    )
                  }) }
                </Select>
              )}
            </FormItem>
        }


        {
          (this.props.addInDevice&& !this.state.newStrategy) ?
            <FormItem
              wrapperCol={ {
                offset: 13,
              }}>
              <Button  style={{marginRight:'10px'}}>
                取消
              </Button>
              <Button   type="primary" htmlType="submit">
                确定
              </Button>
            </FormItem>
            :null
        }

      </Form>
    {newformItemsWrap()}
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
