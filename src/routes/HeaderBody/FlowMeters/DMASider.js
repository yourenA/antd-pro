import React, {PureComponent} from 'react';
import {Icon, Tree, Layout,message,Input} from 'antd';
import {connect} from 'dva';
import request from '../../../utils/request';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const {Sider} = Layout;

@connect(state => ({
}))
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    this.dataList=[];
    this.state = {
      collapsed: false,
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
  }
  queryVillages=(initial)=>{
    const that=this;
    request(`/areas`,{
      method:'GET',
      params:{
        return: 'all'
      }
    }).then((response)=>{
      console.log('response',response.data.data)
      that.setState({
        treeData:that.wrapParent(response.data.data)
      },function () {
        that.generateList(that.state.treeData);
        // console.log(that.dataList)
      })
      if(initial){
        if(that.state.treeData.length>0){
          that.setState({
            selectedKeys:[that.state.treeData[0].id]
        })
          that.props.changeArea(that.state.treeData[0].id)
        }else{
          message.info('没有数据')
        }
      }
    })
  }
  wrapParent=(data)=>{
    let parent=[{
      id:'all',
      name:'全部DMA分区',
      children:[],
    }];
    for(let i=0;i<data.length;i++){
      parent[0].children.push(data[i])
    }
    this.setState({
      expandedKeys:['all']
    })
    return parent
  }
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.id;
      this.dataList.push({ id:key, name: node.name });
      if (node.children) {
        this.generateList(node.children, node.id);
      }
    }
  };
  onExpandNode=(expandedKeys,expanded)=>{
    console.log(expandedKeys)
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  renderTreeNodes = (data) => {
    // console.log(data)
    return data.map((item) => {
      const index = item.name.indexOf(this.state.searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + this.state.searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.name}</span>;
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      // if(item.number){
      //   return  <TreeNode title={item.number} key={item.id} dataRef={item} className="concentrator"/>;
      // }
      return <TreeNode title={title} key={item.id} dataRef={item} className="village"/>;
    });
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onSelect = (selectedKeys, info) => {
    if(info.selected===false){
      return false
    }
    this.setState({ selectedKeys });
    if(info.node.props.dataRef.number){
      this.props.changeConcentrator(info.node.props.dataRef.number,info.node.props.dataRef.village_id)
    }else{
      this.props.changeArea(selectedKeys[0])
    }
  }
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
    return (
      <Sider collapsed={this.state.collapsed} className="sider" width="210">
        <div className="sider-title">
          DMA区域信息
        </div>
        <Search style={{ marginTop:'20px',marginLeft:'12px',marginBottom:'8px',width:'88%' }} placeholder="Search" onChange={this.onChange} />
        <div className="sider-content">
          {(this.state.treeData.length)
            ?
            <Tree
               //defaultExpandAll={true}
              //loadData={this.onLoadData}
                   onExpand={this.onExpandNode}
                  expandedKeys={this.state.expandedKeys}
                  showLine onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}
                  autoExpandParent={this.state.autoExpandParent}
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

        <div className="toggle" onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderTree
