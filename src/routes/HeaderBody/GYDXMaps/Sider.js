import React, {PureComponent} from 'react';
import {Icon, Tree, Layout,Input,Tooltip} from 'antd';
import {connect} from 'dva';
import request from '../../../utils/request';
import find from 'lodash/find'
const TreeNode = Tree.TreeNode;
const {Sider} = Layout;
const Search = Input.Search;
@connect(state => ({
  sider_regions: state.sider_regions,
  global:state.global,
}))
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    this.dataList=[];
    this.mapData=[];
    const {isMobile} =this.props.global;
    this.timer=null;
    this.state = {
      collapsed: isMobile,
      treeData: [
      ],
      selectedKeys: [],
      expandedKeys: [],
      autoExpandParent:true,
      searchValue: '',
    }
  }

  componentDidMount() {
    const {dispatch}=this.props;
    this.queryVillages(true);
    // this.timer=setInterval(this.queryVillages,2000)
  }
  componentWillUnmount() {
    clearInterval(this.queryVillages)
  }
  queryVillages=(initial)=>{
    console.log('获取')
    const that=this;
    request(`/villages`,{
      method:'GET',
      params:{
        return: 'all'
      }
    }).then((response)=>{
      console.log('response',response.data.data);
        request(`/concentrators`,{
          method:'GET',
          params:{
            return: 'all'
          }
        }).then((concentratorsResponse)=>{
          console.log('concentratorsResponse',concentratorsResponse)
          if(that.props.showConcentrator!==false){
            response.data.data.unshift({id:'null',name:'全部集中器',tooltip:"列出所有的集中器号，与安装小区无关",children:[]})
            for(let i=0;i<concentratorsResponse.data.data.length;i++){
              response.data.data[0].children.push({ data:concentratorsResponse.data.data[i],id:concentratorsResponse.data.data[i].id+'5', number: concentratorsResponse.data.data[i].number,parent_village_id:'' })
            }
          }
          this.mapData=concentratorsResponse.data.data;
          this.props.saveConcentrators(concentratorsResponse.data.data)
          // this.props.getPoint(initial)
          that.setState({
            treeData:that.transilate(response.data.data)
          },function () {
            that.generateList(that.state.treeData);
            // console.log(that.dataList)
          })
        })

    })
  }
  transilate=(data)=>{
    if(!data) return null;
    return data.map((item) => {
      if (item.concentrators && this.props.showConcentrator!==false) {
        if(item.concentrators.length>0){
          item.children=item.children||[];
          for(let i=0;i<item.concentrators.length;i++){
            item.concentrators[i].parent_village_id=item.id;
            item.concentrators[i].data=find(this.mapData,function (o) {
              return o.number===item.concentrators[i].number
            })
          }
          let concatR=item.children?item.children.concat(item.concentrators):item.concentrators;
          // console.log('concatR',concatR)
          item.children=concatR
        }
      }
      this.transilate(item.children)
      return item
    });
  }
  onExpandNode=(expandedKeys,expanded)=>{
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  renderTreeNodes = (data) => {
    // console.log(data)
    return data.map((item) => {
      const index = item.name?item.name.indexOf(this.state.searchValue):item.number.indexOf(this.state.searchValue);
      const beforeStr = item.name?item.name.substr(0, index):item.number.substr(0, index);
      const afterStr = item.name?item.name.substr(index + this.state.searchValue.length):item.number.substr(index + this.state.searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.name?item.name:item.number}</span>;
      if (item.children) {
        return (
          <TreeNode title={<span>{title}{item.tooltip? <Tooltip placement="top" title={item.tooltip}><Icon style={{marginLeft:'5px'}} type="question-circle-o" /> </Tooltip>:''}</span>} key={item.id} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if(item.number){
        return  <TreeNode title={title} key={`${item.id}#${item.parent_village_id}`} dataRef={item} className="concentrator"/>;
      }
      return <TreeNode title={title} key={item.id} dataRef={item} className="village"/>;
    });
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('info',info)
    if(info.selected===false){
      return false
    }
    this.setState({ selectedKeys });
    if(info.node.props.dataRef.number){
      this.props.changeConcentrator(info.node.props.dataRef.data)
    }else{
      console.log('地区')
      if(selectedKeys[0]==='null'){
        this.props.changeArea('')
      }else{
        this.props.changeArea(selectedKeys[0])

      }
    }
  }
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.id;
      if(node.number){
        this.dataList.push({ id:key, name: node.number });
      }else{
        this.dataList.push({ id:key, name: node.name });
      }
      if (node.children) {
        this.generateList(node.children, node.id);
      }
    }
  };
  onChange = (e) => {
    const value = e.target.value;
    const expandedKeys = this.dataList.map((item) => {
      // console.log(item.name)
      if (item.name.indexOf(value) > -1) {
        return this.getParentKey(item.id, this.state.treeData);
      }
      return null;
    });
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
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
  render() {
    const {sider_regions:{data}}=this.props;
    return (
      <Sider collapsed={this.state.collapsed} collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          区域信息
        </div>
        <Search style={{ marginTop:'20px',marginLeft:'12px',marginBottom:'8px',width:'88%' }} placeholder="搜索小区或集中器号" onChange={this.onChange} />
        <div className="sider-content">
          {(this.state.treeData.length)
            ?
            <Tree
              //loadData={this.onLoadData}
              onExpand={this.onExpandNode}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              showLine onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
              //defaultExpandedKeys={[data[0].id]}
              //defaultSelectedKeys={[this.state.treeData[0].id]}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
            : null}
          {
            this.props.showArea===false?<div className="hideSider"></div>:null
          }
        </div>

        <div className="showToggle"   onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderTree
