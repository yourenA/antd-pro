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
import {projectName,poweredBy,prefix,loginTitle} from './../common/config'
import request from './../utils/request'
import find from 'lodash/find'
const links = [];

const copyright = <div>powered by {poweredBy}</div>;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      company_name:'',
      company: [],
    };
  }
  componentDidMount() {
    request(`/available_companies`,{
      method:'GET',
    }).then((response)=>{
      console.log(response);
      if(response.status===200){
        this.setState({
          company:response.data.data
        },function () {
          const { location } = this.props;
          let { pathname } = location;
          let url_code= pathname.split('/')[2];
          if(!url_code||url_code==='null'){
            url_code='hy'
          }
          const company_name=find(this.state.company, function(o) { return o.code === url_code; });
          if(window.location.hostname==='124.228.9.126'&&url_code!=='hy'){
            console.log('试图在124.228.9.126登陆非衡阳用户')
            return false
          }
          if(window.location.hostname==='182.61.56.51'&&url_code==='hy'){
            console.log('试图在182.61.56.51登陆衡阳用户')
            return false
          }
          if(company_name){
            this.setState({
              company_name:company_name.name
            })
          }
        })
      }
    })

  }
  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      const { location } = nextProps;
      let { pathname } = location;
      let url_code= pathname.split('/')[2]
      if(!url_code||url_code==='null'){
        url_code='hy'
      }
      const company_name=find(this.state.company, function(o) { return o.code === url_code; });
      this.setState({
        company_name:company_name.name
      })
    }
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
          <div className={styles.box}>
            <div className={styles.top}>
              <div className={styles.header}>
              <span>
                <img alt="" className={styles.logo} src={prefix.indexOf('182.61.56.51:8081')>=0?zhuhuaLogo:waterLogo} />
                <span className={styles.title}>{this.state.company_name+'水务远程水表监控系统'}</span>
              </span>
              </div>
              <p className={styles.desc}></p>
            </div>
            <Route
              path='/login'
              component={Login}
            />
          </div>

          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
