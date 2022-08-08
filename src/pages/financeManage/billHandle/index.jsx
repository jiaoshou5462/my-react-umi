import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Row, Col, Space, Table, Button, message, Tag, Tabs, Modal, Radio, Pagination, Form, Input, Select, DatePicker, Tooltip, Cascader } from "antd";
import { InfoCircleOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from "./style.less";
import { parseToThousandth } from '@/utils/date';
import { QueryFilter } from '@ant-design/pro-form';
const { TextArea } = Input;
import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
// 开票银行
let billingBank = [
  { title: '中国建设银行', id: '1' },
  { title: '招商银行', id: '2' },
  { title: '中国银行', id: '3' }
]
// 开票公司
let billingCompany = [
  { title: '上海路迅通苑', id: '1' },
  { title: '上海路迅通苑（深圳分）', id: '2' },
  { title: '上海路天', id: '3' },
  { title: '上海路天（甘肃分）', id: '4' },
  { title: '上海路天（成都分）', id: '5' },
  { title: '上海路回', id: '6' },
  { title: '上海路回（深圳分）', id: '7' },
  { title: '上海路回（甘肃分）', id: '8' },
  { title: '上海路意', id: '9' },
  { title: '上海路意（深圳分）', id: '10' },
  { title: '上海迅速通', id: '11' }
]
// 账单处理
const handleListInfo = (props) => {
  let { dispatch, businessTypeArr, firstParty, billContent, saveQuerySelect, location, tabNum } = props;
  let [form] = Form.useForm();
  let [invoiceForm] = Form.useForm();
  let [isModalVisible, setIsModalVisible] = useState(false); //开票
  let [tableList, setTableList] = useState([]);
  let [isBusinessType, setIsBusinessType] = useState(null);// 记录业务场景
  let [channelBillInfo, setChannelBillInfo] = useState(location.state && location.state.info || '');
  let [isOrgIdList, setIsOrgIdList] = useState([]);
  let [isModalGive, setIsModalGive] = useState(false);  //退回
  let [runReason, setRunReason] = useState('');  //退回原因
  let [toInfo, setToInfo] = useState({});  //当前选择信息
  let [isModalExamine, setIsModalExamine] = useState(false);  //审核通过
  let [tabBillStatus, setTabBillStatus] = useState('1');  //标签Tab
  let [tabCountInfo, setTabCountInfo] = useState({//账单列表标签Tab
    processNum: 0,
    waitProcessNum: 0
  });
  let [isInit, setIsInit] = useState(null);  //是否第一次请求
  let [newQuery, setNewQuery] = useState({});  //搜索信息

  //跳转账单明细
  let hrefDetail = (name, type) => {
    let formValue = form.getFieldsValue();
    savaQuery(formValue);
    saveTab(tabBillStatus)
    let toQuery = history.location.query;
    toQuery.stateType = type;
    toQuery.billId = name.billId;
    toQuery.billType = name.billType;
    history.push({ pathname: '/financeManage/billHandle/billDetails', query: toQuery })//跳列表
  }
  //开票申请
  let [invoiceParty, setInvoiceParty] = useState({});  //所选基本信息
  let [invoiceApplyInfo, setInvoiceApplyInfo] = useState({});  //所选开票
  //基本信息change
  let changeParty = (e) => {
    let toFirstParty = firstParty.filter((item) => item.objectId == e);
    setInvoiceParty({ ...toFirstParty[0] });
  }
  //弹窗显示
  let invoiceApply = (value) => {
    getinvoiceContent();
    setInvoiceApplyInfo({ ...value });
    invoiceForm.resetFields();
    invoiceForm.setFieldsValue({
      billingBank: '中国银行'
    })
    setInvoiceParty({ ...{} });
    setIsModalVisible(true);
  }

  //开票确定
  let onFinishInvoice = (values) => {
    let toParams = invoiceParty;
    toParams.balancePeriod = invoiceApplyInfo.balancePeriod;
    toParams.billId = invoiceApplyInfo.billId;
    toParams.billingBank = values.billingBank;
    toParams.billingCompany = values.billingCompany;
    toParams.invoiceAddress = invoiceParty.address;
    toParams.invoiceContent = values.invoiceContent;
    toParams.invoiceType = 1;
    toParams.remark = values.remark;
    toParams.uniwayFlag = 1;
    toParams.totalAmount = invoiceApplyInfo.billAdjustConfirmedAmount;
    toParams.recipientsAddr = values.recipientsAddr;
    toParams.recipientsPhone = values.recipientsPhone;
    toParams.recipients = values.recipients;
    billInvoiceApply(toParams);
  };

  //账单明细
  let realColumns = [
    {
      title: '账单编号', dataIndex: 'billNo', key: 'billNo', render: (billNo, record) => {
        return <span className={style.click_blue} onClick={() => {
          hrefDetail(record, 2)
        }}>{billNo}</span>
      }
    },
    { title: '账单月份', dataIndex: 'balancePeriod', key: 'balancePeriod', },
    { title: '账单名称', dataIndex: 'billName', key: 'billName', width: 150, render: (text, record) => <TextEllipsis>{text}</TextEllipsis> },
    { title: '业务类型', dataIndex: 'billTypeName', key: 'billTypeName', render: (billTypeName, record) => billTypeRender(billTypeName, record) },
    {
      title: '分支机构', dataIndex: 'orgName', key: 'orgName',
      render: (text, record) => {
        const obj = {
          children: text || '--',
          attrs: {
            rowSpan: isOrgIdList.length > 0 ? 1 : 0
          },
        }
        return obj
      }
    },
    { title: '结算数量(笔)', dataIndex: 'confirmedCount', key: 'confirmedCount' },
    {
      title: '结算金额(元)', dataIndex: 'billAdjustConfirmedAmount', key: 'billAdjustConfirmedAmount', align: 'right',
      render: (billAdjustConfirmedAmount, record) => <MoneyFormat acc={2} prefix="￥">{billAdjustConfirmedAmount}</MoneyFormat>  
    },
    { title: '账单状态', dataIndex: 'billStatusName', key: 'billStatusName', render: (billStatusName, record) => billStatusRenDer(billStatusName, record) },
    { title: '开票状态', dataIndex: 'invoiceStatusName', key: 'invoiceStatusName' },
    { title: '操作', dataIndex: 'invoiceStatus', key: 'invoiceStatus', fixed: 'right', render: (invoiceStatus, record) => operation(invoiceStatus, record), }
  ];
  //撤销账单&撤销提交&提交审核
  let onToolsPrize = (key, name, btnTxt, record) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      width: 420,
      content: <span className={style.layer_n5}>{name}</span>,
      okText: btnTxt,
      cancelText: '取消',
      onOk () {
        if (key == 1) { //撤销账单
          billRevoke(record.billId);
        } else if (key == 2) {  //撤销提交
          billUpdateStatus(2, "", record.billId);
        } else if (key == 3) {  //提交审核
          billUpdateStatus(7, "", record.billId);
        }
      },
    })
  }
  //账单明细 --撤销账单
  let billRevoke = (billId) => {
    dispatch({
      type: 'billHandleModel/billRevoke',
      payload: {
        method: 'postJSON',
        params: {
          billId: billId,
          accountType: 2
        }
      },
      callback: (res) => {
        message.success('撤销账单成功！');
        let topayload = payload;
        setPayload({ ...topayload })
      }
    })
  }
  //账单明细 --更改账单状态
  let billUpdateStatus = (billStatus, rejectReason, billId) => {
    dispatch({
      type: 'billHandleModel/billUpdateStatus',
      payload: {
        method: 'postJSON',
        params: {
          billId: billId,
          billStatus: billStatus,
          rejectReason: rejectReason,
          platformType: 2
        }
      },
      callback: (res) => {
        message.success('状态操作成功！');
        let topayload = payload;
        setPayload({ ...topayload })
      }
    })
  }
  //退回原因
  let changeReason = (e) => {
    setRunReason(e.target.value);
  }

  // 操作
  const operation = (type, record) => {
    return <>
      {/* 业务类型(billType)
      1.场景服务  2.营销服务  3.Saas(软件)  4.增值

      智科通账单状态(billStatus)
      2：待提交 4：审核通过 7:待审核 8:审核退回

      发票状态(invoiceStatus)
      0：未开票1：已开票 2：部分开票 3：已申请 */}
      {
        record.billStatus == 4 ? <span>--</span> :
          <ListTableBtns showNum={3}>
            {/* {record.billStatus == 2  || record.billStatus == 8 ?<LtbItem onClick={() => { onToolsPrize(3, '确定要将账单提交给上级主管审核？', '提交审核',record) }}>提交审核</LtbItem>: null}
            {record.billStatus == 7 ?<LtbItem onClick={() => { onToolsPrize(2, '确定要撤销已提交审核的账单？', '撤销提交',record) }}>撤销提交</LtbItem>: null}
            {record.billStatus == 2  || record.billStatus == 8 ?<LtbItem onClick={() => { onToolsPrize(1, '撤销账单后账单中的订单需要全部重新入账，确定要撤销？', '撤销账单',record) }}>撤销账单</LtbItem>: null}
            {record.billStatus == 7  ?<LtbItem onClick={() => { setIsModalExamine(true); setToInfo({...record})}}>审核通过</LtbItem>: null}
            {record.billStatus == 7  ?<LtbItem onClick={() => { setIsModalGive(true); setRunReason("");setToInfo({...record}) }}>审核退回</LtbItem>: null} */}

            <LtbItem onClick={() => { hrefDetail(record, 1) }}>处理</LtbItem>
          </ListTableBtns>
      }

    </>
  }
  let [total, setTotal] = useState(0);
  let [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10
  });

  const pageChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }
  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)

  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageSize)
    return `共${total}条记录 第 ${payload.pageNum} / ${totalPage}  页`
  }
  // 保存查询参数到state中，用于返回页面时回显
  let savaQuery = (queryInfo) => {
    dispatch({
      type: 'billHandleModel/saveQuerySelect',
      payload: {
        queryInfo,
      },
    });
  }
  // 保存查询参数到state中，用于返回页面时回显
  let saveTab = (tabNum) => {
    dispatch({
      type: 'billHandleModel/saveTab',
      payload: {
        tabNum,
      },
    });
  }
  //搜索
  let onFinish = (values) => {
    let toQuery = values;
    let tnewQuery = {};
    tnewQuery.billNo = toQuery.billNo ? toQuery.billNo : '';
    tnewQuery.billStatus = toQuery.billStatus ? toQuery.billStatus : '';
    tnewQuery.billType = toQuery.billType ? toQuery.billType : '';
    tnewQuery.orderNo = toQuery.orderNo ? toQuery.orderNo : ''
    tnewQuery.billName = toQuery.billName ? toQuery.billName : '';
    tnewQuery.invoiceStatus = toQuery.invoiceStatus ? toQuery.invoiceStatus : '';
    tnewQuery.tabBillStatus = tabBillStatus;
    if (toQuery.balancePeriodTime) {
      tnewQuery.balancePeriodStart = moment(toQuery.balancePeriodTime[0]).format('YYYY-MM'),
        tnewQuery.balancePeriodEnd = moment(toQuery.balancePeriodTime[1]).format('YYYY-MM')
    }
    if (Object.values(saveQuerySelect).length > 0) {
      if (saveQuerySelect.orgId && saveQuerySelect.orgId.length > 0) {
        tnewQuery.orgId = saveQuerySelect.orgId[saveQuerySelect.orgId.length - 1];
      }
    } else {
      if (toQuery.orgId && toQuery.orgId.length > 0) {
        tnewQuery.orgId = toQuery.orgId[toQuery.orgId.length - 1];
      }
    }
    setNewQuery({ ...tnewQuery });

    setIsInit(null);
    setPayload({
      ...{
        pageNum: 1,
        pageSize: 10
      }
    })
  };
  //重置
  let formReset = () => {
    setNewQuery({ ...{} })
    setIsInit(null);
    form.resetFields();
    setPayload({
      ...{
        pageNum: 1,
        pageSize: 10
      }
    })
  }
  let tabChange = (e) => {
    setTabBillStatus(e);
    let tonewQuery = newQuery;
    tonewQuery.tabBillStatus = e;
    setNewQuery({ ...tonewQuery });
    setPayload({
      ...{
        pageNum: 1,
        pageSize: 10
      }
    })
  }
  // 查询分支机构数据
  let queryChildOrg = () => {
    dispatch({
      type: 'billHandleModel/queryChildOrg',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType: 'channel',
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if (res.result.code == 0) {
          if (res.body.channelOrganizations && res.body.channelOrganizations.length > 0) {
            let tree = eachTreeList(res.body.channelOrganizations);
            setIsOrgIdList([...tree]);
          }
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 构建树
  const eachTreeList = (treeList) => {
    let _treeList = [];
    for (let item of treeList) {
      let obj = {
        ...item,
        value: item.id,
        label: item.name,
      };
      if (item.childOrganizations.length > 0 && item.childOrganizations[0].id) {
        obj.children = eachTreeList(item.childOrganizations);
      }
      _treeList.push(obj);
    }
    return _treeList;
  }

  useEffect(() => {
    savaQuery({})
    saveTab(null)
    queryChildOrg();
    //开票
    invoiceForm.setFieldsValue({})
    if (Object.values(saveQuerySelect).length > 0) {
      console.log(tabNum)
      setTabBillStatus(tabNum)
      setIsBusinessType(saveQuerySelect.billType ? saveQuerySelect.billType : null)
      form.setFieldsValue({
        ...saveQuerySelect
      })
      if (saveQuerySelect.balancePeriodTime) {
        saveQuerySelect.balancePeriodStart = moment(saveQuerySelect.balancePeriodTime[0]).format('YYYY-MM'),
        saveQuerySelect.balancePeriodEnd = moment(saveQuerySelect.balancePeriodTime[1]).format('YYYY-MM')
      }
      setNewQuery({ ...saveQuerySelect });
      console.log(saveQuerySelect)
    } else {
      if (channelBillInfo.orderType == 2) {
        setIsBusinessType(channelBillInfo.businessType ? channelBillInfo.businessType : null)
        form.setFieldsValue({
          balancePeriodTime: [moment(channelBillInfo.startYearMonth), moment(channelBillInfo.endYearMonth)],
          billStatus: channelBillInfo.billStatus,
          billType: channelBillInfo.businessType,
        })
        let tonewQuery = newQuery;
        tonewQuery.billStatus = channelBillInfo.billStatus;
        tonewQuery.billType = channelBillInfo.businessType;
        tonewQuery.balancePeriodStart = channelBillInfo.startYearMonth;
        tonewQuery.balancePeriodEnd = channelBillInfo.endYearMonth;
        setNewQuery({ ...tonewQuery });
      } else {
        form.setFieldsValue({});//查询
      }
    }
  }, []);

  //初始请求
  useEffect(() => {
    businessType();
    getInvoiceConfigList();
    getInvoiceContentList();
  }, [])
  let initGet = () => {
    let toPayInfo = payload;
    let tnewQuery = newQuery;
    tnewQuery.tabBillStatus = tabBillStatus;
    toPayInfo.query = tnewQuery;
    console.log(toPayInfo)
    channelBalanceBillList(toPayInfo);
    channelBalanceBillCount(toPayInfo);
  }
  //触发请求
  useEffect(() => {
    if (isInit) {
      initGet();
    } else {
      let toQuery = form.getFieldsValue();
      console.log(toQuery)
      let tnewQuery = {};
      tnewQuery.billNo = toQuery.billNo ? toQuery.billNo : '';
      tnewQuery.billStatus = toQuery.billStatus ? toQuery.billStatus : '';
      tnewQuery.billType = toQuery.billType ? toQuery.billType : '';
      tnewQuery.orderNo = toQuery.orderNo ? toQuery.orderNo : ''
      tnewQuery.billName = toQuery.billName ? toQuery.billName : '';
      tnewQuery.invoiceStatus = toQuery.invoiceStatus ? toQuery.invoiceStatus : '';
      tnewQuery.tabBillStatus = tabBillStatus;
      if (toQuery.balancePeriodTime) {
        tnewQuery.balancePeriodStart = moment(toQuery.balancePeriodTime[0]).format('YYYY-MM'),
          tnewQuery.balancePeriodEnd = moment(toQuery.balancePeriodTime[1]).format('YYYY-MM')
      }
      if (Object.values(saveQuerySelect).length > 0) {
        if (saveQuerySelect.orgId && saveQuerySelect.orgId.length > 0) {
          tnewQuery.orgId = saveQuerySelect.orgId[saveQuerySelect.orgId.length - 1];
        }
      } else {
        if (toQuery.orgId && toQuery.orgId.length > 0) {
          tnewQuery.orgId = toQuery.orgId[toQuery.orgId.length - 1];
        }
      }

      let toPayInfo = payload;
      toPayInfo.query = newQuery;
      setNewQuery({ ...tnewQuery });
      toPayInfo.query = tnewQuery;
      channelBalanceBillCount(toPayInfo);
    }

  }, [payload])
  //业务类型
  let businessType = () => {
    dispatch({
      type: 'financeManageModel/businessType',// 命名空间名/effect内的函数名
      payload: {
        method: 'get',
        params: {}
      }
    });
  }
  //列表
  let channelBalanceBillList = (params) => {
    dispatch({
      type: 'billHandleModel/channelBalanceBillList',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: (res) => {
        let toList = res.body.list;
        toList.forEach((item, i) => {
          toList[i].confirmedCount = parseToThousandth(parseFloat(item.confirmedCount));
        })
        setTableList([...toList]);
        setTotal(res.body.total);
      }
    })
  }

  //获取发票配置信息
  let getInvoiceConfigList = () => {
    dispatch({
      type: 'billHandleModel/getInvoiceConfigList',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  //查询开票内容
  let getInvoiceContentList = () => {
    dispatch({
      type: 'billHandleModel/getInvoiceContentList',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }

  //开票申请
  let billInvoiceApply = (params) => {
    dispatch({
      type: 'billHandleModel/billInvoiceApply',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: (res) => {
        message.success('开票成功！');
        setIsModalVisible(false);
        let topayload = payload;
        setPayload({ ...topayload })
      }
    })
  }

  //获取开票信息
  let getinvoiceContent = () => {
    dispatch({
      type: 'billHandleModel/getinvoiceContent',
      payload: {
        method: 'get',
      },
      callback: (res) => {
        if (res.body != null) {
          invoiceForm.setFieldsValue({
            recipientsAddr: res.body.recipientsAddr,
            recipientsPhone: res.body.recipientsPhone,
            recipients: res.body.recipients,
          });
        }
      }
    })
  }

  let giveConfig = () => {
    if (!runReason) {
      message.error('请填写退回的原因！');
    } else {
      billUpdateStatus(8, runReason, toInfo.billId);
      setIsModalGive(false);
    }
  }
  //审核通过
  let examineConfig = (e) => {
    billUpdateStatus(4, "", toInfo.billId);
    setIsModalExamine(false);
  }

  //账单列表标签Tab
  let channelBalanceBillCount = (params) => {
    dispatch({
      type: 'billHandleModel/channelBalanceBillCount',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: (res) => {
        if (res.body) {
          setTabCountInfo({ ...res.body });
          if (!isInit) {
            if (res.body.waitProcessNum <= 0 && res.body.processNum > 0) {
              setTabBillStatus("2")
            } else {
              setTabBillStatus("1")
            }
            setIsInit("1");
            setPayload({
              ...{
                pageNum: 1,
                pageSize: 10
              }
            })
          }
        }
      }
    })
  }

  // 账单状态render
  // 待提交 2 待审核 7 审核退回 8 审核通过 4
  let billStatusRenDer = (text, record) => {
    if(record.billStatus==2) return <StateBadge type="yellow">{text}</StateBadge>
    if(record.billStatus==7) return <StateBadge color="#2FB6E4">{text}</StateBadge>
    if(record.billStatus==8) return <StateBadge color="#FFA500">{text}</StateBadge>
    if(record.billStatus==4) return <StateBadge color="#32D1AD">{text}</StateBadge>
  }
  // 业务类型renDer   1：场景服务 2：营销     3：saas      4：增值  5：集采
  let billTypeRender = (text, record) => {
    if (record.billType == 1) return <TypeTags color="#2FB6E4">{text}</TypeTags>
    if (record.billType == 2) return <TypeTags color="#FF724D">{text}</TypeTags>
    if (record.billType == 3) return <TypeTags color="#8E60BE">{text}</TypeTags>
    if (record.billType == 4) return <TypeTags color="#FFC500">{text}</TypeTags>
    if (record.billType == 5) return <TypeTags color="#32D1AD">{text}</TypeTags>
  }

  return (
    <>
      {/* 审核通过 */}
      <Modal title="账单审核" width={600} cancelText="取消" okText="审核通过" visible={isModalExamine} onOk={examineConfig} onCancel={() => { setIsModalExamine(false) }}>
        <Row justify="space-around">
          <Col span={8}>
            <span>账单月份：{toInfo.balancePeriod}</span>
          </Col>
          <Col span={8}>
            <span>账单金额：<i className={style.layer_n2}>{toInfo.adjustConfirmedAmount}</i></span>
          </Col>
          <Col span={8}>
            <span>业务类型：{toInfo.billTypeName}</span>
          </Col>
        </Row>
        <div className={style.layer_n3}>
          <h6>注意事项：</h6>
          <p>1、审核通过后，视为贵公司已确认我司提供的服务内容、结算数量、结算金额；</p>
          <p>2、开票申请后，我司将依据已确认的结算金额及开票信息开具发票；</p>
          <p>3、贵司收到发票后需按约定时间付款，如无特殊约定，默认按30天；</p>
        </div>
      </Modal>
      <Modal title="退回" width={500} cancelText="取消" okText="退回" visible={isModalGive} onOk={giveConfig} onCancel={() => { setIsModalGive(false) }}>
        <p className={style.layer_n1}>退回的原因</p>
        <TextArea rows={3} value={runReason} onChange={changeReason} />
      </Modal>
      {/* 弹框 */}
      <Modal title="开票申请" width={1000} visible={isModalVisible} onCancel={() => { setIsModalVisible(false) }} footer={null}>
        <Form form={invoiceForm} onFinish={onFinishInvoice}>
          <div className={style.modal_by}>
            <Row justify="start">
              <Col className={style.modal_by_li} span={8}>
                <Form.Item name="firstPartyName" label="基本信息" className={style.modal_by_li_n} rules={[{ required: true }]}>
                  <Select placeholder="请选择" onChange={changeParty}>
                    {
                      firstParty.map((item) => <Option key={item.objectId} value={item.objectId}>{item.firstPartyName}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="start">
              <Col className={style.modal_by_li} span={8}>
                <span>纳税人识别号：</span><em>{invoiceParty.taxNo}</em>
              </Col>
              <Col className={style.modal_by_li} span={9}>
                <span>开户银行：</span><em>{invoiceParty.bankName}</em>
              </Col>
              <Col className={style.modal_by_li} span={7}>
                <span>银行账号：</span><em>{invoiceParty.bankAccountNo}</em>
              </Col>
              <Col className={style.modal_by_li2} span={8}>
                <span>发票地址：</span><em>{invoiceParty.address}</em>
              </Col>
              <Col className={style.modal_by_li} span={9}>
                <span>联系电话：</span><em>{invoiceParty.phoneNo}</em>
              </Col>
            </Row>
            <h4>填写信息</h4>
            <Row justify="start">
              <Col className={style.modal_by_li} span={8} >
                <Form.Item name="billingCompany" label="开票公司" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 100px' }}>
                  <Select placeholder="请选择">
                    {
                      billingCompany.map((v) => <Option key={v.id} value={v.title}>{v.title}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col className={style.modal_by_li} span={8}>
                <Form.Item name="billingBank" label="开票银行" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 100px' }}>
                  <Select disabled>
                    {
                      billingBank.map((v) => <Option key={v.id} value={v.title}>{v.title}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item label="开票账期" labelCol={{ flex: '0 0 100px' }}>
                  <em>{invoiceApplyInfo.balancePeriod}</em>
                </Form.Item>
                {/* <span>开票账期：</span><em>{invoiceApplyInfo.balancePeriod}</em> */}
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item label="发票类型" labelCol={{ flex: '0 0 100px' }}>
                  <em>增值税专用发票</em>
                </Form.Item>
                {/* <span>发票类型：</span><em>增值税专用发票</em> */}
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item name="invoiceContent" label="发票内容" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 100px' }}>
                  <Select placeholder="请选择">
                    {
                      billContent ?
                        billContent.map((v) => <Option key={v.value} value={v.name}>{v.name}</Option>)
                        : ''
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item label="备注" name="remark" className={style.modal_by_li_n} labelCol={{ flex: '0 0 100px' }}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item label="收件地址" name="recipientsAddr" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 100px' }}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item label="收件人电话" name="recipientsPhone" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 100px' }}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col className={style.modal_by_li} span={8} >
                <Form.Item label="收件人" name="recipients" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 100px' }}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={style.modal_bom}>
            <Button type="primary" htmlType="submit">确定</Button>
            <Button htmlType="button" onClick={() => { setIsModalVisible(false) }} >取消</Button>
          </div>
        </Form>
      </Modal>
      <div className={style.block__cont}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={onFinish} onReset={formReset}>
          <Form.Item label="账单编号" name="billNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="账单编号" />
          </Form.Item>
          <Form.Item name="balancePeriodTime" label="账单月份" placeholder="开始月份-结束月份" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker picker="month" locale={locale} format="YYYY-MM" className={style.form_by_fn_time} />
          </Form.Item>
          <Form.Item label="业务类型" name="billType" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear onChange={(e) => { setIsBusinessType(e) }}>
              {
                businessTypeArr && businessTypeArr.map((v) => <Option key={v.value} value={v.value}>{v.name}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item name="billName" labelCol={{ flex: '0 0 120px' }} label="账单名称" >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="账单状态" name="billStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              <Option value={2}>待提交</Option>
              <Option value={7}>待审核</Option>
              <Option value={8}>审核退回</Option>
              <Option value={4}>审核通过</Option>
            </Select>
          </Form.Item>
          <Form.Item name="orderNo" labelCol={{ flex: '0 0 120px' }} label={<>
            <Tooltip placement="bottom" title="请输入完整编号，业务类型为场景服务时查询订单编号；营销投放时查询卡券/卡包编号">
              <QuestionCircleOutlined style={{ marginRight: '6px' }} />
            </Tooltip>
            明细编号
          </>}>
            <Input placeholder="请输入" disabled={isBusinessType == 3 || isBusinessType == 4 || isBusinessType == 5 || isBusinessType == null} />
          </Form.Item>
          {
            isOrgIdList.length > 0 ?
              <Form.Item name="orgId" className={style.form_by_fn} labelCol={{ flex: '0 0 120px' }} label="分支机构" >
                <Cascader
                  options={isOrgIdList}
                  placeholder="请选择分支机构"
                  showSearch
                  onSearch={value => console.log(value)}
                  changeOnSelect
                />
              </Form.Item> : null
          }
          <Form.Item label="开票状态" name="invoiceStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              <Option value={3}>未开票</Option>
              <Option value={2}>部分开票</Option>
              <Option value={1}>已开票</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.block__cont}>
        <Tabs activeKey={tabBillStatus} onChange={tabChange} className={style.tabs_content}>
          <TabPane tab={'待处理（' + tabCountInfo.waitProcessNum + '）'} key={1}></TabPane>
          <TabPane tab={'已处理（' + tabCountInfo.processNum + '）'} key={2}></TabPane>
        </Tabs>
        {/* <ListTitle titleName="">
          <Space size={8}>
            <Radio.Group defaultValue={tabBillStatus} buttonStyle="solid" onChange={tabChange}>
              <Radio.Button value={1}>待处理（{tabCountInfo.waitProcessNum}）</Radio.Button>
              <Radio.Button value={2}>已处理（{tabCountInfo.processNum}）</Radio.Button>
            </Radio.Group>
          </Space>
        </ListTitle> */}

        <ListTable showPagination current={payload.pageNum} pageSize={payload.pageSize} total={total}
          onChange={pageChange}
        >
          <Table columns={realColumns} dataSource={tableList} scroll={{ x: 1200 }} pagination={false} />
        </ListTable>
        {/* <div className={style.form__cont}>
          <Table columns={realColumns} dataSource={tableList} pagination={false} scroll={{ x: 1000 }}></Table>
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
    </>
  )
};
export default connect(({ financeManageModel, billHandleModel }) => ({
  businessTypeArr: financeManageModel.businessTypeArr,
  firstParty: billHandleModel.firstParty,
  billContent: billHandleModel.billContent,
  saveQuerySelect: billHandleModel.saveQuerySelect,
  tabNum:  billHandleModel.tabNum,
}))(handleListInfo)
