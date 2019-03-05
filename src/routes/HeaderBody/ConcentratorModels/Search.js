/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button,Switch} from 'antd';
import {injectIntl} from 'react-intl';
const FormItem = Form.Item;
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">

        <Row >
          {this.props.showAddBtn &&<FormItem   >
            <Button type="primary" onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>
          </FormItem>
          }
          <FormItem  label={formatMessage({id: 'intl.open_operating_bar'})} style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateConcentratorModel')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateConcentratorModel',checked);
              this.props.changeShowOperate()
            }} />
          </FormItem>
        </Row>

      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
