import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Button, Layout, message,Tabs} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../../../components/DefaultSearch/index'
import Sider from './Sider'
import {connect} from 'dva';
import moment from 'moment';
import find from 'lodash/find';
import './index.less'
const {Content} = Layout;
const TabPane = Tabs.TabPane;
@connect(state => ({
  endpoints: state.endpoints,
}))
class CommunityAnalysis extends PureComponent {
  constructor(props) {
    super(props);

    const panes = [
      {title: '心跳函数', key: 'heartbeat',content:'123'}
    ];
    this.state = {
      activeKey: panes[0].key,
      panes,
      tableY: 0,
      query: '',
      page: 1,
      initRange: [moment(new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      started_at: '',
      ended_at: '',
      area: '',
    }
  }

  componentDidMount() {
    this.setState({
      // tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }

  siderLoadedCallback = (area)=> {
    console.log('加载区域', area)
    this.setState({
      area
    })
    this.handleSearch({
      page: 1,
      query: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      area: area
    })
  }

  changeArea = (area)=> {
    this.formRef.props.form.resetFields()
    this.handleSearch({
      page: 1,
      query: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      area: area
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      query: '',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      area: this.state.area
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'endpoints/fetch',
      payload: {
        area: values.area? values.area:this.state.area,
        ...values,
      },
    });

    this.setState({
      query: values.query,
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page,
      area:values.area? values.area:this.state.area,
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      area: this.state.area
    })
  }

  operate = (id)=> {
    message.success(id)
  }
  onChange = (activeKey) => {
    this.setState({ activeKey });
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  remove = (targetKey) => {
    console.log('targetKey',targetKey)
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      console.log('最后一个')
      activeKey = panes[lastIndex].key;
    }
    if(panes.length===0){
      activeKey='';
    }
    this.setState({ panes, activeKey });
  }
  changeTab=(item)=>{
    const panes = this.state.panes;
    const canFindInPanes=find(panes, function(o) { return o.key===item.key; })
    if(canFindInPanes){
      this.setState({ activeKey:item.key });
    }else{
      panes.push({ title: item.title, content: `Content of new Tab ${item.key}`, key: item.key });
      this.setState({ panes, activeKey:item.key });
    }
  }
  render() {
    const {endpoints: {data, meta, loading}} = this.props;
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
      {title: '水表编号', width: 120, dataIndex: 'name', key: 'name', fixed: 'left',},
      {title: '水表类型', width: 120, dataIndex: 'age', key: 'age', fixed: 'left'},
      {title: '集中器编号', dataIndex: 'address', key: '1', width: 120,},
      {title: '安装地址', dataIndex: 'address', key: '2', width: 150,},
      {title: '上次抄见', dataIndex: 'address', key: '3', width: 120,},
      {title: '上次抄见时间', dataIndex: 'address', key: '4', width: 200,},
      {title: '本次抄见', dataIndex: 'set', key: '5', width: 120,},
      {title: '本次抄见时间', dataIndex: 'address', key: '6', width: 200},
      {title: '应收水量', dataIndex: 'address', key: '7'},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 283,
        render: (val, record, index) => {
          return (
            <div>
              <Button type="primary" size='small' onClick={()=>this.operate(record.id)}>点抄 901F</Button>
              <Button type="primary" disabled size='small' onClick={()=>this.operate(record.id)}>点抄 90EF</Button>
              <Button type="danger" size='small' onClick={()=>this.operate(record.id)}>停用</Button>
              <Button type="primary" disabled size='small' onClick={()=>this.operate(record.id)}>关阀</Button>
            </div>
          )
        }
      },
    ];
    return (
      <Layout className="layout">
        <Sider changeTab={this.changeTab}  siderLoadedCallback={this.siderLoadedCallback} activeKey={this.state.activeKey}/>
        <Content style={{background: '#fff'}}>
          <Tabs
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            hideAdd={true}
            onEdit={this.onEdit}
          >
            {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
          </Tabs>

        </Content>
      </Layout>
    );
  }
}

export default CommunityAnalysis
