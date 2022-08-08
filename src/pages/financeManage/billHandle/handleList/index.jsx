import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Row, Col, Space, Table, Button, message, Modal, Pagination, Form, Input, Select, DatePicker, Checkbox, Spin } from "antd";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment'
import 'moment/locale/zh-cn'
import { UploadOutlined, ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
import { QueryFilter } from '@ant-design/pro-form';
import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";
import { GetDownFile } from "@/services/contract";
import style from "./style.less";
import { parseToThousandth } from '@/utils/date';
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
// 账单明细
const handleListInfo = (props) => {
  let { dispatch, billHandleInfo, location } = props;
  let [form] = Form.useForm();
  let [tableList, setTableList] = useState([]);
  let [keyList, setKeyList] = useState([]);
  let [checkList, setCheckList] = useState([]);
  let [totalAmount, setTotalAmount] = useState(0); // 底部悬浮结算总金额
  let [optionalList, setOptionalList] = useState([]);// 可选择导出(导入)数据
  let [optionalVilible, setOptionalVilible] = useState(false);// 可选择导出(导入)显示与隐藏
  let [optionalVilibleTitle, setOptionalVilibleTitle] = useState(''); // 可选择导出(导入)弹层的标题
  let [optionalVilibleBtnText, setOptionalVilibleBtnText] = useState('')// 可选择导出(导入)弹层按钮文字
  let [multipleChoiceShow, setMultipleChoiceShow] = useState(false); // 控制全选遮罩层的显示与隐藏
  let [totalAmountInfo, setTotalAmountInfo] = useState(0);// 汇总金额

  let [indeterminate, setIndeterminate] = useState(true);
  let [checkAll, setCheckAll] = useState(false);
  let [checkedList, setCheckedList] = useState([]);
  let [optionalList2, setOptionalList2] = useState([]);// 可选择导出(导入)数据-name


  //账单明细
  let realColumns = [];
  if (billHandleInfo.serviceName == '救援') {
    realColumns = [
      { title: '壹路通订单号', dataIndex: 'orderNo', width: 220, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'orderCreateTime', width: 280 },
      { title: '服务状态', dataIndex: 'orderStatusName', width: 120 },
      { title: '服务项目', dataIndex: 'serviceName', width: 220 },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', width: 280 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '用户手机号', dataIndex: 'userMobile', width: 180 },
      { title: '车牌号', dataIndex: 'plateNo', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 140 },
    ]
  } else if (billHandleInfo.serviceName == '代办年检') {
    realColumns = [
      { title: '壹路通订单号', dataIndex: 'orderNo', width: 220, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'orderCreateTime', width: 280 },
      { title: '服务状态', dataIndex: 'orderStatusName', width: 120 },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', width: 280 },
      { title: '用户手机号', dataIndex: 'userMobile', width: 180 },
      { title: '车牌号', dataIndex: 'plateNo', width: 140 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 140 },
    ]
  } else if (billHandleInfo.serviceName == '代驾') {
    realColumns = [
      { title: '壹路通订单号', dataIndex: 'orderNo', width: 220, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'orderCreateTime', width: 280 },
      { title: '服务状态', dataIndex: 'orderStatusName', width: 120 },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', width: 280 },
      { title: '用户手机号', dataIndex: 'userMobile', width: 180 },
      { title: '车牌号', dataIndex: 'plateNo', width: 140 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 140 },
    ]
  } else if (billHandleInfo.serviceName == '安全检测') {
    realColumns = [
      { title: '壹路通订单号', dataIndex: 'orderNo', width: 220, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'orderCreateTime', width: 280 },
      { title: '服务状态', dataIndex: 'orderStatusName', width: 120 },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', width: 280 },
      { title: '用户手机号', dataIndex: 'userMobile', width: 180 },
      { title: '车牌号', dataIndex: 'plateNo', width: 140 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 140 },
    ]
  } else if (billHandleInfo.serviceName == '代步车') {
    realColumns = [
      { title: '壹路通订单号', dataIndex: 'orderNo', width: 220, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'orderCreateTime', width: 280 },
      { title: '服务状态', dataIndex: 'orderStatusName', width: 120 },
      { title: '来源工单号', dataIndex: 'thirdOrderNo', width: 280 },
      { title: '用户手机号', dataIndex: 'userMobile', width: 180 },
      { title: '车牌号', dataIndex: 'plateNo', width: 140 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 140 },
    ]
  } else if (billHandleInfo.serviceName == '轮胎存换') {
    realColumns = [
      { title: '壹路通订单号/案件号', dataIndex: 'orderNo', width: 220, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '受理时间', dataIndex: 'orderCreateTime', width: 280 },
      { title: '服务状态', dataIndex: 'orderStatusName', width: 120 }, ,
      { title: '渠道订单号/工单号', dataIndex: 'thirdOrderNo', width: 160 },
      { title: '用户手机号', dataIndex: 'userMobile', width: 180 },
      { title: '车牌号', dataIndex: 'plateNo', width: 140 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 140 },
    ]
  } else if (billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放') {
    realColumns = [
      { title: '卡券/卡包编号', dataIndex: 'cardId', width: 180, render: (orderNo, record) => orderRender(orderNo, record) },
      { title: '卡券/卡包标题', dataIndex: 'couponSkuName', width: 240 },
      { title: '卡券品类', dataIndex: 'couponCategoryName', width: 100 },
      { title: '结算节点时间', dataIndex: 'balanceNodeTime', width: 280 },
      { title: '用户手机号', dataIndex: 'customerPhone', width: 140 },
      { title: '用户身份证号', dataIndex: 'customerIdentityNo', width: 200 },
      { title: '结算节点', dataIndex: 'balanceNodeStr', width: 140 },
      { title: '金额(元)', dataIndex: 'balanceAmount', width: 140 },
      { title: '结算状态', dataIndex: 'balanceFlagStr', width: 180 },
    ]
  }

  let goToOrderDetail = (record, type) => {
    let orderDetailInfo = { type, ...record }
    let toQuery = history.location.query;
    toQuery.utype = type;
    if (billHandleInfo.serviceName == '救援') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailRescue', state: { orderDetailInfo }, query: toQuery })
    if (billHandleInfo.serviceName == '代驾') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailDriving', state: { orderDetailInfo }, query: toQuery })
    if (billHandleInfo.serviceName == '代办年检') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailExpeditedService', state: { orderDetailInfo }, query: toQuery })
    if (billHandleInfo.serviceName == '代步车') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailScooter', state: { orderDetailInfo }, query: toQuery })
    if (billHandleInfo.serviceName == '安全检测') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailSafetyDetection', state: { orderDetailInfo }, query: toQuery })
    if (billHandleInfo.serviceName == '轮胎存换') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailTyre', state: { orderDetailInfo }, query: toQuery })
    if (billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放') return history.push({ pathname: '/financeManage/billSettlementReconciliation/detailMarketing', state: { orderDetailInfo }, query: toQuery })
  }

  let orderRender = (orderNo, record) => {
    return <span className={style.click_blue} onClick={() => { goToOrderDetail(record, 1) }}>{orderNo}</span>
  }

  let [total, setTotal] = useState(0);
  let [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10
  });

  const pageChange=(page,pageSize)=>{
    setCheckList([]);
    setKeyList([]);

    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page;
    this_payload.pageSize = pageSize;
    setPayload(this_payload)
  }
  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setCheckList([]);
    setKeyList([]);
    setPayload(this_payload)

  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setCheckList([]);
    setKeyList([]);
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageSize)
    return `共${total}条记录 第 ${payload.pageNum} / ${totalPage}  页`
  }
  //搜索
  let onFinish = (values) => {
    let toPayload = {
      pageNum: 1,
      pageSize: 10
    }
    setCheckList([]);
    setKeyList([]);
    setPayload({ ...toPayload });
  };

  // 选择导出列
  const selectOptchColmons = () => {
    dispatch({
      type: 'billHandleModel/channelBalanceBillSelectZktExportFiled',
      payload: {
        method: 'postJSON',
        params: {
          serviceName: billHandleInfo.serviceName,
        },
      },
      callback: (res) => {
        console.log(res)
        if (res.result.code == '0') {
          setOptionalList(res.body);
          let toOptionalList=[];
          let toOptionalListCheck=[];
          res.body.forEach((e)=>{
            toOptionalList.push(e.name);
            if(e.checked){
              toOptionalListCheck.push(e.name);
            }
          })
          setOptionalList2([...toOptionalList]);
          setCheckedList([...toOptionalListCheck]);
          setOptionalVilible(true);
          setIndeterminate(!!toOptionalListCheck.length && toOptionalListCheck.length < toOptionalList.length);
          setCheckAll(toOptionalListCheck.length === toOptionalList.length);
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 可选择导入列change事件
  let optionalChange = (list) => {
    setCheckedList([...list]);
    setIndeterminate(!!list.length && list.length < optionalList2.length);
    setCheckAll(list.length === optionalList2.length);
    const res = optionalList2.filter((item)=>!list.some((lItem)=>lItem===item)); // 查找被点击的多选框是谁  
    let newList = JSON.parse(JSON.stringify(optionalList))
    if(checkAll) {
      newList.forEach(item => {
        if(res.length>0) {
          res.forEach(r => {
            if(item.name == r) return item.checked = false;
          })
        }else {
          item.checked = true
        }
      })
    }else {
      newList.forEach(item => {
        item.checked = !checkAll
        res.forEach(r => {
          if(item.name == r) return item.checked = checkAll;
        })
      })
    }
    setOptionalList(newList)
  }

  // 二次导出下载
  let exportBillDetails = () => {
    let toQuery = form.getFieldsValue();
    toQuery.billId = history.location.query.billId;
    toQuery.serviceName = billHandleInfo.serviceName;
    let toOptionalList=optionalList.filter(item => checkedList.some((items) => item.name == items));;
    toQuery.exportFileds = toOptionalList;
    if (toQuery.reportTime) {
      toQuery.reportStartDate = moment(toQuery.reportTime[0]).format('YYYY-MM-DD');
      toQuery.reportEndDate = moment(toQuery.reportTime[1]).format('YYYY-MM-DD')
    }
    if (toQuery.balanceNodeTime) {
      toQuery.balanceNodeStartTime = moment(toQuery.balanceNodeTime[0]).format('YYYY-MM-DD');
      toQuery.balanceNodeEndTime = moment(toQuery.balanceNodeTime[1]).format('YYYY-MM-DD')
    }
    let toPayInfo = payload;
    toPayInfo.query = toQuery;
    dispatch({
      type: optionalVilibleBtnText == '导出' ? 'billHandleModel/exportBillDetail' : 'billHandleModel/channelBalanceBillExportPDFBillDetail',
      payload: {
        method: 'postJSON',
        params: toPayInfo,
      },
      callback: (res) => {
        if (res.result.code == '0') {
          downloadFileEvent(res.body.fileId, '账单明细')
          setOptionalVilible(false)
        } else {
          message.error(res.result.message)
        }
      }
    });

  }

  //导出
  const orderExport = () => {
    setOptionalVilibleTitle('选择导出列');
    setOptionalVilibleBtnText('导出');
    selectOptchColmons();
  }

  // 下载盖章明细(pdf)
  let downloadDetails = () => {
    setOptionalVilibleTitle('选择下载列');
    setOptionalVilibleBtnText('下载盖章明细');
    selectOptchColmons();
  }

  //下载
  function downloadFileEvent(id, filename) {
    let AEle = document.createElement("a"),
      reader = new FileReader(),
      param = {
        apier: "downloadFile",
        params: { param: `?fileCode=${id}` }
      };
    AEle.setAttribute("download", filename);
    GetDownFile(param)
      .then((res) => {
        let blob = res;
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          AEle.href = e.target.result;
          document.body.appendChild(AEle);
          AEle.click();
          document.body.removeChild(AEle);
        }
      })
  }

  let getInitTime = () => {
    let initTime;
    let date = new Date();
    if (date.getMonth() <= 2) {
      initTime = [moment(moment(new Date()).format(moment().startOf('year').format("YYYY-MM-DD"))), moment(moment(new Date()).format(moment().endOf('month').format("YYYY-MM-DD")))]
    } else {
      initTime = [moment(moment(new Date()).format(moment().startOf('month').subtract(2, 'months').format("YYYY-MM-DD"))), moment(moment(new Date()).format(moment().endOf('month').format("YYYY-MM-DD")))]
    }
    return initTime;
  }
  //重置
  let formReset = () => {
    form.setFieldsValue({
      ...{
        cardId: "",
        orderNo: "",
        couponSkuName: '',
        reportTime: "",
        billFlagName: "",
        userMobile: "",
        userIdentityNo: "",
        thirdOrderNo: "",
        balanceNodeTime: "",
        policyNo: "",
        plateNo: ""
      }
    });
    setCheckList([]);
    setKeyList([]);
    let toPayload = {
      pageNum: 1,
      pageSize: 10
    }
    setPayload({ ...toPayload });
  }

  //日期限制
  let [dates, setDates] = useState([]);
  const disabledDate = current => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 365;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 365;
    return tooEarly || tooLate;
  };
  let [hackValue, setHackValue] = useState([]);
  const onOpenChange = open => {
    let toForm = form.getFieldsValue();
    if (billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放') {
      if (toForm.balanceNodeTime) {
        setHackValue([...toForm.balanceNodeTime])
      } else {
        setHackValue("")
      }
    } else {
      if (toForm.reportTime) {
        setHackValue([...toForm.reportTime])
      } else {
        setHackValue("")
      }
    }
    if (open) {
      toForm.reportTime = "";
      toForm.balanceNodeTime = "";
      setDates([]);
      form.setFieldsValue({ ...toForm });
    } else {
      if (billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放') {
        if (!toForm.balanceNodeTime) {
          if (hackValue) {
            toForm.balanceNodeTime = hackValue;
            form.setFieldsValue({ ...toForm });
          }
        }
      } else {
        if (!toForm.reportTime) {
          if (hackValue) {
            toForm.reportTime = hackValue;
            form.setFieldsValue({ ...toForm });
          }
        }

      }
    }

  };

  useEffect(() => {
    form.setFieldsValue({
      cardId: "",
      orderNo: "",
      couponSkuName: '',
      reportTime: "",
      billFlagName: "",
      userMobile: "",
      userIdentityNo: "",
      thirdOrderNo: "",
      balanceNodeTime: "",
      policyNo: "",
      plateNo: ""
    });
  }, []);



  useEffect(() => {
    let toQuery = form.getFieldsValue();
    toQuery.billId = history.location.query.billId;
    toQuery.serviceName = billHandleInfo.serviceName;
    let toPayInfo = payload;
    toPayInfo.query = toQuery;
    billDetail(toPayInfo);
  }, [payload])


  //数据请求
  let billDetail = (payInfo) => {
    if (payInfo.query.reportTime) {
      payInfo.query.reportStartDate = moment(payInfo.query.reportTime[0]).format('YYYY-MM-DD');
      payInfo.query.reportEndDate = moment(payInfo.query.reportTime[1]).format('YYYY-MM-DD')
    }
    if (payInfo.query.balanceNodeTime) {
      payInfo.query.balanceNodeStartTime = moment(payInfo.query.balanceNodeTime[0]).format('YYYY-MM-DD');
      payInfo.query.balanceNodeEndTime = moment(payInfo.query.balanceNodeTime[1]).format('YYYY-MM-DD')
    }
    dispatch({
      type: 'billHandleModel/billDetail',// 命名空间名/effect内的函数名
      payload: {
        method: 'postJSON',
        params: payInfo
      },
      callback: (res) => {
        if (res.result.code == '0') {
          let toList = res.body.list;
          toList.forEach((item, i) => {
            toList[i].balanceAmount = parseToThousandth(item.balanceAmount);
          })
          setTableList([...toList]);
          setTotal(res.body.total);
        } else {
          message.error(res.result.message);
          if (!billHandleInfo.serviceName) {
            history.goBack()
          }
        }
      }
    }
    );
  }

  // 列表 选中 配置
  const rowSelection = {
    onChange: (key, value) => {
      setKeyList(key)
      setCheckList(value || []);
      setTotalAmount(CalculateTotalAmount(value))
    },
    type: 'checkbox',
    hideSelectAll: false,
    selectedRowKeys: keyList
  }

  // 遍历数组 计算选中金额
  let CalculateTotalAmount = (arr) => {
    const totalPrice = arr.reduce((c, R) => c + delcommafy(R.balanceAmount), 0);
    return totalPrice;
  }

  // 去除千分位 
  let delcommafy = (num) => {
    if (num) {
      num = num.replace(/,/gi, '');
      num = parseFloat(num)
      return num;
    } else {
      num = parseFloat(num)
      return num;
    }
  }

  // 批量选择
  let batchHandleBtn = (content, onOKText) => {
    if (!multipleChoiceShow) {
      let checkArr = checkList.map(item => item.billDetailId)
      billDetailId(content, onOKText, checkArr)
    } else {
      allBatchOperateRrevokeCheck(content, onOKText)
    }
  }

  // 多选框批量确认提示框
  let billDetailId = (content, okText, billDetailIdList, batchId) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content,
      okText,
      cancelText: '取消',
      onOk() {
        if (!multipleChoiceShow) {
          batchOperateRevokeCredit(billDetailIdList)
        } else {
          allBatchOperateRevoke(batchId)
        }
      }
    })
  }

  // 点击全选查询汇总金额
  let choiceIsShow = () => {
    let formValue = form.getFieldsValue();
    let info = JSON.parse(JSON.stringify(formValue));
    if (billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放') {
      if (info.balanceNodeTime) {
        info.timeStart = moment(info.balanceNodeTime[0]).format('YYYY-MM-DD');
        info.timeEnd = moment(info.balanceNodeTime[1]).format('YYYY-MM-DD');
      }
      delete info.balanceNodeTime
    } else {
      if (info.reportTime) {
        info.timeStart = moment(info.reportTime[0]).format('YYYY-MM-DD');
        info.timeEnd = moment(info.reportTime[1]).format('YYYY-MM-DD');
      }
      delete info.reportTime
    }
    if (history.location.query.billType == 1) {  	//订单分类(当billType = 1时 此字段必传),1:道路救援,2:代驾服务,3:代办年检,4:事故代步车,5:安全检测,6:轮胎存换
      if (billHandleInfo.serviceName == '救援') {
        info.orderType = 1
      } else if (billHandleInfo.serviceName == '代驾') {
        info.orderType = 2
      } else if (billHandleInfo.serviceName == '代办年检') {
        info.orderType = 3
      } else if (billHandleInfo.serviceName == '代步车') {
        info.orderType = 4
      } else if (billHandleInfo.serviceName == '安全检测') {
        info.orderType = 5
      } else if (billHandleInfo.serviceName == '轮胎存换') {
        info.orderType = 6
      }
    }
    dispatch({
      type: 'billHandleModel/allBatchOperateQueryAmout',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          billType: history.location.query.billType,
          reqSource: 2,
          ...info
        }
      },
      callback: res => {
        if (res.result.code == 0) {
          setTotalAmountInfo(res.body)
          setMultipleChoiceShow(true)
        } else {
          message.warning(res.result.message)
        }
      }
    });
  }

  // 全选撤销入账校验
  let allBatchOperateRrevokeCheck = (content, onOKText) => {
    let formValue = form.getFieldsValue();
    let info = JSON.parse(JSON.stringify(formValue));
    if (billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放') {
      if (info.balanceNodeTime) {
        info.timeStart = moment(info.balanceNodeTime[0]).format('YYYY-MM-DD');
        info.timeEnd = moment(info.balanceNodeTime[1]).format('YYYY-MM-DD')
      }
      delete info.balanceNodeTime
    } else {
      if (info.reportTime) {
        info.timeStart = moment(info.reportTime[0]).format('YYYY-MM-DD');
        info.timeEnd = moment(info.reportTime[1]).format('YYYY-MM-DD')
      }
      delete info.reportTime
    }
    dispatch({
      type: 'billHandleModel/allBatchOperateRrevokeCheck',
      payload: {
        method: 'postJSON',
        params: {
          platformType: 2,
          operateStatus: 4,
          billId: history.location.query.billId,
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          billType: history.location.query.billType,
          total,
          ...info,
        }
      },
      callback: res => {
        if (res.result.code == 0) {
          billDetailId(`确认将选中的${total}笔订单全部从账单中撤销？`, onOKText, [], res.body)
        } else {
          message.warning(res.result.message)
        }
      }
    });
  }

  // 全选撤销入账操作
  let allBatchOperateRevoke = (batchId) => {
    dispatch({
      type: 'billHandleModel/allBatchOperateRevoke',
      payload: {
        method: 'postJSON',
        params: {
          batchId,
          billId: history.location.query.billId,
          billType: history.location.query.billType,
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType: 2,
          total
        }
      },
      callback: res => {
        if (res.result.code == 0) {
          if (res.body == 1) {
            history.push('/financeManage/billHandle');
          } else {
            let toPayload = {
              pageNum: 1,
              pageSize: 10
            }
            setMultipleChoiceShow(false)
            setPayload({ ...toPayload });
          }
        } else {
          message.warning(res.result.message)
        }
      }
    });
  }

  // 批量撤销入账
  let batchOperateRevokeCredit = (billDetailIdList) => {
    dispatch({
      type: 'billHandleModel/batchOperateRevokeCredit',
      payload: {
        method: 'postJSON',
        params: {
          billDetailIdList,
          billId: history.location.query.billId,
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType: 2,
          type: history.location.query.billType,
        }
      },
      callback: res => {
        if (res.result.code == 0) {
          if (res.body == 1) {
            history.push('/financeManage/billHandle');
          } else {
            let toPayload = {
              pageNum: 1,
              pageSize: 10
            }
            setKeyList([])
            setCheckList([])
            setPayload({ ...toPayload });
          }
        } else {
          message.warning(res.result.message)
        }
      }
    });
  }

  let onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? [...optionalList2] : [...[]]);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    let list = JSON.parse(JSON.stringify(optionalList))
    if(e.target.checked) {
      list.forEach(item => item.checked = true)
    }else {
      list.forEach(item => item.checked = false)
    }
    setOptionalList(list)
  };

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <div className={style.block__header_h}>
            <strong className={style.block__header_h}>账单明细</strong>
            <span className={style.block__header_pn}>{billHandleInfo.billName}</span>
            <span className={style.block__header_pn}>{billHandleInfo.billTypeName}-{billHandleInfo.serviceName}</span>
          </div>
          <div>
          </div>
        </div>
        <div className={style.form_box}>
          <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={onFinish} onReset={formReset}>
            {
              billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放' ?
                <Form.Item name="cardId" label="卡券编号" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="卡券编号" />
                </Form.Item> :
                <Form.Item name="orderNo" label="壹路通订单号" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="壹路通订单号" />
                </Form.Item>
            }
            {
              billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放' ?

                <Form.Item name="couponSkuName" label="卡券/卡包标题" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="卡券/卡包标题" />
                </Form.Item> :
                <Form.Item name="reportTime" label="受理日期" placeholder="开始日期-结束日期" labelCol={{ flex: '0 0 120px' }}>
                  <RangePicker locale={locale} format="YYYY-MM-DD" disabledDate={disabledDate} onCalendarChange={val => setDates(val)} onOpenChange={onOpenChange} />
                </Form.Item>
            }

            {/* <Form.Item name="billFlagName" label="结算状态">
              <Input placeholder="结算状态" className={style.form_by_fn} />
            </Form.Item> */}
            <Form.Item name="userMobile" label="手机号" labelCol={{ flex: '0 0 120px' }}>
              <Input placeholder="手机号" />
            </Form.Item>
            {
              billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放' ?

                <Form.Item name="userIdentityNo" label="用户身份证号" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="用户身份证号" className={style.form_by_fn} />
                </Form.Item>
                :

                <Form.Item name="thirdOrderNo" label="来源工单号" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="来源工单号" className={style.form_by_fn} />
                </Form.Item>

            }
            {
              billHandleInfo.serviceName == '卡券' || billHandleInfo.serviceName == '营销投放' ?

                <Form.Item name="balanceNodeTime" label="结算节点时间" placeholder="开始日期-结束日期" labelCol={{ flex: '0 0 120px' }}>
                  <RangePicker locale={locale} showTime format="YYYY-MM-DD" disabledDate={disabledDate} onCalendarChange={val => setDates(val)} className={style.form_by_fn} />
                </Form.Item>
                :

                <Form.Item name="policyNo" label="保单号码" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="保单号码" className={style.form_by_fn} />
                </Form.Item>

            }
            {
              billHandleInfo.serviceName != '卡券' && billHandleInfo.serviceName != '营销投放' ?

                <Form.Item name="plateNo" label="车牌号" labelCol={{ flex: '0 0 120px' }}>
                  <Input placeholder="车牌号" className={style.form_by_fn} />
                </Form.Item>
                : null
            }

          </QueryFilter>
        </div>
      </div>
      <div className={style.block__cont}>
        <ListTitle titleName="">
          <Space size={8}>
            <Button htmlType="button" onClick={orderExport}>全部导出</Button>
            {
              location.state.invoiceStatus != 0 ? <Button htmlType="button" onClick={downloadDetails}>下载盖章明细</Button> : ''
            }
          </Space>
        </ListTitle>

        <ListTable showPagination current={payload.pageNum} pageSize={payload.pageSiz} total={total}
          onChange={pageChange} >
          <Table rowSelection={{ ...rowSelection }} rowKey={(record, index) => index} columns={realColumns} dataSource={tableList} scroll={{ x: 1500 }} pagination={false}></Table>
        </ListTable>

        {/* <div className={style.form__cont}>
          <Table rowSelection={{ ...rowSelection }} rowKey={(record, index) => index} columns={realColumns} dataSource={tableList} pagination={false} scroll={{ x: "1500px" }}></Table>
          <Pagination
            className={style.pagination}
            current={payload.pageNum} //选中第一页
            pageSize={payload.pageSize} //默认每页展示10条数据
            total={total} //总数
            onChange={onNextChange} //切换 页码时触发事件
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
        </div> */}
      </div>

      <BottomArea>
        <Button onClick={() => {
          history.goBack()
        }}>返回上级</Button>
      </BottomArea>
      {/* <div className={`${style.block__cont} ${style.block_cent}`}>
        <Button className={style.btn_radius} htmlType="button" onClick={() => {
          history.goBack()
        }}>返回上级</Button>
      </div> */}
      {/* 当列表勾选选中时显示 */}
      {
        checkList.length > 0 ?
          <div className={style.bottom_btn_box}>
            <div style={{ display: 'flex' }}>
              <div>已选择{!multipleChoiceShow ? checkList.length : total}笔　　选中项汇总金额为{!multipleChoiceShow ? parseToThousandth(totalAmount) : parseToThousandth(totalAmountInfo) || 0}元</div>
              {
                !multipleChoiceShow ? <a onClick={() => { choiceIsShow() }}>选择全部{total}笔</a> : <a onClick={() => { setMultipleChoiceShow(false) }}>取消选择全部</a>
              }
            </div>
            <div style={{ paddingRight: '30px' }}>
              <Space size={18}>
                <Button type="primary" onClick={() => { batchHandleBtn(`确认将选中的${checkList.length}笔订单全部从账单中撤销？`, '全部撤销入账') }}>撤销入账</Button>
              </Space>
            </div>
          </div> : ''
      }

      {/* 可选择导入/导入 */}
      <Modal title={optionalVilibleTitle} visible={optionalVilible} okText="导出" onOk={()=> {exportBillDetails()}} onCancel={() => { setOptionalVilible(false) }} width={1200}>
        <Checkbox className={style.checkBox_select} indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>全选</Checkbox>
        <CheckboxGroup className={style.optional_modal} options={optionalList2} value={checkedList} onChange={optionalChange}/>
      </Modal>


      {/* 全选遮罩 */}
      {
        multipleChoiceShow ? <div className={style.spin_loading}></div> : ''
      }
    </>
  )
};
export default connect(({ billHandleModel }) => ({
  billHandleInfo: billHandleModel.billHandleInfo
}))(handleListInfo)
