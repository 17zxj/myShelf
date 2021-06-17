/**
 * 表格上方筛选条件
 * input 输入框, select 下拉选, rangePicker 时间筛选框
 */
import React, { Component } from 'react';
import { Form, Button, Divider } from 'antd';
import config from '../../../config';
import WidgetFormItem from '../FormItem';
import styles from './index.less';

const FormItem = Form.Item;


class Filtrate extends Component {
  state = {};

  // 查询
  submit() {
    let t = this;
    let params = t.props.form.getFieldsValue();

    // 查询回调
    let { onSearch } = t.props;
    onSearch && onSearch(1,config.pageSize);
  }

  // 清空 Form 组件输入的内容
  clearForm() {
    let t = this;
    t.props.form.resetFields();

    // 清除回调
    let { clearForm } = t.props;
    clearForm && clearForm(1,config.pageSize);
  }

  render() {
    let t = this;
    let { items, form, clearBtnShow = true, submitBtnShow = true, className } = t.props;

    return (
      <div id="filtrate" className={`${styles.filtrate} ${className}`}>
        <Form layout="inline">
          {
            items && items.length > 0 &&
            items.map((item, index) => {
              if (item.type === 'line') {
                return (
                  <Divider key={index} type="vertical" style={{ margin: '10px 20px', height: 24 }}/>
                );
              } else if (item.type === 'lineH') {
                return (
                  <div
                    key={index}
                    style={{ width: '98%', margin: '0 auto', height: 1, borderTop: '1px dashed #DDD' }}/>
                );
              } else {
                return (
                  <WidgetFormItem key={index} formItem={item} form={form}/>
                );
              }
            })
          }
          {
            (submitBtnShow || clearBtnShow) &&
            <FormItem>
              {
                submitBtnShow &&
                <Button style={{ margin: "0 20px 0 0" }} type="primary" onClick={t.submit.bind(t)}>查询</Button>
              }
              {
                clearBtnShow &&
                <Button onClick={t.clearForm.bind(t)}>重置</Button>
              }
            </FormItem>
          }
        </Form>
      </div>
    );
  }
}

export default Form.create()(Filtrate);
