import React, { PureComponent } from 'react';
import {Icon, Tree, Layout} from 'antd';
const TreeNode = Tree.TreeNode;
const { Sider} = Layout;
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
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
    return (
      <Sider collapsed={this.state.collapsed} className="sider" width="250">
        <div className="sider-title">
          选项
        </div>
        <div className="toggle" onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default Dashboard
