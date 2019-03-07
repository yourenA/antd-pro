/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input ,InputNumber,Radio,TreeSelect,Select,DatePicker} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
@injectIntl
class EditUserArchives extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {sider_regions:{data}}=this.props;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          label= {formatMessage({id: 'intl.user_number'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('number', {
            initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            rules: [{required: true, message: formatMessage({id: 'intl.user_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Input  />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          style={{width:'50%',display:'inline-block'}}
          label={(
            <span>
               {formatMessage({id: 'intl.village_name'})}
            </span>
          )}>
          {getFieldDecorator('village_id', {
            initialValue: this.props.editRecord?this.props.editRecord.village_id:'',
          })(
            <TreeSelect
              treeDefaultExpandAll={true}
            >
              {this.renderTreeNodes(data)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem
          label= {formatMessage({id: 'intl.user_name'})}
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('real_name', {
            initialValue: this.props.editRecord ? this.props.editRecord.real_name : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          style={{width:'50%',display:'inline-block'}}
          label={(
            <span>
               {formatMessage({id: 'intl.install_address'})}
            </span>
          )}
        >
          {getFieldDecorator('address', {
            initialValue: this.props.editRecord ? this.props.editRecord.address : '',
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          style={{width:'50%',display:'inline-block'}}
          label= {formatMessage({id: 'intl.email'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('email', {
            initialValue: this.props.editRecord ? this.props.editRecord.email : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          style={{width:'50%',display:'inline-block'}}
          label= {formatMessage({id: 'intl.telephone'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('phone', {
            initialValue: this.props.editRecord ? this.props.editRecord.phone : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label= {formatMessage({id: 'intl.id_card'})}
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('id_card', {
            initialValue: this.props.editRecord ? this.props.editRecord.id_card : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label= {formatMessage({id: 'intl.sex'})}
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('sex', {
            initialValue:  '保密',
          })(
            <RadioGroup>
              <Radio value="男">{formatMessage({id: 'intl.male'})}</Radio>
              <Radio value="女">{formatMessage({id: 'intl.female'})}</Radio>
              <Radio value="保密">{formatMessage({id: 'intl.secret'})}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          label= {formatMessage({id: 'intl.reader'})}
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('reader', {
            initialValue: this.props.editRecord ? this.props.editRecord.reader : '',
          })(
            <Input />
          )}
        </FormItem>
        {this.props.editRecord ?null:  <FormItem
          label= {formatMessage({id: 'intl.initial_value'})}
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('initial_water', {
            initialValue: this.props.editRecord ? this.props.editRecord.initial_water : '',
          })(
            <InputNumber />
          )}
        </FormItem>}
        {this.props.editRecord ?null:   <FormItem
          style={{width:'50%',display:'inline-block'}}
          label= {formatMessage({id: 'intl.history_reading'})}
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('historical_value', {
            initialValue: this.props.editRecord ? this.props.editRecord.historical_value : '',
          })(
            <InputNumber />
          )}
        </FormItem>}
        {this.props.editRecord ?null:     <FormItem
          style={{width:'50%',display:'inline-block'}}
          label="换表记录"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('is_change', {
            initialValue: {key:'-1',label:'未换'},
          })(
            <Select labelInValue={true} >
              { [{key:1,label:'已换'},{key:-1,label:'未换'}].map((item, key) => {
                return (
                  <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                )
              }) }
            </Select>
          )}
        </FormItem>}
        {this.props.editRecord ?null:   <FormItem
          style={{width:'50%',display:'inline-block'}}
          {...formItemLayoutWithLabel}
          label={(
            <span>
               {formatMessage({id: 'intl.installed_date'})}
            </span>
          )}>
          {getFieldDecorator('installed_at', {
            initialValue: (this.props.editRecord&&this.props.editRecord.installed_at)?moment(this.props.editRecord.installed_at):null,
          })(
            <DatePicker allowClear={false}/>
          )}
        </FormItem>}

      </Form>
    </div>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
