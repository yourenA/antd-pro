/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, TreeSelect,Select,Cascader} from 'antd';
import {connect} from 'dva';
import request from "./../../../utils/request";
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
@injectIntl
class EditUserArchives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      concentrators:[]
    };
  }
  componentDidMount() {
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
        village_id:value?value[value.length-1]:'',
        return:'all'
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        concentrators:response.data.data
      })
    })
  }
  renderDMATreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children&&item.children.length>0) {
        return (
          <TreeNode value={item.id}  title={item.name} key={item.id}>
            {this.renderDMATreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
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
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        {
          company_code==='hy'&&
          <FormItem
            {...formItemLayoutWithLabel}
            label='DMA分区'>
            {getFieldDecorator('area_id', {
            })(
              <TreeSelect
                allowClear
              >
                {this.renderDMATreeNodes(this.props.dma.allData)}
              </TreeSelect>
            )}
          </FormItem>
        }
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.village_name'})}
            </span>
          )}>
          {getFieldDecorator('village_id', {
          })(
            <Cascader onChange={this.onChangeCasader} options={this.renderTreeSelect(this.props.sider_regions.data)} placeholder="请选择"/>
          )}
        </FormItem>
        <FormItem
          label={formatMessage({id: 'intl.concentrator_number'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('concentrator_number', {
            initialValue: '',
            rules: [{required: true, message: '集中器编号不能为空'}],
          })(
            <Select >
              { this.state.concentrators.map(item => <Option key={item.id} value={item.number}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage({id: 'intl.water_meter_type'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('meter_model_id', {
            initialValue: '',
          })(
            <Select  allowClear={true}>
              { this.props.meter_models.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
