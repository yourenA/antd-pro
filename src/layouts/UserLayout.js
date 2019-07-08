import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from 'dva/router';
import DocumentTitle from 'react-document-title';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import Login from '../routes/User/Login';
import waterLogo from '../images/water.png'
import hyLogo from '../images/hy-logo.png'
import zhuhuaLogo from '../images/zhuhua.png'
import {projectName, poweredBy, prefix, loginTitle} from './../common/config'
import request from './../utils/request'
import {LocaleProvider} from 'antd';
import en_US from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {IntlProvider, addLocaleData,FormattedMessage} from 'react-intl';
import zhCN from './../locale/zh-CN.js';  //导入 i18n 配置文件,需要手动创建并填入语言转换信息
import enUS from './../locale/en-US.js';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
// let output={}
// for(let key in zhCN){
//   // console.log(zhCN[key])
//   // console.log(enUS[key])
//   output[zhCN[key]]=enUS[key]
// }
// console.log('output',output)
addLocaleData([...en, ...zh]);
import find from 'lodash/find'
const links = [];

const copyright = <div>powered by <FormattedMessage id="intl.power_name"/></div>;
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

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      company_name: '',
      company_code: '',
      company: [],
      locale: sessionStorage.getItem('locale') || 'zh-CN'
    };
  }

  componentDidMount() {
    request(`/available_companies`, {
      method: 'GET',
    }).then((response)=> {
      console.log(response);
      if (response.status === 200) {
        this.setState({
          company: response.data.data
        }, function () {
          const {location} = this.props;
          let {pathname} = location;
          let url_code = pathname.split('/')[2];
          if (!url_code || url_code === 'null') {
            url_code = 'hy'
          }
          const company_name = find(this.state.company, function (o) {
            return o.code === url_code;
          });
          // if (window.location.hostname === '124.228.9.126' && url_code !== 'hy') {
          //   console.log('试图在124.228.9.126登陆非衡阳用户')
          //   return false
          // }
          if (window.location.hostname === '182.61.56.51' && url_code === 'hy') {
            console.log('试图在182.61.56.51登陆衡阳用户')
            return false
          }
          console.log('company_name',company_name)
          if (company_name) {
            this.setState({
              company_name: company_name.name,
              company_code: company_name.code,
              locale: company_name.language,
            }, function () {
              if (company_name.language) {
                sessionStorage.setItem('locale', company_name.language)
              }
            })
          } else {
            this.setState({
              company_name: ''
            })
          }
        })
      }
    })

  }

  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      const {location} = nextProps;
      let {pathname} = location;
      let url_code = pathname.split('/')[2]
      if (!url_code || url_code === 'null') {
        url_code = 'hy'
      }
      const company_name = find(this.state.company, function (o) {
        return o.code === url_code;
      });
      console.log('company_name',company_name)
      if (company_name) {
        this.setState({
          company_name: company_name.name,
          company_code: company_name.code,
          locale: company_name.language,
        },function () {
          if (company_name.language) {
            console.log('company_name.language',company_name.language)
            sessionStorage.setItem('locale', company_name.language)
          }
        })
      } else {
        this.setState({
          company_name: ''
        })
      }
    }
  }

  getChildContext() {
    const {location} = this.props;
    return {location};
  }

  getPageTitle() {

    return  this.state.locale === 'en' ? `Sign in`: `登陆`;
  }

  render() {
    console.log('this.state.company_code',this.state.company_code)
    const layout = ( <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.login_mask}></div>
          <div className={styles.login_content}>
            <div className={styles.top}>
              <div className={styles.header}>
              <span>
                <img alt="" className={styles.logo}
                     src={window.location.hostname.indexOf('124.228.9.126') >= 0 ? hyLogo : waterLogo}/>
                <span className={styles.title}>{this.state.company_name }<FormattedMessage id="intl.project_name"/></span>

              </span>
              </div>
            </div>
            <Route
              path='/login'
              component={Login}
            />
          </div>

        </div>
        <GlobalFooter className={styles.footer} links={links} copyright={copyright}/>
      </div>
    )
    return (
      <IntlProvider locale={this.state.locale === 'en' ? 'en' : 'zh'} messages={this.state.locale === 'en' ? enUS: zhCN}>
        <LocaleProvider locale={this.state.locale === 'en' ? en_US : zh_CN}>
          <DocumentTitle title={this.getPageTitle()}>
            <ContainerQuery query={query} style={{height: '100%'}}>
              {params => <div className={classNames(params)}>{layout}</div>}
            </ContainerQuery>
          </DocumentTitle>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}

export default UserLayout;
