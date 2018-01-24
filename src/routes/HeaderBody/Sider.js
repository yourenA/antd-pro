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
}))
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      treeData: [
      ],
    }
  }

  componentDidMount() {
    const {dispatch}=this.props;
    const that=this;
     request(`/villages`,{
      method:'GET',
      params:{
        return: 'all'
      }
    }).then((response)=>{
       console.log('response',response)
       that.setState({
         treeData:response.data.data
       })
       if(response.data.data.length>0){
         that.props.changeArea(response.data.data[0].id)
       }
     })

   /* dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all'
      },
      callback: function () {
        const {sider_regions:{data}}=that.props;
        if(data.length>0){
          that.props.changeArea(data[0].id)
        }
      }
    });*/
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
        console.log('else')
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
      }else if(!item.has_concentrators){
        // console.log('是集中器')
        return <TreeNode title={item.name} key={item.id} dataRef={item} isLeaf={true}/>;
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    if(info.node.props.dataRef.concentrator_model_id){
      console.log('集中器')
      this.props.changeConcentrator(info.node.props.dataRef.number)
    }else{
      console.log('地区')
      this.props.changeArea(selectedKeys[0])
    }
  }

  render() {
    const {sider_regions:{data}}=this.props;
    return (
      <Sider collapsed={this.state.collapsed} className="sider" width="250">
        <div className="sider-title">
          区域信息
        </div>
        <div className="sider-content">
          {(this.state.treeData.length)
            ?
            <Tree
              loadData={this.onLoadData}
              onExpand={this.onExpandNode}
                  showLine onSelect={this.onSelect}
                  //defaultExpandedKeys={[data[0].id]}
                  defaultSelectedKeys={[this.state.treeData[0].id]}
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
