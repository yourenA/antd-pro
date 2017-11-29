/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Card, Tooltip, Button, Table, Popconfirm, Checkbox, message} from 'antd';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
@connect(state => ({
  usergroup: state.usergroup,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.uuid = 0;
    this.isNew = this.props.match.params.ruleId === 'add' ? true : false;
    this.state = {
      plainOptions:['Apple', 'Pear', 'Orange'],
      checkedList: ['Apple', 'Orange'],
      indeterminate: true,
      checkAll: false,
      editRecord: {}
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const id = this.props.match.params.id;
    const that = this;
    if (this.isNew) {
      console.log('新建规则')
    } else {
      console.log('修改规则')
      dispatch({
        type: 'usergroup/fetchOneusergroup',
        payload: {
          id
        },
        callback: function () {
          const {usergroup:{editRecord}}=that.props
          that.setState({
            data: editRecord.destinations.data,
          })
        }
      });

    }
  }

  handleSubmit = (e)=> {
    e.preventDefault();
    const that = this;
    const id = this.props.match.params.id;
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          console.log(values)
          const type = this.isNew ? 'usergroup/add' : 'usergroup/edit';
          const msg = this.isNew ? '创建规则成功' : '修改规则成功';
          const data = this.isNew ? {
            id,
            ...values
          } : {
            id,
            destinations: this.state.data,
            ...values
          };
          this.props.dispatch({
            type: type,
            payload: {
              data
            },
            callback: function () {
              message.success(msg)
              that.props.dispatch(routerRedux.replace(`/system-management/usergroup`));
            }
          });
        }
      }
    );
  }
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
      checkAll: checkedList.length === this.state.plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.state.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  render() {
    const formItemLayoutWithOutLabel={
      wrapperCol: {
        xs: {span: 24},
        sm: {offset:5,span: 15},
      }
    }
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
    const {usergroup:{editRecord}}=this.props
    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <h3  className="form-title" >基本信息</h3>
            <FormItem
              {...formItemLayoutWithLabel}
              label='名称'
            >
              {getFieldDecorator('name', {
                initialValue: !this.isNew ? editRecord.name : '',
                rules: [{required: true, message: '名称不能为空'}],
              })(
                <Input disabled={this.props.editRecord ? true : false}/>
              )}
            </FormItem>
            <FormItem
              label="描述"
              {...formItemLayoutWithLabel}

            >
              {getFieldDecorator('description', {
                initialValue: !this.isNew ? editRecord.description : '',
              })(
                <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
              )}
            </FormItem>
            <h3  className="form-title" >权限信息</h3>
            <FormItem
              {...formItemLayoutWithOutLabel}

            >
                <div className="checkgroup-title" >
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    账号管理
                  </Checkbox>
                </div>
                <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </FormItem>
            <FormItem
              {...formItemLayoutWithOutLabel}

            >
              <div className="checkgroup-title" >
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  费用管理
                </Checkbox>
              </div>
              <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </FormItem>
            <FormItem
              wrapperCol={ {
                offset: 7,
                span: 10
              }}>
              <Button style={{marginRight: '10px', width: '40%'}} onClick={()=> {
                this.props.dispatch(routerRedux.replace(`/system-management/usergroup`));
              }}>
                取消
              </Button>
              <Button style={{width: '40%'}} type="primary" htmlType="submit">
                确定
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
