/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Select, Input, TreeSelect, Cascader, Tabs, Row, Col, Modal, Radio, Checkbox, Button, Icon} from 'antd';
import {connect} from 'dva';
import ShowMap from './ShowMap'
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
let uuid = 0;
import {injectIntl} from 'react-intl';
@injectIntl
class AddConcentrator extends Component {
  constructor(props) {
    super(props);
    this.BMap = window.BMap;
    this.findChildPoi = ()=> {
    }
    this.state = {
      mapModal: false,
      point:''
    };
  }

  renderTreeSelect = (data)=> {
    return data.map((item)=> {
      if (item.children) {
        this.renderTreeSelect(item.children)
      }
      item.value = item.id;
      item.label = item.name
      return item
    })
  }
  renderTreeNodes = (data)=> {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
    });
  }
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentKey = node.id;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  onChangeSleepHours = (checkedList) => {
    this.setState({
      checkedList
    });
  }
  add = () => {
    uuid++;
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  remove = (k) => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  showMap = ()=> {
    this.setState({
      mapModal: true
    })
  }
  findChildFunc = (cb)=> {
    this.findChildPoi = cb
  }
  getPoint = ()=> {
    let point = this.findChildPoi();
    const {form}=this.props;
    form.setFieldsValue({latitude_longitude: `${point.lng}/${point.lat}`});
    this.setState({
      point:`${point.lng}/${point.lat}`,
      savePoint:true
    })
    let geoc = new this.BMap.Geocoder();
    geoc.getLocation(point, function (rs) {
      var addComp = rs.addressComponents;
      form.setFieldsValue({install_address: `${addComp.province}${addComp.city}${addComp.district}${addComp.street}${addComp.streetNumber}`});
    });


    this.setState({
      mapModal: false
    })
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 17, offset: 7},
      },
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // if(this.props.editRecord){
    //   const village_id=this.getParentKey(this.props.editRecord.village_id,this.props.area);
    //   console.log('village_id',village_id)
    // }
    getFieldDecorator('keys', {initialValue: [uuid]});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const layout = index === 0 ? formItemLayoutWithLabel : formItemLayoutWithOutLabel;
      return (
        <FormItem
          {...layout}
          label={index === 0 ?  formatMessage({id: 'intl.village_name'}) : ''}
          required={false}
          key={k}>
          {getFieldDecorator(`villages-${k}`, {
            initialValue: [],
          })(<VillageCascader area={this.props.area}/>)}
          <Icon
            className="concentrator-cascader-del-btn"
            type="minus-circle-o"
            title={ formatMessage({id: 'intl.delete'})}
            onClick={() => this.remove(k)}
          />
        </FormItem>
      );
    });
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label={ formatMessage({id: 'intl.server_address'})}
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('server_id', {
              initialValue: this.props.editRecord ? {
                key: this.props.editRecord.server_id,
                label: this.props.editRecord.server_ip
              } : {key: '', label: ''},
              //rules: [{required: true, message: '服务器地址为空'}],
            })(
              <Select labelInValue={true} allowClear={true}>
                { this.props.servers.map(item => <Option key={item.id}
                                                         value={item.id}>{item.ip + ':' + item.port}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem
            label={ formatMessage({id: 'intl.concentrator_type'})}
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('concentrator_model_id', {
              initialValue: this.props.editRecord ? {
                key: this.props.editRecord.concentrator_model_id,
                label: this.props.editRecord.concentrator_model_name
              } : {key: '', label: ''},
              rules: [{required: true, message:  formatMessage({id: 'intl.concentrator_type'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
            })(
              <Select labelInValue={true} disabled={this.props.editRecord ? true : false}>
                { this.props.concentrator_models.map(item => <Option key={item.id}
                                                                     value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                { formatMessage({id: 'intl.concentrator_number'})}
            </span>
            )}
          >
            {getFieldDecorator('number', {
              initialValue: this.props.editRecord ? this.props.editRecord.number : '',
              rules: [{required: true, message: formatMessage({id: 'intl.concentrator_number'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
            })(
              <Input disabled={this.props.editRecord ? true : false}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             { formatMessage({id: 'intl.serial_number'})}
            </span>
            )}
          >
            {getFieldDecorator('serial_number', {
              initialValue: this.props.editRecord ? this.props.editRecord.serial_number : '',
              rules: [{required: true, message: formatMessage({id: 'intl.serial_number'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
            })(
              <Input disabled={this.props.editRecord ? true : false}/>
            )}
          </FormItem>
          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button onClick={this.add} style={{width: '60%'}}>
              <Icon type="plus"/> { formatMessage({id: 'intl.add'})}
            </Button>
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
             { formatMessage({id: 'intl.sim_number'})}
            </span>
            )}
          >
            {getFieldDecorator('sim_number', {
              initialValue: this.props.editRecord ? this.props.editRecord.sim_number : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                 { formatMessage({id: 'intl.sim_operator'})}
            </span>
            )}
          >
            {getFieldDecorator('sim_operator', {
              initialValue: this.props.editRecord ? this.props.editRecord.sim_operator : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                 { formatMessage({id: 'intl.install_address'})}
            </span>
            )}
          >
            {getFieldDecorator('install_address', {
              initialValue: this.props.editRecord ? this.props.editRecord.install_address : '',
            })(
              <Input style={{width: '70%'}}/>
            )}
            <Button type="primary" onClick={this.showMap}> { formatMessage({id: 'intl.manual_selection'})}</Button>
          </FormItem>
          {getFieldDecorator('latitude_longitude', {})(
            <div>
              <Input type={'hidden'}/>
            </div>
          )}
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
               { formatMessage({id: 'intl.is_count'})}
            </span>
            )}>
            {getFieldDecorator('is_count', {
              initialValue: this.props.editRecord ? {
                key: this.props.editRecord.is_count.toString(),
                label: this.props.editRecord.is_count === 1 ?formatMessage({id: 'intl.yes'})  : formatMessage({id: 'intl.no'})
              } : {key: '1', label:formatMessage({id: 'intl.yes'})},
            })(
              <Select labelInValue={true}>
                { [{key: 1, label: formatMessage({id: 'intl.yes'})}, {key: -1, label: formatMessage({id: 'intl.no'})}].map((item, key) => {
                  return (
                    <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                  )
                }) }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              { formatMessage({id: 'intl.remark'})}
            </span>
            )}
          >
            {getFieldDecorator('remark', {
              initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
            })(
              <Input />
            )}
          </FormItem>
          {
            this.props.editRecord ? null :
              <FormItem
                style={{color: 'red'}}
                label={ formatMessage({id: 'intl.prompt'})}
                {...formItemLayoutWithLabel}>
                <div>{ formatMessage({id: 'intl.concentrator_tip'})}</div>
              </FormItem>
          }

        </Form>
        <Modal
          style={{ top: 20 }}
          width="80%"
          title={ formatMessage({id: 'intl.drag_the_red_dot'})}
          visible={this.state.mapModal}
          onOk={this.getPoint}
          onCancel={() => this.setState({mapModal: false,point:''})}
        >
          <ShowMap point={this.state.point} savePoint={this.state.savePoint} findChildFunc={this.findChildFunc}/>
        </Modal>

      </div>
    );
  }
}

class VillageCascader extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      village: value || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleCurrencyChange = (village) => {
    if (!('value' in this.props)) {
      this.setState({village});
    }
    this.triggerChange({village});
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  renderTreeSelect = (data)=> {
    return data.map((item)=> {
      if (item.children) {
        this.renderTreeSelect(item.children)
      }
      item.value = item.id;
      item.label = item.name
      return item
    })
  }

  render() {
    const {size} = this.props;
    const state = this.state;
    return (
      <span>
         <Cascader className="concentrator-cascader" options={this.renderTreeSelect(this.props.area)}
                   value={state.village} onChange={this.handleCurrencyChange}
         />
      </span>
    );
  }
}

const AddConcentratorFormWrap = Form.create()(AddConcentrator);
export default connect()(AddConcentratorFormWrap);
