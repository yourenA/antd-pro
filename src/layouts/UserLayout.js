import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import Login from '../routes/User/Login';
import waterLogo from '../images/water.png'
import zhuhuaLogo from '../images/zhuhua.png'
import {projectName,poweredBy,prefix} from './../common/config'
const links = [];

const copyright = <div>powered by {poweredBy}</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  componentDidMount() {
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    return `登录-${projectName}`;
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <span>
                <img alt="" className={styles.logo} src={prefix.indexOf('182.61.56.51:8081')>=0?zhuhuaLogo:waterLogo} />
                <span className={styles.title}>{projectName}</span>
              </span>
            </div>
            <p className={styles.desc}></p>
          </div>
          <Route
            path='/login'
            component={Login}
          />
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
