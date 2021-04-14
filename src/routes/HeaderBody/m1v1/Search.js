/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button,Switch} from 'antd';
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
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
          <FormItem   >
            <Button type="primary" onClick={()=>this.props.handleSearch({
              page: 1,
              per_page: 30,
            })} icon='sync'>刷新</Button>
          </FormItem>
         <FormItem   >
            <Button type="primary" onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}</Button>
          </FormItem>

          <FormItem  label={formatMessage({id: 'intl.open_operating_bar'})}  style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('workstations')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('workstations',checked);
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
