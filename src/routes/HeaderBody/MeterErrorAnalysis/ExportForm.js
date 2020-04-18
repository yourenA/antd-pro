/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Cascader ,  Radio, TreeSelect,DatePicker,Select } from 'antd';
import {connect} from 'dva';
import {disabledDate} from './../../../utils/utils'
import request from "./../../../utils/request";
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import moment from 'moment'
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  sider_regions: state.sider_regions,
  manufacturers:state.manufacturers
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concentrators:[]
    };
  }
  componentDidMount() {
    const {dispatch}=this.props
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
      },
      callback: ()=> {
      }
    });
    this.onChangeCasader()
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

  onChangeCasader=(value)=>{
    console.log('value',value);
    const that=this;
    const {form} = this.props;
    form.setFieldsValue({ concentrator_number:''}),
      request(`/concentrators`, {
        method: 'get',
        params: {
          village_id:value?value:'',
          return:'all'
        }
      }).then((response)=> {
        console.log(response);
        that.setState({
          concentrators:response.data.data
        })
      })
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {sider_regions:{data}}=this.props;
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
      <FormItem label=   {formatMessage({id: 'intl.start'})}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('started_at', {
            initialValue: moment(),

          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
       <FormItem label=   {formatMessage({id: 'intl.end'})}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('ended_at', {
            initialValue: moment(),
          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={ formatMessage({id: 'intl.vendor_name'})}
        >
          {getFieldDecorator('manufacturer_id', {
          })(
            <Select allowClear={true} >
              { this.props.manufacturers.data.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.village_name'})}
            </span>
          )}>
          {getFieldDecorator('village_id', {
            initialValue:[],
          })(
            <TreeSelect
              allowClear
              onChange={this.onChangeCasader}
            >
              {this.renderTreeNodes(data)}
            </TreeSelect>
          )}
        </FormItem>
      {/*  <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.village_name'})}
            </span>
          )}>
          {getFieldDecorator('village_id', {
          })(
            <Cascader onChange={this.onChangeCasader} options={this.renderTreeSelect(data)} placeholder="请选择"/>
          )}
        </FormItem>*/}
        <FormItem
          label={formatMessage({id: 'intl.concentrator_number'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('concentrator_number', {
            initialValue: '',
          })(
            <Select
              showSearch
              filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              { this.state.concentrators.map(item => <Option key={item.id} value={item.number}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          label={'尺寸类型'}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('size_type', {
            initialValue:{key:'',label:''},
          })(
            <Select
              labelInValue={true}
            >
              { [{id:1,name:'小表'},{id:2,name:'大表'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          label={'温度介质类型'}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('temperature_type', {
            initialValue:{key:'',label:''},
          })(
            <Select
              labelInValue={true}
            >
              { [{id:1,name:'冷水表'},{id:2,name:'热水表'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
