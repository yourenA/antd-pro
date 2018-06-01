import React, { PureComponent } from 'react';
import {Icon, Tree, Layout} from 'antd';
import {Link} from 'dva/router';
import {connect} from 'dva';
const { Sider} = Layout;
@connect(state => ({
  global:state.global,
}))
class SiderEmpty extends PureComponent {
  constructor(props) {
    super(props);
    const {isMobile} =this.props.global;
    this.state = {
      collapsed: isMobile,
    }
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <Sider collapsed={this.state.collapsed}  collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          选项
        </div>
        <div className="showToggle"   onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderEmpty
