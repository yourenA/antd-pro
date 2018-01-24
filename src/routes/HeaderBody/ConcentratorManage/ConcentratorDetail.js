import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Button, Layout, message, Modal} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import DetailSearch from './DetailSearch'
import AddConcentrator from './AddOrEditConcentrator'
import Sider from './../Sider'
import {connect} from 'dva';
import Detail from './Detail'
import moment from 'moment'
import './index.less'
const {Content} = Layout;
@connect(state => ({
  concentrator_water: state.concentrator_water,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      meter_number: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      area: '',
      showArea: true
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    this.handleSearch({
      page: 1,
      meter_number: '',
    })
  }

  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrator_water/fetch',
      payload: {
        ...values,
        id:this.props.concentratorId
      },
    });

    this.setState({
      meter_number: values.meter_number,
      page: values.page,
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
    })
  }


  render() {
    const {concentrator_water: {data, meta, loading}} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        fixed: 'left',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '水表号', width: '20%', dataIndex: 'meter_number', key: 'meter_number'},
      {title: '水表类型', dataIndex: 'meter_model_name', key: 'meter_model_name', width:  '20%', },
      {title: '用户名称', dataIndex: 'real_name', key: 'real_name', width:  '20%',},
      {title: '小区名称', dataIndex: 'village_name', key: 'village_name', width: '20%',},
      {title: '安装地址', dataIndex: 'install_address', key: 'install_address',},
    ];
    return (

      <div>
        <div className='tableList'>
          <div className='tableListForm'>
            <DetailSearch wrappedComponentRef={(inst) => this.formRef = inst}
                          onBack={this.props.handleBack}
                          handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                          initRange={this.state.initRange}/>
          </div>
        </div>
        <Table
          key={ Date.parse(new Date()) + 1}
          rowClassName={function (record, index) {
            if (record.description === '') {
              return 'error'
            }
          }}
          className='meter-table'
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          scroll={{ y: this.state.tableY}}
          pagination={false}
          size="small"
        />
        <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                    current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                    style={{marginTop: '10px'}} onChange={this.handPageChange}/>
        <Modal
          title="添加集中器"
          visible={this.state.addModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({addModal: false})}
        >
          <AddConcentrator />
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="集中器指令:集中器编号"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <Detail />
        </Modal>
      </div>


    );
  }
}

export default UserMeterAnalysis
