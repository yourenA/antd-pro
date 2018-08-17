/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Form, Select, Layout, Card, Button, Input, message, TimePicker, Switch,List,Modal ,Tabs,Icon ,InputNumber,Popconfirm  } from "antd";
import {connect} from "dva";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import request from "./../../../../utils/request";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import forEach from "lodash/forEach";
import filter from "lodash/filter";
import ExportCSV from './Export/Sort'
import Fields from './Fields/Sort'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
const {Content} = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@DragDropContext(HTML5Backend)
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.format = 'HH:mm';
    this.state = {
      tableY:0
    }
  }

  componentDidMount() {
  }
  render() {
    return (
      <Layout className="layout">
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '水表水量分析页面设置'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <Tabs defaultActiveKey="2" className="system-tabs" >
                  <TabPane  tab='导出CSV字段设置' key="2" >
                    <ExportCSV />
                  </TabPane>
                  {/*<TabPane tab='页面表格显示字段设置' key="1">
                    <Fields />
                  </TabPane>*/}
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
