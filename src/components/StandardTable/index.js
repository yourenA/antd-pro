import React, {PureComponent} from 'react';
import moment from 'moment';
import {Table, Alert, Pagination, Popconfirm} from 'antd';
import styles from './index.less';
import { Link } from 'dva/router';
const statusMap = ['default', 'processing', 'success', 'error'];
class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({selectedRowKeys, totalCallNo});
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const {selectedRowKeys, totalCallNo} = this.state;
    const {data, loading} = this.props;
    const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: '实例名称',
        dataIndex: 'name',
        render:  (val, record, index)  => {
          return (
            <Link to={`/access-management/matter-access-management/${record.id}`}>
              {val}
            </Link>
          )
        }
      },
      {
        title: '描述',
        dataIndex: 'description',
        render: val => {
          return (
            <div style={{ width: '150px' }}>
              {val}
            </div>
          )
        }
      },
      {
        title: '地址',
        dataIndex: 'ip',
        render: val => {
          let ip = val.split('|');
          let ipList = ip.map((item, index)=> {
            return (
              <p key={index}>{item}</p>
            )
          })
          return ipList
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createAt',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (val, record, index) => (
          <p>
            <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                        onConfirm={()=>this.props.handleRemove(record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          </p>
        ),
      },
    ];

    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   ...pagination,
    // };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <p>
                已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>清空</a>
              </p>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
        />
        {/*        <Pagination   showSizeChanger={true}
         showQuickJumper={true}  total={pagination.total} current={pagination.current}
         style={{marginTop: '10px',float:'right'}} onChange={this.onPageChange}/>*/}
      </div>
    );
  }
}

export default StandardTable;
