/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input ,InputNumber,Radio,TreeSelect,Select,DatePicker,Button,Upload,Icon ,Cascader} from 'antd';
import {connect} from 'dva';
import {download} from './../../../utils/utils'
import request from "./../../../utils/request";
import moment from 'moment'
import config from '../../../common/config'
const TreeNode = TreeSelect.TreeNode;
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
    this.props.findChildFunc(this.getState);
  }
  getState=()=>{
    return this.state.fileList
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
  downloadTemplates=()=>{
    download(`${config.prefix}/templates?type=meter&language=${sessionStorage.getItem('locale') === 'en'?'en':'zh-CN'}&timestamp=${(new Date()).valueOf()}`)
  }
  renderTreeSelect=(data)=>{
    return data.map((item)=>{
      if(item.children){
        this.renderTreeSelect(item.children)
      }
      item.value=item.id;
      item.label=item.name;
      item.disabled=item.is_available===-1
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
        village_id:value[value.length-1]
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
    const props = {
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label= {formatMessage({id: 'intl.import_template_download'})}
          {...formItemLayoutWithLabel}
        >
          <Button type="primary" onClick={this.downloadTemplates}> {formatMessage({id: 'intl.download_template'})}</Button>
        </FormItem>
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
            rules: [{required: true, message: '安装小区不能为空'}],
          })(
            <Cascader onChange={this.onChangeCasader} options={this.renderTreeSelect(this.props.sider_regions.data)} />
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
            rules: [{required: true, message: '水表类型不能为空'}],
          })(
            <Select >
              { this.props.meter_models.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          label={formatMessage({id: 'intl.water_meter_number_length'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('meter_number_length', {
            initialValue: '14',
            rules: [{required: true, message: '水表号长度'}],
          })(
            <Select >
              <Option  value="14">14</Option>
              <Option  value="12">12</Option>
              <Option  value="8">8</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.reset_the_data'})}
            </span>
          )}>
          {getFieldDecorator('is_reset', {
            initialValue:{key:-1,label:formatMessage({id: 'intl.no'})},
            rules: [{required: true}],
          })(
            <Select labelInValue={true} >
              { [{key:3,label:formatMessage({id: 'intl.reset_meter_type'})},{key:2,label:formatMessage({id: 'intl.reset_village'})},{key:1,label:formatMessage({id: 'intl.reset_all'})},{key:-1,label:formatMessage({id: 'intl.no'})}].map((item, key) => {
                return (
                  <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={formatMessage({id: 'intl.excel_file'})}
        >
          <div className="dropbox">
            {getFieldDecorator('file', {
              rules: [{required: true, message: 'Excel文件不能为空'}],
            })(
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">{formatMessage({id: 'intl.click_on_this_area'})}</p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>
      </Form>
    </div>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
