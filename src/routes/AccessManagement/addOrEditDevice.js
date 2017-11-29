/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Tooltip ,  Select,message} from 'antd';
import AddOrEditIdentify from './addOrEditIdentify.js'
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
class AddDeviceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newIdentify: false,
    };
  }

  handleChange = (value)=> {
    const selectValue = value ? value.key : '';
    if (selectValue === 'newIdentify') {
      this.setState({
        newIdentify: true,
      })
    } else {
      this.setState({
        newIdentify: false,
      })
    }
  };
  addIdentify=(values)=>{
    console.log('values',values)
    const that=this;
    const {form,dispatch,endpoint_id} = this.props;
    dispatch({
      type: 'identify/add',
      payload: {
        data: {
          ...values,
          endpoint_id
        },
      },
      callback: function (data) {
        message.success('添加身份成功');
        dispatch({
          type: 'identify/fetch',
          payload: {
            endpoint_id,
            return:'all'
          }
        });
        form.setFieldsValue({
          identify: {key:data.id.toString(),label:data.name},
        });
        that.setState({
          newIdentify: false,
        })
      }
    });
  }
  cancel=()=>{
    this.setState({
      newIdentify: false,
    })
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
    const {getFieldDecorator} = this.props.form;
    const newformItemsWrap = ()=> {
      if (this.state.newIdentify) {
        return (
          <fieldset>
            <legend><Icon type="plus-square" />新建身份</legend>
            <AddOrEditIdentify cancel={this.cancel} cb={this.addIdentify} endpoint_id={this.props.endpoint_id}  strategy={this.props.strategy}  addInDevice={true}/>
          </fieldset>
        )
      }
      else {
        return (
          null
        )
      }
    };
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={(
              <span>
              名称&nbsp;
                <Tooltip
                  title="名称由英文字母（a-z，不区分大小写）、数字（0-9）、下划线“_”以及连字符“-”（即中横线）构成，不能使用空格及特殊字符（如！、$、&、?等）。“-” 不能单独或连续使用，不能放在开头或结尾。">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
            )}
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('name', {
              rules: [{required: true, message: '名称不能为空'}],
              initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            })(
              <Input disabled={this.props.editRecord ? true : false}/>
            )}
          </FormItem>
          <FormItem
            label="描述"
            {...formItemLayoutWithLabel}
          >
                        {getFieldDecorator('description', {
                          initialValue: this.props.editRecord ? this.props.editRecord.description : '',
                        })(
                          <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
                        )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label="身份"
          >
            {getFieldDecorator('identify', {
              onChange: this.handleChange,
              initialValue: this.props.editRecord?{key:this.props.editRecord.principal_id.toString(),label:this.props.editRecord.principal_name}:{key:'',label:''},
              rules: [
                {required: true, message: '请选择身份'},
              ],
            })(
              <Select labelInValue={true}>
                <Option value='newIdentify'>新建</Option>
                { this.props.identify.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
        </Form>
        {newformItemsWrap()}
      </div>
    );
  }
}

const AddDeviceFormWrap = Form.create()(AddDeviceForm);
export default connect()(AddDeviceFormWrap);
