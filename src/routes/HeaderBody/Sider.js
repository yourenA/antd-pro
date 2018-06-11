import React, {PureComponent} from 'react';
import {Icon, Tree, Layout} from 'antd';
import siderJson from './sider.json'
import {connect} from 'dva';
import request from '../../utils/request';
import forEach from 'lodash/forEach'
const TreeNode = Tree.TreeNode;
const {Sider} = Layout;

@connect(state => ({
  sider_regions: state.sider_regions,
  global:state.global,
}))
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    const {isMobile} =this.props.global;
    this.state = {
      collapsed: isMobile,
      treeData: [
      ],
      selectedKeys: []
    }
  }

  componentDidMount() {
    const {dispatch}=this.props;
    this.queryVillages(true);
  }
  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.refreshSider !== this.props.refreshSider) {
      console.log('刷新sider');
      this.queryVillages(true);
    }
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
        treeData:this.props.showSiderCon===false?response.data.data:that.transilate(response.data.data)
      },function () {
      })
      if(initial){
        if(response.data.data.length>0){
          // console.log('that.props.initConcentrator',that.props.initConcentrator)
          if(that.props.noClickSider){
          }else{
            that.setState({
              selectedKeys:[response.data.data[0].id]
            })
            that.props.changeArea(response.data.data[0].id)
          }
        }else{
          that.props.changeArea('')
        }
      }
    })
  }
  transilate=(data)=>{
    if(!data) return null;
    return data.map((item) => {
      if (item.concentrators) {
        if(item.concentrators.length>0){
          item.children=item.children||[];
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
  }
  onLoadData = (treeNode) => {
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
        resolve();
      }
    });
  }
  renderTreeNodes = (data) => {
    // console.log(data)
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if(item.number){
        return  <TreeNode title={item.number} key={item.id} dataRef={item} className="concentrator"/>;
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} className="village"/>;
    });
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onSelect = (selectedKeys, info) => {

    console.log('onSelect', info);
    if(info.selected===false){
      return false
    }
    this.setState({ selectedKeys });
    if(info.node.props.dataRef.number){
      console.log('集中器')
      this.props.changeConcentrator(info.node.props.dataRef.number,info.node.props.dataRef.village_id)
    }else{
      console.log('地区')
      this.props.changeArea(selectedKeys[0])
    }
  }

  render() {
    const {sider_regions:{data}}=this.props;
    return (
      <Sider collapsed={this.state.collapsed} collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          区域信息
        </div>
        <div className="sider-content">
          {(this.state.treeData.length)
            ?
            <Tree
              //loadData={this.onLoadData}
              onExpand={this.onExpandNode}
              defaultExpandedKeys={[this.state.treeData[0].id]}
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
