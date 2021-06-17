/**
 * Description: 测试页面（可做公共的后台表格）
 */
import React, { Component } from 'react';
import { Divider, Popconfirm, Icon, message, Modal } from 'antd';
import Filtrate from '../../components/common/Filtrate';
import Container from '../../components/common/Container';
import MyTable from '../../components/common/MyTable';
import MyPagination from '../../components/common/MyPagination';
import PublicService from '../../services/PublicService';
import config from '../../config';
import FormModal from "../../components/common/FormModal";
import request from '@/utils/request';

class TestPage extends Component {
  state = {
    pageIndex: 1,
    pageSize: config.pageSize,
    pageTotal: 0,
    tableData: [],
    tableLoading: false,
    modalShow: false,
    modalVal: {},
  };

  componentDidMount() {
    this.onSearch();
  };

  // 查询
  onSearch = (pageIndex= this.state.pageIndex, pageSize=this.state.pageSize) => {
    // let { pageIndex, pageSize } = this.state;
    const params = this.searchForm.props.form.getFieldsValue();
    let { searchUrl = '' } = this.props;
    this.setState({
      tableLoading: true
    }, () => {
      request({
        url: searchUrl,
        method: "GET",
        params: {
          current: pageIndex,
          size: pageSize,
          ...params
        }
      }).then(res => {
        if (res.code == 0) {
          this.setState({
            tableLoading: false,
            tableData: res.data.records,
            pageTotal: res.data.total
          })
        } else {
          message.error(res.message, 2)
        }
        this.setState({
          tableLoading: false,
        })
      })
    });
  };

  // 打开模态框
  onModalShow = (modalTitle, modalVal) => {
    const { detailUrl, callBackModalType, callBackModalVal, detailsArgument } = this.props;
    callBackModalType && callBackModalType(modalTitle)
    if (detailUrl && modalTitle !== "新增") {
      request({
        url:detailUrl,
        method:'GET',
        params:{id: detailsArgument ? modalVal[detailsArgument] : modalVal.objectid}
      }).then((res=>{
        if(res.code == 0){
          callBackModalVal && callBackModalVal(res.data)
          this.setState({
            modalShow: true,
            modalVal: res.data,
            modalTitle
          })
        }
      }))
    } else {
      this.setState({
        modalShow: true,
        modalVal,
        modalTitle
      })
      callBackModalVal && callBackModalVal(modalVal)
    }
  };


  // 渲染查询栏
  renderFiltrate = () => {
    const { searchConfig } = this.props
    const items = searchConfig;
    return (
      <Filtrate items={items} onSearch={this.onSearch} clearForm={this.onSearch} wrappedComponentRef={ref => this.searchForm = ref} />
    );
  };

  pageChange = (current,pageSize) => {
    this.setState({
      pageIndex:current,
      pageSize:pageSize
    },()=>{
        this.onSearch()
    })
  }

  // 渲染列表
  renderTable = () => {
    const t = this;
    const { pageIndex, pageSize, pageTotal, tableLoading, tableData } = t.state;
    const { containerConfig, tableColumns, tableConfig, } = this.props;
    // 删除按钮点击
    const deleteBtn = () => {
      const t = this;
      const { selectedRows = [] } = t.state;
      if (!selectedRows.length) {
        return message.warning("请选择要删除的数据！");
      }

      Modal.confirm({
        title: '提示',
        content: '是否删除当前勾选的数据?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => onDelete(PublicService.getDataByKey(selectedRows, "objectid"))
      });
    };

    // 删除事件
    const onDelete = (val) => {
      const hide = message.loading('删除中...', 0);
      hide();
      request({
        url: deleteUrl,
        method: "POST",
        data: val
      }).then(res => {
        if (res.code == 0) {
          message.success("删除成功！", 2);
          this.onSearch();
          this.setState({
            selectedRowKeys: [],
            selectedRows:[]
          })
        } else {
          message.error(res.message, 2)
        }
      })
    };

    const { tableDelete = false,tabelColumnFixed } = tableConfig;

    const columns = [
      { title: '序号', dataIndex: 'num', width: 92, align: 'center',fixed: tabelColumnFixed ? 'left': false },
      ...tableColumns,
      {
        title: '操作',
        dataIndex: '操作',
        align: 'center',
        fixed: tabelColumnFixed ? 'right' : false,
        width:160,
        render: (text, record) => (
          <div>
            <a onClick={t.onModalShow.bind(t, "查看", record)}>详情</a>
            <Divider type={'vertical'} />
            <a onClick={t.onModalShow.bind(t, "编辑", record)}>编辑</a>
            {
              !tableDelete &&
              <>
                <Divider type={'vertical'} />
                <Popconfirm
                  title="是否删除这条数据?"
                  onConfirm={onDelete.bind(t, [record.objectid])}
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                  <a style={{ color: 'red' }}>删除</a>
                </Popconfirm>
              </>
            }
          </div>
        ),
      },
    ];

    const { addOrUpdateUrl, deleteUrl, exportUrl, editUrl, importBtnUrl, extraBtn, headerShow = true } = containerConfig;

    return (
      <Container
        headerShow={headerShow}
        heightAuto={true}
        importBtnUrl={importBtnUrl}
        addBtn={addOrUpdateUrl ? t.onModalShow.bind(t, "新增", {}) : false}
        exportBtn={exportUrl ? () => message.success("导出") : false}
        editBtn={editUrl ? () => message.success("编辑") : false}
        deleteBtn={deleteUrl ? deleteBtn : false}
        extraBtn={extraBtn}
        extraHeight={35}
        {...containerConfig}
      >
        <MyTable
          heightAuto={true}
          columns={columns}
          loading={tableLoading}
          pagination={false}
          rowSelection={{
            columnWidth: 67,
            selectedRowKeys: t.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              t.setState({ selectedRowKeys, selectedRows });
            },
          }}
          dataSource={PublicService.transformArrayData(tableData, true, true, pageIndex, pageSize)}
          {...tableConfig}
        />
        <MyPagination
          pageSize={pageSize}
          current={pageIndex}
          total={pageTotal}
          onChange={t.pageChange}
          showSizeChanger={true}
          showSizeChanger
          showQuickJumper
          onShowSizeChange={t.pageChange}          
        />
      </Container>
    );
  };

  // 渲染弹窗
  renderModal = () => {
    const t = this;
    const {customSaveKey,containerConfig,callBackModalVal,mapUP,modalColumn=3} = t.props;
    const {addOrUpdateUrl} = containerConfig;
    const {modalShow} = t.state;
    const {modalTitle, modalVal, modalBtnLoading} = t.state;
    let disabled = modalTitle === "查看";

    // 关闭弹窗
    const modalCancel = () => {
      this.myForm.props.form.resetFields()
      this.setState({
        modalShow: false,
        modalVal: {}
      });
      callBackModalVal && callBackModalVal({})
    };

    // 弹窗保存
    const onModalSave = (val) => {
      const {modalItems} = this.props;
      if (modalVal.id) {
        val.id = modalVal.id;
      }
      if (modalVal.objectid) {
        val.objectid = modalVal.objectid;
      }
      // 自定义保存/需要删除的键值
      let errLength = 0;
      if (customSaveKey) {
        customSaveKey.map((item, idx) => {
          if (item.subKey) {
            val[item.key] = {};
            val[item.key][item.subKey] = item.val
          } else {
            if(item.isrequired && !item.val){
              errLength++;
              return false;
            }
            val[item.key] = item.val
          }
          if (item.delete) {
            delete val[item.delete];
          }
        })
      }
      if(errLength > 0){
        message.error("必填项不能为空");
        return false;
      }
      // 日期选择类型参数转换
      if (modalItems) {
        const tmFormat = "YYYY-MM-DD HH:mm:ss";
        for (const item of modalItems) {
          if (
            item.type == "datePicker" ||
            item.type == "monthPicker" ||
            item.type == "yearPicker"
          ) {
            if (val[item.paramName]) {
              val[item.paramName] = val[item.paramName].format(
                item.tmFormat || tmFormat
              );
            }
          }
          // 多选select
          if(item.type == "select" && item.itemProps.mode == "multiple"){
            if(val[item.paramName]){
              val[item.paramName] = val[item.paramName].join()
            }
          }
        }
      }

      this.setState({modalBtnLoading: true},()=>{
        request({
          url: addOrUpdateUrl,
          method: "POST",
          data: val
        }).then(res => {
          if (res.code == 0) {
            message.success("保存成功", 2);
            this.onSearch();
            modalCancel();
            this.setState({ modalBtnLoading: false });
          } else {
            message.error(res.message, 2)
            this.setState({ modalBtnLoading: false });
          }
        })
      });
    };

    const { modalItems, modalWidth } = t.props;

    const formConfig = {
      visible: modalShow,
      modalBtnLoading: modalBtnLoading,
      title: modalTitle,
      footerShow: !disabled && !mapUP,
      cancelBtn: true,
      onCancel: modalCancel,
     
    }
   
    return (
      <FormModal
        width={modalWidth}
        items={modalItems}
        wrappedComponentRef={ref => this.myForm = ref}
        disabled={disabled}
        onModalSave={onModalSave}
        formConfig={formConfig}
        key={modalVal.objectid}
        column={modalColumn}
      />
    )  
  };

  render() {
    const t = this;
    const {noModal = false} = t.props;
    return (
      <>
        {t.renderFiltrate()}
        {t.renderTable()}
        {!noModal?t.renderModal():null}
      </>
    );
  }
}

export default TestPage;
