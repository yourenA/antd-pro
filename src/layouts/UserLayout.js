import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import Login from '../routes/User/Login';
import waterLogo from '../images/water.png'
const links = [];

const copyright = <div>Copyright <Icon type="copyright" /> 2017 辂轺科技</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    return '登陆';
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={waterLogo} />
                <span className={styles.title}>辂轺科技水务系统IOT</span>
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
