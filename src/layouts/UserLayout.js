import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import Login from '../routes/User/Login';
import waterLogo from '../images/water.png'
import {projectName,poweredBy} from './../common/config'
const links = [];

const copyright = <div>powered by {poweredBy}</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    return '登录';
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={waterLogo} />
                <span className={styles.title}>{projectName}</span>
              </Link>
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
