/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button,Switch} from 'antd';
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">

        <Row >
          {this.props.showAddBtn &&
          <FormItem   >

            <Button type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>
          </FormItem>
          }
          <FormItem  label="打开操作栏" style={{float:'right'}}>
            <Switch defaultChecked={localStorage.getItem('canOperateDMA')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateDMA',checked);
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
