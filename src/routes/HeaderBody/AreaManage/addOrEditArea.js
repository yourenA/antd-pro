/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Upload,Button ,Icon,TreeSelect } from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(state => ({
  sider_regions: state.sider_regions,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
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
    const {sider_regions:{data}}=this.props;
    const props = {
      action:'',
      name:'shoce11',
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [file],
        }));
        return false;
      },
      showUploadList:  { showPreviewIcon: true, showRemoveIcon:false},
      fileList: this.state.fileList,
    };
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              地址名称
            </span>
          )}
        >
          {getFieldDecorator('name', {
            initialValue: this.props.editRecord ? this.props.editRecord.name : '',
            rules: [{required: true, message: '地址名称不能为空'}],
          })(
            <Input />
          )}
        </FormItem>
        {/* 表单图片上传
          var formData = new FormData();
          formData.append("content", formValues.content);
          formData.append("image", formValues.file.file);*/}
       {/* <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              地址名称
            </span>
          )}
        >
          {getFieldDecorator('file', {
            rules: [{required: true, message: '地址名称不能为空'}],
          })(
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          )}
        </FormItem>*/}
        {!this.props.editRecord?
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              上级名称
            </span>
            )}>
            {getFieldDecorator('parent_id', {
            })(
              <TreeSelect
                treeDefaultExpandAll={true}
              >
                {this.renderTreeNodes(data)}
                </TreeSelect>
            )}
          </FormItem>:
        null}
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              备注
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
