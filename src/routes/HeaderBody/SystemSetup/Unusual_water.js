/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, Layout, Card, Button, Input, message, TimePicker, Switch,List,Modal ,Tabs,Icon ,InputNumber,Popconfirm  } from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import forEach from "lodash/forEach";
import filter from "lodash/filter";
import AddOrEditUnusualModels from './addOrEditUnusualModels'
import AddOrEditUnusualSpecial from './addOrEditUnusualSpecial'
const {Content} = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
@connect(state => ({
  meter_models: state.meter_models,
}))
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      consumption_abnormality_is_open: {},
      consumption_abnormality_normal_meter_value: {},
      consumption_abnormality_meter_models: {},
      consumption_abnormality_special_meters:{},
      searchInputValue:'',
      searchSpecialValue:'',
      tableY:0
    }
  }

  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'meter_models/fetch',
      payload: {
        return: 'all'
      }
    });
    request(`/configs?groups[]=consumption_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      this.changeTableY()
      that.setState({
        consumption_abnormality_is_open: find(response.data.data, function (o) {
          return o.name === 'consumption_abnormality_is_open'
        }),
        consumption_abnormality_normal_meter_value: find(response.data.data, function (o) {
          return o.name === 'consumption_abnormality_normal_meter_value'
        }),
        consumption_abnormality_meter_models: find(response.data.data, function (o) {
          return o.name === 'consumption_abnormality_meter_models'
        }),
        consumption_abnormality_special_meters: find(response.data.data, function (o) {
          return o.name === 'consumption_abnormality_special_meters'
        }),
      },function () {
        const {form} = that.props;
        form.setFieldsValue({
          consumption_abnormality_is_open: that.state.consumption_abnormality_is_open.value==='1'?true:false,
          consumption_abnormality_normal_meter_value: that.state.consumption_abnormality_normal_meter_value.value,
        });
      })

    })
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.system-tabs').offsetTop - (68 + 54 + 50+ 60  + 17)
    })
  }
  handleFormReset = () => {
    const {form} = this.props;
    const that=this;
    form.setFieldsValue({
      consumption_abnormality_is_open: that.state.consumption_abnormality_is_open.value==='1'?true:false,
      consumption_abnormality_normal_meter_value: that.state.consumption_abnormality_normal_meter_value.value,
    });
  }
  handleSubmit=()=>{
    this.props.form.validateFields({ force: false },
      (err, values) => {
        console.log('values',values)
          request(`/configs`, {
            method: 'PATCH',
            data: {
              consumption_abnormality_is_open:values.consumption_abnormality_is_open?'1':'-1',
              consumption_abnormality_normal_meter_value:values.consumption_abnormality_normal_meter_value
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              message.success(`修改${this.state.consumption_abnormality_normal_meter_value.display_name}成功`)
            }
          })
      }
    );
  }
  handleSubmitModel=()=>{
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log(formValues)
    if(!formValues.meter_model_id.key ){
      message.error(`水表类型不能为空`)
      return false
    }
    if(formValues.value === undefined ){
      message.error(`判断值不能为空`)
      return false
    }
    const isExit=find(this.state.consumption_abnormality_meter_models.value, function(o) { return o.id ===formValues.meter_model_id.key; });
    console.log('isExit',isExit)
    // console.log('...',[...this.state.consumption_abnormality_meter_models.value,{id:formValues.meter_model_id.key,value:formValues.value}]);
    if(!isExit){
      forEach(this.state.consumption_abnormality_meter_models.value, function(item, index) {
        delete item.name
      });
      request(`/configs`, {
        method: 'PATCH',
        data: {
          consumption_abnormality_meter_models:[{id:formValues.meter_model_id.key,value:formValues.value},...this.state.consumption_abnormality_meter_models.value]
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          this.setState({
            modelModal:false,
            consumption_abnormality_meter_models: find(response.data.data, function (o) {
              return o.name === 'consumption_abnormality_meter_models'
            }),

          })
          message.success(`添加${this.state.consumption_abnormality_meter_models.display_name}成功`)
        }
      })
    }else{
      message.error(`该水表类型规则已经存在`)
      return false
    }
  }
  handleSubmitEditModel=()=>{
    const formValues = this.EditformRef.props.form.getFieldsValue();
    if(formValues.value === undefined ){
      message.error(`判断值不能为空`)
      return false
    }
    const that=this;
    const editIndex=findIndex(this.state.consumption_abnormality_meter_models.value, function(o) { return o.id ===that.state.editModelRecord.id; });
    console.log('editIndex',editIndex)
    this.state.consumption_abnormality_meter_models.value[editIndex].value=formValues.value;

    forEach(this.state.consumption_abnormality_meter_models.value, function(item, index) {
      delete item.name
    });
    request(`/configs`, {
      method: 'PATCH',
      data: {
        consumption_abnormality_meter_models:this.state.consumption_abnormality_meter_models.value
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        this.setState({
          editModelModal:false,
          consumption_abnormality_meter_models: find(response.data.data, function (o) {
            return o.name === 'consumption_abnormality_meter_models'
          }),
        })
        message.success(`修改${this.state.consumption_abnormality_meter_models.display_name}成功`)
      }
    })
  }
  handleRemoveModel=(id)=>{
    const deleteIndex=findIndex(this.state.consumption_abnormality_meter_models.value, function(o) { return o.id ===id; });
    console.log('deleteIndex',deleteIndex)
    if(deleteIndex !== -1){
      const consumption_abnormality_meter_models=this.state.consumption_abnormality_meter_models.value.splice(deleteIndex,1)
      console.log(consumption_abnormality_meter_models)
      console.log(this.state.consumption_abnormality_meter_models.value)
      forEach(this.state.consumption_abnormality_meter_models.value, function(item, index) {
        delete item.name
      });
      request(`/configs`, {
        method: 'PATCH',
        data: {
          consumption_abnormality_meter_models:this.state.consumption_abnormality_meter_models.value
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          this.setState({
            consumption_abnormality_meter_models: find(response.data.data, function (o) {
              return o.name === 'consumption_abnormality_meter_models'
            }),
          })
          message.success(`删除${this.state.consumption_abnormality_meter_models.display_name}成功`)
        }
      })
    }
  }


  handleSubmitSpecial=()=>{
    const formValues = this.specialFormRef.props.form.getFieldsValue();
    console.log(formValues)
    if(!formValues.meter_number.key ){
      message.error(`水表号不能为空`)
      return false
    }
    if(formValues.value === undefined ){
      message.error(`判断值不能为空`)
      return false
    }
    const isExit=find(this.state.consumption_abnormality_special_meters.value, function(o) { return o.number ===formValues.meter_number.key; });
    console.log('isExit',isExit)
    // console.log('...',[...this.state.consumption_abnormality_meter_models.value,{id:formValues.meter_model_id.key,value:formValues.value}]);
    if(!isExit){
      request(`/configs`, {
        method: 'PATCH',
        data: {
          consumption_abnormality_special_meters:[{number:formValues.meter_number.key,value:formValues.value},...this.state.consumption_abnormality_special_meters.value]
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          this.setState({
            specialModal:false,
            consumption_abnormality_special_meters: find(response.data.data, function (o) {
              return o.name === 'consumption_abnormality_special_meters'
            }),

          })
          message.success(`添加${this.state.consumption_abnormality_special_meters.display_name}成功`)
        }
      })
    }else{
      message.error(`该水表规则已经存在`)
      return false
    }
  }

  handleRemoveSpecial=(number)=>{
    const deleteIndex=findIndex(this.state.consumption_abnormality_special_meters.value, function(o) { return o.number ===number; });
    console.log('deleteIndex',deleteIndex)
    if(deleteIndex !== -1){
      const consumption_abnormality_special_meters=this.state.consumption_abnormality_special_meters.value.splice(deleteIndex,1)
      console.log(consumption_abnormality_special_meters)
      console.log(this.state.consumption_abnormality_special_meters.value)
      request(`/configs`, {
        method: 'PATCH',
        data: {
          consumption_abnormality_special_meters:this.state.consumption_abnormality_special_meters.value
        }
      }).then((response)=> {
        console.log(response);
        if(response.status===200){
          this.setState({
            consumption_abnormality_special_meters: find(response.data.data, function (o) {
              return o.name === 'consumption_abnormality_special_meters'
            }),
          })
          message.success(`删除${this.state.consumption_abnormality_special_meters.display_name}成功`)
        }
      })
    }
  }
  handleSubmitEditSpecial=()=>{
    const formValues = this.specialEditFormRef.props.form.getFieldsValue();
    if(formValues.value === undefined ){
      message.error(`判断值不能为空`)
      return false
    }
    const that=this;
    const editIndex=findIndex(this.state.consumption_abnormality_special_meters.value, function(o) { return o.number ===that.state.editSpecialRecord.number; });
    console.log('editIndex',editIndex)
    this.state.consumption_abnormality_special_meters.value[editIndex].value=formValues.value;

    forEach(this.state.consumption_abnormality_special_meters.value, function(item, index) {
      delete item.name
    });
    request(`/configs`, {
      method: 'PATCH',
      data: {
        consumption_abnormality_special_meters:this.state.consumption_abnormality_special_meters.value
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        this.setState({
          editSpecialModal:false,
          consumption_abnormality_special_meters: find(response.data.data, function (o) {
            return o.name === 'consumption_abnormality_special_meters'
          }),
        })
        message.success(`修改${this.state.consumption_abnormality_special_meters.display_name}成功`)
      }
    })
  }
  render() {
    const {meter_models}=this.props
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      }
    };
    const {getFieldDecorator,} = this.props.form;
    const that=this;
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '用水量异常报警设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs defaultActiveKey="1" className="system-tabs" >
                  <TabPane tab={this.state.consumption_abnormality_normal_meter_value.display_name} key="1">
                    <Form style={{maxWidth: '500px', margin: '0 auto'}} onSubmit={this.handleSubmit}>
                      <FormItem
                        {...formItemLayoutWithLabel}
                        label={this.state.consumption_abnormality_is_open.display_name}

                      >
                        {getFieldDecorator('consumption_abnormality_is_open', {valuePropName: 'checked'})(
                          <Switch />
                        )}
                      </FormItem>
                      <FormItem
                        label={this.state.consumption_abnormality_normal_meter_value.display_name}
                        {...formItemLayoutWithLabel}
                      >
                        {getFieldDecorator('consumption_abnormality_normal_meter_value', {})(
                          <Input />
                        )}
                      </FormItem>
                      <FormItem
                        wrapperCol={ {
                          offset: 10,
                        }}>
                        <Button onClick={this.handleFormReset} >重置</Button>
                        <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSubmit}  >确定</Button>
                      </FormItem>
                    </Form>
                  </TabPane>
                  <TabPane tab={this.state.consumption_abnormality_meter_models.display_name} key="2">
                    <div>
                      <div style={{margin:'0 0 16px 12px'}}>
                        <Button onClick={() =>{
                          this.setState({
                            modelModal:true
                          })
                        }} type="primary" >
                          <Icon type="plus" /> 添加水表类型异常规则
                        </Button>
                      </div>
                      <List
                        style={{height:this.state.tableY,overflow:'auto'}}
                        rowKey="id"
                        grid={{gutter: 24, xl: 4,lg: 3, md: 2, sm: 2, xs: 1}}
                        dataSource={this.state.consumption_abnormality_meter_models.value?this.state.consumption_abnormality_meter_models.value:[]}
                        renderItem={(item, index)=> (
                            <List.Item key={item.id}>
                              <div>
                                <table className="custom-table">
                                  <tbody>
                                  <tr>
                                    <td>水表类型</td>
                                    <td>{item.name}
                                      <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                                  onConfirm={()=>this.handleRemoveModel(item.id)}>
                                        <Button style={{float:'right'}} size="small" type="danger">删除</Button>
                                      </Popconfirm>
                                     </td>
                                  </tr>
                                  <tr>
                                    <td>异常值</td>
                                    <td>{item.value} <Button size="small"  style={{float:'right'}} onClick={()=>{
                                      this.setState({
                                        editModelRecord:item,
                                        editModelModal:true
                                      })
                                    }}>修改</Button></td>
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                            </List.Item>
                        )}
                      />
                    </div>
                  </TabPane>
                  <TabPane  tab={this.state.consumption_abnormality_special_meters.display_name} key="3">
                    <div style={{margin:'0 0 16px 12px'}}>
                      <Input placeholder="水表号" style={{width:'150px',marginRight:'10px'}} onChange={(e)=>{
                        this.setState({
                          searchInputValue:e.target.value
                        })
                      }} value={this.state.searchInputValue}/>
                      <Button style={{marginRight:'10px'}} onClick={()=>{
                        this.setState({
                          searchSpecialValue:this.state.searchInputValue
                        })
                      }} type="primary" >
                         确定
                      </Button>
                      <Button style={{marginRight:'10px'}} onClick={()=>{
                        this.setState({
                          searchSpecialValue:'',
                          searchInputValue:''
                        })
                      }}  >
                        重置
                      </Button>
                      <Button onClick={() =>{
                        this.setState({
                          specialModal:true
                        })
                      }} type="primary" >
                        <Icon type="plus" /> 添加特殊水表异常规则
                      </Button>
                    </div>
                    <List
                      style={{height:this.state.tableY,overflow:'auto'}}
                      rowKey="number"
                      grid={{gutter: 24, xl: 4,lg: 3, md: 2, sm: 2, xs: 1}}
                      dataSource={this.state.consumption_abnormality_special_meters.value?filter(this.state.consumption_abnormality_special_meters.value,function (o) {
                        return o.number.indexOf(that.state.searchSpecialValue)>=0
                      }):[]}
                      renderItem={(item, index)=> (
                        <List.Item key={item.id}>
                          <div>
                            <table className="custom-table">
                              <tbody>
                              <tr>
                                <td>水表号</td>
                                <td>{item.number}
                                  <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                                              onConfirm={()=>this.handleRemoveSpecial(item.number)}>
                                    <Button style={{float:'right'}} size="small" type="danger">删除</Button>
                                  </Popconfirm>
                                </td>
                              </tr>
                              <tr>
                                <td>异常值</td>
                                <td>{item.value} <Button size="small"  style={{float:'right'}} onClick={()=>{
                                  this.setState({
                                    editSpecialRecord:item,
                                    editSpecialModal:true
                                  })
                                }}>修改</Button></td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </List.Item>
                      )}
                    />

                  </TabPane>
                </Tabs>
                <Modal
                  title="添加水表类型异常规则"
                  visible={this.state.modelModal}
                  onOk={this.handleSubmitModel}
                  onCancel={() => this.setState({modelModal: false})}
                >
                  <AddOrEditUnusualModels meter_models={meter_models}  wrappedComponentRef={(inst) => this.formRef = inst}/>
                </Modal>
                <Modal
                  key={ Date.parse(new Date())+1}
                  title="修改水表类型异常规则"
                  visible={this.state.editModelModal}
                  onOk={this.handleSubmitEditModel}
                  onCancel={() => this.setState({editModelModal: false,editModelRecord:{}})}
                >
                  <AddOrEditUnusualModels meter_models={meter_models} editModelRecord={this.state.editModelRecord}  wrappedComponentRef={(inst) => this.EditformRef = inst}/>
                </Modal>
                <Modal
                  title="添加特殊水表异常规则"
                  visible={this.state.specialModal}
                  onOk={this.handleSubmitSpecial}
                  onCancel={() => this.setState({specialModal: false})}
                >
                  <AddOrEditUnusualSpecial   wrappedComponentRef={(inst) => this.specialFormRef = inst}/>
                </Modal>
                <Modal
                  key={ Date.parse(new Date())+2}
                  title="修改特殊水表异常规则"
                  visible={this.state.editSpecialModal}
                  onOk={this.handleSubmitEditSpecial}
                  onCancel={() => this.setState({editSpecialModal: false,editSpecialRecord:{}})}
                >
                  <AddOrEditUnusualSpecial editSpecialRecord={this.state.editSpecialRecord}   wrappedComponentRef={(inst) => this.specialEditFormRef = inst}/>
                </Modal>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
