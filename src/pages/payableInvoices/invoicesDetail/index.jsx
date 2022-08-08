import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, DatePicker, Table, Image, message, Select, Modal, Button,Descriptions } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn'
import ExpressModal from "./ExpressModal"; 
moment.locale('zh-cn')

import { formatDate } from '@/utils/date'

const { RangePicker } = DatePicker;
const { Column } = Table;
const { TextArea } = Input;

// 发票详情
const invoicesDetailPage = (props) => {
  let { dispatch, billInfo, invoiceApplyInfo, invoiceDetailsList, invoiceInfo } = props;
  let [form] = Form.useForm();
  let [templateNo, setTemplateNo] = useState('');//快递单号
  let [fPhoneNo, setFphoneNo] = useState('');//手机号
  let [detailsVisible, setDetailsVisible] = useState(false); //详情弹窗


  useEffect(() => {
    invoiceDetails()
  }, [])

  let invoiceDetails = () => {
    dispatch({
      type: 'payableInvoicesModel/invoiceDetails',
      payload: {
        method: 'get',
        params: {},
        billNo: history.location.query.billNo
      }
    });
  }
/*跳转快递详情*/
let getDetail = (objectId,billId) => {
  setTemplateNo(objectId)
  setFphoneNo(billId)
  setDetailsVisible(true)
}
//详情弹窗回调
// useEffect(() => {
//   if (templateNo || fPhoneNo) {
//     setDetailsVisible(true)
//   } else {
//     setDetailsVisible(false)
//   }
// }, [templateNo,fPhoneNo])
/*设置弹窗回调*/
let onCallbackSetSales = (e) => {
  setDetailsVisible(false)
  setTemplateNo('')
  setFphoneNo('')
  if (e) {
    getList()
  }
}
  return (
    <>
      <div className={style.detailBox}>
        <div className={style.title}>发票详情</div>
        {/* 1 */}
        <div className={style.info}>
          <div className={style.info_title}>账单信息</div>
          <div className={style.info_data}>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="账单编码">{billInfo && billInfo.billNo}</Descriptions.Item>
              <Descriptions.Item label="账单月份">{billInfo && billInfo.balancePeriod}</Descriptions.Item>
              <Descriptions.Item label="业务类型">{billInfo && billInfo.billTypeStr}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="账单名称">{billInfo && billInfo.billName}</Descriptions.Item>
              <Descriptions.Item label="确认日期">{billInfo && billInfo.confirmTime}</Descriptions.Item>
              <Descriptions.Item label="结算笔数">{billInfo && billInfo.confirmedCount}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="账单金额">{
                (billInfo && billInfo.adjustConfirmedAmount) || (billInfo && billInfo.adjustConfirmedAmount == 0) ?
                  <div>{billInfo && billInfo.adjustConfirmedAmount}</div>
                  :
                  ''
              }</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={style.interspace}></div>
        {/* 2 */}
        <div className={style.info}>
          <div className={style.info_title}>申请信息</div>
          <div className={style.info_data}>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="甲方信息">{invoiceApplyInfo && invoiceApplyInfo.firstPartyName}</Descriptions.Item>
              <Descriptions.Item label="开票公司名称">{invoiceApplyInfo && invoiceApplyInfo.billingCompany}</Descriptions.Item>
              <Descriptions.Item label="纳税人识别号">{invoiceApplyInfo && invoiceApplyInfo.taxNo}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="开户银行">{invoiceApplyInfo && invoiceApplyInfo.bankName}</Descriptions.Item>
              <Descriptions.Item label="银行账号">{invoiceApplyInfo && invoiceApplyInfo.bankAccountNo}</Descriptions.Item>
              <Descriptions.Item label="发票地址">{invoiceApplyInfo && invoiceApplyInfo.invoiceAddress}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="联系电话">{invoiceApplyInfo && invoiceApplyInfo.phoneNo}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <div className={style.interspace}></div>
        {/* 3 */}
        <div className={style.info}>
          <div className={style.info_title}>开票信息</div>
          <div className={style.info_data}>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="开票类型">{invoiceInfo && invoiceInfo.uniwayFlagStr}</Descriptions.Item>
              <Descriptions.Item label="开票银行">{invoiceInfo && invoiceInfo.billingBank}</Descriptions.Item>
              <Descriptions.Item label="发票类型">{invoiceInfo && invoiceInfo.invoiceTypeStr}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="开票账期">{invoiceInfo && invoiceInfo.balancePeriod}</Descriptions.Item>
              <Descriptions.Item label="发票内容">{invoiceInfo && invoiceInfo.invoiceContent}</Descriptions.Item>
              <Descriptions.Item label="开票公司">{invoiceInfo && invoiceInfo.billingCompany}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="备注">{invoiceInfo && invoiceInfo.remark}</Descriptions.Item>
              <Descriptions.Item label="已开票金额(元)"><span>{invoiceInfo && invoiceInfo.totalInvoiceAmount}</span></Descriptions.Item>
              <Descriptions.Item label="未开票金额(元)"><span>{invoiceInfo && invoiceInfo.unInvoicedAmount}</span></Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="收件地址">{invoiceInfo && invoiceInfo.recipientsAddr}</Descriptions.Item>
              <Descriptions.Item label="收件人电话">{invoiceInfo && invoiceInfo.recipientsPhone}</Descriptions.Item>
              <Descriptions.Item label="收件人">{invoiceInfo && invoiceInfo.recipients}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={style.interspace}></div>
        {/* 4 */}
        <div className={style.tableData}>
          <div className={style.tableData_title}>发票明细</div>
          <Table pagination={false} dataSource={invoiceDetailsList} bordered={true}>
            <Column title="发票号码" dataIndex="invoiceNo" key="invoiceNo" align='center' />
            <Column
              title="发票代码"
              dataIndex="invoiceCode"
              key="invoiceCode"
              align='center'
              className={`${style.columns_item}`}
            // render={(text, record) => contRender(record, 1)}
            />
            <Column
              title="发票日期"
              dataIndex="invoiceTime"
              key="invoiceTime"
              align='center'
              className={`${style.columns_item}`}
            // render={(text, record) => contRender(record, 2)}
            />
            <Column
              title="发票总额(元)"
              dataIndex="invoiceAmount"
              key="invoiceAmount"
              align='center'
              className={`${style.columns_item}`}
              render={(text, record) => {
                return <span>{text}</span>
              }}
            />
            <Column title="发票税额(元)" dataIndex="taxAmount" key="taxAmount" align='center'
              render={(text, record) => {
                return <span>{text}</span>
              }}
            />
            <Column title="发票税率(%)" dataIndex="invoiceRate" key="invoiceRate" align='center' />
            <Column title="发票状态"
              dataIndex="invoiceStatusStr"
              key="invoiceStatusStr"
              align='center'
            // render={(text, record) => {
            //   return <span>{text} {record.guidedPriceUnitStr}</span>
            // }}
            />
            <Column title="快递单号" dataIndex="expressNumber" key="expressNumber" align='center'
              render={(text, record) => {
                return <span className={style.expressText} onClick={() => { getDetail(text,record.billId) }}>
                  {text}
                </span>
              }}
            />
            <Column title="快递进度" dataIndex="expressStatusStr" key="expressStatusStr" align='center'
              render={(text, record) => {
                return <span>{text}</span>
              }}
            />
          </Table>
        </div>
        <div className={style.btns}>
          <Button onClick={() => { history.goBack() }}>返回</Button>
        </div>
        {
        templateNo ? 
        <ExpressModal //快递详情弹窗
          templateNo={templateNo}
          fPhoneNo={fPhoneNo}
          detailsVisible={detailsVisible}
          onCallbackSetSales={(flag) => onCallbackSetSales(flag)}
        />
        :''
        }
        
       
      </div>
    </>
  )
}


export default connect(({ payableInvoicesModel }) => ({
  billInfo: payableInvoicesModel.billInfo,
  invoiceApplyInfo: payableInvoicesModel.invoiceApplyInfo,
  invoiceDetailsList: payableInvoicesModel.invoiceDetailsList,
  invoiceInfo: payableInvoicesModel.invoiceInfo
}))(invoicesDetailPage)







