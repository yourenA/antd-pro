import React, {Component} from 'react';
import {Form, Icon, Input, Button, Tooltip, Select} from 'antd';
import {convertPoliciesTopic} from './../../utils/utils'
const FormItem = Form.Item;
const Option = Select.Option;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.uuid=this.props.editRecord?this.props.editRecord.permissions.data.length-1:0;
    this.state = {};
  }
  add = () => {
    this.uuid++;
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  remove = (k) => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //     return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    const { type } = this.state;
    const that=this;
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.cb(convertPoliciesTopic(values))
        }
      }
    );
  }
  render() {
    const {editRecord}=this.props
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 15, offset: 5},
      },
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const keysArr=[];
    const permissionsLen=editRecord?editRecord.permissions.data.length:0
    if(editRecord){
      for(let k in editRecord.permissions.data){
        keysArr.push(parseInt(k))
      }
    }

    getFieldDecorator('keys', {initialValue:keysArr});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const layout = index === 0 ? formItemLayoutWithLabel : formItemLayoutWithOutLabel;
      let authority='0'
      if(editRecord&&permissionsLen>k){
        if(editRecord.permissions.data[k].allow_publish===1 && editRecord.permissions.data[k].allow_subscribe===1){
          authority='2'
        }else if(editRecord.permissions.data[k].allow_publish===1){
          authority='1'
        }else if(editRecord.permissions.data[k].allow_subscribe===1){
          authority='0'
        }
      }
      return (
        <FormItem
          {...layout}
          label={index === 0 ? '主题' : ''}
          required={true}
          key={k}>
          {getFieldDecorator(`topics-${k}`, {
            initialValue: (editRecord&&permissionsLen>k)?{name:editRecord.permissions.data[k].topic,id:editRecord.permissions.data[k].id,authority:authority}:{name: '', authority: '0',id:null},
          })(<ThemeInput />)}
          <Icon
            style={{cursor: 'pointer'}}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        </FormItem>
      );
    });

    return (
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
        {formItems}
        <FormItem
          {...formItemLayoutWithOutLabel}>
          <Button type="primary" onClick={this.add} style={{width: '100%'}}>
            <Icon type="plus"/> 增加主题
          </Button>
        </FormItem>

        {
          (this.props.addInDevice) ?
            <FormItem
              wrapperCol={ {
                offset: 13,
              }}>
              <Button  style={{marginRight:'10px'}} onClick={this.props.cancel}>
                取消
              </Button>
              <Button   type="primary" htmlType="submit">
                确定
              </Button>
            </FormItem>
            :null
        }
      </Form>
    );
  }
}

class ThemeInput extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      name: value.name || '',
      authority: value.authority || "0",
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleNumberChange = (e) => {
    const name = e.target.value;
    if (!('value' in this.props)) {
      this.setState({name});
    }
    this.triggerChange({name});
  }
  handleCurrencyChange = (authority) => {
    if (!('value' in this.props)) {
      this.setState({authority});
    }
    this.triggerChange({authority});
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const {size} = this.props;
    const state = this.state;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.name}
          onChange={this.handleNumberChange}
          style={{width: '45%', marginRight: '3%'}}
        />
        <Input type="hidden"/>
        <Select
          value={state.authority}
          size={size}
          style={{width: '45%', marginRight: '2%'}}
          onChange={this.handleCurrencyChange}
        >
          <Option value="0">订阅</Option>
          <Option value="1">发布</Option>
          <Option value="2">订阅+发布</Option>
        </Select>
      </span>
    );
  }
}
const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default AddPoliciesFormWrap;
