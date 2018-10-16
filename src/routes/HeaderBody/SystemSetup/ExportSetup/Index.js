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

@DragDropContext(HTML5Backend)
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      activeKey:company_code==='hy'?'2':'1',
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
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '导出设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs activeKey={this.state.activeKey} onChange={this.onChange} className="system-tabs" type="card">
                  {
                    company_code!=='hy'&&<TabPane tab=' 水表读数信息导出' key="1">
                      <MeterDataExportIndex />
                    </TabPane>
                  }
                  <TabPane  tab='用户信息导出' key="2" >
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
