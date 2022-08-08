import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Space, Table, Button, Select, DatePicker, message, Tag, Input, Form, Modal, Pagination } from "antd"
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { fmoney } from '@/utils/date'
const { RangePicker } = DatePicker
const { Option, OptGroup } = Select;
const { TextArea } = Input;
const { Column } = Table;

// 3，4.查看详情
const DetailSoftwareValueadded = (props) => {
  let thisDetail = JSON.parse(localStorage.getItem('finance_list_itemed'));
  // console.log(thisDetail, 'hha')
  let {
    dispatch,
    channelBalanceBillInfo,
    channelBalanceBillInvoiceApplyInfo,
    infoDetailList,

    total,
    isDisable,
    caseServiceList,
    caseServiceItems,
    caseStatusList,
    isLastConfirm,
    isLastReject
  } = props,
    [form] = Form.useForm(),
    [countDetail, setCountDetail] = useState(thisDetail),//基本信息
    [rejectReason, setRejectReason] = useState('')//驳回理由
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [isModalReject, setIsModalReject] = useState(false);



  let [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10,
    query: {
      channelId: countDetail.channelId,//客户名称
      billType: countDetail.billType,//业务类型 1：据实服务 2：预采投放 3：数字SaaS 4:增值服务
      billId: history.location.query.billId,//账单序号

      orderNo: '',//订单编号
      serviceTypeId: null,//服务类型
      serviceId: null,//服务项目
      plateNo: '',//车牌号
      orderCreateTimeStart: '',//	订单创建时间起始
      orderCreateTimeEnd: '',//订单创建时间终止
      orderStatus: null,//服务状态==================(1.据实服务)
      cardId: null,//	卡券编号
      couponSkuName: '',//卡券标题
      discountsType: null,//卡券种类1、优惠券 2、抵用券 3、打折券
      couponCategoryType: null,//卡券品类1、洗车券2、送花券 3、停车券 4、保养券、5钣喷券
      balanceNode: null,//结算节点:0发放,1领取,2使用
      balanceNodeBeginTime: '',//结算开始时间
      balanceNodeEndTime: '',//结算结束时间===============（2.预采）

      serviceName: '',//服务名称
      // uploadImageFlag: 0//是否上传照片:0否1是
    }
  });

  useEffect(() => {
    getServePro()//服务类型，项目
    billInfo()//1查看详情
    infoList()//2详情列表
  }, [payload])

  // 服务和项目
  let getServePro = () => {
    dispatch({
      type: 'financeManageModel/serviceProjects',
      payload: {
        method: 'get',
        params: {}
      }
    })
  }
  // 1查看已入账
  const billInfo = () => {
    dispatch({
      type: 'financeManageModel/billInfo',
      payload: {
        method: 'get',
        billId: history.location.query.billId,
        params: {}
      }
    })
  }
  // 2入账详情-结算明细列表
  const infoList = () => {
    dispatch({
      type: 'financeManageModel/infoList',
      payload: {
        method: 'postJSON',
        params: payload
      }
    })
  }
  // 1对账专用
  // let exportSpecial = () => {
  // }


  // 2导出（1据实）
  const exportRealed = () => {
    dispatch({
      type: 'financeManageModel/billDetail',
      payload: {
        method: 'postJsonExcel',
        params: payload.query
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '结算明细.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  // 3点击批量调整金额
  const adjustmentBatch = () => {
    history.push({
      pathname: '/financeManage/billList/adjustmentBatch',
      query: {
        billId: history.location.query.billId
      }
    })
  }
  // 4点击批量撤销入账
  const revokeBatch = () => {
    history.push({
      pathname: '/financeManage/billList/revokeBatch',
      query: {
        billId: history.location.query.billId
      }
    })
  }

  // 时间处理
  let orderCreateTime = (text, all) => {
    let textTime = text.substring(0, 10)
    return <div>{textTime}</div>
  }

  let realColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '服务名称', dataIndex: 'serviceName', key: 'serviceName', },
    { title: '结算周期', dataIndex: 'balanceTypeName', key: 'balanceTypeName' },
    {
      title: '结算金额(元) ', align: "right", dataIndex: 'balanceAmount', key: 'balanceAmount',
      render: (text, all) => {
        return <span style={{ color: '#f00' }}>{text}</span>
      }
    },
    { title: '结算日期', dataIndex: 'balanceNodeTime', key: 'balanceNodeTime' }
    // {
    //   title: '结算日期',
    //   dataIndex: 'orderCreateTime',
    //   key: 'orderCreateTime',
    //   // render: (text, all) => orderCreateTime(text, all)
    // }
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   key: 'option',
    //   render: (text, all) => option(text, all)
    // }
  ]
  // 判断操作栏是否显示
  // if (history.location.query.recordDetail == 'view') {
  //   realColumns = realColumns.slice(0, realColumns.length - 1);
  // }
  let option = (text, all) => {
    return <div ><Space size="middle"><span className={style.click_blue}>调整金额</span><span className={style.click_blue}>撤销入账</span></Space></div>
  }



  // 3点击终审确认
  let confirmInstance = () => {
    setIsModalConfirm(true);
  }
  // 3-1确认终审
  let handleConfirmOk = () => {
    dispatch({
      type: 'financeManageModel/udpateBill',
      payload: {
        method: 'postJSON',
        params: {
          billId: history.location.query.billId,//	账单ID
          billStatus: 4,//更新账单状态 2:确认账单 4:终审确认5:提交审核 6:初审驳回 7:初审确认 8:终审驳回
          rejectReason: ""//驳回原因
        }
      },
      callback: (res) => {
        console.log(res, '666')
        if (res.result.code == '0') {//成功
          message.success({
            content: '终审确认提交成功！',
          })
          // dispatch({
          //   type: 'financeManageModel/isLastConfirm',
          //   payload: true
          // });
          // dispatch({
          //   type: 'financeManageModel/isLastReject',
          //   payload: true
          // });
          setIsModalConfirm(false);
          billInfo()//刷新结算明细列表
        } else {//失败
          message.warning({
            content: res.result.message,
          });
        }
      }
    })
  }
  let handleConfirmCancel = () => {
    setIsModalConfirm(false);
  }


  // 4点击终审驳回
  let rejectInstance = () => {
    setIsModalReject(true);
  }
  // 终审驳回理由
  let rejectText = (e) => {
    setRejectReason(e.target.value)
  }
  // 4-1确认终审驳回
  let handleRejectOk = () => {
    // console.log(rejectReason, '66')
    if (rejectReason.replace(/^\s+|\s+$/g, "") == '') {//去除两头空格
      message.warning('请填写驳回理由！')
    } else {
      dispatch({
        type: 'financeManageModel/udpateBill',
        payload: {
          method: 'postJSON',
          params: {
            billId: history.location.query.billId,//	账单ID
            billStatus: 8,//更新账单状态 2:确认账单 4:终审确认5:提交审核 6:初审驳回 7:初审确认 8:终审驳回
            rejectReason: rejectReason//驳回原因
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {//成功
            message.success({
              content: '终审驳回提交成功！',
            })
            dispatch({
              type: 'financeManageModel/isLastReject',
              payload: true
            });
            dispatch({
              type: 'financeManageModel/isLastConfirm',
              payload: true
            });
            setIsModalReject(false);
            billInfo()//刷新结算明细列表
          } else {//失败
            message.warning({
              content: res.result.message,
            });
          }
        }
      })

    }
  }
  let handleRejectCancel = () => {
    setIsModalReject(false);
  }


  /*3查询按钮*/
  let searchRealBtn = (values) => {
    // 判断是否存在
    if (values.orderTime) {
      payload.query.orderCreateTimeStart = values.orderTime[0].format('YYYY-MM-DD');
      payload.query.orderCreateTimeEnd = values.orderTime[1].format('YYYY-MM-DD')
    }
    if (values.serviceTypeId) {
      payload.query.serviceTypeId = values.serviceTypeId.split('&')[0]//服务类型id
    }

    let data = {
      pageNum: 1,
      pageSize: 10,
      query: {
        channelId: countDetail.channelId,//客户名称
        billType: countDetail.billType,//	业务类型
        billId: history.location.query.billId,//

        orderNo: values.orderNo || '',//订单编号
        serviceTypeId: payload.query.serviceTypeId || null,//服务类型
        serviceId: values.serviceId || null,//服务项目
        plateNo: values.plateNo || '',//车牌号
        orderStatus: values.orderStatus || null,//服务状态
        orderCreateTimeStart: payload.query.orderCreateTimeStart || '',//订单创建时间起始
        orderCreateTimeEnd: payload.query.orderCreateTimeEnd || '',//订单创建时间终止==========(1据实服务)
        serviceName: values.serviceName || ''
      }
    }
    setPayload(data);
    // 判空
    // for (let keys in values) {
    //   console.log(keys)
    //   if (values[keys]) { data.query[keys] = values[keys] }
    // }
  }
  /*4重置*/
  let resetBtnEvent = () => {
    form.resetFields();//重置
    let data = {
      pageNum: 1,
      pageSize: 10,
      query: {
        channelId: countDetail.channelId,//客户名称
        billType: countDetail.billType,//	业务类型
        billId: history.location.query.billId,//账单序号

        orderNo: '',//订单编号
        serviceName: '',//
        serviceTypeId: null,//服务类型
        serviceId: null,//服务项目
        plateNo: '',//车牌号
        orderStatus: null,//	服务状态
        orderCreateTimeStart: '',//订单创建时间起始
        orderCreateTimeEnd: '',//订单创建时间终止==========(1据实服务)
      }
    }
    setPayload(data)
  }
  const clickCaseServiceList = (e) => {
    console.log(e, 'ee')
    let data = e.split('&')
    let id = data[0]//服务类型id
    let arr = JSON.parse(data[1])

    console.log(arr, id);
    if (id) {
      dispatch({
        type: 'financeManageModel/isDisable',
        payload: false
      });

      dispatch({
        type: 'financeManageModel/serviceItems',
        payload: arr
      });
    }
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

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          {/* {
            history.location.query.recordDetail == 'view' ? <div>账单明细</div> : <div>处理账单</div>
          } */}
          <div>账单明细</div>
          <div>
            <Button className={style.btn_radius} htmlType="button" onClick={() => { history.goBack() }}>返回</Button>
          </div>
        </div>
        <div className={style.form__cont}>
          <h3>基本信息</h3>
          <div className={style.form__cont}>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>业务类型：<span>{channelBalanceBillInfo.billTypeName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单月份：<span>{channelBalanceBillInfo.balancePeriod}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单名称：<span>{channelBalanceBillInfo.billName}</span></div>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>账单编码：<span>{channelBalanceBillInfo.billNo}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单状态：<span>{channelBalanceBillInfo.billStatusName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单说明：<span>{channelBalanceBillInfo.checkRemark ? channelBalanceBillInfo.checkRemark : '--'}</span></div>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>原结算金额(元)：<span style={{ color: '#f00' }}>{channelBalanceBillInfo.confirmedAmount}</span></div>
                <div style={{ color: '#f00' }}></div>              </Col>
              <Col className={style.form__item} span={8}>
                <div>调整后结算金额(元)：<span style={{ color: '#f00' }}>{channelBalanceBillInfo.adjustConfirmedAmount}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>调整金额(元)：
                  <span style={{ color: '#f00' }}>
                    {channelBalanceBillInfo.totalAdjustAmount}
                  </span>
                </div>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>已结算笔数：<span>{channelBalanceBillInfo.confirmedCount}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>备注：<span>{channelBalanceBillInfo.remark}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
              </Col>
            </Row>
            {/* <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>客户名称：<span>{channelBalanceBillInfo.channelName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单ID：<span>{channelBalanceBillInfo.billNo}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>入账笔数：<span>{channelBalanceBillInfo.confirmedCount}</span></div>
              </Col>
            </Row>

            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>账单说明：<span>{channelBalanceBillInfo.remark ? channelBalanceBillInfo.remark : '--'}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>账单状态：<span>{channelBalanceBillInfo.billStatusName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>审核备注：<span>{channelBalanceBillInfo.checkRemark ? channelBalanceBillInfo.checkRemark : '--'}</span></div>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col className={style.form__item} span={8}>
                <div>开票状态：<span>{channelBalanceBillInfo.invoiceStatusName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
                <div>收款状态：<span>{channelBalanceBillInfo.reciveStatusName}</span></div>
              </Col>
              <Col className={style.form__item} span={8}>
              </Col>
            </Row> */}
          </div>
        </div>
      </div>
      {/* 开票信息111 */}
      {/* {channelBalanceBillInvoiceApplyInfo ?
        <div className={style.block__cont}>
          <div className={style.form__cont}>
            <h3>开票信息</h3>
            <div className={style.form__cont}>
              <Row justify="space-around" align="center">
                <Col className={style.form__item} span={8}>
                  <div>所属渠道：<span>{billTypeStr}</span></div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    甲方信息：
                    <span>{channelBalanceBillInvoiceApplyInfo.channelName}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    开票公司名称：
                    <span>{channelBalanceBillInvoiceApplyInfo.invoiceName}</span>
                  </div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form__item} span={8}>
                  <div>
                    纳税人识别号：
                    <span>{channelBalanceBillInvoiceApplyInfo.taxNo}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    开户银行：
                    <span>{channelBalanceBillInvoiceApplyInfo.bankName}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    账号：
                    <span>{channelBalanceBillInvoiceApplyInfo.bankAccountNo}</span>
                  </div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form__item} span={8}>
                  <div>
                    发票地址：
                    <span>{channelBalanceBillInvoiceApplyInfo.invoiceAddress}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    联系电话：
                    <span>{channelBalanceBillInvoiceApplyInfo.phoneNo}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    开票金额：
                    <span>{channelBalanceBillInvoiceApplyInfo.totalInvoiceAmount}</span>
                  </div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form__item} span={8}>
                  <div>
                    发票类型：
                    <span>{channelBalanceBillInvoiceApplyInfo.invoiceType == 1 ? '增值税专用发票' : '--'}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    开票账期：
                    <span>{channelBalanceBillInvoiceApplyInfo.balancePeriod}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    发票内容：
                    <span>{channelBalanceBillInvoiceApplyInfo.invoiceContent}</span>
                  </div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form__item} span={8}>
                  <div>
                    开票银行：
                    <span>{channelBalanceBillInvoiceApplyInfo.billingBank}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                  <div>
                    备注：
                    <span>{channelBalanceBillInvoiceApplyInfo.remark}</span>
                  </div>
                </Col>
                <Col className={style.form__item} span={8}>
                </Col>
              </Row>
            </div>
          </div>
        </div> : ''
      } */}

      <div className={style.block__cont__t}>
        <div className={style.listTitle}>
          <span style={{ padding: '30px 20px' }}>结算明细</span>
          <div className={style.btns}>
            {/* <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={exportSpecial}>导出（对账专用）</Button> */}
            {/* <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={exportRealed}>导出当前明细</Button> */}
            {/* {
              (channelBalanceBillInfo.billStatus == 2 || channelBalanceBillInfo.billStatus == 6 || channelBalanceBillInfo.billStatus == 8)
                ?
                <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={adjustmentBatch}>调整金额（批量）</Button>
                : ''
            }
            {
              (channelBalanceBillInfo.billStatus == 2 || channelBalanceBillInfo.billStatus == 6 || channelBalanceBillInfo.billStatus == 8)
                ?
                <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={revokeBatch}>撤销入账（批量）</Button>
                : ''
            } */}
          </div>
        </div>
        <Table dataSource={infoDetailList} pagination={false}>
          <Column title="结算月份" dataIndex="balancePeriod" key="balancePeriod" />
          <Column title="服务类别" dataIndex="scenesStr" key="scenesStr" />
          {
            channelBalanceBillInfo.billType == 3 ?
              <Column title="服务名称" dataIndex="serviceName" key="serviceName" />
              : ''
          }
          <Column title="结算金额" dataIndex="saleAmount" key="saleAmount" />
          <Column title="结算时间" dataIndex="orderBalanceTime" key="orderBalanceTime" />
        </Table>
        {/* <Pagination
          className={style.pagination}
          current={payload.pageNum} //选中第一页
          pageSize={payload.pageSize} //默认每页展示10条数据
          total={total} //总数
          onChange={onNextChange} //切换 页码时触发事件
          pageSizeOptions={['10', '20', '30', '60']}
          onShowSizeChange={onSizeChange}
          showTotal={onPageTotal}
        /> */}
        {/* 底部 */}
        {/*账单状态（1待生成；2待下发；3调整中；4终审确认5:待初审;6:初审驳回7:待终审;8:终审驳回） */}
        {/* <div style={{ marginTop: '100px', textAlign: 'center' }}>

          // disabled={isLastConfirm} 
          {
            channelBalanceBillInfo.billStatus == 7
              ? <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={confirmInstance}>终审确认</Button>
              : ''
          }
            // disabled={isLastReject} 
          {
            channelBalanceBillInfo.billStatus == 7
              ? <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={rejectInstance}>终审驳回</Button>
              : ''
          }
        </div> */}
      </div>

      {/* 3审核确认弹框 */}
      <Modal title="审核确认声明" visible={isModalConfirm} onOk={handleConfirmOk} onCancel={handleConfirmCancel}>
        <p>
          点击终审确认按钮，视为贵司和我司已确认对应服务的服务内容，
          服务条款，服务效期，结算基准、结算数量、结算单价、服务费用、以及结算总价金额。
          并且同意系统据此生成账单，我司根据账单开据发票，
          贵司确认结算账单总金额根据销售合同的付款信息，向我司支付全部款项。
          已确认开票的金额，不得退票，退款。
        </p>
      </Modal>
      {/* 4驳回理由弹框 */}
      <Modal title="驳回理由" visible={isModalReject} onOk={handleRejectOk} onCancel={handleRejectCancel}>
        <Form name="explain">
          <Form.Item
            label="驳回理由："
            name="reject"
            rules={[
              {
                required: true,
                message: '请填写驳回理由',
              }
            ]}
          >
            <TextArea onChange={rejectText} rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
};
export default connect(({ financeManageModel }) => ({
  unrecordedDetailList: financeManageModel.unrecordedDetailList,
  total: financeManageModel.total,
  caseServiceList: financeManageModel.caseServiceList,
  caseServiceItems: financeManageModel.caseServiceItems,
  caseStatusList: financeManageModel.caseStatusList,
  isDisable: financeManageModel.isDisable,
  isLastConfirm: financeManageModel.isLastConfirm,
  isLastReject: financeManageModel.isLastReject,


  channelBalanceBillInfo: financeManageModel.channelBalanceBillInfo,
  channelBalanceBillInvoiceApplyInfo: financeManageModel.channelBalanceBillInvoiceApplyInfo,
  infoDetailList: financeManageModel.infoDetailList
}))(DetailSoftwareValueadded)
