import React, {PureComponent} from 'react';
import {Icon, Tree, Layout} from 'antd';
import siderJson from './sider.json'
import {connect} from 'dva';
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
    }
  }

  componentDidMount() {
    const {dispatch}=this.props;
    const that=this;
    dispatch({
      type: 'sider_regions/fetch',
      callback: function () {
        const {sider_regions:{data}}=that.props;
        if(data.length>0){
          that.props.siderLoadedCallback(data[0].id)
        }
      }
    });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item}/>;
    });
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.props.changeArea(selectedKeys[0])
  }

  render() {
    const {sider_regions:{data}}=this.props;
    return (
      <Sider collapsed={this.state.collapsed} className="sider" width="250">
        <div className="sider-title">
          区域信息
        </div>
        <div className="sider-content">
          {(data.length)
            ?
            <Tree showLine onSelect={this.onSelect}
                  defaultExpandedKeys={[data[0].id]}
                  defaultSelectedKeys={[data[0].id]}
            >
              {this.renderTreeNodes(data)}
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
