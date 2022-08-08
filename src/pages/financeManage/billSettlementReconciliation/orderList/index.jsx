import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Spin, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, Modal, Checkbox, message, DatePicker } from "antd"
import { QueryFilter, ProFormText, ProFormDatePicker,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

import { UploadOutlined, ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
import OrderTable from '../components/orderTable';
import moment from 'moment';
import { parseToThousandth } from '@/utils/date';
import ModalBox from '../components/batchModal';
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

// 订单列表
const orderList = (props) => {
  let { dispatch, location, saveQuerySelect } = props;
  let [form] = Form.useForm();
  let [pageNum, setPageNum] = useState(1)
  let [pageSize, setPageSize] = useState(10);
  let [callList, setCallList] = useState(false);
  let [batchIsShow, setBatchIsShow] = useState(false);// 批量操作弹框的显示与隐藏
  let [orderInfo, setOrderInfo] = useState(location.state && location.state.orderInfo || '');
  let [totalAmountInfo, setTotalAmountInfo] = useState({});// 订单金额
  let [pagination, setPagination] = useState({}); // 分页数据
  let [checkList, setCheckList] = useState([]); // 表格选中数据
  let isBillFlag = localStorage.getItem("isBillFlag");
  let [modalInfo, setMdalInfo] = useState(''); // 表格数据
  let [totalAmount, setTotalAmount] = useState(0)
  const [resetFormInfo, setResetFormInfo] = useState(false);
  let [batchNoSettlement, setBatchNoSettlement] = useState(false); // 批量不结算的显示与隐藏
  let [optionalList, setOptionalList] = useState([]);// 可选择导出(导入)数据
  let [optionalVilible, setOptionalVilible] = useState(false);// 可选择导出(导入)显示与隐藏
  let [multipleChoiceShow, setMultipleChoiceShow] = useState(false); // 控制全选遮罩层的显示与隐藏
  let [selectBatchId, setSelectBatchId] = useState('');// 全选操作批次(校验后body中获取)
  let [branchList, setBranchList] = useState([])

  let [indeterminate, setIndeterminate] = useState(true); // 选择导出列全选
  let [checkAll, setCheckAll] = useState(false);
  let [checkedList, setCheckedList] = useState([]);
  let [optionalList2, setOptionalList2] = useState([]);// 可选择导出(导入)数据-name

  // 表格数据回调
  const callModal = (flag, list) => {
    if (flag) {
      setPageNum(1);
      setCallList(!callList)
    }else {
      setTotalAmount(CalculateTotalAmount(list));
      setCheckList(list);
    }
  }

  let [operatingModal, setOperatingModal] = useState(''); // 弹框数据
  // 弹框回调
  const operatingCallModal = (flag) => {
    setOperatingModal('')
    if(flag) {
      setBatchIsShow(false);
      setMultipleChoiceShow(false);
      setCallList(!callList);
      setCheckList([]);
      setMdalInfo('');
    }
  }
  // 公共函数
  let commonFn = () => {
    querySettlementOrderList();
    queryTotalAmount();
    queryBranchList();
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

  useEffect(() => {
    savaQuery({});  
    if (Object.values(saveQuerySelect).length > 0) {
      if (isBillFlag == 1) {
        saveQuerySelect.billFlag = null;
      }
      form.setFieldsValue({
        ...saveQuerySelect
      })
    } else {
      if (orderInfo.startTime && orderInfo.endTime) {
        if (isBillFlag == 1) {
          form.setFieldsValue({
            date: [moment(orderInfo.startTime), moment(orderInfo.endTime)]
          })
        } else {
          form.setFieldsValue({
            date: [moment(orderInfo.startTime), moment(orderInfo.endTime)],
            billFlag: orderInfo.value,
          })
        }
      }
    }
  }, [resetFormInfo])
  useEffect(() => {
    commonFn();
  }, [callList])

  // 列表查询
  let querySettlementOrderList = () => {
    let info = form.getFieldValue();
    let query = JSON.parse(JSON.stringify(info));
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    query.orderType = orderInfo.orderType;
    if (query.date) {
      query.timeStart = moment(query.date[0]).format('YYYY-MM-DD');
      query.timeEnd = moment(query.date[1]).format('YYYY-MM-DD');
    }
    delete query.date
    dispatch({
      type: 'billSettlementReconciliationModel/querySettlementOrderList',
      payload: {
        method: 'postJSON',
        params: {
          pageNum,
          pageSize,
          ...query
        },
      },
      callback: res => {
        // res.data.list.forEach(item => {
        //   if (item.balanceAmount) return item.balanceAmount = parseToThousandth(item.balanceAmount)
        //   if (item.saleAmount) return item.saleAmount = parseToThousandth(item.saleAmount)
        // });// 金额修改为千分位展示
        setMdalInfo({ tableType: orderInfo.orderType, list: res.data.list || [], querySelect: form.getFieldValue() })
        setPagination(res.data)
      }
    });
  }
  // 表单搜索
  let orderListSearch = (val) => {
    setPageNum(1);
    setPageSize(10);
    setCheckList([]);
    setMdalInfo('');
    setCallList(!callList)
  };
  // 表单重置
  let resetBtn = () => {
    form.resetFields();
    setResetFormInfo(!resetFormInfo)
    setCheckList([]);
    setMdalInfo('');
    setPageNum(1);
    setPageSize(10);
    setCallList(!callList)
  };
  // 查询汇总金额
  let queryTotalAmount = () => {
    let info = form.getFieldValue();
    let query = JSON.parse(JSON.stringify(info));
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    query.orderType = orderInfo.orderType;
    if (query.date) {
      query.timeStart = moment(query.date[0]).format('YYYY-MM-DD');
      query.timeEnd = moment(query.date[1]).format('YYYY-MM-DD');
    }
    delete query.date;
    dispatch({
      type: 'billSettlementReconciliationModel/queryTotalAmount',
      payload: {
        method: 'postJSON',
        params: {
          pageNum,
          pageSize,
          ...query
        },
      },
      callback: res => {
        setTotalAmountInfo(res.data || {})
      }
    });
  }
  // 结算状态数据 
  let settlementStatus = [
    { value: 2, name: '待确认' },
    { value: 3, name: '异议' },
    { value: 4, name: '已确认/待生成账单' },
    { value: 1, name: '已生成账单' },
  ]
  //分页
  const pageChange=(page,pageSize)=>{
    setPageNum(page)
    setPageSize(pageSize)
    setCheckList([]);
    setMdalInfo('');
    setMultipleChoiceShow(false)
    setCallList(!callList)
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

  // 选择导出列
  const selectOptchColmons = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/settlementManageGetDzExportFields',
      payload: {
        method: 'get',
        params: {
          orderTypeId: orderInfo.orderType,
        },
      },
      callback: (res) => {
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

  // 依据查询结果导出excel
  let exportSettlementOrderList = () => {
    selectOptchColmons() 
  }
  
  // 二次导出
  let exportBillDetails = () => {
    let info = form.getFieldValue();
    let query = JSON.parse(JSON.stringify(info));
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    query.orderType = orderInfo.orderType;
    query.exportFields = optionalList;
    if (query.date) {
      query.timeStart = moment(query.date[0]).format('YYYY-MM-DD');
      query.timeEnd = moment(query.date[1]).format('YYYY-MM-DD');
    }
    delete query.date;
    dispatch({
      type: 'billSettlementReconciliationModel/exportSettlementOrderList',
      payload: {
        method: 'postJsonExcel',
        params: {
          pageNum,
          pageSize,
          ...query
        },
      },
      callback: (res) => {
        setOptionalVilible(false);
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURIComponent('结算对账.xlsx'))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })

  }

  // 批量导入处理
  let handleBtn = (batchType, batchName) => {
    let batchInfo = { batchType, batchName, billType: orderInfo.orderType }
    history.push({ pathname: '/financeManage/billSettlementReconciliation/BatchOperation', state: { batchInfo } })
  }
  
  // 多选框批量
  let batchHandleBtn = (type, content, okText) => {
    if(multipleChoiceShow) {
      allBatchOperateQuery(type, content, okText);
    }else {
      let checkArr = checkList.map(item => item.balanceDetailId);
      batchOperateCheckStatus(checkArr, type, content, okText)
    }
  }
  // 全选状态检验
  let allBatchOperateQuery = (type, content, okText) => {
    let formValue = form.getFieldValue();
    let query = JSON.parse(JSON.stringify(formValue));
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    query.billType = orderInfo.orderType==7 ? 2 : 1;
    query.reqSource = 2;
    query.platformType = 2;
    query.total = pagination.total;
    query.operateStatus = type;
    if(orderInfo.orderType !=7) {
      query.orderType = orderInfo.orderType;
      query.userMobile = query.customerPhone
    }else {
      delete query.userMobile;
      delete query.orderType;
    }
    if (query.date) {
      query.timeStart = moment(query.date[0]).format('YYYY-MM-DD');
      query.timeEnd = moment(query.date[1]).format('YYYY-MM-DD');
    }
    delete query.date;
    dispatch({
      type: 'billSettlementReconciliationModel/allBatchOperateQuery',
      payload: {
        method: 'postJSON',
        params: { 
          ...query
        }
      },
      callback: res => {
        if(res.result.code==0) {
          setSelectBatchId(res.body);// 复制批次id
          if(type==7) {
            setBatchNoSettlement(true)
          }else {
            modalConfirm(type, content, okText, [], res.body);
          }
        }else {
          message.warning(res.result.message)
        }
      }
    });
  }
  // 批量状态校验
  let batchOperateCheckStatus = (objectIdList, type, content, okText) => {
    dispatch({
      type: 'billSettlementReconciliationModel/batchOperateCheckStatus',
      payload: {
        method: 'postJSON',
        params: { 
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          objectIdList,
          operateStatus: type,// 操作状态 1：确认 2：撤回确认 3:入账 4：撤销入账 5：不结算 6：重新结算 7：异议 8：撤销异议
          platformType: 2,
          type: orderInfo.orderType==7 ? 2 : 1,
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          if(type==7) {
            setBatchNoSettlement(true)
          }else {
            modalConfirm(type, content, okText, objectIdList);
          }
        }else {
          message.warning(res.result.message)
        }
      }
    });
  }
  // 多选框批量确认提示框
  let modalConfirm = (type, content, okText, objectIdList, batchId) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content,
      okText,
      cancelText: '取消',
      onOk () {
        if(multipleChoiceShow){ // 全选时执行的操作
          if(type==3) {// 入账操作
            return setOperatingModal({ modalName: 'entry', type: orderInfo.orderType,  channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId, modalType: 3, total: pagination.total, batchId: batchId });
          }else {
            allBatchOperateConfirm(batchId, type);
          }
        }else {// 批量勾选时做的操作
          if(type==1) return batchOperateConfirm(objectIdList);
          if(type==2) return batchOperateRevokeConfirm(objectIdList);
          if(type==3) return setOperatingModal({ modalName: 'entry', type: orderInfo.orderType, objectIdList: objectIdList, channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId, modalType: 2 });
          if(type==8) return batchOperateRevokeObjection(objectIdList);
        }
      }
    })
  }

  //  批量确认操作(勾选框)
  let batchOperateConfirm = (objectIdList) => {
    dispatch({
      type: 'billSettlementReconciliationModel/batchOperateConfirm',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          objectIdList,
          platformType: 2,
          type: orderInfo.orderType==7 ? 2 : 1,
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          setMdalInfo('')
          setCallList(!callList);
          setCheckList([])
        }else {
          message.error(res.result.message)
        }
      }
    });
  }
  
  // 批量确认撤回操作(勾选框)
  let batchOperateRevokeConfirm = (objectIdList) => {
    dispatch({
      type: 'billSettlementReconciliationModel/batchOperateRevokeConfirm',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          objectIdList,
          platformType: 2,
          type: orderInfo.orderType==7 ? 2 : 1,
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          setMdalInfo('')
          setCallList(!callList);
          setCheckList([])
        }else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 批量撤销异议(勾选框)
  let batchOperateRevokeObjection = (objectIdList) => {
    dispatch({
      type: 'billSettlementReconciliationModel/batchOperateRevokeObjection',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          objectIdList,
          platformType: 2,
          type: orderInfo.orderType==7 ? 2 : 1,
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          setMdalInfo('')
          setCallList(!callList);
          setCheckList([])
        }else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 批量异议操作(勾选框)
  let batchOperateObjection = (objectIdList) => {
    let formValue = form.getFieldValue()
    dispatch({
      type: 'billSettlementReconciliationModel/batchOperateObjection',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          objectIdList,
          objectionReason: formValue.noBalanceReason,
          platformType: 2,
          type: orderInfo.orderType==7 ? 2 : 1,
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          setBatchNoSettlement(false);
          setMdalInfo('')
          setCallList(!callList);
          setCheckList([])
        }else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 批量异议弹层确认操作
  let batchNoSettlementOnFinish = () => {
    if(!multipleChoiceShow) {
      let objectIdList = checkList.map(item => item.balanceDetailId)
      dispatch({
        type: 'billSettlementReconciliationModel/batchOperateCheckStatus',
        payload: {
          method: 'postJSON',
          params: { 
            channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
            objectIdList,
            operateStatus: 7,// 操作状态 1：确认 2：撤回确认 3:入账 4：撤销入账 5：不结算 6：重新结算 7：异议 8：撤销异议
            platformType: 2,
            type: orderInfo.orderType==7 ? 2 : 1,
            userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
          }
        },
        callback: res => {
          if(res.result.code==0) {
            batchOperateObjection(objectIdList)
          }else {
            message.warning(res.result.message)
          }
        }
      });
    }else {
      allBatchOperateConfirm(selectBatchId, 7)
    }
  }

  // 遍历数组 计算选中金额
  let CalculateTotalAmount = (arr)=> {
    const totalPrice = arr.reduce((c, R) => c +  delcommafy(R.balanceAmountStr), 0);
    return totalPrice;
  }

  // 去除千分位 
  let delcommafy = (num) => {
    if(num){
      num = num.replace(/,/gi, '');
      num = parseFloat(num)
      return num;
    }else {
      num = parseFloat(num)
      return num;
    }
  }

  // 全选批量二次确认，撤销确认， 异议， 撤销异议
  let allBatchOperateConfirm = (batchId, operateStatus) => {
    let query = {
      batchId, 
      billType: orderInfo.orderType==7 ? 2 : 1,
      channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
      operateStatus,
      platformType:2,
      total: pagination.total
    }
    if(operateStatus==7) {
      let formValue = form.getFieldValue();
      query.objectionReason = formValue.noBalanceReason
    }
    dispatch({
      type: 'billSettlementReconciliationModel/allBatchOperateConfirm',
      payload: {
        method: 'postJSON',
        params: { 
          ...query
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success(res.result.message);
          setMultipleChoiceShow(false)
          setBatchNoSettlement(false)
          setCheckList([])
          setMdalInfo('')
          setCallList(!callList);
        }else {
          message.warning(res.result.message)
        }
      }
    });
  }
  
  // 查询承保单位列表(数据权限使用)
  let queryBranchList = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryBranchList',
      payload: {
        method: 'postJSON',
        params: { 
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType: 'channel',
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          setBranchList(res.body)
        }else {
          message.warning(res.result.message)
        }
      }
    });
  }

  // 全选事件
  let onCheckAllChange = (e) => {
    let list = JSON.parse(JSON.stringify(optionalList))
    setCheckedList(e.target.checked ? [...optionalList2] : [...[]]);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    if(e.target.checked) {
      list.forEach(item => item.checked = true)
    }else {
      list.forEach(item => item.checked = false)
    }
    setOptionalList(list)
  };

  return (
    <>
      <div className={style.filter_box}>
        {
          orderInfo.orderType == 7 ?
          <QueryFilter className={style.form} form={form} defaultCollapsed labelWidth={140} onFinish={orderListSearch} onReset={resetBtn}>
            <ProFormDateRangePicker format="YYYY-MM-DD" name="date" label='结算时间' placeholder={['结算节点时间(开始)', '结算节点时间(结束)']} />         
            <ProFormSelect name="billFlag" label='结算状态'
              options={ settlementStatus.map((v)=>{
                return {value:v.value, label:v.name}
              })} />         
            <ProFormText name="cardId" label='卡券/卡包编号' />         
            <ProFormText name="couponSkuName" label='卡券/卡包标题' />         
            <ProFormText name="customerIdentityNo" label='用户身份证号' />         
            <ProFormText name="customerPhone" label='用户手机号' />         
            <ProFormText name="marketProjectName" label='所属项目' />          
            <ProFormText name="activityName" label='活动名称' />           
            <ProFormSelect name="sourceType" label="获取来源"  
              options={[
                {value:1, label:'导入'},
                {value:2, label:'转赠'},
                {value:3, label:'抽奖'},
                {value:4, label:'购买'},
                {value:5, label:'兑换'},
                {value:6, label:'注册赠送'},
                {value:7, label:'推广赠送'},
                {value:8, label:'线下门店关注'},
                {value:9, label:'套餐发放'},
                {value:10, label:'权益转换'},
                {value:11, label:'活动赠送'},
              ]} />
          </QueryFilter> 
          :
          <QueryFilter className={style.form} form={form} defaultCollapsed labelWidth={140} onFinish={orderListSearch} onReset={resetBtn}>
            <ProFormDateRangePicker format="YYYY-MM-DD" name="date" label='受理时间' placeholder={['开始月份(受理时间)', '结束月份(受理时间)']} />         
            <ProFormSelect name="billFlag" label='结算状态' 
              options={ settlementStatus.map((v)=>{
                return {value:v.value, label:v.name}
              })} />
            <ProFormText name="orderNo" label='壹路通订单号' />
            <ProFormText name="thirdOrderNo" label='来源工单号' />
            <ProFormText name="policyNo" label='保单号码' />
            <ProFormText name="plateNo" label='车牌号' />
            <ProFormText name="customerPhone" label='手机号' />
            <ProFormSelect name="sourceFlagArrays" label="订单来源" mode="multiple" 
              options={[
                {value:0, label:'后台'},
                {value:1, label:'用户'},
                {value:2, label:'系统'},
              ]} />
              <ProFormSelect name="channelBranchId" label='承保单位' 
                options={ branchList.map((v)=>{
                  return {value:v.branchid, label:v.depname}
                })} />
          </QueryFilter>
        }
      </div>
      <div className={style.list_box}>
        <ListTitle titleName={`订单列表　|　${orderInfo.orderTypeName}`}>
          <Space size={8}>
            {
              checkList.length > 0 ? 
              <>
                <Button onClick={() => { batchHandleBtn(3, `确认将选中的${ !multipleChoiceShow ? checkList.length : pagination.total }笔订单全部加入账单？`, '全部生成账单')}}>生成账单</Button>
                <Button onClick={() => { batchHandleBtn(8, `确认将选中的${!multipleChoiceShow ? checkList.length : pagination.total}笔订单全部撤销异议？`, '全部撤销异议')}}>撤销异议</Button>
                <Button onClick={() => { batchHandleBtn(7)}}>异议</Button>
                <Button onClick={() => { batchHandleBtn(2, `将选中的${!multipleChoiceShow ? checkList.length : pagination.total}笔订单全部撤销确认？`, '全部撤销确认')}}>撤销确认</Button>
                <Button onClick={() => { batchHandleBtn(1, `将选中的${!multipleChoiceShow ? checkList.length : pagination.total}笔订单全部标记为已确认？`, '全部确认')}}>确认</Button>
              </> : ''
            }
            <Button type='primary' onClick={exportSettlementOrderList}>全部导出</Button>
            <Button type='primary' onClick={() => { setBatchIsShow(true) }}>批量导入</Button>
          </Space>
        </ListTitle>
        <ListTips>
          <div className={style.tips_flex}>
            <div>查询汇总金额{totalAmountInfo.totalAmount || 0}元</div>
            {
              checkList.length > 0 ?
              <div className={style.tips_flex_box}>
                <div>已选择{ !multipleChoiceShow ? checkList.length : pagination.total }笔　　选中项汇总金额为{ !multipleChoiceShow ? parseToThousandth(totalAmount) : totalAmountInfo.totalAmount || 0}元</div>　　
                  {
                  !multipleChoiceShow ? <a onClick={() => {setMultipleChoiceShow(true)}}>选择全部{pagination.total}笔</a> : <a onClick={() => {setMultipleChoiceShow(false)}}>取消选择全部</a>
                  }
              </div> : ''
            }
          </div>
        </ListTips>
        {
          modalInfo ?
          <ListTable showPagination current={pageNum} pageSize={pageSize} total={pagination.total} onChange={pageChange}>
            <OrderTable modalInfo={modalInfo} modalDisabled={multipleChoiceShow} toFatherValue={(flag, list) => callModal(flag, list)} />
          </ListTable> : null
        }
        <BottomArea>
          <Button onClick={() => { localStorage.setItem("isBillFlag", 0); history.goBack() }}>返回上级</Button>
        </BottomArea>
      </div>

      {/* 批量操作 */}
      <Modal title="批量导入处理" centered visible={batchIsShow} footer={null} onCancel={() => { setBatchIsShow(false) }} width={800}>
        <p>选择要批量执行的操作</p>
        <div className={style.modal_btn_box}>
          <Space size={22}>
            <Button onClick={() => { handleBtn(4, '撤销入账') }}>撤销入账</Button>
            <Button onClick={() => { handleBtn(3, '生成账单') }}>生成账单</Button>
            {/* <Button onClick={() => { setBatchNoSettlement(true)}}>异议</Button> */}
            <Button onClick={() => { handleBtn(2, '撤销确认') }}>撤销确认</Button>
            <Button onClick={() => { handleBtn(1, '确认') }}>确认</Button>
          </Space>
        </div>
      </Modal>

      {/* 批量弹窗操作 */}
      {operatingModal ? <ModalBox operatingModal={operatingModal} operatingToFatherValue={(flag) => operatingCallModal(flag)} /> : ''}

      {/* 异议弹层 */}
      <Modal title="异议" width={800} visible={batchNoSettlement} footer={null} onCancel={() => { setBatchNoSettlement(false) }}>
        <Form form={form} onFinish={batchNoSettlementOnFinish}>
          <div style={{ overflow: 'hidden' }}>
            <Row>
              <Col span={24}>
                <Form.Item name='noBalanceReason' rules={[{ required: true, message: `将选中的${checkList.length}笔订单退回并提出异议的原因` }]}>
                  <TextArea showCount maxLength={200} rows={4}  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" align="end" style={{}}>
              <Space size={20}>
                <Button onClick={() => { setBatchNoSettlement(false) }}>取消</Button>
                <Button type="primary" htmlType="submit">全部异议</Button>
              </Space>
            </Row>
          </div>
        </Form>
      </Modal>

      {/* 可选择导入/导入 */}
      <Modal title='选择导出列' visible={optionalVilible} okText="导出" onOk={()=> {exportBillDetails()}} onCancel={() => { setOptionalVilible(false) }} width={1200}>
        <Checkbox className={style.checkBox_select} indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>全选</Checkbox>
        <CheckboxGroup className={style.optional_modal} options={optionalList2} value={checkedList} onChange={optionalChange}/>
      </Modal>
    </>
  )
}


export default connect(({ billSettlementReconciliationModel }) => ({
  saveQuerySelect: billSettlementReconciliationModel.saveQuerySelect
}))(orderList)
