import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Tabs } from 'antd';
import {Link} from 'dva/router'
import classNames from 'classnames';
import styles from './index.less';
const { TabPane } = Tabs;


export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  render() {
    const {title,tabList}=this.props
    const tabDefaultValue = tabList && (tabList.filter(item => item.key===title.key));
    return (
      <div className={styles.pageHeader}>
        <Breadcrumb separator=">">
        {this.props.breadcrumb.map((item,index)=>{
            if(item.link){
              return(
                <Breadcrumb.Item  key={index}><Link to={item.link}>{item.name}</Link></Breadcrumb.Item>
              )
            }else{
              return(
                <Breadcrumb.Item  key={index}>{item.name}</Breadcrumb.Item>
              )
            }
        })}
        </Breadcrumb>
        <div className={styles.title}>
          <h3>{title.label}</h3>
        </div>
        {
          tabList &&
          tabList.length &&
          <Tabs
            className={styles.tabs}
            defaultActiveKey={tabDefaultValue[0].key}
            onTabClick={this.onChange}
          >
            {
              tabList.map(item => <TabPane tab={item.tab} key={item.key} />)
            }
          </Tabs>
        }
      </div>
    );
  }
}
