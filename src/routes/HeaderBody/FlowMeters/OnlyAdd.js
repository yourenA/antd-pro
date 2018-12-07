/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button} from 'antd';
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">

        <Row >

          <FormItem   >
            {this.props.showAddSiteBtn &&
            <Button type="primary" style={{marginRight: 8}} onClick={this.props.clickAddSite} icon='plus'>添加流量计站点</Button>
            }
            {this.props.showAddBtn &&
            <Button type="primary" onClick={this.props.clickAdd} icon='plus'>添加流量计</Button>
            }
          </FormItem>



        </Row>

      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
