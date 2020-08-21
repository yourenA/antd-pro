import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tabs, Row, Col, Input,Tag,DatePicker} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../EmptySider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, renderIndex2,ellipsis2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import Pagination from './../../../components/Pagination/Index'
import AddOrEditForm from './addOrEditArea'
import uuid from 'uuid/v4'
import {disabledDate,getTimeDistance} from './../../../utils/utils'
import {injectIntl} from 'react-intl';
import 'react-sortable-tree/style.css';
const TabPane = Tabs.TabPane;
import SortableTree, {
  toggleExpandedForAll,
  getFlatDataFromTree,
  removeNodeAtPath,
  addNodeUnderParent,
  changeNodeAtPath
} from 'react-sortable-tree';
const ButtonGroup = Button.Group;
const {Content} = Layout;
@connect(state => ({
  relations_analysis: state.relations_analysis,
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
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll: true,
      canOperate: localStorage.getItem('canOperateArea') === 'true' ? true : false,
      rangePickerValue:   [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      expandedRowKeys: [],
      otherMeterValue: '0',
      forwardsMeterValue: '0',
      key: uuid(),
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [],
      tabArr:[],
      // concentrator_number:''
    }
  }

  componentDidMount() {
    this.handleSearch(null,null,true)
  }

  componentWillUnmount() {
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.sort-content').offsetTop - (68 + 54 + 50)
    })
  }


  handleSearch = (values, saveInput,init) => {
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
      type: 'relations_analysis/fetch',
      payload: {
        started_at:that.state.rangePickerValue[0].format("YYYY-MM-DD"),
        ended_at:that.state.rangePickerValue[1].format("YYYY-MM-DD"),
      },
      callback: function () {
        const {relations_analysis: {data}} = that.props;
        that.setState({
          ...values,
        },function () {
          for(let i=0;i<data.length;i++){

            if(init){
              let tabArr=that.state.tabArr;
              tabArr.push({name:data[i].name})
              that.setState({
                tabArr:tabArr,
              })
            }
            that.setState({
              [data[i].name+'treeData']: that.parseTree([data[i]]),
            })
          }
        })

        that.changeTableY()
      }
    });
  }
  parseTree = (data)=> {
    for (var i in data) {
      data[i].title = data[i].name;
      data[i].expanded = data[i].expanded==='1'?true:false;
      data[i].subtitle2 = data[i].meter_number;
      if (data[i].children) {
        this.parseTree(data[i].children)
      }
    }
    return data
  }
  toggleNodeExpansion = expanded => {
    for(let i=0;i<this.state.tabArr.length;i++){
      console.log([this.state.tabArr[i].name+'treeData'])
      this.setState(prevState => {
        console.log(prevState[this.state.tabArr[i].name+'treeData'])
        return {
          [this.state.tabArr[i].name+'treeData']:  toggleExpandedForAll({
            treeData: prevState[this.state.tabArr[i].name+'treeData'],
            expanded,
          })
        }
      })

    }
    // this.setState(prevState => ({
    //   treeData: toggleExpandedForAll({
    //     treeData: prevState.treeData,
    //     expanded,
    //   }),
    // }));
  };
  handleSearchOnChange = e => {
    this.setState({
      searchString: e.target.value,
    });
  };
  isActive(type) {
    const {rangePickerValue} = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return false;
    }
    if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day')) {
      return true;
    }
  }
  handleRangePickerChange = (datePickerValue,type) => {
    const that=this;
    if(type==='start'){
      this.setState({
        rangePickerValue:[datePickerValue,this.state.rangePickerValue[1]],
      },function () {
        that.handleSearch()
      });
    }else{
      this.setState({
        rangePickerValue:[this.state.rangePickerValue[0],datePickerValue],
      },function () {
        that.handleSearch()
      });
    }
  }
  selectDate = (type) => {
    const that=this;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    },function () {
      that.handleSearch()
    });
  }
  render() {
    console.log(this.state)
    const {relations_analysis: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Sider
          />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析"
                              breadcrumb={[{name: formatMessage({id: 'intl.data_analysis'})}, {name: formatMessage({id: 'intl.meter_relations_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>

                <div className="sort-content" >
                  <div className='tableList'>
                    <div className='tableListForm' >
                      <ButtonGroup>
                        <Button  onClick={() => this.selectDate('today')} type={this.isActive('today')?'primary':''}>{formatMessage({id: 'intl.today'})}</Button>
                        <Button  onClick={() => this.selectDate('month')} type={this.isActive('month')?'primary':''}>{formatMessage({id: 'intl.this_month'})}</Button>
                        <Button  onClick={() => this.selectDate('year')} type={this.isActive('year')?'primary':''}>{formatMessage({id: 'intl.this_year'})}</Button>
                      </ButtonGroup>

                      <DatePicker
                        value={this.state.rangePickerValue[0]}
                        allowClear={false}
                        disabledDate={disabledDate}
                        format="YYYY-MM-DD"
                        style={{width: 120}}
                        placeholder={formatMessage({id: 'intl.start'})}
                        onChange={(e)=>this.handleRangePickerChange(e,'start')}
                      />
                      <DatePicker
                        style={{marginRight: '5px',width: 120}}
                        allowClear={false}
                        value={this.state.rangePickerValue[1]}
                        disabledDate={disabledDate}
                        format="YYYY-MM-DD"
                        placeholder={formatMessage({id: 'intl.end'})}
                        onChange={(e)=>this.handleRangePickerChange(e,'end')}
                      />
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
                    </div>
                  </div>
                    <Tabs defaultActiveKey="1" style={{
                      height: this.state.tableY-35,
                      border: '3px dashed #d9d9d9',
                      marginTop: '5px',
                      background: this.state.hadEdit ? '#fce4d6' : '#e2efda'
                    }}>
                      {
                        this.state.tabArr.map((item,index)=>{
                          return   <TabPane tab={item.name}  key={index} >
                            <div style={{
                              height: this.state.tableY-85,
                            }}>
                              <SortableTree
                                treeData={this.state[item.name+'treeData']?this.state[item.name+'treeData']:[]}
                                onChange={treeData => {
                                  this.setState({[item.name+'treeData']:treeData})
                                } }
                                canDrag={false}
                                rowHeight={40}
                                scaffoldBlockPxWidth={34}
                                searchQuery={this.state.searchString}
                                searchFocusOffset={this.state.searchFocusIndex}
                                generateNodeProps={rowInfo => {
                                  let btns=[<Tag
                                    color="#108ee9"
                                    style={{marginRight: '5px',fontSize:'14px'}}
                                  >
                                    用水量 : {rowInfo.node.consumption}
                                  </Tag>,
                                  ];
                                  if(rowInfo.node.children){
                                    btns.push(<Tag
                                      color="#87d068"
                                      style={{marginRight: '5px',fontSize:'14px'}}
                                    >
                                      下属分表用水总量 : {rowInfo.node.child_consumption}
                                    </Tag>,<Tag
                                      color="#f50"
                                      style={{marginRight: '5px',fontSize:'14px'}}
                                    >
                                      损耗量 : {rowInfo.node.attrition_value}
                                    </Tag>,<Tag
                                      color="#f50"
                                      style={{marginRight: '5px',fontSize:'14px'}}
                                    >
                                      损耗率 : {rowInfo.node.attrition_rate}
                                    </Tag>,)
                                  }
                                  return ({
                                    buttons: btns
                                  })
                                }}
                                // canDrag={false}
                              />
                            </div>
                          </TabPane>
                        })
                      }

                      </Tabs>

                </div>
                {/*
                 <Table
                 className='meter-table'
                 loading={loading}
                 rowKey={record => record.meter_number}
                 dataSource={data}
                 columns={columns}
                 scroll={{y: this.state.tableY}}
                 pagination={false}
                 size="small"
                 />
                 */}
                {/*    <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}
                 handPageChange={this.handPageChange}/>*/}
              </Card>
            </PageHeaderLayout>
            <Modal
              destroyOnClose={true}
              title={formatMessage({id: 'intl.add'})}
              visible={this.state.addModal}
              onOk={this.handleAdd}
              onCancel={() => this.setState({addModal: false})}
            >
              <AddOrEditForm wrappedComponentRef={(inst) => this.formRef = inst}/>
            </Modal>
            <Modal
              destroyOnClose={true}
              title={formatMessage({id: 'intl.edit'})}
              visible={this.state.editModal}
              onOk={this.handleEdit}
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