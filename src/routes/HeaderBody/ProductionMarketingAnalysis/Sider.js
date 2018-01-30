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
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
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
