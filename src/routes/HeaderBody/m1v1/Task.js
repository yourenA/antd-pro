/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Badge,  Radio, Select,Table,Popconfirm,Button,Modal,message   } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
import {ellipsis2} from "../../../utils/utils";
import AddTask from "./addTask";
import moment from 'moment'
@connect(state => ({
  workstations: state.workstations,
  manufacturers: state.manufacturers,
}))
@injectIntl
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleAdd = () => {
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'workstations/addTask',
      payload: {
        imei: this.props.editRecord.imei,
        channel: formValues.channel,
        time: moment(formValues.time).format('HH:mm'),
        task: formValues.task==='open_valve_tasks'?'open_valve_tasks':'close_valve_tasks'
      },
      callback: function () {
        const {intl: {formatMessage}} = that.props;
        message.success('添加定时任务成功')
        that.setState({
          addModal: false,
        });
        that.props.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
        that.props.hideModal()
      }
    });

  }
  handleRemove = (id) => {
    const that = this;
    this.props.dispatch({
      type: 'workstations/removeTask',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl: {formatMessage}} = that.props;
        message.success('删除成功')
        that.props.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
        that.props.hideModal()
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;

    const {getFieldDecorator} = this.props.form;
    const columns = [
      {
        title: '通道号', dataIndex: 'channel', key: 'channel', render: (text, record, index) => {
          return `通道${text+1}`
        }
      },
      {
        title: '时间', dataIndex: 'time', key: 'time'
      },


      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (val, record, index) => (
          <p>
            <Badge status={val === 'open_valve' ? "success" : "error"}/>{val === 'open_valve' ? "自动开阀" : "自动关阀"}

          </p>
        )
      },
      {
        title: formatMessage({id: 'intl.operate'}),
        render: (val, record, index) => (
          <p>
            <Popconfirm placement="topRight"
                        title={formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                        onConfirm={() => this.handleRemove(record.id)}>
              <a href="">{formatMessage({id: 'intl.delete'})}</a>
            </Popconfirm>

          </p>
        ),
      }
    ];
    return (
      <div>
        <Button onClick={()=>{
          this.setState({
            addModal:true
          })
        }} icon={'plus'} type={'primary'} style={{marginBottom:'10px'}}>添加定时任务</Button>
        <Table
          columns={columns}
          dataSource={this.props.editRecord.timed_tasks}
          pagination={false}
          bordered
        />
        <Modal
          width={600}
          title={'添加定时任务'}
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false})}
        >
          <AddTask wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
