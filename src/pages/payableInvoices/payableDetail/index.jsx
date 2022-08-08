import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, DatePicker, Table, Image, message, Select, Modal, Button } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import { formatDate } from '@/utils/date'

const { RangePicker } = DatePicker;
const { Column } = Table;
const { TextArea } = Input;

// 付款详情
const payableDetailPage = (props) => {
  let { dispatch, billInfo, payableInfo, paymentDetailsList } = props;
  let [form] = Form.useForm()


  useEffect(() => {
    paymentDetails()
  }, [])

  let paymentDetails = () => {
    dispatch({
      type: 'payableInvoicesModel/paymentDetails',
      payload: {
        method: 'get',
        params: {},
        billNo: history.location.query.billNo
      }
    });

  }

  return (
    <>
      <div className={style.detailBox}>
        <div className={style.title}>付款详情</div>
        {/* 1 */}
        <div className={style.info}>
          <div className={style.info_title}>账单信息</div>
          <div className={style.info_data}>
            <Form.Item className={style.form_item} label="账单编码：" labelCol={{ span: 8 }}>
              {billInfo.billNo}
            </Form.Item>
            <Form.Item className={style.form_item} label="账单月份：" labelCol={{ span: 8 }}>
              {billInfo.balancePeriod}
            </Form.Item>
            <Form.Item className={style.form_item} label="业务类型：" labelCol={{ span: 8 }}>
              {billInfo.billTypeStr}
            </Form.Item>
            <Form.Item className={style.form_item} label="账单名称：" labelCol={{ span: 8 }}>
              {billInfo.billName}
            </Form.Item>
            <Form.Item className={style.form_item} label="确认日期：" labelCol={{ span: 8 }}>
              {billInfo.confirmTime}
            </Form.Item>
            <Form.Item className={style.form_item} label="结算笔数：" labelCol={{ span: 8 }}>
              {billInfo.confirmedCount}
            </Form.Item>
            <Form.Item className={style.form_item} label="账单金额(元)：" labelCol={{ span: 8 }}>
              {
                billInfo.adjustConfirmedAmount || billInfo.adjustConfirmedAmount == 0 ?
                  <div>{billInfo.adjustConfirmedAmount}</div>
                  :
                  ''
              }
            </Form.Item>
          </div>
        </div>
        <div className={style.interspace}></div>
        {/* 2 */}
        <div className={style.info}>
          <div className={style.info_title}>应付信息</div>
          <div className={style.info_data}>
            <Form.Item className={style.form_item} label="应付金额(元)：" labelCol={{ span: 8 }}>
              <span>{payableInfo.totalAmount}</span>
            </Form.Item>
            <Form.Item className={style.form_item} label="已付金额(元)：" labelCol={{ span: 8 }}>
              <span>{payableInfo.totalIncomeAmount}</span>
            </Form.Item>
            <Form.Item className={style.form_item} label="未付金额(元)：" labelCol={{ span: 8 }}>
              <span>{payableInfo.unInvoicedAmount}</span>
            </Form.Item>
            <Form.Item className={style.form_item} label="付款状态：" labelCol={{ span: 8 }}>
              {payableInfo.reciveStatusStr}
            </Form.Item>
          </div>
        </div>

        <div className={style.interspace}></div>
        {/* 3 */}
        <div className={style.tableData}>
          <div className={style.tableData_title}>付款明细</div>
          <Table pagination={false} dataSource={paymentDetailsList} bordered={true}>
            <Column title="付款日期" dataIndex="incomeTime" key="incomeTime" align='center' />
            <Column title="付款金额（元）"
              dataIndex="incomeAmount"
              key="incomeAmount"
              align='right'
              render={(text, record) => {
                return <span>{text}</span>
              }}
            />
            <Column title="银行流水号" dataIndex="bankLsh" key="bankLsh" align='center' />
            <Column title="付款银行" dataIndex="bankName" key="bankName" align='center' />
            <Column title="付款备注" dataIndex="remark" key="remark" align='center' />
            {/* <Column title="核销时间"
              dataIndex="balanceAmount"
              key="balanceAmount"
              align='center'
              render={(text, record) => {
                return <>
                  {
                    text || text == 0 ?
                      <div><span style={{ color: '#f00' }}>{fmoney(text)}</span> 元</div>
                      :
                      ''
                  }
                </>
              }}
            /> */}
          </Table>
        </div>
        <div className={style.btns}>
          <Button onClick={() => { history.goBack() }}>返回</Button>
        </div>


      </div>
    </>
  )
}


export default connect(({ payableInvoicesModel }) => ({
  billInfo: payableInvoicesModel.billInfo,
  payableInfo: payableInvoicesModel.payableInfo,
  paymentDetailsList: payableInvoicesModel.paymentDetailsList
}))(payableDetailPage)







