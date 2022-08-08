import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, Modal, ConfigProvider, message, DatePicker } from "antd"
import style from "./style.less";
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

//账单页面
const entryRecordedPage = (props) => {
  let { dispatch, channelList, recordedList, total, firstParty, firstPartyItem, billingAmount, billContent, channelBalanceBillInfo, businessTypeArr } = props;
  let [form] = Form.useForm();
  const [isModalBilling, setIsModalBilling] = useState(false);
  const [isModalfinalJudgment, setIsModalfinalJudgment] = useState(false);//终审弹框

  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [isModalReject, setIsModalReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('')//驳回理由

  let [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10,
    query: {
      channelId: null,//客户名称
      billType: null,//账单类型 1：据实服务 2：预采投放 3：数字SaaS 4:增值服务
      billNo: '',//账单 ID
      // balancePeriod: '',//账单月份
      balancePeriodStart: '',//账单月份
      balancePeriodEnd: '',//账单月份
      billStatus: null,//账单状态（1待生成；2待下发；3调整中；4终审确认5:待初审;6:初审驳回7:待终审;8:终审驳回）
      invoiceStatus: null,//开票状态0：未开票1：已开票 2：部分开票 3：已申请
      reciveStatus: null//收款状态 0:未收款1：已收款2：部分收款
    }
  })

  // 账单状态
  let billStatusType = [
    // { title: '待生成', id: '1' },
    { title: '待下发', id: '2' },
    // { title: '调整中', id: '3' },
    { title: '终审确认', id: '4' },
    { title: '待初审', id: '5' },
    { title: '初审驳回', id: '6' },
    { title: '待终审', id: '7' },
    { title: '终审驳回', id: '8' }
  ]
  // 开票状态
  let invoiceStatusType = [
    { title: '未开票', id: '0' },
    { title: '已开票', id: '1' },
    { title: '部分开票', id: '2' },
    { title: '已申请', id: '3' },
  ]
  // 收款状态
  let reciveStatusType = [
    { title: '未收款', id: '0' },
    { title: '已收款', id: '1' },
    { title: '部分收款', id: '2' }
  ]

  useEffect(() => {
    getChannel();//客户名称接口
    businessType()
  }, [])

  useEffect(() => {
    billList();
  }, [payload])

  // 业务类型
  let businessType = () => {
    dispatch({
      type: 'financeManageModel/businessType',// 命名空间名/effect内的函数名
      payload: {
        method: 'get',
        params: {}
      }
    });
  }

  /*1.获取所有渠道接口*/
  let getChannel = () => {
    dispatch({
      type: 'financeManageModel/selectChannel',// 命名空间名/effect内的函数名
      payload: {
        method: 'get',
        params: {}
      }
    });
  }
  // 2渠道对账列表-入账（已入账列表）
  let billList = () => {
    dispatch({
      type: 'financeManageModel/billList',// 命名空间名/effect内的函数名
      payload: {
        method: 'postJSON',
        params: payload
      }
    });
  }
  // 账单编号（进入详情）
  const billNoDetail = (text, all) => {
    // console.log(all, 'all')
    let businessType = all.billType;
    // 查看详情
    let viewDetail = () => {
      localStorage.setItem('finance_list_itemed', JSON.stringify(all));
      if (businessType == 1) {
        history.push({
          pathname: '/financeManage/billList/detailRealed',
          query: {
            billId: all.billId,//账单id
            recordDetail: 'view'
          }
        })
      } else if (businessType == 2) {
        history.push({
          pathname: '/financeManage/billList/detailChargeed',
          query: {
            billId: all.billId,//账单id
            recordDetail: 'view'
          }
        })
      } else if (businessType == 3 || businessType == 4) {
        history.push({
          pathname: '/financeManage/billList/softwareValueadded',
          query: {
            billId: all.billId,//账单id
            recordDetail: 'view'
          }
        })

      }

    }
    return <div className={style.click_blue} onClick={viewDetail}>{text}</div>
  }
  // 原入账金额（元）
  const confirmedAmount = (text, all) => {
    return <div style={{ color: '#f00' }}>{text}</div>
  }
  // 调整后金额（元）
  const adjustConfirmedAmount = (text, all) => {
    return <div style={{ color: '#f00' }}>{text}</div>
  }
  // 累计调整（元）
  const totalAdjustAmount = (text, all) => {
    return <div style={{ color: '#f00' }}>{text}</div>
  }

  // 1查看已入账
  const billInfo = () => {
    dispatch({
      type: 'financeManageModel/billInfo',
      payload: {
        method: 'get',
        billId: newbillId,
        params: {}
      }
    })
  }

  let [newbillId, setNewbillId] = useState(null);//账单id
  // 终审操作
  let handleClick = (text, all) => {
    setIsModalfinalJudgment(true);
    newbillId = all.billId;
    setNewbillId(newbillId)
    billInfo();

    // localStorage.setItem('finance_list_itemed', JSON.stringify(all));
    // let businessType = all.billType;
    // if (businessType == 1) {
    //   history.push({
    //     pathname: '/financeManage/billList/detailRealed',//处理
    //     query: {
    //       billId: all.billId,//账单id
    //       recordDetail: 'operation'
    //     }
    //   })
    // } else if (businessType == 2) {
    //   history.push({
    //     pathname: '/financeManage/billList/detailChargeed',
    //     query: {
    //       billId: all.billId,//账单id
    //       recordDetail: 'operation'
    //     }
    //   })
    // }
    // else if(businessType ==3){
    //   return;
    // }else if(businessType ==4){
    //   return;
    // }
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
          billId: newbillId,//	账单ID
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
          setIsModalfinalJudgment(false);
          billList()//刷新列表
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
            billId: newbillId,//	账单ID
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
            setIsModalfinalJudgment(false);
            billList()//刷新列表
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

  let columns = [
    //  {
    //   title: '客户名称',
    //   dataIndex: 'channelName',
    //   key: 'channelName',
    // }, 
    // {
    //   title: '入账笔数',
    //   dataIndex: 'confirmedCount',
    //   key: 'confirmedCount',
    // },
    // {
    //   title: '开票状态',
    //   dataIndex: 'invoiceStatusName',
    //   key: 'invoiceStatusName',
    // },
    // {
    //   title: '收款状态',
    //   dataIndex: 'reciveStatusName',
    //   key: 'reciveStatusName',
    // },
    {
      title: '账单编号', dataIndex: 'billNo', key: 'billNo',
      render: (text, all) => billNoDetail(text, all)

    },
    { title: '账单月份', dataIndex: 'balancePeriod', key: 'balancePeriod' },
    { title: '业务类型', dataIndex: 'billTypeName', key: 'billTypeName' },

    { title: '结算数量(笔)', dataIndex: 'confirmedCount', key: 'confirmedCount', },
    {
      title: '原结算金额(元)', align: "right", dataIndex: 'confirmedAmount', key: 'confirmedAmount',
      render: (text, all) => confirmedAmount(text, all)
    },
    {
      title: '调整后结算金额(元) ', align: "right", dataIndex: 'adjustConfirmedAmount', key: 'adjustConfirmedAmount',
      render: (text, all) => adjustConfirmedAmount(text, all)
    },
    {
      title: '调整金额(元)', align: "right", dataIndex: 'totalAdjustAmount', key: 'totalAdjustAmount',
      render: (text, all) => totalAdjustAmount(text, all)
    },
    { title: '账单状态', dataIndex: 'billStatusName', key: 'billStatusName' },
    {
      title: '操作', dataIndex: 'status', key: 'status',
      render: (text, all) => (
        <Space size="middle">
          {
            (all.billStatus == 4 && all.invoiceStatus == 0) ?
              <div className={style.click_blue} onClick={() => { handleBilling(text, all) }}>开票申请</div>
              :
              all.billStatus == 7 ?
                <div className={style.click_blue} onClick={() => { handleClick(text, all) }}>终审</div>
                :
                '--'
          }
        </Space>
      )
    }
  ];

  let [channelId, setChannelId] = useState('')

  // 开票申请方法
  let handleBilling = (text, all) => {
    setIsModalBilling(true);

    // payload.query.channelId = all.channelId;
    channelId = all.channelId;
    setChannelId(channelId)
    dispatch({
      type: 'financeManageModel/infoByChannelId',//甲方信息1
      payload: {
        method: 'get',
        params: {},
        channelId: all.channelId,
      }
    });

    dispatch({
      type: 'financeManageModel/billAmount',//开票申请管理-新增开票申请查询2
      payload: {
        method: 'get',
        params: {},
        billId: all.billId,
      }
    });


    dispatch({
      type: 'financeManageModel/invoiceContentList',//开票申请管理-新增开票申请查询(获取发票内容)3
      payload: {
        method: 'get',
        params: {}
      }
    });

    form.resetFields();//重置
    firstPartyItem.bankAccountNo = ''//银行账号
    firstPartyItem.bankName = ''//开户银行
    firstPartyItem.address = ''//发票地址
    firstPartyItem.invoiceName = ''//开票公司名称
    firstPartyItem.phoneNo = ''//联系电话
    firstPartyItem.taxNo = ''//纳税人识别号
  }


  /*3查询按钮*/
  const searchBtn = (values) => {
    console.log(values, 'values')
    // 判断是否存在
    if (values.balancePeriod) {
      payload.query.balancePeriodStart = values.balancePeriod[0].format('YYYYMM');
      payload.query.balancePeriodEnd = values.balancePeriod[1].format('YYYYMM')
    }
    let data = {
      pageNum: 1,
      pageSize: 10,
      query: {
        channelId: values.channelId || null,//客户名称
        billType: values.billType || null,//	业务类型
        // balancePeriod: values.balancePeriod,//账单月份
        balancePeriodStart: payload.query.balancePeriodStart,
        balancePeriodEnd: payload.query.balancePeriodEnd,
        billNo: values.billNo,//账单编号
        billStatus: values.billStatus,//账单状态
        invoiceStatus: values.invoiceStatus,//开票状态
        reciveStatus: values.reciveStatus//收款状态

      }
    }
    setPayload(data);
  };
  /*4重置*/
  let resetBtnEvent = () => {
    form.resetFields();//重置
    let data = {
      pageNum: 1,
      pageSize: 10,
      query: {
        channelId: null,//客户名称
        billType: null,//	业务类型
        // balancePeriod: '',//账单月份
        balancePeriodStart: '',//账单月份
        balancePeriodEnd: '',//账单月份
        billId: null,//账单ID
        billStatus: null,//账单状态
        invoiceStatus: null,//开票状态
        reciveStatus: null//收款状态
      }
    }
    setPayload(data)
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


  let serveBtn = (val) => {
    // console.log(val, 'val')
    dispatch({
      type: 'financeManageModel/invoiceApply',//开票申请（保存）
      payload: {
        method: 'postJSON',
        params: {
          balancePeriod: billingAmount.balancePeriod,//	开票账期
          bankAccountNo: firstPartyItem.bankAccountNo,//银行账号
          bankName: firstPartyItem.bankName,//开户银行
          invoiceAddress: firstPartyItem.address,//发票地址
          invoiceName: firstPartyItem.invoiceName,//开票公司名称
          phoneNo: firstPartyItem.phoneNo,//联系电话
          taxNo: firstPartyItem.taxNo,//纳税人识别号
          billingBank: val.billingBank,//开票银行
          // channelId: val.channelId,//渠道ID------------------------
          channelId: billingAmount.channelId,//渠道ID
          invoiceContent: val.invoiceContent,//发票内容
          billingCompany: val.billingCompany,//开票公司
          firstPartyName: val.firstPartyName.split('-')[1],//============甲方信息
          invoiceType: 1,//发票类型1：增值税专用发票
          remark: val.remark,//备注
          uniwayFlag: 1,//开票类型 1:自营2：非自营
          billId: billingAmount.billId,//账单id
          totalAmount: billingAmount.totalAmount//总账单金额
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success({
            content: '发票保存成功！',
          })
          setIsModalBilling(false);
          // billList();//重新刷新列表
          dispatch({
            type: 'financeManageModel/billList',// 命名空间名/effect内的函数名
            payload: {
              method: 'postJSON',
              params: {
                pageNum: 1,
                pageSize: 10,
                query: {
                  channelId: null,//客户名称
                  billType: null,//账单类型 1：据实服务 2：预采投放 3：数字SaaS 4:增值服务
                  billNo: '',//账单 ID
                  // balancePeriod: '',//账单月份
                  balancePeriodStart: '',
                  balancePeriodEnd: '',
                  billStatus: null,//账单状态（1待生成；2待下发；3调整中；4终审确认5:待初审;6:初审驳回7:待终审;8:终审驳回）
                  invoiceStatus: null,//开票状态0：未开票1：已开票 2：部分开票 3：已申请
                  reciveStatus: null,//收款状态 0:未收款1：已收款2：部分收款
                }
              }
            }
          });
        } else {
          message.warning({
            content: res.result.message
          });
        }
      }
    });
  }
  // 选择甲方信息
  let changeFirstParty = (e) => {
    // console.log(e, 'pp')
    let data = e.split('-')
    let objectId = data[0]//甲方信息id
    let str = data[1]//甲方名称
    dispatch({
      type: 'financeManageModel/infoByChannelIdItem',//甲方信息(单条)
      payload: {
        method: 'get',
        params: {},
        channelId: channelId,
        // channelId: payload.query.channelId,
        objectId: objectId,
      }
    });
  }
  // 取消
  let handleBillingCancel = () => {
    setIsModalBilling(false);
  }

  // 开票类型(自营、非自营)
  let uniwayFlag = [
    { title: '自营', id: '1' },
    // { title: '非自营', id: '2' }
  ]

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
  // 发票类型
  let invoiceType = [
    { title: '增值税专用发票', id: '1' },
  ]


  return (
    <>
      <div className={style.block__cont}>
        <Form form={form} onFinish={searchBtn}>
          <Row justify="space-around" align="center">
            <Col span={8}>
              <Form.Item label="账单月份：" name="balancePeriod" labelCol={{ flex: '0 0 120px' }}>
                {/* <Input placeholder="请输入" ></Input> */}
                <RangePicker picker="month" placeholder={['开始月份', '结束月份']} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="业务类型：" name="billType" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    businessTypeArr && businessTypeArr.map((v) => <Option key={v.value} value={v.value}>{v.name}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="账单状态：" name="billStatus" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    billStatusType.map((v) => <Option key={v.id} value={v.id}>{v.title}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row justify="space-around" align="center">
            <Form.Item label="客户名称：" name="channelId" className={style.form__item} labelCol={{ span: 8 }}>
              <Select
                placeholder="不限"
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  channelList && channelList.map((v) => <Option key={v.channelId} value={v.channelId}>{v.channelName}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item label="账单编号：" name="billNo" className={style.form__item} labelCol={{ span: 8 }}>
              <Input placeholder="请输入" ></Input>
            </Form.Item>

            <Form.Item label="开票状态：" name="invoiceStatus" className={style.form__item} labelCol={{ span: 8 }}>
              <Select placeholder="不限" allowClear>
                {
                  invoiceStatusType.map((v) => <Option key={v.id} value={v.id}>{v.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Row>
          <Row justify="space-around" align="center">
            <Form.Item label="收款状态：" name="reciveStatus" className={style.form__item} labelCol={{ span: 8 }}>
              <Select placeholder="不限" allowClear>
                {
                  reciveStatusType.map((v) => <Option key={v.id} value={v.id}>{v.title}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item className={style.form__item} labelCol={{ span: 8 }}>

            </Form.Item>
            <Form.Item className={style.form__item} labelCol={{ span: 8 }}>

            </Form.Item>
          </Row> */}
          <Row justify="end">
            <Space size={22}>
              <Button htmlType="button" onClick={resetBtnEvent}>重置</Button>
              <Button htmlType="submit" type="primary">查询</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.block__cont__t}>
        <div className={style.title_box}>结果列表</div>
        <div className={style.table_box}>
          <Table columns={columns} dataSource={recordedList} pagination={false}></Table>
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
        </div>
      </div>

      {/* 弹框 */}
      <Modal title="开票申请"
        width={'70%'}
        visible={isModalBilling}
        // onOk={handleBillingOk}
        // onCancel={handleBillingCancel}
        // footer={[
        //   <Button key="back" onClick={handleBillingCancel}>
        //     Return
        //   </Button>,
        //   <Button key="submit" type="primary" onClick={handleBillingOk}>
        //     Submit
        //   </Button>
        //    ]}
        onCancel={() => { setIsModalBilling(false) }}
        footer={null}
      >
        <div className='applyBilling'>
          {/* <h3>
            开票申请
            <span>
              （涉及开票账单数：
              <span>{billingAmount.totalCount}</span>
              笔，开票总金额：
              <span>{billingAmount.totalAmount}</span>
              元）
            </span>
          </h3> */}
          <Form className={style.form__cont} form={form} onFinish={serveBtn}>
            <Row justify="space-around" align="center">
              {/* <Form.Item
                label="客户名称："
                name="channelId"
                className={style.form__item}
                labelCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}>
                <Select
                  placeholder="不限"
                >
                  <Option value={billingAmount.channelId}>{billingAmount.channelName}</Option>
                </Select>
              </Form.Item> */}
              <Form.Item
                label="基本信息："
                name="firstPartyName"
                className={style.form__item}
                labelCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}
              >
                <Select placeholder="不限" onChange={(e) => { changeFirstParty(e) }}>
                  {
                    firstParty.map((v) => <Option key={v.channelId} value={v.objectId + '-' + v.firstPartyName}>{v.firstPartyName}</Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item className={style.form__item} labelCol={{ span: 8 }}></Form.Item>
              <Form.Item className={style.form__item} labelCol={{ span: 8 }}></Form.Item>
            </Row>

            <Row justify="space-around" align="center" style={{ margin: '10px 0' }}>
              {/* <Form.Item
                label="开票公司名称："
                name="invoiceName"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>{firstPartyItem.invoiceName}</div>
              </Form.Item> */}
              <Form.Item
                label="纳税人识别号："
                name="taxNo"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>{firstPartyItem.taxNo}</div>
              </Form.Item>
              <Form.Item
                label="开户银行："
                name="bankName"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>{firstPartyItem.bankName}</div>
              </Form.Item>
              <Form.Item
                label="银行账号："
                name="bankAccountNo"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>{firstPartyItem.bankAccountNo}</div>
              </Form.Item>
            </Row>
            {/* <Row justify="space-around" align="center" style={{ margin: '10px 0' }}>
            </Row> */}
            <Row justify="space-around" align="center" style={{ margin: '10px 0' }}>
              <Form.Item
                label="发票地址："
                name="address"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>{firstPartyItem.address}</div>
              </Form.Item>
              <Form.Item
                label="联系电话："
                name="phoneNo"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>{firstPartyItem.phoneNo}</div>
              </Form.Item>
              <Form.Item
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                {/* <div>{firstPartyItem.phoneNo}</div> */}
              </Form.Item>
            </Row>

            <h3>填写信息</h3>
            <Row justify="space-around" align="center">
              {/* <Form.Item
                label="开票类型："
                name="uniwayFlag"
                className={style.form__item}
                labelCol={{ span: 8 }} 
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}>
                <Select
                  placeholder="不限"
                >
                  {
                    uniwayFlag.map((v) => <Option key={v.id} value={v.id}>{v.title}</Option>)
                  }
                  </Select>
                </Form.Item> */}
              <Form.Item
                label="开票公司："
                name="billingCompany"
                className={style.form__item}
                labelCol={{ span: 9 }}
                // style={{ width: '250px' }}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}>
                <Select
                  placeholder="不限"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    billingCompany.map((v) => <Option key={v.id} value={v.title}>{v.title}</Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item
                label="开票银行："
                name="billingBank"
                className={style.form__item}
                labelCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}
              >
                <Select placeholder="不限">
                  {
                    billingBank.map((v) => <Option key={v.id} value={v.title}>{v.title}</Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item
                label="开票账期："
                name="balancePeriod"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <span>{billingAmount.balancePeriod}</span>
              </Form.Item>

            </Row>
            <Row justify="space-around" align="center">
              {/* <Form.Item
                label="发票类型："
                name="invoiceType"
                className={style.form__item}
                labelCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}>
                <Select
                  placeholder="不限"
                >
                  {
                    invoiceType.map((v) => <Option key={v.id} value={v.id}>{v.title}</Option>)
                  }
                </Select>
              </Form.Item> */}
              <Form.Item
                label="发票类型："
                name="invoiceType"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <div>增值税专用发票</div>
              </Form.Item>
              <Form.Item
                label="发票内容："
                name="invoiceContent"
                className={style.form__item}
                labelCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  }
                ]}>
                <Select
                  placeholder="不限"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    billContent ?
                      billContent.map((v) => <Option key={v.value} value={v.name}>{v.name}</Option>)
                      : ''
                  }
                </Select>
              </Form.Item>
              <Form.Item className={style.form__item} labelCol={{ span: 8 }}></Form.Item>
            </Row>
            {/* <Row justify="space-around" align="center">

              <Form.Item
                label="备注："
                name="remark"
                className={style.form__item}
                labelCol={{ span: 8 }}
              >
                <TextArea placeholder="请输入"></TextArea>
              </Form.Item>
              <Form.Item
                label=""
                className={style.form__item}
                labelCol={{ span: 4 }}
              >
              </Form.Item>
            </Row> */}
            <Row align="center" style={{
              padding: '10px 16px',
              textAlign: 'right',
              background: 'transparent',
              borderTop: '1px solid #f0f0f0',
            }}>
              <Space size={22}>
                <Button htmlType="submit" type="primary">确定</Button>
                <Button htmlType="button" onClick={handleBillingCancel}>取消</Button>
              </Space>
            </Row>
          </Form>
        </div>
      </Modal>
      {/* 弹框 */}
      <Modal title="账单终审"
        width={1000} visible={isModalfinalJudgment}
        onCancel={() => { setIsModalfinalJudgment(false) }}
        footer={null}
      >
        <Row justify="space-around" align="center" style={{ marginBottom: '50px' }}>
          <Col className={style.form__item} span={8}>
            <div>账单月份：<span>{channelBalanceBillInfo.balancePeriod}</span></div>
          </Col>
          <Col className={style.form__item} span={8}>
            <div>账单金额：<span style={{ color: '#f00' }}>{channelBalanceBillInfo.confirmedAmount}</span></div>
          </Col>
          <Col className={style.form__item} span={8}>
            <div>业务类型：<span>{channelBalanceBillInfo.billTypeName}</span></div>
          </Col>
        </Row>
        <Row justify="space-around" align="center">
          <Col className={style.form__item} span={24}>
            注意事项:
            <span style={{ marginLeft: '30px' }}>
              <p style={{ marginTop: '20px' }}>1、终审通过后，视为贵司已确认我司提供的服务内容、结算数量、结算金额；</p>
              <p>2、开票申请后，我司将依据已确认的结算金额及开票信息开具发票；</p>
              <p>3、贵司收到发票后需按约定时间付款，如无特殊约定，默认按30天；</p>
            </span>
          </Col>
        </Row>

        {/* 底部 */}
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          {/*账单状态（1待生成；2待下发；3调整中；4终审确认5:待初审;6:初审驳回7:待终审;8:终审驳回） */}
          {
            channelBalanceBillInfo.billStatus == 7
              // disabled={isLastConfirm}
              ? <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={confirmInstance}>终审通过</Button>
              : ''
          }
          {
            channelBalanceBillInfo.billStatus == 7
              // disabled={isLastReject}
              ? <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={rejectInstance}>不通过</Button>
              : ''
          }
        </div>
      </Modal>
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
}


export default connect(({ financeManageModel }) => ({
  channelList: financeManageModel.channelList,//命名空间名.变量
  recordedList: financeManageModel.recordedList,
  total: financeManageModel.total,
  firstParty: financeManageModel.firstParty,
  firstPartyItem: financeManageModel.firstPartyItem,
  billingAmount: financeManageModel.billingAmount,
  billContent: financeManageModel.billContent,
  channelBalanceBillInfo: financeManageModel.channelBalanceBillInfo,
  businessTypeArr: financeManageModel.businessTypeArr
}))(entryRecordedPage)