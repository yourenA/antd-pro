import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip, Row, Col, Input} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, renderIndex2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import Pagination from './../../../components/Pagination/Index'
import AddOrEditForm from './addOrEditArea'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
import 'react-sortable-tree/style.css';

import SortableTree, {
  toggleExpandedForAll,
  getFlatDataFromTree,
  removeNodeAtPath,
  addNodeUnderParent,
  changeNodeAtPath
} from 'react-sortable-tree';
const {Content} = Layout;
@connect(state => ({
  relations: state.relations,
  global: state.global,
}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtn: find(this.permissions, {name: 'attrition_rate_analysis'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'attrition_rate_analysis'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage: 1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll: true,
      canOperate: localStorage.getItem('canOperateArea') === 'true' ? true : false,
      expandedRowKeys: [],
      otherMeterValue: '0',
      forwardsMeterValue: '0',
      key: uuid(),
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [],
      hadEdit: false

      // concentrator_number:''
    }
  }

  componentDidMount() {
    this.handleSearch()
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }

  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.sort-content').offsetTop - (68 + 54 + 50)
    })
  }


  handleSearch = (values, saveInput) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys: []
    })
    if (!saveInput) {
      this.setState({
        key: uuid()
      })
    }
    dispatch({
      type: 'relations/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        const {relations: {data}} = that.props;
        that.setState({
          treeData: that.parseTree(data),
          ...values,
        })
        that.changeTableY()
      }
    });
  }
  parseTree = (data)=> {
    for (var i in data) {
      data[i].title = data[i].name;
      data[i].expanded = true
      data[i].subtitle = data[i].meter_number;
      if (data[i].children) {
        this.parseTree(data[i].children)
      }
    }
    return data
  }
  flatten = (data) => {
    return data.reduce((arr, {subtitle, children = []}) =>
      arr.concat([{subtitle}], this.flatten(children)), [])
  }
  removeNode = (rowInfo)=> {
    const {node, path, treeIndex} = rowInfo;
    console.log('node', node)
    const that = this
    const newTree = removeNodeAtPath({
      treeData: this.state.treeData,
      path,
      getNodeKey: ({treeIndex}) => treeIndex,
    });
    that.setState({
      hadEdit: true,
      treeData: newTree
    });
  }
  addNewNode = async ()=> {
    const that = this;
    let formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues 1', formValues);
    const exist = this.flatten(this.state.treeData)
    let addNodes =formValues.meter_number
    if(!addNodes){
      message.error('请选择水表')
      return false
    }
  /*  for (let k in formValues) {
      if (k.indexOf('meter_number$') >= 0) {
        if (formValues.hasOwnProperty(k)) {
          const meter_number = formValues[k]
          if (meter_number === '') {
            message.error('请选择水表')
            return false
          } else {
            for (let i = 0; i < exist.length; i++) {
              if (meter_number.split('@')[0] == exist[i].subtitle) {
                message.error(`${meter_number.split('@')[1]} 已存在在关系中`)
                return false
              }
            }
          }
          addNodes.push(meter_number)
        }
      }
    }*/
    for (let i = 0; i < exist.length; i++) {
      for (let j = 0; j < addNodes.length; j++) {
        if (addNodes[j].split('@')[0] == exist[i].subtitle) {
          message.error(`${addNodes[j].split('@')[1]} 已存在在关系中`)
          return false
        }
      }
    }

    let newTree = []

    if (this.state.rowInfo) {
      const {node, path, treeIndex} = this.state.rowInfo;
      for (let i = 0; i < addNodes.length; i++) {
        const NEW_NODE = {
          title: addNodes[i].split('@')[1], subtitle: addNodes[i].split('@')[0], expanded: true,
          meter_number: addNodes[i].split('@')[0],
        };
        newTree=await addNodeUnderParent({
          treeData: this.state.treeData,
          newNode: NEW_NODE,
          expandParent: true,
          parentKey: this.state.rowInfo ? treeIndex : undefined,
          getNodeKey: ({treeIndex}) => treeIndex,
        }).treeData;
        this.setState({treeData: newTree})
      }

    } else {
      for (let i = 0; i < addNodes.length; i++) {
        newTree.push({
          title: addNodes[i].split('@')[1],
          subtitle: addNodes[i].split('@')[0],
          expanded: true,
          meter_number: addNodes[i].split('@')[0]
        })
      }
      newTree=[
        ...newTree,
        ...this.state.treeData
      ]
      this.setState({treeData: newTree})
    }


    this.setState({hadEdit: true, rowInfo: null, addModal: false});
  }
  changeNode = ()=> {
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    if (!formValues.name) {
      message.error('请输入完整信息')
      return false
    }
    let newTree = []
    const {node, path, treeIndex} = this.state.rowInfo;
    const NEW_NODE = {title: formValues.name, subtitle: node.meter_number, expanded: node.expanded, ...formValues};
    newTree = changeNodeAtPath({
      treeData: this.state.treeData,
      path,
      newNode: NEW_NODE,
      getNodeKey: ({treeIndex}) => treeIndex,
    });
    console.log('newTree', newTree)
    this.setState({treeData: newTree, hadEdit: true, rowInfo: null, editModal: false});
  }
  toggleNodeExpansion = expanded => {
    this.setState(prevState => ({
      treeData: toggleExpandedForAll({
        treeData: prevState.treeData,
        expanded,
      }),
    }));
  };
  handleSearchOnChange = e => {
    this.setState({
      searchString: e.target.value,
    });
  };
  saveTree = ()=> {
    const that = this;
    this.props.dispatch({
      type: 'relations/add',
      payload: {
        relations: this.state.treeData
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success('保存成功')
        that.setState({
          addModal: false,
          rowInfo: null,
          hadEdit: false
        });
      }
    });
  }

  render() {
    const {relations: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Sider/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析"
                              breadcrumb={[{name: formatMessage({id: 'intl.device'})}, {name: formatMessage({id: 'intl.meter_relations'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>

                <div className="sort-content" style={{
                  height: this.state.tableY,
                  border: '3px dashed #d9d9d9',
                  marginTop: '5px',
                  background: this.state.hadEdit ? '#fce4d6' : '#e2efda'
                }}>
                  <div className='tableList'>
                    <div className='tableListForm'
                         style={{padding: '10px ', borderBottom: '3px dashed #d9d9d9', marginBottom: '0',}}>
                      <Button type="primary" style={{marginRight: '5px'}}
                              onClick={() => {
                                this.setState({
                                  addModal: true
                                })
                              }}
                      >
                        添加主表
                      </Button>
                      <Button style={{marginRight: '5px'}} onClick={()=>this.toggleNodeExpansion(true)}>
                        展开全部
                      </Button>
                      <Button
                        style={{marginRight: '5px'}}
                        onClick={()=>this.toggleNodeExpansion(false)}
                      >
                        收起全部
                      </Button>
                      <label>搜索: </label>
                      <Input onChange={this.handleSearchOnChange} style={{width: 150}}/>
                      {
                        this.state.hadEdit &&
                        <Button
                          type="primary"
                          style={{float: 'right'}}
                          onClick={this.saveTree}
                        >
                          保存
                        </Button>
                      }
                    </div>
                  </div>
                  <div style={{height: this.state.tableY - 61,}}>
                    <SortableTree
                      treeData={this.state.treeData}
                      onChange={treeData => {
                        this.setState({treeData, hadEdit: true})
                      } }
                      searchQuery={this.state.searchString}
                      searchFocusOffset={this.state.searchFocusIndex}
                      generateNodeProps={rowInfo => ({
                        buttons: [<Button
                          size="small"
                          type="primary"
                          style={{marginRight: '5px'}}
                          onClick={() => {
                            this.setState({rowInfo: rowInfo, addModal: true})
                          }}
                        >
                          添加子节点
                        </Button>,
                          <Popconfirm placement="topRight"
                                      title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                                      onConfirm={()=>this.removeNode(rowInfo)}>
                            <Button
                              size="small"
                              type="danger"
                            >
                              删除节点
                            </Button>
                          </Popconfirm>
                        ],
                      })}
                      // canDrag={false}
                    />
                  </div>

                </div>
              </Card>
            </PageHeaderLayout>
            <Modal
              destroyOnClose={true}
              title={formatMessage({id: 'intl.add'})}
              visible={this.state.addModal}
              onOk={this.addNewNode}
              onCancel={() => this.setState({addModal: false})}
            >
              <AddOrEditForm wrappedComponentRef={(inst) => this.formRef = inst}/>
            </Modal>
            <Modal
              destroyOnClose={true}
              title={formatMessage({id: 'intl.edit'})}
              visible={this.state.editModal}
              onOk={this.changeNode}
              onCancel={() => this.setState({editModal: false})}
            >
              <AddOrEditForm editRecord={this.state.editRecord}
                             wrappedComponentRef={(inst) => this.editFormRef = inst}/>
            </Modal>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
