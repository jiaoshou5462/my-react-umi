import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Form,  Table,  Button,
  Descriptions, Modal,Row
} from "antd"
import moment from 'moment'
import style from "./style.less";
const { Column } = Table;

//列表详情弹框
const cardDetailModal = (props) => {
  let { dispatch, sonListVisible, closeModal, currentInfo, detailList } = props;
  let [form] = Form.useForm();

  useEffect(() => {
    detailGrant()
    console.log(detailList);
  }, [])

  const detailGrant = () => {
    dispatch({
      type: 'cardDetailList/queryCouponDetail',//（详情）
      payload: {
        method: 'get',
        params: {
          couponDetailId: currentInfo.poolDetailId,
        }
      }
    })
  }
  return (
    <>
      <Modal
        title={
         '卡券详情'
        }
        width={'90%'}
        centered
        visible={sonListVisible}
        onCancel={() => { closeModal() }}
        footer={[
          <Button key="close" onClick={() => { closeModal() }}>
            关闭
          </Button>
        ]}
      >
        <>
        <div className={style.background_1}> 
          <Row className={style.header}><span>用户信息</span></Row>
          <Row>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="用户姓名">{detailList.customerName}</Descriptions.Item>
                <Descriptions.Item label="微信openid">{detailList.openId}</Descriptions.Item>
                <Descriptions.Item label="手机号">{detailList.customerPhone}</Descriptions.Item>
              </Descriptions>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="证件号">{detailList.identityNo}</Descriptions.Item>
                <Descriptions.Item label="发放标识">{detailList.bsoPolicyNo}</Descriptions.Item>
              </Descriptions>
          </Row>
        </div>
        <div className={style.background_1}> 
          <Row className={style.header}><span>卡券信息</span></Row>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="卡券ID">{detailList.poolDetailId}</Descriptions.Item>
                <Descriptions.Item label="卡券名称">{detailList.scName}</Descriptions.Item>
                <Descriptions.Item label="卡券品类">{detailList.scCategoryName}</Descriptions.Item>
              </Descriptions>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="卡券面值">{detailList.scAmount}</Descriptions.Item>
                <Descriptions.Item label="卡券形式">{detailList.scTypeName}</Descriptions.Item>
                <Descriptions.Item label="卡券来源">{detailList.sourceTypeName}</Descriptions.Item>
              </Descriptions>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="卡券生效日期">{detailList.cpdEffectiveStart}</Descriptions.Item>
                <Descriptions.Item label="卡券失效日期">{detailList.cpdEffectiveEnd}</Descriptions.Item>
                <Descriptions.Item label="赠送状态">{detailList.shareStatusName}</Descriptions.Item>
              </Descriptions>
        </div>
        <div className={style.background_1}> 
          <Row className={style.header}><span>享权信息</span></Row>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="卡券状态">{detailList.cpdStatusName}</Descriptions.Item>
                <Descriptions.Item label="卡券发放时间">{detailList.bsoSendDate}</Descriptions.Item>
                <Descriptions.Item label="卡券领取时间">{detailList.bsoReceiveDate}</Descriptions.Item>
              </Descriptions>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="保单号">{detailList.policyNo}</Descriptions.Item>
                <Descriptions.Item label="车牌号">{detailList.plateNo}</Descriptions.Item>
                <Descriptions.Item label="车架号">{detailList.vinNo}</Descriptions.Item>
              </Descriptions>
              <Descriptions column={3} labelStyle={{ marginLeft: '50px'}}>
                <Descriptions.Item label="转赠日期">{detailList.shareCouponDate}</Descriptions.Item>
                <Descriptions.Item label="首赠人">{detailList.shareCustomerPhone}</Descriptions.Item>
              </Descriptions>
        </div>
        </>
      </Modal>
    </>
  )
}


export default connect(({ cardDetailList }) => ({
  detailList: cardDetailList.detailList,
}))(cardDetailModal)