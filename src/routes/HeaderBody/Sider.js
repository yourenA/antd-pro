import React, {PureComponent} from 'react';
import {Icon, Tree, Layout} from 'antd';
import siderJson from './sider.json'
const TreeNode = Tree.TreeNode;
const {Sider} = Layout;
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      collapsed: false,
    }
  }

  componentDidMount() {
    const that = this;
    setTimeout(function () {
      that.setState({
        treeData: siderJson.REGION,
      }, function () {
        if (that.state.treeData.length > 0) {
          that.props.siderLoadedCallback(that.state.treeData[0].id[0])
        }
      })
    }, 1000)
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.nodes) {
        return (
          <TreeNode title={item.text} key={item.id[0]} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.nodes)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.text} key={item.id[0]} dataRef={item}/>;
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
          区域信息
        </div>
        {this.state.treeData.length
          ?
          <Tree showLine onSelect={this.onSelect}
                defaultExpandedKeys={[this.state.treeData[0].id[0]]}
                defaultSelectedKeys={[this.state.treeData[0].id[0]]}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
          : 'loading tree'}

        <div className="toggle" onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderTree
