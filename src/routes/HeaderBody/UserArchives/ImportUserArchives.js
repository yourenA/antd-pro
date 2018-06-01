/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input ,InputNumber,Radio,TreeSelect,Select,DatePicker,Button,Upload,Icon } from 'antd';
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
class EditUserArchives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
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
    download(`${config.prefix}/templates?type=meter`)
  }
  render() {
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
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="导入模板下载"
          {...formItemLayoutWithLabel}
        >
          <Button type="primary" onClick={this.downloadTemplates}>下载模板</Button>
        </FormItem>
        <FormItem
          label="集中器编号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('concentrator_number', {
            initialValue: '',
            rules: [{required: true, message: '集中器编号不能为空'}],
          })(
            <Select >
              { this.props.concentrators.map(item => <Option key={item.id} value={item.number}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          label="水表类型"
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
          {...formItemLayoutWithLabel}
          label="Excel文件"
        >
          <div className="dropbox">
            {getFieldDecorator('file', {
              rules: [{required: true, message: 'Excel文件不能为空'}],
            })(
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击这个区域选择Excel文件</p>
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
