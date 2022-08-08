
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, DatePicker, message, Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

const orderTable = (props) => {
  let { dispatch, modalInfo, toFatherValue, saveQuerySelect, modalDisabled } = props;
  let [tableColumn, setTableColumn] = useState([]); // 列表数据
  let [billList, setBillList] = useState([]) //选中的数据
  let [billKeyList, setBillKeyList] = useState([]) //选中数据的key

  useEffect(() => {
    // modalInfo.orderType   订单分类 1:道路救援,2:代驾服务,3:代办年检,4:事故代步车,5:安全检测,6:轮胎存换,7:营销投放
    if (modalInfo.tableType == 1) {
      setTableColumn(handleRescueColumn());
    } 
    if (modalInfo.tableType == 2) {
      setTableColumn(handleDrivingColumn());
    } 
    if (modalInfo.tableType == 3) {
      setTableColumn(handleExpeditedServiceColumn());
    } 
    if (modalInfo.tableType == 4) {
      setTableColumn(handleScooterColumn());
    } 
    if (modalInfo.tableType == 5) {
      setTableColumn(handleSafetyDetectionColumn());
    } 
    if (modalInfo.tableType == 6) {
      setTableColumn(handleReplacementColumn());
    } 
    if (modalInfo.tableType == 7) {
      setTableColumn(handleCardColumn());
    } 
  }, [])
  // 救援列表column   
  let handleRescueColumn = () => {
    let rescueColumn = [
      { title: '壹路通订单号', dataIndex: 'orderNo', key: 'orderNo', fixed: 'left', render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'reportDate', key: 'reportDate', render: (reportDate, record) => timeRender(reportDate, record) },
      { title: '服务状态', dataIndex: 'statusName', key: 'statusName' },
      { title: '服务项目', dataIndex: 'serviceName', key: 'serviceName' },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', key: 'thirdOrderNo' },
      { title: '金额(元)', dataIndex: 'balanceAmount', key: 'balanceAmount', align: 'right', render: (balanceAmount, record) => moneyRender(balanceAmount, record) },
      { title: '用户手机号', dataIndex: 'userMobile', key: 'userMobile',  },
      { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo',  },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag', fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return rescueColumn;
  }
  // 代办年检列表column
  let handleExpeditedServiceColumn = () => {
    let expeditedServiceColumn = [
      { title: '壹路通订单号', dataIndex: 'orderNo', key: 'orderNo', fixed: 'left', render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'reportDate', key: 'reportDate', render: (reportDate, record) => timeRender(reportDate, record)},
      { title: '服务状态', dataIndex: 'statusName', key: 'statusName' },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', key: 'thirdOrderNo', render: (thirdOrderNo, record) => textRender(thirdOrderNo, record) },
      { title: '用户手机号', dataIndex: 'userMobile', key: 'userMobile',  },
      { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo',  },
      { title: '金额(元)', dataIndex: 'balanceAmount', key: 'balanceAmount', align: 'right', render: (balanceAmount, record) => moneyRender(balanceAmount, record) },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag',  fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return expeditedServiceColumn;
  }
  // 代驾列表column
  let handleDrivingColumn = () => {
    let drivingColumn = [
      { title: '壹路通订单号', dataIndex: 'orderNo', key: 'orderNo',  fixed: 'left', render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'reportDate', key: 'reportDate', render: (reportDate, record) => timeRender(reportDate, record)},
      { title: '服务状态', dataIndex: 'statusName', key: 'statusName'},
      { title: '来源工单号', dataIndex: 'thirdOrderNo', key: 'thirdOrderNo', render: (thirdOrderNo, record) => textRender(thirdOrderNo, record)  },
      { title: '用户手机号', dataIndex: 'userMobile', key: 'userMobile',  },
      { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo',  },
      { title: '金额(元)', dataIndex: 'balanceAmount', key: 'balanceAmount', align: 'right', render: (balanceAmount, record) => moneyRender(balanceAmount, record) },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag',  fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return drivingColumn
  }
  // 安全检测列表column
  let handleSafetyDetectionColumn = () => {
    let safetyDetectionColumn = [
      { title: '壹路通订单号', dataIndex: 'orderNo', key: 'orderNo',  fixed: 'left', render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'reportDate', key: 'reportDate',  render: (reportDate, record) => timeRender(reportDate, record)},
      { title: '服务状态', dataIndex: 'statusName', key: 'statusName'},
      { title: '来源工单号', dataIndex: 'thirdOrderNo', key: 'thirdOrderNo', render: (thirdOrderNo, record) => textRender(thirdOrderNo, record)  },
      { title: '用户手机号', dataIndex: 'userMobile', key: 'userMobile',  },
      { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo',  },
      { title: '金额(元)', dataIndex: 'balanceAmount', key: 'balanceAmount', align: 'right', render: (balanceAmount, record) => moneyRender(balanceAmount, record) },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag', fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return safetyDetectionColumn
  }
  // 代步车列表column
  let handleScooterColumn = () => {
    let scooterColumn = [
      { title: '壹路通订单号', dataIndex: 'orderNo', key: 'orderNo',  width: 280, fixed: 'left', render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'reportDate', key: 'reportDate',  render: (reportDate, record) => timeRender(reportDate, record)},
      { title: '服务状态', dataIndex: 'statusName', key: 'statusName' },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', key: 'thirdOrderNo', render: (thirdOrderNo, record) => textRender(thirdOrderNo, record) },
      { title: '用户手机号', dataIndex: 'userMobile', key: 'userMobile',  },
      { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo',  },
      { title: '金额(元)', dataIndex: 'balanceAmount', key: 'balanceAmount', align: 'right', render: (balanceAmount, record) => moneyRender(balanceAmount, record) },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag',  fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return scooterColumn
  }
  // 轮胎换存列表column
  let handleReplacementColumn = () => {
    let replacementColum = [
      { title: '壹路通订单号', dataIndex: 'orderNo', key: 'orderNo',  fixed: 'left', render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'reportDate', key: 'reportDate',  render: (reportDate, record) => timeRender(reportDate, record)},
      { title: '服务状态', dataIndex: 'statusName', key: 'statusName' },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', key: 'thirdOrderNo', render: (thirdOrderNo, record) => textRender(thirdOrderNo, record) },
      { title: '用户手机号', dataIndex: 'userMobile', key: 'userMobile',  },
      { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo',  },
      { title: '金额(元)', dataIndex: 'balanceAmount', key: 'balanceAmount', align: 'right', render: (balanceAmount, record) => moneyRender(balanceAmount, record) },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag',  fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return replacementColum
  }
  // 卡券列表Column
  let handleCardColumn = () => {
    let cardColumn = [
      { title: '卡券/卡包编号', dataIndex: 'cardId', key: 'cardId',  render: (cardId, record) => orderRender(cardId, record) },
      { title: '卡券/卡包标题', dataIndex: 'couponSkuName', key: 'couponSkuName', render: (couponSkuName, record) => textRender(couponSkuName, record) },
      { title: '卡券品类', dataIndex: 'couponCategoryTypeName', key: 'couponCategoryTypeName', render: (couponCategoryTypeName, record) => textRender(couponCategoryTypeName, record) },
      { title: '结算节点时间', dataIndex: 'balanceNodeTime', key: 'balanceNodeTime',  render: (balanceNodeTime, record) => timeRender(balanceNodeTime, record)},
      { title: '用户手机号', dataIndex: 'customerPhone', key: 'customerPhone', render: (customerPhone) => <span>{customerPhone || '-'}</span> },
      { title: '用户身份证号', dataIndex: 'customerIdentityNo', key: 'customerIdentityNo', render: (customerIdentityNo, record) => textRender(customerIdentityNo, record) },
      { title: '结算节点', dataIndex: 'balanceNodeName', key: 'balanceNodeName',  render: (balanceNodeName, record) => textRender(balanceNodeName, record) },
      { title: '金额(元)', dataIndex: 'saleAmount', key: 'saleAmount', align: 'right', render: (saleAmount, record) => moneyRender(saleAmount, record) },
      { title: '结算状态', dataIndex: 'billFlagName', key: 'billFlagName', render: (billFlagName, record)=> billFlagRenDer(billFlagName, record) },
      { title: '操作', dataIndex: 'billFlag', key: 'billFlag', fixed: 'right', render: (billFlag, record) => operatingRender(billFlag, record) },
    ]
    return cardColumn
  }
  // 案件订单号 依据订单分类点击跳转表格详情依据表格
  let orderRender = (orderNo, record) => {
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={() => { goToOrderDetail(record, 1) }}>{orderNo}</LtbItem>
    </ListTableBtns>
  }
  let goToOrderDetail = (record, type) => {
    // modalInfo.orderType   订单分类 1:道路救援,2:代驾服务,3:代办年检,4:事故代步车,5:安全检测,6:轮胎存换,7:营销投放
    savaQuery(modalInfo.querySelect); // 保存当前页面的查询参数   用作详情页返回
    let orderDetailInfo = { type, ...record }
    if (modalInfo.tableType == 1) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailRescue', state: { orderDetailInfo }, query: { utype: type } })
    if (modalInfo.tableType == 2) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailDriving', state: { orderDetailInfo }, query: { utype: type } })
    if (modalInfo.tableType == 3) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailExpeditedService', state: { orderDetailInfo }, query: { utype: type } })
    if (modalInfo.tableType == 4) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailScooter', state: { orderDetailInfo }, query: { utype: type } })
    if (modalInfo.tableType == 5) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailSafetyDetection', state: { orderDetailInfo }, query: { utype: type } })
    if (modalInfo.tableType == 6) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailTyre', state: { orderDetailInfo }, query: { utype: type } })
    if (modalInfo.tableType == 7) return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailMarketing', state: { orderDetailInfo }, query: { utype: type } })
  }
  // 操作
  let operatingRender = (billFlag, record) => {
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={() => { goToOrderDetail(record, 2) }}>处理</LtbItem>
    </ListTableBtns>
  }
  /*卡券列表 选中 配置*/
  const rowSelection = {
    onChange: (key, value) => {
      setBillKeyList(key)
      setBillList(value || []);
      toFatherValue(false, value);
    },
    type: 'checkbox',
    hideSelectAll: false,
    selectedRowKeys: billKeyList,
    getCheckboxProps: (record) => ({
      disabled: modalDisabled, 
    }),
  }

  // 保存查询参数到state中，用于返回页面时回显
  let savaQuery = (queryInfo) => {
    dispatch({
      type: 'billSettlementReconciliationModel/saveQuerySelect',
      payload: {
        queryInfo,
      },
    });
  }

  // 时间render
  let timeRender = (timeStr, record) => {
    return <ListTableTime>{timeStr}</ListTableTime>
  }

  // 金额render
  let moneyRender = (text, record) => {
    return <MoneyFormat acc={2}>{text}</MoneyFormat>
  }

  // 文本超出显示render
  let textRender = (text, record) => {
    return <TextEllipsis>{text || '-'}</TextEllipsis>
  }

  // 结算状态render
  let billFlagRenDer = (text, record) => {
    // 结算状态:1:已生成账单，2:待确认，3:异议，4:已确认
    if(record.billFlag==1) return <StateBadge color="#32D1AD">{text}</StateBadge>
    if(record.billFlag==2) return <StateBadge color="#FF4A1A">{text}</StateBadge>
    if(record.billFlag==3) return <StateBadge color="#C91132">{text}</StateBadge>
    if(record.billFlag==4) return <StateBadge color="#2FB6E4">{text}</StateBadge>
  }

  return (
    <>
      <Table
        locale={{ emptyText: '暂无数据' }}
        rowSelection={{ ...rowSelection }}
        columns={tableColumn}
        rowKey={(record, index) => index}
        dataSource={modalInfo.list}
        pagination={false}
        scroll={{ x: 600 }}
        loading={{ spinning: false, delay: 500 }}
      />
    </>
  )
}

export default connect(({ billSettlementReconciliationModel }) => ({
  saveQuerySelect: billSettlementReconciliationModel.saveQuerySelect
}))(orderTable)







