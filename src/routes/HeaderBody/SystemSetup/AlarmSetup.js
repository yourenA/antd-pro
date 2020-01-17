/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Tabs, Layout, Card, Button, Radio, message, Table, Popconfirm,Modal,Icon} from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import request from "./../../../utils/request";
import find from "lodash/find";
import moment from 'moment'

const TabPane = Tabs.TabPane;
const {Content} = Layout;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {injectIntl} from 'react-intl';
import AddOrEditForm from "./addOrEditPhone";
@connect(state => ({
  concentrator_errors: state.concentrator_errors,
  manufacturers: state.manufacturers,
  servers: state.servers,
}))
@injectIntl
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      disabled: false,
      data: [],
      error_upload_alarm_level: {},
      missing_upload_alarm_level: {},
      tableY:0
    }
  }

  componentDidMount() {
    const that = this;

    this.handleSearch()
  }
  handleSearch = (values,cb,fetchAndPush=false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:fetchAndPush?'concentrator_errors/fetchAndPush': 'concentrator_errors/fetch',
      payload: {
        started_at:'2019-12-12',
        ended_at:'2020-01-15',
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
      },
      callback: function () {
        that.setState({
          ...values,
        })
        that.changeTableY();
        if(!fetchAndPush){
          that.setState({
            initPage:values.page
          })
        }
        if(cb) cb()
      }
    });

  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (230)
    })
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'meters/remove',
      payload: {
        id: id,
      },
      callback: function () {
      }
    })
  }
  render() {
    console.log('this.state.tableY',this.state.tableY)
    const {intl: {formatMessage}} = this.props;
    const {concentrator_errors: {data, meta, loading}, manufacturers,servers} = this.props;
    const {getFieldDecorator,} = this.props.form;
    const columns = [
      {
        title: '手机号',
        dataIndex: 'concentrator_number',
        key: 'concentrator_number',
        width: 150,
        render:(text)=>{
          return <p><Icon type="mail" style={{marginRight:'4px'}}  theme="twoTone"/>{text}</p>
        }
      },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render:(text,record,index)=>{
          return   <Popconfirm placement="topRight"  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                               onConfirm={()=>this.handleRemove(record.id)}>
            <Button type={'danger'} icon={'delete'} size={'small'}>{formatMessage({id: 'intl.delete'})}</Button>
          </Popconfirm>
        }
      },]
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.system_setting'})},
              {name: '手机报警'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs defaultActiveKey="1" className="system-tabs alarm-tabs">
                  <TabPane tab={'短信报警'} key="1">
                    <Button style={{marginBottom:'10px'}} type={'primary'} onClick={()=>{
                      this.setState({
                        addModal:true
                      })
                    }}>添加手机号</Button>
                    <div style={{width: '300px'}}>
                      <Table
                        className={'meter-table'}
                        size="small"
                        pagination={false}
                             dataSource={data} loading={loading} columns={columns} rowKey={record => record.concentrator_number}
                             scroll={{x: true, y: this.state.tableY}}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab={'微信报警'} key="2">
                  </TabPane>
                </Tabs>
              </Card>
              <Modal
                title={'添加手机号'}
                visible={this.state.addModal}
                onOk={this.handleSubmitSpecial}
                onCancel={() => this.setState({addModal: false})}
              >
                <AddOrEditForm wrappedComponentRef={(inst) => this.addFormRef = inst}/>
              </Modal>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>

    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
