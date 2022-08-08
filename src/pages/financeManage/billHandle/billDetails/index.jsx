import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Space, Table, Button, message, Modal, Input, Form, Select, DatePicker } from "antd"
import style from "./style.less";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { parseToThousandth } from '@/utils/date';
import CompAuthControl from '@/components/Authorized/CompAuthControl';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
// 开票银行
let billingBank = [
  { title: '中国建设银行', id: '1' },
  { title: '招商银行', id: '2' },
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
  { title: '上海迅速通', id: '11' },
  { title: '上海辉臻', id: '12' },
]
// 账单处理
const billDetailsInfo = (props) => {
  let { dispatch, channelBalanceBillInfo, firstParty, billContent, invoiceInfo, invoiceApplyInfos } = props;
  let [invoiceForm] = Form.useForm();
  let [callList, setCallList] = useState(false);
  let [isModalOperate, setIsModalOperate] = useState(false);  //操作记录
  let [isModalGive, setIsModalGive] = useState(false);  //退回
  let [runReason, setRunReason] = useState('');  //退回原因
  let [isModalExamine, setIsModalExamine] = useState(false);  //审核通过
  let [isModalDeduction, setIsModalDeduction] = useState(false); // 撤销扣减明细
  let isForbid = history.location.query.stateType && history.location.query.stateType == 2 ? true : false;  //是否禁用
  let toBillType = history.location.query.billType;  //当前场景服务
  let [tableList, setTableList] = useState([]);  //账单明细
  let [billStatus, setBillStatus] = useState(0);  //账单状态
  let [invoiceStatus, setInvoiceStatus] = useState(null);// 下载盖章明细的状态 不等于0时显示
  let [invoiceApplyInfo, setInvoiceApplyInfo] = useState({});  //所选开票
  let [operateList, setOperateList] = useState([]);
  let [channelBalanceBillInfo2, setChannelBalanceBillInfo2] = useState({});
  let [channelBalanceBillInvoiceApplyInfo, setChannelBalanceBillInvoiceApplyInfo] = useState({});
  let [channelBalanceDeductionInfo, setChannelBalanceDeductionInfo] = useState(null); // 账单信息扣减信息独享
  let [invoiceParty, setInvoiceParty] = useState({});  //所选基本信息
  let [formInfo, setFormInfo] = useState({});  //开票信息
  //明细列表
  let goDetailList = (info) => {
    let billHandleInfo = info;
    billHandleInfo.billTypeName = channelBalanceBillInfo2.billTypeName || '';
    billHandleInfo.billName = channelBalanceBillInfo2.billName || '';
    dispatch({
      type: 'billHandleModel/setBillInfo',
      payload: billHandleInfo
    })
    history.push({ pathname: '/financeManage/billHandle/handleList', query: history.location.query, state: { invoiceStatus } })//跳列表
  }
  // 笔数
  const confirmedCount = (text, all) => {
    if (all.serviceName == '总计') {
      return <div>{text}</div>
    } else {
      return <div className={style.click_blue} onClick={() => { goDetailList(all) }}>{text}</div>
    }

  }

  //账单明细

  let realColumns = [];
  if (toBillType == 1 || toBillType == 2) {
    realColumns = [
      { title: '明细分类', dataIndex: 'serviceName', key: 'serviceName' },
      {
        title: '笔数', dataIndex: 'count', key: 'count',
        render: (count, all) => confirmedCount(count, all)
      },
      { title: '金额(元)', dataIndex: 'amount', key: 'amount' }
    ]
  } else if (toBillType == 3) {
    realColumns = [
      { title: '结算月份', dataIndex: 'balancePeriod', key: 'balancePeriod' },
      { title: '服务类别', dataIndex: 'scenesStr', key: 'scenesStr', },
      { title: '服务名称', dataIndex: 'serviceName', key: 'serviceName' },
      { title: '结算金额', dataIndex: 'saleAmount', key: 'saleAmount' },
      { title: '结算时间', dataIndex: 'orderBalanceTime', key: 'orderBalanceTime' }
    ]
  } else {
    realColumns = [
      { title: '结算月份', dataIndex: 'balancePeriod', key: 'balancePeriod' },
      { title: '服务类别', dataIndex: 'scenesStr', key: 'scenesStr', },
      { title: '结算金额', dataIndex: 'saleAmount', key: 'saleAmount' },
      { title: '结算时间', dataIndex: 'orderBalanceTime', key: 'orderBalanceTime' }
    ]
  }

  //操作记录
  let operateColumns = [
    { title: '操作人', dataIndex: 'createUserName', width: '150px' },
    { title: '操作时间', dataIndex: 'createTime', width: '200px' },
    { title: '操作', dataIndex: 'operContent', width: '160px' },
    { title: '备注', dataIndex: 'remark' }
  ]
  //确认退回
  let giveConfig = () => {
    if (!runReason) {
      message.error('请填写退回的原因！');
    } else {
      billUpdateStatus(8, runReason, {});
      setIsModalGive(false);
    }
  }
  //退回原因
  let changeReason = (e) => {
    setRunReason(e.target.value);
  }

  //审核通过
  let examineConfig = (e) => {
    billUpdateStatus(4, "", formInfo);
    setIsModalExamine(false);
  }

  //撤销账单&撤销提交&提交审核
  let onToolsPrize = (key, name, btnTxt, toFrom) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      width: 420,
      content: <span className={style.layer_n5}>{name}</span>,
      okText: btnTxt,
      cancelText: '取消',
      onOk () {
        if (key == 1) { //撤销账单
          billRevoke();
        } else if (key == 2) {  //撤销提交
          billUpdateStatus(2, "", {});
        } else if (key == 3) {  //提交审核
          billUpdateStatus(7, "", toFrom);
        }
      },
    })
  }

  useEffect(() => {
    queryDeductionInfo();
    channelBalanceBillInfos();
    if (toBillType == 1 || toBillType == 2) {
      billStatistics();
    } else {
      billSaasAndVat();
    }
  }, [callList])

  //账单信息查询
  let channelBalanceBillInfos = () => {
    dispatch({
      type: 'billHandleModel/channelBalanceBillInfos',
      payload: {
        method: 'get',
        billId: history.location.query.billId
      },
      callback: (res) => {
        setChannelBalanceBillInfo2({ ...res.body.channelBalanceBillInfo });
        setChannelBalanceBillInvoiceApplyInfo({ ...res.body.channelBalanceBillInvoiceApplyInfo });
        setBillStatus(res.body.channelBalanceBillInfo.billStatus);
        setInvoiceStatus(res.body.channelBalanceBillInfo.invoiceStatus)
        setInvoiceApplyInfo({ ...res.body.channelBalanceBillInfo });
        invoiceDetails(res.body.channelBalanceBillInfo.billNo);
      }
    })
  }

  //账单明细 -- 场景服务和营销卡券
  let billStatistics = () => {
    dispatch({
      type: 'billHandleModel/billStatistics',
      payload: {
        method: 'get',
        billId: history.location.query.billId
      },
      callback: (res) => {
        let toList = res.body;
        toList.forEach((item, i) => {
          toList[i].count = parseToThousandth(item.count);
          toList[i].amount = parseToThousandth(item.amount);
        })
        setTableList([...toList])
      }
    })
  }

  //账单明细 -- Saas和增值
  let billSaasAndVat = () => {
    let params = {
      "pageNum": 1,
      "pageSize": 1000,
      "query": {
        "billId": history.location.query.billId,
        "billType": toBillType
      }
    }
    dispatch({
      type: 'billHandleModel/billSaasAndVat',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: (res) => {
        let toList = res.body.list;
        setTableList([...toList])
      }
    })
  }

  //账单明细 --操作记录
  let billLog = () => {
    dispatch({
      type: 'billHandleModel/billLog',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,
          accountType: 2
        }
      },
      callback: (res) => {
        if (res.body && res.body.length > 0) {
          setOperateList([...res.body]);
        }
      }
    })
  }

  //账单明细 --撤销账单
  let billRevoke = () => {
    dispatch({
      type: 'billHandleModel/billRevoke',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,
          accountType: 2
        }
      },
      callback: (res) => {
        message.success('撤销账单成功！');
        history.goBack()
      }
    })
  }
  //账单明细 --更改账单状态
  let billUpdateStatus = (billStatus, rejectReason, billInvoiceApplyQuery) => {
    dispatch({
      type: 'billHandleModel/billUpdateStatus',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,
          billStatus: billStatus,
          rejectReason: rejectReason,
          platformType: 2,
          billInvoiceApplyQuery: billInvoiceApplyQuery
        }
      },
      callback: (res) => {
        message.success('状态操作成功！');
        channelBalanceBillInfos();
      }
    })
  }
  // 账单明细 --查询扣减信息
  let queryDeductionInfo = () => {
    dispatch({
      type: 'billHandleModel/queryDeductionInfo',
      payload: {
        method: 'postJSON',
        billId: history.location.query.billId
      },
      callback: (res) => {
        setChannelBalanceDeductionInfo(res.body)
      }
    })
  }
  // 扣减下载文件
  let downCodeFile = (all) => {
    dispatch({
      type: 'billHandleModel/fileDownload',//下载文件
      payload: {
        method: 'get',
        fileCode: all.fileId,
        responseType: 'blob'
      },
      callback: (res) => {
        if (res) {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', all.fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    })
  }
  // 根据扣减id删除扣减信息
  let onOkDeduction = () => {
    console.log(280)
    dispatch({
      type: 'billHandleModel/revocationBillDeduction',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,
          billDeductionId: channelBalanceDeductionInfo.objectId
        }
      },
      callback: (res) => {
        console.log(res)
        if (res.result.code == 0) {
          message.success(res.result.message);
          setIsModalDeduction(false)
          setCallList(!callList)
        } else {
          message.error(res.result.message);
          setIsModalDeduction(false)
        }
      }
    })
  };
  //获取发票配置信息
  let getInvoiceConfigList = () => {
    dispatch({
      type: 'billHandleModel/getInvoiceConfigList',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  };
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
  useEffect(() => {
    getInvoiceConfigList();
    getInvoiceContentList();
    getinvoiceContent();
    invoiceForm.setFieldsValue({
      billingBank: '中国银行',
      invoiceType: 1
    })
  }, [])
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
        channelBalanceBillInfos();
      }
    })
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
    toParams.invoiceType = values.invoiceType;
    toParams.remark = values.remark;
    toParams.uniwayFlag = 1;
    toParams.totalAmount = invoiceApplyInfo.billAdjustConfirmedAmount;
    toParams.recipientsAddr = values.recipientsAddr;
    toParams.recipientsPhone = values.recipientsPhone;
    toParams.recipients = values.recipients;
    if (billStatus == 7) {
      setFormInfo({ ...toParams })
      setIsModalExamine(true);
    } else {
      setFormInfo({ ...toParams });
      onToolsPrize(3, '确定要将账单提交给上级主管审核？', '提交审核', toParams);
    }

  };
  //基本信息change
  let changeParty = (e) => {
    let toFirstParty = firstParty.filter((item) => item.objectId == e);
    setInvoiceParty({ ...toFirstParty[0] });
  }
  //开票信息
  let invoiceDetails = (billNo) => {
    dispatch({
      type: 'payableInvoicesModel/invoiceDetails',
      payload: {
        method: 'get',
        params: {},
        billNo: billNo
      }
    });
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


  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <div className={style.block__header_h}>账单处理</div>
          <div>
            <Button className={style.btn_radius} htmlType="button" onClick={() => {
              history.goBack()
            }}>返回</Button>
          </div>
        </div>
        <div className={style.form__cont}>
          <h3>账单信息</h3>
          <div className={style.form__cont}>
            <Row justify="space-around">
              <Col className={style.form__item} span={8}>
                <div>业务类型</div>
                <p>{channelBalanceBillInfo2.billTypeName}</p>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单月份</div>
                <p>{channelBalanceBillInfo2.balancePeriod}</p>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单名称</div>
                <p>{channelBalanceBillInfo2.billName}</p>
              </Col>
            </Row>
            <Row justify="space-around">
              <Col className={style.form__item} span={8}>
                <div>账单编号</div>
                <p>{channelBalanceBillInfo2.billNo}</p>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单状态</div>
                <p>{channelBalanceBillInfo2.billStatusName}</p>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单说明</div>
                <p>{channelBalanceBillInfo2.remark}</p>
              </Col>
            </Row>
            <Row justify="space-around">
              <Col className={style.form__item} span={8}>
                <div>账单金额</div>
                <p>{channelBalanceBillInfo2.adjustConfirmedAmount} 元</p>
              </Col>
              {
                toBillType == 3 || toBillType == 4 ? <Col className={style.form__item} span={8}>
                  <div>已结算笔数</div>
                  <p>{channelBalanceBillInfo2.confirmedCount}</p>
                </Col> : null
              }
              {
                toBillType == 1 || toBillType == 2 ? <Col className={style.form__item} span={8}>
                  <div>备注</div>
                  <p>{channelBalanceBillInfo2.checkRemark}</p>
                </Col> : null
              }
              <Col className={style.form__item} span={8}>
                <div>退回原因</div>
                <p>{channelBalanceBillInfo2.rejectReamrk}</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {
        channelBalanceDeductionInfo ?
          <div className={style.block__cont}>
            <div className={style.form__cont}>
              <h3>扣减明细</h3>
              <div className={style.form__cont}>
                <Row justify="space-around">
                  <Col className={style.form__item} span={8}>
                    <div>原账单金额</div>
                    <p>{window.number_to_thousandth(channelBalanceDeductionInfo.oriAdjustConfirmedAmount, 2)}元</p>
                  </Col>
                  <Col className={style.form__item} span={8}>
                    <div>扣减金额</div>
                    <p>{window.number_to_thousandth(channelBalanceDeductionInfo.deductionAmount, 2)}元</p>
                  </Col>
                  <Col className={style.form__item} span={8}>
                    <div>扣减后金额</div>
                    <p>{window.number_to_thousandth(channelBalanceDeductionInfo.adjustConfirmedAmount, 2)}元</p>
                  </Col>
                </Row>
                <Row justify="space-around">
                  <Col className={style.form__item} span={8}>
                    <div>扣减比例</div>
                    <p>{channelBalanceDeductionInfo.deductionProportion}%</p>
                  </Col>
                  <Col className={style.form__item} span={8}>
                    <div>扣减理由</div>
                    <p>{channelBalanceDeductionInfo.deductionTypeStr}</p>
                  </Col>
                  <Col className={style.form__item} span={8}>
                    <div>附件</div>
                    {
                      channelBalanceDeductionInfo.fileName ?
                        <a onClick={() => { downCodeFile(channelBalanceDeductionInfo) }}>{channelBalanceDeductionInfo.fileName}</a>
                        :
                        <p>--</p>
                    }
                  </Col>
                </Row>
                <Row justify="space-around">
                  <Col className={style.form__item} span={8}>
                    <div>扣减说明</div>
                    <p>{channelBalanceDeductionInfo.remark}</p>
                  </Col>
                  <Col className={style.form__item} span={8}></Col>
                  <Col className={style.form__item} span={8}></Col>
                </Row>
              </div>
            </div>
          </div> : null
      }
      <div className={style.block__cont}>
        <div className={style.form__cont}>
          <h3>账单明细</h3>
          <Table columns={realColumns} dataSource={tableList} pagination={false}></Table>

        </div>
      </div>
      <Form form={invoiceForm} onFinish={onFinishInvoice}>
        {
          ((toBillType == 3 || toBillType == 4) && (billStatus == 7)) || (toBillType == 1 || toBillType == 2) && (billStatus == 2 || billStatus == 8) && !isForbid ? <div className={style.block__cont}>
            <div className={style.form__cont}>
              <h3>开票信息</h3>
              <div className={style.modal_by}>
                <Row justify="start">
                  <Col className={style.modal_by_li} span={8}>
                    <Form.Item name="firstPartyName" label="公司名称" labelCol={{ flex: '0 0 120px' }} className={style.modal_by_li_n} rules={[{ required: true }]}>
                      <Select placeholder="请选择" onChange={changeParty}>
                        {
                          firstParty.map((item) => <Option key={item.objectId} value={item.objectId}>{item.firstPartyName}</Option>)
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {
                  invoiceParty && invoiceParty.taxNo ?
                    <Row justify="start" className={style.modal_by_start}>
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
                    </Row> : null
                }

                <Row justify="start">
                  <Col className={style.modal_by_li} span={8} >
                    <Form.Item name="billingCompany" label="开票公司" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 120px' }}>
                      <Select placeholder="请选择">
                        {
                          billingCompany.map((v) => <Option key={v.id} value={v.title}>{v.title}</Option>)
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className={style.modal_by_li} span={8}>
                    <Form.Item name="billingBank" label="开票银行" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 120px' }}>
                      <Select disabled>
                        {
                          billingBank.map((v) => <Option key={v.id} value={v.title}>{v.title}</Option>)
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className={style.modal_by_li} span={8} >
                    <Form.Item label="开票账期" labelCol={{ flex: '0 0 120px' }}>
                      <em>{invoiceApplyInfo.balancePeriod}</em>
                    </Form.Item>
                    {/* <span>开票账期：</span><em>{invoiceApplyInfo.balancePeriod}</em> */}
                  </Col>
                  <Col className={style.modal_by_li} span={8} >
                    <Form.Item label="发票类型" name="invoiceType" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                      <Select placeholder="请选择" defaultValue={1}>
                        <Option key={1} value={1}>增值税专用发票</Option>
                        <Option key={2} value={2}>普通发票</Option>
                      </Select>
                    </Form.Item>
                    {/* <span>发票类型：</span><em>增值税专用发票</em> */}
                  </Col>
                  <Col className={style.modal_by_li} span={8} >
                    <Form.Item name="invoiceContent" label="发票内容" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 120px' }}>
                      <Select allowClear showSearch placeholder="请选择">
                        {
                          billContent ?
                            billContent.map((v) => <Option key={v.value} value={v.name}>{v.name}</Option>)
                            : ''
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className={style.modal_by_li} span={8} >
                    <Form.Item label="备注" name="remark" className={style.modal_by_li_n} labelCol={{ flex: '0 0 120px' }}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>

                </Row>
              </div>

            </div>
          </div> : null
        }
        {
          ((toBillType == 3 || toBillType == 4) && (billStatus == 7)) || (toBillType == 1 || toBillType == 2) && (billStatus == 2 || billStatus == 8) && !isForbid ?
            <div className={style.block__cont}>
              <div className={style.form__cont}>
                <h3>快递信息</h3>
                <div className={style.modal_by}>
                  <Row justify="start">
                    <Col className={style.modal_by_li} span={8} >
                      <Form.Item label="收件地址" name="recipientsAddr" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 120px' }}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col className={style.modal_by_li} span={8} >
                      <Form.Item label="收件人电话" name="recipientsPhone" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 120px' }}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                    <Col className={style.modal_by_li} span={8} >
                      <Form.Item label="收件人姓名" name="recipients" className={style.modal_by_li_n} rules={[{ required: true }]} labelCol={{ flex: '0 0 120px' }}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
            </div> : !isForbid && (invoiceApplyInfos || invoiceInfo) ? <div className={style.block__cont}>
              <div className={style.form__cont}>
                <h3>开票信息</h3>
                <div className={style.form__cont}>
                  <Row justify="space-around">
                    <Col className={style.form__item} span={8}>
                      <div>公司信息</div>
                      <p>{invoiceApplyInfos && invoiceApplyInfos.firstPartyName ? invoiceApplyInfos.firstPartyName : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>纳税人识别号</div>
                      <p>{invoiceApplyInfos && invoiceApplyInfos.taxNo ? invoiceApplyInfos.taxNo : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>开户银行</div>
                      <p>{invoiceApplyInfos && invoiceApplyInfos.bankName ? invoiceApplyInfos.bankName : ''}</p>
                    </Col>
                  </Row>
                  <Row justify="space-around">
                    <Col className={style.form__item} span={8}>
                      <div>银行账号</div>
                      <p>{invoiceApplyInfos && invoiceApplyInfos.bankAccountNo ? invoiceApplyInfos.bankAccountNo : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>发票地址</div>
                      <p>{invoiceApplyInfos && invoiceApplyInfos.invoiceAddress ? invoiceApplyInfos.invoiceAddress : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>联系电话</div>
                      <p>{invoiceApplyInfos && invoiceApplyInfos.phoneNo ? invoiceApplyInfos.phoneNo : ''}</p>
                    </Col>
                  </Row>
                  <Row justify="space-around">
                    <Col className={style.form__item} span={8}>
                      <div>开票公司</div>
                      <p>{invoiceInfo && invoiceInfo.billingCompany ? invoiceInfo.billingCompany : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>开票银行</div>
                      <p>{invoiceInfo && invoiceInfo.billingBank ? invoiceInfo.billingBank : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>开票账期</div>
                      <p>{invoiceInfo && invoiceInfo.balancePeriod ? invoiceInfo.balancePeriod : ''}</p>
                    </Col>
                  </Row>
                  <Row justify="space-around">
                    <Col className={style.form__item} span={8}>
                      <div>发票类型</div>
                      <p>{invoiceInfo && invoiceInfo.invoiceTypeStr ? invoiceInfo.invoiceTypeStr : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>发票内容</div>
                      <p>{invoiceInfo && invoiceInfo.invoiceContent ? invoiceInfo.invoiceContent : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>备注</div>
                      <p>{invoiceInfo && invoiceInfo.remark ? invoiceInfo.remark : ''}</p>
                    </Col>
                  </Row>
                  <Row justify="space-around">
                    <Col className={style.form__item} span={8}>
                      <div>快递地址</div>
                      <p>{invoiceInfo && invoiceInfo.recipientsAddr ? invoiceInfo.recipientsAddr : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>收件人</div>
                      <p>{invoiceInfo && invoiceInfo.recipients ? invoiceInfo.recipients : ''}</p>
                    </Col>
                    <Col className={style.form__item} span={8}>
                      <div>收件人电话</div>
                      <p>{invoiceInfo && invoiceInfo.recipientsPhone ? invoiceInfo.recipientsPhone : ''}</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div> : null
        }





        <div className={style.block__cont}>
          <div className={style.form_tools}>
            <Button htmlType="button" onClick={() => { billLog(); setIsModalOperate(true); }}>操作记录</Button>
            {
              (toBillType == 1 || toBillType == 2) && (billStatus == 2 || billStatus == 8) ? <Button htmlType="button" disabled={isForbid} onClick={() => { onToolsPrize(1, '撤销账单后账单中的订单需要全部重新入账，确定要撤销？', '撤销账单') }}>撤销账单</Button> : null
            }
            {
              (toBillType == 1 || toBillType == 2) && (billStatus == 7) ? <Button htmlType="button" disabled={isForbid} onClick={() => { onToolsPrize(2, '确定要撤销已提交审核的账单？', '撤销提交') }}>撤销提交</Button> : null
            }
            {
              (toBillType == 1 || toBillType == 2) && (billStatus == 2 || billStatus == 8) ? <Button type="primary" htmlType="submit" disabled={isForbid}>提交审核</Button> : null
            }
            {
              billStatus == 7 ?
                <CompAuthControl compCode="financeManage_billDetails_back">
                  <Button htmlType="button" disabled={isForbid} onClick={() => { setIsModalGive(true); setRunReason(""); }}>退回</Button>
                </CompAuthControl>
                : null
            }
            {
              billStatus == 7 ?
                <CompAuthControl compCode="financeManage_billDetails_examine">
                  <Button type="primary" htmlType="submit" disabled={isForbid}>审核通过</Button>
                  {/* <Button type="primary" disabled={isForbid} onClick={() => { setIsModalExamine(true); }}>审核通过</Button> */}
                </CompAuthControl>
                : null
            }
            {
              // channelBalanceDeductionInfo ?  <Button onClick={() => { setIsModalDeduction(true) }}>撤销扣减明细</Button> : null
            }
          </div>
        </div>
      </Form>

      <Modal title="操作记录" width={1000} visible={isModalOperate} onCancel={() => { setIsModalOperate(false) }} footer={null}>
        <Table columns={operateColumns} dataSource={operateList} pagination={false} scroll={{ y: 500 }}></Table>
      </Modal>

      <Modal title="退回" width={500} cancelText="取消" okText="退回" visible={isModalGive} onOk={giveConfig} onCancel={() => { setIsModalGive(false) }}>
        <p className={style.layer_n1}>退回的原因</p>
        <TextArea rows={3} value={runReason} onChange={changeReason} />
      </Modal>
      {/* 审核通过 */}
      <Modal title="账单审核" width={600} cancelText="取消" okText="审核通过" visible={isModalExamine} onOk={examineConfig} onCancel={() => { setIsModalExamine(false) }}>
        <Row justify="space-around">
          <Col span={8}>
            <span>账单月份：{channelBalanceBillInfo2.balancePeriod}</span>
          </Col>
          <Col span={8}>
            <span>账单金额：<i className={style.layer_n2}>{channelBalanceBillInfo2.adjustConfirmedAmount}</i></span>
          </Col>
          <Col span={8}>
            <span>业务类型：{channelBalanceBillInfo2.billTypeName}</span>
          </Col>
        </Row>
        <div className={style.layer_n3}>
          <h6>注意事项：</h6>
          <p>1、审核通过后，视为贵公司已确认我司提供的服务内容、结算数量、结算金额；</p>
          <p>2、开票申请后，我司将依据已确认的结算金额及开票信息开具发票；</p>
          <p>3、贵司收到发票后需按约定时间付款，如无特殊约定，默认按30天；</p>
        </div>
      </Modal>
      {/* 扣减账单明细弹层 */}
      <Modal title="撤销扣减明细" cancelText="取消" okText="撤销" visible={isModalDeduction} onOk={onOkDeduction} onCancel={() => { setIsModalDeduction(false) }}>
        <p>扣减明细撤销后将不能恢复，请谨慎操作，确定要撤销？</p>
      </Modal>
    </>
  )
};
export default connect(({ billHandleModel, payableInvoicesModel }) => ({
  channelBalanceBillInfo: billHandleModel.channelBalanceBillInfo,
  firstParty: billHandleModel.firstParty,
  billContent: billHandleModel.billContent,
  invoiceInfo: payableInvoicesModel.invoiceInfo,
  invoiceApplyInfos: payableInvoicesModel.invoiceApplyInfo,
}))(billDetailsInfo)