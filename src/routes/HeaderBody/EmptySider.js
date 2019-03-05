import React, { PureComponent } from 'react';
import {Icon, Tree, Layout} from 'antd';
import {Link} from 'dva/router';
import {connect} from 'dva';
import {injectIntl} from 'react-intl';
const { Sider} = Layout;
@connect(state => ({
  global:state.global,
}))
@injectIntl
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
    const {intl:{formatMessage}} = this.props;
    return (
      <Sider collapsed={this.state.collapsed}  collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          {formatMessage({id: 'intl.option'})}
        </div>
        <div className="showToggle"   onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderEmpty
