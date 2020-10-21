/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input ,InputNumber,Radio,TreeSelect,Select,Collapse,Button,message,Tooltip,Icon} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Panel = Collapse.Panel;
let uuid=1
import {injectIntl} from 'react-intl';
@injectIntl
class EditUserArchives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meterArr:[uuid],
      meterActiveKey:['1']
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
  addMeter=()=>{
    uuid++;
    this.state.meterArr.push(uuid)
    this.state.meterActiveKey.push(uuid.toString())
    this.setState({
      meterArr:this.state.meterArr,
      meterActiveKey:this.state.meterActiveKey
    })
  }
  deleteMeter=(item)=>{
    console.log('删除的item',item)
    if(this.state.meterArr.length===1){
      console.log('只有一个水表')
      // message.error('至少需要一个水表')
      // return false
    }
    const index=this.state.meterArr.indexOf(item);
    console.log('index',index)
    this.state.meterArr.splice(index, 1);
    this.setState({
      meterArr:this.state.meterArr
    })
  }
  changeMeterPanel=(keys)=>{
    console.log('keys',keys)
    this.setState({
      meterActiveKey:keys
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
        sm: {span: 16},
      }
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {sider_regions:{data}}=this.props;
    const company_code = sessionStorage.getItem('company_code');

    const meterForms=this.state.meterArr.map((item,index)=>{
      return (
        <Panel showArrow={false}
               header={<div>{formatMessage({id: 'intl.meter'})}-{index+1}  <Button onClick={(e)=>{e.stopPropagation();this.deleteMeter(item)}}
               size="small" style={{float:'right',marginRight:'10px'}} type="danger">{formatMessage({id: 'intl.delete'})}</Button>  </div>}
               key={item.toString()} >
          <Form key={index}>
            <FormItem
              style={{width:'33%',display:'inline-block'}}
              label={formatMessage({id: 'intl.water_meter_number'})}
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator(`meter_number-${item}`, {
                initialValue: '',
                rules: [{required: true, message:  formatMessage({id: 'intl.water_meter_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label={formatMessage({id: 'intl.water_meter_type'})}
              style={{width:'33%',display:'inline-block'}}
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator(`meter_model_id-${item}`, {
                initialValue: '',
                rules: [{required: true, message:  formatMessage({id: 'intl.water_meter_type'})+formatMessage({id: 'intl.can_not_be_empty'})}],
              })(
                <Select >
                  { this.props.meter_models.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              style={{width:'33%',display:'inline-block'}}
              label={(
                <span>
              {formatMessage({id: 'intl.water_meter_index'})}
            </span>
              )}
            >
              {getFieldDecorator(`meter_index-${item}`, {
                rules: [{required: true, message:  formatMessage({id: 'intl.water_meter_index'})+formatMessage({id: 'intl.can_not_be_empty'})}],
                initialValue: '',
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem
              style={{width:'33%',display:'inline-block'}}
              {...formItemLayoutWithLabel}
              label={(
                <span>
              {formatMessage({id: 'intl.initial_value'})}
            </span>
              )}
            >
              {getFieldDecorator(`initial_water-${item}`, {
                initialValue:  '0.00',
              })(
                <InputNumber />
              )}
            </FormItem>


            <FormItem
              style={{width:'33%',display:'inline-block'}}
              label={formatMessage({id: 'intl.vendor_code'})}
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator(`manufacturer_prefix-${item}`, {
                initialValue: '',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              style={{width:'33%',display:'inline-block'}}
              label={formatMessage({id: 'intl.concentrator_number'})}
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator(`concentrator_number-${item}`, {
                initialValue: '',
                rules: [{required: true, message:  formatMessage({id: 'intl.concentrator_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],
              })(
                <Input  />
              )}
            </FormItem>
            <FormItem
              label={formatMessage({id: 'intl.channel'})}
              style={{width:'33%',display:'inline-block'}}
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator(`channel-${item}`, {
                initialValue: '1',
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem
              label={'IMEI'}
              style={{width:'33%',display:'inline-block'}}
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator(`imei-${item}`, {
                initialValue: '',
              })(
                <Input />
              )}
            </FormItem>
            {
              (company_code==='hy')&&
              <FormItem
                style={{width:'33%',display:'inline-block'}}
                {...formItemLayoutWithLabel}
                label={(
                  <span>
              排序号 <Tooltip title="请输入数字或'N','N'表示不指定排序">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                )}
              >
                {getFieldDecorator(`sort_number-${item}`, {
                })(
                  <Input />
                )}
              </FormItem>
            }

          </Form>
        </Panel>
      )
    })
    return (
      <div>

        <Collapse activeKey={['1','2']} >
          <Panel header={formatMessage({id: 'intl.base_info'})} key="1" showArrow={false}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                style={{width:'33%',display:'inline-block'}}
                label={formatMessage({id: 'intl.user_number'})}
                {...formItemLayoutWithLabel}
              >
                {getFieldDecorator('number', {
                  initialValue: '',
                  rules: [{required: true, message:  formatMessage({id: 'intl.user_number'})+formatMessage({id: 'intl.can_not_be_empty'})}],

                })(
                  <Input  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayoutWithLabel}
                style={{width:'33%',display:'inline-block'}}
                label={(
                  <span>
              {formatMessage({id: 'intl.village_name'})}
            </span>
                )}>
                {getFieldDecorator('village_id', {
                  initialValue: '',
                  rules: [{required: true, message:  formatMessage({id: 'intl.village_name'})+formatMessage({id: 'intl.can_not_be_empty'})}],
                })(
                  <TreeSelect
                    treeDefaultExpandAll={true}
                  >
                    {this.renderTreeNodes(data)}
                  </TreeSelect>
                )}
              </FormItem>
              {
                company_code==='hy'&&
                <FormItem
                  style={{width:'33%',display:'inline-block'}}
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
              {/* {this.props.editRecord ?null: <FormItem
               style={{width:'33%',display:'inline-block'}}
               label="台区"
               {...formItemLayoutWithLabel}
               >
               {getFieldDecorator('distribution_area', {
               initialValue: this.props.editRecord ? this.props.editRecord.distribution_area : '',
               rules: [{required: true, message: '台区不能为空'}],
               })(
               <Input />
               )}
               </FormItem>}
               {this.props.editRecord ?null: <FormItem
               style={{width:'33%',display:'inline-block'}}
               label="表册"
               {...formItemLayoutWithLabel}
               >
               {getFieldDecorator('statistical_forms', {
               initialValue: this.props.editRecord ? this.props.editRecord.statistical_forms : '',
               rules: [{required: true, message: '表册不能为空'}],
               })(
               <Input />
               )}
               </FormItem>}*/}
              <FormItem
                label={formatMessage({id: 'intl.user_name'})}
                style={{width:'33%',display:'inline-block'}}
                {...formItemLayoutWithLabel}
              >
                {getFieldDecorator('real_name', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayoutWithLabel}
                style={{width:'33%',display:'inline-block'}}
                label={(
                  <span>
              {formatMessage({id: 'intl.install_address'})}
            </span>
                )}
              >
                {getFieldDecorator('address', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>

              <FormItem
                style={{width:'33%',display:'inline-block'}}
                label={formatMessage({id: 'intl.email'})}
                {...formItemLayoutWithLabel}
              >
                {getFieldDecorator('email', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                style={{width:'33%',display:'inline-block'}}
                label={formatMessage({id: 'intl.telephone'})}
                {...formItemLayoutWithLabel}
              >
                {getFieldDecorator('phone', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
              {/*    <FormItem
               {...formItemLayoutWithLabel}
               label={(
               <span>
               安装小区
               </span>
               )}>
               {getFieldDecorator('village_id', {
               rules: [{required: true, message: '安装小区不能为空'}],
               initialValue: this.props.editRecord?this.props.editRecord.village_id:'',
               })(
               <TreeSelect
               treeDefaultExpandAll={true}
               >
               {this.renderTreeNodes(this.props.area)}
               </TreeSelect>
               )}
               </FormItem>*/}
              <FormItem
                label={formatMessage({id: 'intl.id_card'})}
                style={{width:'33%',display:'inline-block'}}
                {...formItemLayoutWithLabel}
              >
                {getFieldDecorator('id_card', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                label={formatMessage({id: 'intl.sex'})}
                style={{width:'33%',display:'inline-block'}}
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
                label={formatMessage({id: 'intl.reader'})}
                style={{width:'33%',display:'inline-block'}}
                {...formItemLayoutWithLabel}
              >
                {getFieldDecorator('reader', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Form>
          </Panel>
          <Panel header={formatMessage({id: 'intl.water_meter_info'})} key="2" showArrow={false}>
            <Collapse activeKey={this.state.meterActiveKey} onChange={this.changeMeterPanel}>
            {meterForms}

            </Collapse>
            <Button type="primary" block onClick={this.addMeter}>{formatMessage({id: 'intl.add'})+formatMessage({id: 'intl.meter'})}</Button>
          </Panel>
        </Collapse>
    </div>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
