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
        {this.props.showAddBtn &&
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <FormItem   >
            <Button type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>
          </FormItem>

        </Row>
        }
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
