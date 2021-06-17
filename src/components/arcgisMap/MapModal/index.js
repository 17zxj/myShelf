/**
 * 公共弹框组件
 */
import React, { Component } from 'react';
import { Form, Row, Col, Button, Spin, Tabs } from 'antd';
import styles from './index.less';
import MyIcon from '../../common/MyIcon';
import FormItem from '../../common/FormItem';
import Chart from '../../common/Charts/Chart';
import YjThree from './yjThree';
import Video from '../../common/Video';

const { TabPane } = Tabs;
class MapModal extends Component {
  static defaultProps = {
    drag: true
  };

  state = {};

  componentDidMount() {
    let t = this;
    const { id } = t.props
    if (id) {
      t.dragFunc(id);
    } else {
      t.dragFunc("MapModal");
    }
  };

  // 拖拽
  dragFunc = (id) => {
    var Drag = document.getElementById(id);
    var style = null;
    if (window.getComputedStyle) {
      style = window.getComputedStyle(Drag, null);    // 非IE
    } else {
      style = Drag.currentStyle;  // IE
    }
    Drag.onmousedown = function (event) {
      var currentId = event.target.id;
      var parentId = event.target.parentNode.id
      var ev = event || window.event;
      event.stopPropagation();
      var disX = ev.clientX - Drag.offsetLeft;
      var disY = ev.clientY - Drag.offsetTop;
      let DragWidht = style.width.replace(/[^\d]/g, ' ');
      let DragHight = style.height.replace(/[^\d]/g, ' ');
      if (currentId.indexOf("dragable") > -1 || parentId.indexOf("dragable") > -1) {
        document.onmousemove = function (event) {
          var ev = event || window.event;
          // if (ev.clientX - disX >= 0 && ev.clientX - disX < (window.innerWidth - DragWidht - 240)) {
          Drag.style.left = ev.clientX - disX + "px";
          // }
          // if (ev.clientY - disY > 0 && ev.clientY - disY < (window.innerHeight - DragHight - 110)) {
          Drag.style.top = ev.clientY - disY + "px";
          // }
          Drag.style.cursor = "move";
        };
      }

    };
    Drag.onmouseup = function () {
      document.onmousemove = null;
      this.style.cursor = "default";
    };
  };

  // 渲染底部
  renderFooter() {
    let t = this;
    let { footerShow, modalBtnLoading = false } = t.props;
    if (footerShow) {
      let {
        TSBtn, TSTitle = "暂存", onTS,
        returnBtn, returnTitle = "退回", onReturnBack,
        saveBtn = true, saveTitle = "保存", onModalSave, // 默认展示保存按钮
        submitBtn, submitTitle = "提交", onSubmit,
        cancelBtn, cancelTitle = "取消", onCancel,
        buttonList = [] // 自定义按钮
      } = t.props;

      // 默认按钮
      let defaultBtnList = [
        ...(cancelBtn ? [{ title: cancelTitle, onClick: onCancel, className: styles.cancelBtn }] : []), // 取消
        ...(saveBtn ? [{ title: saveTitle, onClick: onModalSave, className: styles.saveBtn }] : []), // 保存
        ...(returnBtn ? [{ title: returnTitle, onClick: onReturnBack, className: styles.cancelBtn }] : []), // 退回
        ...(TSBtn ? [{ title: TSTitle, onClick: onTS, className: styles.saveBtn }] : []), // 暂存
        ...(submitBtn ? [{ title: submitTitle, onClick: onSubmit, className: styles.submitBtn }] : []), // 提交
        ...buttonList // 自定义按钮列表
      ];
      return (
        <div className={styles.showCenter}>
          {
            defaultBtnList.map((item, index) => (
              <Button
                key={index}
                loading={modalBtnLoading}
                className={item.className}
                onClick={item.onClick}>
                {item.title}
              </Button>
            ))
          }
        </div>
      )
    }
  }

  renderContent(items) {
    const {
      form, column = 2, formLayout = 'horizontal', loading = false, style
    } = this.props;
    let defaultCol = 24 / column; // 默认2列布局
    return <div className={styles["MapModal-content"]} style={{ ...style }}>
      <div className={styles.modalWrap}>
        <Spin spinning={loading}>
          <Form layout={formLayout}>
            <Row gutter={12} type={''} align={'middle'}>
              {
                items && items.map((item, index) => {
                  if (item.type === 'blank') {
                    return (
                      <Col
                        key={item.key || index}
                        span={item.span || defaultCol}
                        offset={item.offset}
                        style={item.style}
                        className={styles["subTitle"]}
                      >
                        {item.content}
                      </Col>
                    );
                  }
                  if (item.type === 'tabs') {

                    return (
                      <Col
                        key={item.key || index}
                        span={item.span || defaultCol}
                        offset={item.offset}
                        style={{ position: 'relative' }}>
                        <Tabs defaultActiveKey="1">
                          {
                            item.child.map((lis) => {
                              {
                                if (lis.type === 'chartLine') {
                                  return (<TabPane tab={lis.title} key="1">
                                    {lis.child.map((it, index) => {
                                      return (
                                        <div className="searchItem">
                                          <FormItem
                                            disabled={it.disabled}
                                            formItem={it}
                                            form={form}
                                            formItemLayout={formLayout === 'horizontal'} />
                                        </div>
                                      )
                                    })}
                                    <Chart height={'260px'} name={lis.name} data={lis.data} dataZoomShow={true} xAxisData={lis.xAxisData} gridTop={lis.gridTop}></Chart>
                                  </TabPane>)
                                } else {
                                  return (<TabPane tab={lis.title} key="2">
                                    <YjThree code={lis.code} />
                                  </TabPane>)
                                }
                              }
                            })
                          }
                        </Tabs>
                      </Col>
                    )
                  }
                  if (item.type === 'video') {
                    // console.log("item",item)
                    return (
                      <Col
                        key={index}
                        span={item.span || defaultCol}
                        offset={item.offset}
                        style={item.style}
                        className={item.className}
                      >
                        <div style={{width:'100%',height:218}}>
                          <Video width={'100%'} height={'100%'}  file={item.initialValue}>
                          </Video>
                        </div>
                        
                      </Col>
                    )
                  }
                  return (
                    <Col
                      key={index}
                      span={item.span || defaultCol}
                      offset={item.offset}
                      style={item.style}
                      className={item.className}
                    >
                      <FormItem
                        disabled={item.disabled}
                        formItem={item}
                        form={form}
                        formItemLayout={formLayout === 'horizontal' && {
                          labelCol: { span: item.labelCol || 10 },
                          wrapperCol: { span: item.wrapperCol || 14 },
                        }} />
                    </Col>
                  );
                })
              }
            </Row>
          </Form>
        </Spin>
      </div>
    </div>
  }

  render() {
    let t = this;
    let { width = '420px', icon, size, title, contentConfig, visible, closeModal, isCustom = false, style, isIcon = false, isEdit = true, id, locate } = t.props;
    return (
      <div className={styles["MapModal"]} style={{ width: width, display: visible ? "block" : "none", ...style }} id={id ? id : "MapModal"}>
        <div className={styles["MapModal-header"]} id='dragable1'>
          <span className={styles["MapModal-titleIcon"]} id='dragable2'>
            {isIcon ? icon
              : <MyIcon type={icon} style={{ fontSize: size || '14px', marginRight: '6px' }} id='dragable3'/>
            }
            {title}
          </span>
          <span id='dragable6'>
            {isEdit ? <MyIcon title="定位" onClick={locate} type="icon-didian" id='dragable4' style={{ fontSize: '18px', marginRight: '6px', cursor: 'pointer', color: '#FFF' }} /> : null}
            <MyIcon type="icon-public-guanbi" id='dragable5' style={{ fontSize: '18px', marginRight: '6px', cursor: 'pointer' }} onClick={closeModal} />
          </span>
        </div>
        {
          isCustom ? <div>{t.props.children}</div> : t.renderContent(contentConfig)
        }
      </div>
    )
  }
}


export default Form.create()(MapModal);
