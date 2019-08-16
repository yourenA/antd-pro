import React, {PureComponent} from 'react';
import {Icon, Tree, Layout,message,Input} from 'antd';
import siderJson from './sider.json'
import {connect} from 'dva';
import request from '../../utils/request';
import forEach from 'lodash/forEach'
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const {Sider} = Layout;

@connect(state => ({
  sider_regions: state.sider_regions,
  global:state.global,
}))
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    this.dataList=[];
    const {isMobile} =this.props.global;
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
  }
  queryVillages=(initial)=>{
    const that=this;
    request(`/villages`,{
      method:'GET',
      params:{
        return: 'all'
      }
    }).then((response)=>{
      console.log('response',response.data.data)
      that.setState({
        treeData:response.data.data
      },function () {
        console.log('transilate',that.state.transilate)
        that.generateList(that.state.treeData);
        // console.log(that.dataList)
      })
      if(initial){
        if(this.props.noClickSider){
          console.log('不从sider加载数据')
        }else{
          if(response.data.data.length>0){
            that.setState({
              selectedKeys:[response.data.data[0].id]
            })
            that.props.changeArea(response.data.data[0].id)
          }else{
            that.props.changeArea('')
          }
        }
      }
    })
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
  transilate=(data)=>{
    if(!data) return null;
    return data.map((item) => {
      if (item.concentrators) {
        if(item.concentrators.length>0){
          let concatR=item.children?item.children.concat(item.concentrators):item.concentrators
          item.children=concatR
        }
        this.transilate(item.children)
      }
      return item
    });
  }
  onExpandNode=(expandedKeys,expanded)=>{
    console.log(expandedKeys)
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
 /* onLoadData = (treeNode) => {
    const that=this;
    console.log(treeNode)
    return new Promise((resolve,reject) => {
      if (treeNode.props.children&&treeNode.props.dataRef.has_concentrators===-1) {
        console.log('有children,没有子集中器')
        resolve();
        return;
      }else if(treeNode.props.children&&treeNode.props.dataRef.has_concentrators===1){
        console.log('有children,有子集中器')
        let doRequest=true
        forEach(treeNode.props.dataRef.children,function (item,index) {
          if(item.concentrator_model_id){
            doRequest=false
          }
        })
        if(doRequest){
          request(`/concentrators`,{
            method:'GET',
            params:{
              village_id:treeNode.props.eventKey,
              return: 'all'
            }
          }).then((response)=>{
            response.data.data.map((item,index)=>{
              item.name=item.number;
              item.isLeaf=true
            })
            console.log(treeNode.props.dataRef.children)
            console.log(response.data.data)
            treeNode.props.dataRef.children =[...treeNode.props.dataRef.children, ...response.data.data];
            that.setState({
              treeData: [...this.state.treeData],
            });

          })
        }
        resolve();
        return;
      } else if(treeNode.props.dataRef.has_concentrators===1){
        console.log('没有children，有子集中器')
        request(`/concentrators`,{
          method:'GET',
          params:{
            village_id:treeNode.props.eventKey,
            return: 'all'
          }
        }).then((response)=>{
          console.log('response',response)
          response.data.data.map((item,index)=>{
            item.name=item.number;
            item.isLeaf=true
          })
          treeNode.props.dataRef.children = response.data.data;
          that.setState({
                treeData: [...this.state.treeData],
              });
          resolve();
        })
      }else{
        console.log('else')
        resolve();
      }
    });
  }*/
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
          <TreeNode  title={title} key={item.id} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if(item.number){
        return  <TreeNode   title={item.number} key={item.id} dataRef={item} className="concentrator"/>;
      }
      return <TreeNode   title={title} key={item.id} dataRef={item} className="village"/>;
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
        console.log(this.getParentKey(item.id, this.state.treeData))
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
        <Search style={{ marginTop:'20px',marginLeft:'12px',marginBottom:'8px',width:'88%' }} placeholder="Search" onChange={this.onChange} />
        <div className="sider-content">
          {(this.state.treeData.length)
            ?
            <Tree
               //defaultExpandAll={true}
              //loadData={this.onLoadData}
              onExpand={this.onExpandNode}
                  expandedKeys={this.state.expandedKeys}
                  showLine
              onSelect={this.onSelect}
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

        {/*<div className="toggle" onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>*/}
            <div className="showToggle"   onClick={this.onCollapse}>
              <Icon type={this.state.collapsed ? "right" : "left"}/>
            </div>
      </Sider>
    );
  }
}

export default SiderTree
