/***
 * table组件 定制了表头样式
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import PublicService from '../../../services/PublicService';
import { Resizable  } from 'react-resizable';
import styles from './index.less';

class MyTable extends Component {
  static defaultProps = {
    columnLayer: 1, // 头部的层级(以children来划分)
    heightAuto: false, // 自动获取高度
    editCode: null, // 编辑按钮权限
    noResize: false //列宽是否可拖拽自定义
  };

  state = {
    tableHeight: 650,
    columns:[]
  };

  componentDidMount() {
    let { heightAuto } = this.props;
    if (heightAuto) {
      window.setTimeout(() => {
        this.setTableHeight();
        window.addEventListener('resize', this.setTableHeight)
      }, 10);
    }
    if(this.props.columns && this.props.columns.length){
      this.setState({
        columns:this.props.columns
      })
      this.computeWidth()
    }
  };

  componentDidUpdate(prevProps){
    if(this.props.columns.length != prevProps.columns.length){
      this.setState({
        columns:this.props.columns
      })
      this.computeWidth()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setTableHeight)
  }

  // 设置表格的高度
  setTableHeight = () => {
    let { columnLayer } = this.props;
    let tableHeight = 650;
    // let tableHeaderHeight = document.getElementsByClassName('ant-table-thead')[0].offsetHeight; // table头高度
    let ContainerHeader = document.getElementById('container'); // 获取按钮组的高度
    let PublicContainerHeader = document.getElementById('PublicContainerHeader'); // 获取按钮组的高度
    let PublicPageHeader = document.getElementById('PublicPage'); // 获取按钮组的高度
    if (ContainerHeader) {
      tableHeight = ContainerHeader.offsetHeight - 20 - (columnLayer * 30);
    }
    if (PublicContainerHeader) {
      let PublicContainerHeaderHeight = PublicContainerHeader.offsetHeight;
      tableHeight = tableHeight - PublicContainerHeaderHeight;
    }
    if (PublicPageHeader) {
      let PublicPageHeaderHeight = PublicPageHeader.offsetHeight;
      tableHeight = tableHeight - PublicPageHeaderHeight - 6;
    }
    // if (tableHeaderHeight > 40) {
    //   tableHeight = tableHeight - 22;
    // }
    this.setState({
      tableHeight
    });
  };

  getScroll = () => {
    const t = this;
    let { scroll, heightAuto, columns } = this.props;
    let { tableHeight } = t.state;
    let SCROLL = scroll?JSON.parse(JSON.stringify(scroll)) : {};
    if (heightAuto) {
      if (scroll && scroll.x) {
        SCROLL.x = scroll.x;
      } else {
        let WIDTH = document.body.clientWidth;
        if (WIDTH < 1500) {
          let x = PublicService.getTableWidth(columns);
          if (x >= 1050) {
            SCROLL.x = x;
          }
        }
      }
      SCROLL.y = tableHeight;
      if(scroll && scroll.y){
        SCROLL.y = scroll.y
      }
    }
    return SCROLL;
  };

  ResizeableTitle = props => {
    const { onResize,  className, width, ...restProps } = props;
  
    if (!width) {
      return <th {...restProps} />;
    }

    // 列中增加codeTD className 则表示该列不可拖动宽度 
    if(className.indexOf("codeTd") !== -1){
      return <th {...restProps} />;
    }
  
    return (
      <Resizable
        width={width}
        height={100}
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th {...restProps} />
      </Resizable>
    );
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  components = {
    header: {
      cell: this.ResizeableTitle,
    },
  };

  // 计算出未设置宽度的列的宽度
  computeWidth = () => {
    let {columns} = this.props;
    let tolWidth = document.getElementById("wpTable").clientWidth-40
    let noWidthCol = 0
    columns.map((v,i)=>{
      if(!v.width){
        noWidthCol++
      }
      if(v.width){
        tolWidth = tolWidth-v.width
      }
    })
    let comWidth = Math.floor(tolWidth/noWidthCol)
    this.setState({
      comWidth
    })
  }

  render() {
    const t = this;
    const {noResize = false,heightAuto,height,extraHeight = 48} = t.props;
    let {tableHeight} = this.state;
    const columns = noResize?t.state.columns:t.state.columns.map((col, index) => ({
      ...col,
      ellipsis: true,
      onHeaderCell: column => ({
        width: column.width || t.state.comWidth,
        onResize: t.handleResize(index),
      }),
     
    }));

    return (  
      <div id="wpTable" className={styles["wp-table"]} >
        <Table
          bordered
          pagination={false}
          size={"middle"}
          {...this.props}
          scroll={t.getScroll()}
          columns={columns}
          components={noResize ?{}: t.components}
        />
      </div>
    );
  }
}

export default MyTable;
