/**
 * Created by GYL on 2018/7/27
 */
import React, {Component} from 'react';
import {Form} from 'antd';
import FormItem from "../../FormItem";

class MyForm extends Component {
  state = {};

  componentDidMount() {
    const t = this;
  };

  render() {
    const t = this;
    let {form, disabled, list = []} = t.props;
    return (
      <Form>
        {
          list && list.length > 0 &&
          list.map((v, i) => (
              <FormItem
                key={i}
                data={v}
                form={form}
                disabled={disabled}
                formItemLayout={{
                  labelCol: {span: v.labelCol || 4},
                  wrapperCol: {span: v.wrapperCol || 20},
                }}
              />
            )
          )
        }
      </Form>
    )
  }
}

export default Form.create()(MyForm);
