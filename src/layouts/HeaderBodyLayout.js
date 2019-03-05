/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import {
  Layout,
  Menu,
  Modal,
  Icon,
  Avatar,
  message,
  BackTop,
  notification,
  Button,
  Badge,
  Popover,
  Tooltip,
  LocaleProvider
} from 'antd';
import styles from './HeaderBodyLayout.less';
import {connect} from 'dva';
import {Link, Route, Redirect, Switch, routerRedux} from 'dva/router';
import {getNavData} from '../common/nav';
import {getRouteData} from '../utils/utils';
import DocumentTitle from 'react-document-title';
import {ContainerQuery} from 'react-container-query';
import intersection from 'lodash/intersection';
import throttle from 'lodash/throttle'
import Main from './../routes/HeaderBody/NewPage';
import classNames from 'classnames';
import EditPassword from '../routes/HeaderBody/HomePage/EditPassword'
import request from './../utils/request'
import NotFound from './../routes/Exception/404';
import {projectName, poweredBy} from './../common/config'
import moment from 'moment';
import find from 'lodash/find'
import HyLogo from '../images/hy-logo.png'
import Contentlayout from './headerBodyContent'
import en_US from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {IntlProvider, addLocaleData, injectIntl, FormattedMessage} from 'react-intl';
import zhCN from './../locale/zh-CN.js';  //导入 i18n 配置文件,需要手动创建并填入语言转换信息
import enUS from './../locale/en-US.js';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
addLocaleData([...en, ...zh]);
const {SubMenu} = Menu;
const {Header, Content} = Layout;
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};
class HeaderBodyLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      locale: localStorage.getItem('locale') || "zh-CN"
    };
  }
  getPageTitle() {
    const {location} = this.props;
    let {pathname} = location;
    const company_name = sessionStorage.getItem('company_name');
    const company_code = sessionStorage.getItem('company_code');
    let title = company_name + projectName;
    getRouteData('HeaderBodyLayout').forEach((item) => {
      // console.log(`/${company_code}/main${item.path}`)
      if (`/${company_code}/main${item.path}` === pathname) {
        title = `${item.name} - ${company_name + projectName}`;
      }
      if (pathname.indexOf(`system_setup`) > 0) {
        title = `系统设置 - ${company_name + projectName}`;
      }
    });
    return title;
  }

  render() {

    return (
      <IntlProvider locale={this.state.locale === 'en' ? 'en' : 'zh'}
                    messages={this.state.locale === 'en' ? enUS : zhCN}>

        <LocaleProvider locale={this.state.locale === 'en' ? en_US : zh_CN}>
          <DocumentTitle title={this.getPageTitle()}>
            <ContainerQuery query={query}>
              {params => <div className={classNames(params)}><Contentlayout {...this.props}/></div>}
            </ContainerQuery>
          </DocumentTitle>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
export default connect(state => ({
  global: state.global,
  login: state.login
}))(HeaderBodyLayout);
