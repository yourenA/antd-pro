/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import {Breadcrumb, Collapse, Icon, Anchor,LocaleProvider} from 'antd';
import {connect} from 'dva';
const {Link} = Anchor;
import DocumentTitle from 'react-document-title';
import {ContainerQuery} from 'react-container-query';
import manufater from './../images/about/manufater.png'
import area from './../images/about/area.png'
import server from './../images/about/server.png'
import concentratorModel from './../images/about/concentratorModel.png'
import concentrator from './../images/about/concentrator.png'
import meterModel from './../images/about/meterModel.png'
import meter from './../images/about/meter.png'
import process from './../images/about/process.png'
import open1 from './../images/about/open1.png'
import open2 from './../images/about/open2.png'

import classNames from 'classnames';
import './About.less'
import en_US from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {IntlProvider, addLocaleData, injectIntl, FormattedMessage} from 'react-intl';
import zhCN from './../locale/zh-CN.js';  //导入 i18n 配置文件,需要手动创建并填入语言转换信息
import enUS from './../locale/en-US.js';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
addLocaleData([...en, ...zh]);
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

class TestLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
      editModal: false
    };
  }

  componentDidMount = ()=> {
    let items = document.querySelectorAll('.about-content-item img');
    let imgObj = document.querySelectorAll(".about-content-item img");
    let l = 0;
    window.onscroll = function () {
      var seeHeight = document.documentElement.clientHeight;
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      for (let i = 0; i < items.length; i++) {
        if (items[i].offsetTop + 50 < seeHeight + scrollTop) {
          if (imgObj[i].getAttribute("src") == "") {
            imgObj[i].src = imgObj[i].getAttribute("data-src");
          }
        }
        if (imgObj[i].offsetTop + 50 > seeHeight + scrollTop) {
          l = i;
          break;
        }

      }
    }
  }
  componentWillUnmount = ()=> {
  }

  getPageTitle() {
    return this.state.locale === 'en' ? `${enUS['intl.document']}`: `${zhCN['intl.document']}`
  }

  scrollToAnchor = (id)=> {
    document.getElementById(id).scrollIntoView();
  }

  render() {
    const company_code = sessionStorage.getItem('company_code');
    const layout = (
      <div className="about-container">
        <div className="about-anchor">
          <Anchor>
            <Link href="#/about/#system-desc" title={<span  >1.系统概述</span>}/>
            <Link href="#/about/#import" title={<span >2.数据导入流程</span>}>
              <Link href="#/about/#manufater" title={<span >2.2 添加安装小区</span>}/>
              <Link href="#/about/#server" title={<span  >2.3 添加服务器地址</span>}/>
              <Link href="#/about/#concentratorModel" title={<span >2.4 添加集中器类型</span>}/>
              <Link href="#/about/#concentrator" title={<span >2.5 添加集中器</span>}/>
              <Link href="#/about/#meterModel" title={<span  >2.6 添加水表类型</span>}/>
              <Link href="#/about/#meter" title={<span  >2.7 导入用户和水表数据</span>}/>
              <Link href="#/about/#process" title={<span >2.8 一站添加数据</span>}/>
            </Link>
            <Link href="#/about/#openMeter" title={<span  >3.开关阀操作</span>}/>
          </Anchor>
        </div>
        <div className="about-content">
          <div className="about-content-item" id="/about/#system-desc">
            <h2>1.系统概述</h2>
            <div className="item-desc">
              <ul>
                <ol>
                  远传水表监控系统
                </ol>
              </ul>
            </div>
          </div>
          <div className="about-content-item" id="/about/#import">
            <h2>2.数据导入流程</h2>
            <div className="item-desc" id="/about/#manufater">
              <h3>2.1 添加厂商</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  添加"集中器"和"水表"的生产厂商
                </ol>
                <ol><span className="color-red">操作：</span>系统管理 > 厂商查询 > 添加</ol>
              </ul>
              <img className="about-image" alt="系统概述" data-src={manufater} src=''/>
            </div>
            <div className="item-desc" id="/about/#area">
              <h3>2.2 添加安装小区</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  添加安装小区,安装小区与侧边栏的"区域信息"相挂钩
                </ol>
                <ol><span className="color-red">操作：</span>系统管理 > 区域管理 > 添加</ol>
                <ol>安装小区 采用树形结构，添加下层小区需要选择"上级名称"</ol>
              </ul>
              <img className="about-image" alt="区域管理" data-src={area} src=''/>
            </div>
            <div className="item-desc" id="/about/#server">
              <h3>2.3 添加服务器地址</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  添加服务器地址，包括IP与端口
                </ol>
                <ol><span className="color-red">操作：</span>运行管理 > 服务器地址 > 添加</ol>
              </ul>
              <img className="about-image" alt="服务器地址" data-src={server} src=''/>
            </div>
            <div className="item-desc" id="/about/#concentratorModel">
              <h3>2.4 添加集中器类型</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  添加集中器类型
                </ol>
                <ol><span className="color-red">操作：</span>系统管理 > 集中器类型查询 > 添加</ol>
              </ul>
              <img className="about-image" alt="集中器类型" data-src={concentratorModel} src=''/>
            </div>
            <div className="item-desc" id="/about/#concentrator">
              <h3>2.5 添加集中器</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  添加集中器
                </ol>
                <ol><span className="color-red">操作：</span>运行管理 > 集中器管理 > 添加</ol>
                <ol>一个集中器可以有多个安装小区</ol>
              </ul>
              <img className="about-image" alt="集中器" data-src={concentrator} src=''/>
            </div>
            <div className="item-desc" id="/about/#meterModel">
              <h3>2.6 添加水表类型</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  添加水表类型
                </ol>
                <ol><span className="color-red">操作：</span>系统管理 >水表类型查询 > 添加</ol>
              </ul>
              <img className="about-image" alt="水表类型" data-src={meterModel} src=''/>
            </div>
            <div className="item-desc" id="/about/#meter">
              <h3>2.7 导入用户和水表数据</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  通过excel导入用户和水表数据
                </ol>
                <ol><span className="color-red">操作：</span>运行管理 > 用户档案 > 批量导入</ol>
                <ol>点击"下载模板"按钮可以下载excel模板，根据模板填入用户和水表数据，然后上传excel文件</ol>
              </ul>
              <img className="about-image" alt="入用户和水表数据" data-src={meter} src=''/>
            </div>
            <div className="item-desc" id="/about/#process">
              <h3>2.8 一站添加数据</h3>
              <ul>
                <ol><span className="color-red">说明：</span>
                  在"一站添加数据"页面可以完成上面七个步骤的添加数据，而不用切换页面添加数据
                </ol>
                <ol><span className="color-red">操作：</span>系统管理 > 一站添加数据</ol>
                <ol>如果某个数据不需要添加可以选择"跳过"</ol>

              </ul>
              <img className="about-image" alt="一站添加数据" data-src={process} src=''/>
            </div>
          </div>
          <div className="about-content-item" id="/about/#openMeter">
            <h2>3.开关阀操作</h2>
            <div className="item-desc">
              <ul>
                <ol><span className="color-red">说明：</span>
                  对水表进行开/关阀操作
                </ol>
                <ol><span className="color-red">操作：</span>系统管理 > 水表管理</ol>
                <ol>进行操作前先要"打开操作栏"</ol>
                <ol>"是否阀控"为"是"的水表才可以进行阀控</ol>

              </ul>
              <img className="about-image" alt="阀控" data-src={open1} src=''/>
              <img className="about-image" alt="阀控" data-src={open2} src=''/>

            </div>
          </div>
        </div>
      </div>
    )
    return (
      <IntlProvider locale={this.state.locale === 'en' ? 'en' : 'zh'}
                    messages={this.state.locale === 'en' ? enUS : zhCN}>

        <LocaleProvider locale={this.state.locale === 'en' ? en_US : zh_CN}>
          <DocumentTitle title={this.getPageTitle()}>
            <ContainerQuery query={query}>
              {params => <div className={classNames(params)}>{layout}</div>}
            </ContainerQuery>
          </DocumentTitle>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
export default connect(state => ({}))(TestLayout);
