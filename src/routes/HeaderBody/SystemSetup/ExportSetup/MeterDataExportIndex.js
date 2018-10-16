/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Tabs} from "antd";
import {connect} from "dva";
import MeterDataExport from './MeterDataExport/Sort'
import MeterSortExport from './MeterSortExport/Sort'
const TabPane = Tabs.TabPane;

class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
                <Tabs  className="system-tabs"  tabPosition='left' >
                  <TabPane tab='导出字段信息(列)' key="1">
                      <MeterDataExport />
                    </TabPane>
                  <TabPane  tab='导出排序信息(行)' key="2" >
                    <MeterSortExport />
                  </TabPane>
                </Tabs>
    );
  }
}

export default connect()(EditPassword);
