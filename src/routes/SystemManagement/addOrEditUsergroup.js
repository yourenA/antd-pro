/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Card, Tooltip, Button, Table, Popconfirm, Checkbox, message} from 'antd';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import request from './../../utils/request'
import groupBy from 'lodash/groupBy'
import forEach from 'lodash/forEach'
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
@connect(state => ({
  usergroup: state.usergroup,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.uuid = 0;
    this.isNew = this.props.match.params.id === 'add' ? true : false;
    this.state = {
      userManageCheckedList: [],
      villageCheckedList: [],
      otherCheckedList: [],
      other:[],
      userManage:[],
      village:[],
      userIndeterminate: false,
      otherIndeterminate: false,
      villageIndeterminate: false,
      checkAll: false,
      otherCheckAll: false,
      villageCheckAll: false,
      editRecord: {},
      你好评:'234'
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const id = this.props.match.params.id;
    const that = this;

    request(`/permissions`,{
      method:'GET',
      params:{
        return:'all',
        type:'only_company'
      }
    }).then((response)=>{
      console.log('response',response)
      const group=groupBy(response.data.data,'group')
      console.log('group',group);
      forEach(group, function(value, key) {
        console.log(key);
        that.setState({
          key:value
        })
      });
      that.setState({
        other:group['其他'].reduce((result,item)=>{
          result.push({label:item.display_name,value:item.name})
          return result
        },[]),
        userManage:group['用户管理'].reduce((result,item)=>{
          result.push({label:item.display_name,value:item.name})
          return result
        },[]),
        village:group['安装小区管理'].reduce((result,item)=>{
          result.push({label:item.display_name,value:item.name})
          return result
        },[]),
      },function () {
        if (this.isNew) {
          console.log('新建用户组')
        } else {
          console.log('修改用户组')
          dispatch({
            type: 'usergroup/fetchOneusergroup',
            payload: {
              id
            },
            callback: function () {
              const {usergroup:{editRecord}}=that.props;
              const selectGroup=groupBy(editRecord.permissions.data,'group')
              console.log('selectGroup',selectGroup)
              that.setState({
                otherCheckedList:selectGroup['其他']?selectGroup['其他'].reduce((result,item)=>{
                  result.push(item.name)
                  return result
                },[]):[],
                userManageCheckedList:selectGroup['用户管理']?selectGroup['用户管理'].reduce((result,item)=>{
                  result.push(item.name)
                  return result
                },[]):[],
                villageCheckedList:selectGroup['安装小区管理']?selectGroup['安装小区管理'].reduce((result,item)=>{
                  result.push(item.name)
                  return result
                },[]):[],
              },function () {

                that.setState({
                  userIndeterminate: !!this.state.userManageCheckedList.length && (this.state.userManageCheckedList.length < this.state.userManage.length),
                  checkAll: this.state.userManageCheckedList.length === this.state.userManage.length,
                  otherIndeterminate: !!this.state.otherCheckedList.length && (this.state.otherCheckedList.length < this.state.other.length),
                  otherCheckAll: this.state.otherCheckedList.length === this.state.other.length,
                  villageIndeterminate: !!this.state.villageCheckedList.length && (this.state.villageCheckedList.length < this.state.village.length),
                  villageCheckAll: this.state.villageCheckedList.length === this.state.village.length,
                })

              })
            }
          });

        }
      })
    })
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
          const msg = this.isNew ? '创建用户组成功' : '修改用户组成功';
          const data = this.isNew ? {
            permissions:this.state.otherCheckedList.concat(this.state.userManageCheckedList),
            ...values
          } : {
            id,
            permissions:this.state.otherCheckedList.concat(this.state.userManageCheckedList),
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
  onChange = (userManageCheckedList) => {
    this.setState({
      userManageCheckedList,
      userIndeterminate: !!userManageCheckedList.length && (userManageCheckedList.length < this.state.userManage.length),
      checkAll: userManageCheckedList.length === this.state.userManage.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      userManageCheckedList: e.target.checked ? this.state.userManage.map((item,index)=>{
        return item.value
      }) : [],
      userIndeterminate: false,
      checkAll: e.target.checked,
    });
  }
  onChangeOther = (otherCheckedList) => {
    this.setState({
      otherCheckedList,
      otherIndeterminate: !!otherCheckedList.length && (otherCheckedList.length < this.state.other.length),
      otherCheckAll: otherCheckedList.length === this.state.other.length,
    });
  }
  onCheckAllChangeOther = (e) => {
    this.setState({
      otherCheckedList: e.target.checked ? this.state.other.map((item,index)=>{
        return item.value
      }) : [],
      otherIndeterminate: false,
      otherCheckAll: e.target.checked,
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
          <Form >
            <h3  className="form-title" >基本信息</h3>
            <FormItem
              {...formItemLayoutWithLabel}
              label='名称'
            >
              {getFieldDecorator('display_name', {
                initialValue: !this.isNew ? editRecord.display_name : '',
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
                    indeterminate={this.state.userIndeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    账号管理
                  </Checkbox>
                </div>
                <CheckboxGroup options={this.state.userManage}  value={this.state.userManageCheckedList} onChange={this.onChange} />
            </FormItem>
            <FormItem
              {...formItemLayoutWithOutLabel}
            >
              <div className="checkgroup-title" >
                <Checkbox
                  indeterminate={this.state.otherIndeterminate}
                  onChange={this.onCheckAllChangeOther}
                  checked={this.state.otherCheckAll}
                >
                  其他
                </Checkbox>
              </div>
              <CheckboxGroup options={this.state.other}  value={this.state.otherCheckedList} onChange={this.onChangeOther} />
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
              <Button style={{width: '40%'}} type="primary" onClick={this.handleSubmit}>
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
