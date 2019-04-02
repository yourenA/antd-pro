/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  DatePicker , TreeSelect,InputNumber, Select} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
import request from "./../../../utils/request";
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import {injectIntl} from 'react-intl';
@injectIntl
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concentrators:[]
    };
  }
  componentDidMount() {
    if(this.props.editRecord){

      this.onChangeCasader(this.props.editRecord.village_id,true)
    }
  }
  onChangeCasader=(value,init)=>{
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
        },function () {
          if(init===true){
            that.props.form.setFieldsValue({
              concentrator_number:that.props.editRecord.concentrator_number,
            });
          }

        })
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
    const {intl:{formatMessage}} = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const {sider_regions:{data}}=this.props;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.liquid_sensors_number'})}
            </span>
          )}
        >
          {getFieldDecorator('number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.liquid_sensors_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label=   {formatMessage({id: 'intl.liquid_sensors_index'})}
        >
          {getFieldDecorator('index',{
            initialValue: this.props.editRecord ? this.props.editRecord.index: '',
            rules: [{required: true, message:  formatMessage({id: 'intl.liquid_sensors_index'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <InputNumber  min={1}/>
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                 {formatMessage({id: 'intl.min_actual_value'})}
            </span>
          )}
        >
          {getFieldDecorator('min_actual_value', {
            initialValue: this.props.editRecord ? this.props.editRecord.min_actual_value : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.min_actual_value'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <InputNumber  />
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                {formatMessage({id: 'intl.max_actual_value'})}
            </span>
          )}
        >
          {getFieldDecorator('max_actual_value', {
            initialValue: this.props.editRecord ? this.props.editRecord.max_actual_value : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.max_actual_value'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <InputNumber  />
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                 {formatMessage({id: 'intl.unit'})}
            </span>
          )}
        >
          {getFieldDecorator('unit', {
            initialValue: this.props.editRecord ? this.props.editRecord.unit :  formatMessage({id: 'intl.unit_meter'}),
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                 {formatMessage({id: 'intl.village_name'})}
            </span>
          )}>
          {getFieldDecorator('village_id', {
            initialValue: this.props.editRecord?this.props.editRecord.village_id:'',
            rules: [{required: true, message:  formatMessage({id: 'intl.village_name'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <TreeSelect
              onChange={this.onChangeCasader}
            >
              {this.renderTreeNodes(data)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                 {formatMessage({id: 'intl.concentrator_number'})}
            </span>
          )}>
          {getFieldDecorator('concentrator_number', {
            initialValue: this.props.editRecord?this.props.editRecord.concentrator_number:'',
            rules: [{required: true, message:  formatMessage({id: 'intl.concentrator_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <Select >
              { this.state.concentrators.map(item => <Option key={item.id} value={item.number}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label=   {formatMessage({id: 'intl.install_address'})}
        >
          {getFieldDecorator('address',{
            initialValue: this.props.editRecord ? this.props.editRecord.address : '',
            rules: [{required: true, message:  formatMessage({id: 'intl.install_address'})+formatMessage({id: 'intl.can_not_be_empty'})}],

          })(
            <Input />
          )}
        </FormItem>


        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                 {formatMessage({id: 'intl.enabled_date'})}
            </span>
          )}
        >
          {getFieldDecorator('enabled_date', {
            initialValue: this.props.editRecord ? moment(this.props.editRecord.enabled_date ): moment(),
          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
                 {formatMessage({id: 'intl.remark'})}
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
