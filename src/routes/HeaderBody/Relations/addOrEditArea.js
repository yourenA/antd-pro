/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Upload,Button ,Icon,TreeSelect } from 'antd';
import {connect} from 'dva';
import request from '../../../utils/request';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meters: [],
    };
  }
  componentDidMount() {
    request(`/meters`, {
      method: 'GET',
      params: {
        return: 'all'
      }
    }).then(response=>{
      if(response.status===200){
        this.setState({
          meters:response.data.data
        })
      }

    })
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
          {...formItemLayoutWithLabel}
          label={(
            <span>
              水表编号
            </span>
          )}
        >
          {getFieldDecorator('meter_number', {
            initialValue: this.props.editRecord ? this.props.editRecord.meter_number : '',
            rules: [{required: true, message:'水表编号不能为空'}],
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择"
              optionFilterProp="children"
              filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                this.state.meters.map((item,index)=>{
                  return <Option key={index} value={item.number}>{item.number}</Option>
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              上级水表编号
            </span>
          )}
        >
          {getFieldDecorator('parent_meter_number', {
            initialValue: this.props.editRecord ? this.props.editRecord.parent_meter_number : '',
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择"
              allowClear={true}
              optionFilterProp="children"
              filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                this.state.meters.map((item,index)=>{
                  return <Option key={index} value={item.number}>{item.number}</Option>
                })
              }
            </Select>

          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={'提示'}
        >
          <p >上级水表编号，空表示该水表是主表</p>
        </FormItem>


      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
