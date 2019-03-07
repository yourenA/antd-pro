/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, Layout, Card, Button, Input, message, TimePicker, Switch,List,Modal ,Tabs,Icon ,InputNumber,Popconfirm  } from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import MemberExport from './MemberExport/Sort'
import MeterDataExportIndex from './MeterDataExportIndex'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
const {Content} = Layout;
const TabPane = Tabs.TabPane;
import {injectIntl} from 'react-intl';
@injectIntl
@DragDropContext(HTML5Backend)
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      activeKey:(company_code==='hy'||company_code==='jxwa')?'2':'1',
      tableY:0
    }
  }

  componentDidMount() {
    const search=this.props.history.location.search.substr(1)
    if(search){
      const searchObj={};
      searchObj[search.split('=')[0]]=search.split('=')[1]
      if(searchObj.type){
        this.setState({
          activeKey:searchObj.type
        })
      }

    }
  }
  onChange=(activeKey)=>{
    this.setState({
      activeKey
    })
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理"  breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.system_setting'})},
              {name: formatMessage({id: 'intl.export_setup'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs activeKey={this.state.activeKey} onChange={this.onChange} className="system-tabs" type="card">
                  {
                    (company_code!=='hy')&& (company_code!=='jxwa')&&<TabPane tab={formatMessage({id: 'intl.water_meter_value_export'})} key="1">
                      <MeterDataExportIndex />
                    </TabPane>
                  }
                  <TabPane  tab={formatMessage({id: 'intl.user_info_export'})} key="2" >
                    <MemberExport />
                  </TabPane>

                </Tabs>
              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default connect()(EditPassword);
