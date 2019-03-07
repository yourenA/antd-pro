/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from "react";
import {Tabs} from "antd";
import {connect} from "dva";
import MeterDataExport from './MeterDataExport/Sort'
import MeterSortExport from './MeterSortExport/Sort'
const TabPane = Tabs.TabPane;
import {injectIntl} from 'react-intl';
@injectIntl
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
    const {intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    return (
                <Tabs  className="system-tabs"  tabPosition='left' >
                  <TabPane tab={formatMessage({id: 'intl.export_field_info'})} key="1">
                      <MeterDataExport />
                    </TabPane>
                  <TabPane  tab={formatMessage({id: 'intl.export_sort_info'})} key="2" >
                    <MeterSortExport />
                  </TabPane>
                </Tabs>
    );
  }
}

export default connect()(EditPassword);
