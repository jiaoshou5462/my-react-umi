import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Descriptions, Modal, message, InputNumber
} from "antd"
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'
import moment from 'moment'
import style from './modalStyle.less';

const { TextArea } = Input;
const { Column } = Table;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

//列表详情弹框
const detailModal = (props) => {
  let { dispatch, sonListVisible, closeModal, currentInfo, grantDetailObj } = props;
  let [form] = Form.useForm();
  // console.log(currentInfo, 'currentInfo')
  // console.log(grantDetailObj, 'grantDetailObj')

  useEffect(() => {
    detailGrant()
  }, [])

  const detailGrant = () => {
    dispatch({
      type: 'cardgrantManageModel/detailGrant',//卡券投放展开子列表（详情）
      payload: {
        method: 'postJSON',
        params: {
          grantBatchId: currentInfo.grantBatchId,
          cardPackageFlag: currentInfo.cardPackageFlag,//0卡券，1卡包
        }
      }
    })
  }
  // 有效期处理
  const effectDateType = (text, all) => {
    return <>
      {
        all.effectDateType == 2 ? 
          <span>以保单时间为准</span>
        :
        all.useValidType == 1?
          <span>{all.effectiveDays }天(发放后立即生效)</span>
        :
        all.useValidType == 2 ?
          <span>{all.effectiveDays }天（领取后立即生效）</span>
        :
        all.effectDateType == 1 ?
          <span>{moment(all.effectStartDate).format('YYYY-MM-DD') }~{ moment(all.effectEndDate).format('YYYY-MM-DD')}</span>
        : 
          <span>{all.effectiveDays}</span>
      }
      {/* {
        all.useValidType == 1?
          <span>{all.effectiveDays }天(发放后立即生效)</span>
        :
        all.useValidType == 2 ?
          <span>{all.effectiveDays }天（领取后立即生效）</span>
        :
        all.effectDateType == 1 ?
          <span>{moment(all.effectStartDate).format('YYYY-MM-DD') }~{ moment(all.effectEndDate).format('YYYY-MM-DD')}</span>
        : 
        all.effectDateType == 2 ? 
          <span>以保单时间为准</span>
        :
          <span>{all.effectiveDays}</span>
      } */}
    </>
  }
  return (
    <>
      <Modal
        title={
          currentInfo.cardPackageFlag == 0 ? '卡券投放' :
            currentInfo.cardPackageFlag == 1 ? '卡包投放' :
              currentInfo.cardPackageFlag == 2 ? '兑换码投放' :
                currentInfo.cardPackageFlag == 3 ? 'N选M投放' :
                  currentInfo.cardPackageFlag == 4 ? '接口投放' :
                    ''
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
          {
            currentInfo.cardPackageFlag == 0 ?
              <Descriptions column={6} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
                <Descriptions.Item label="批次ID">{grantDetailObj.grantBatchId}</Descriptions.Item>
                <Descriptions.Item label="批次名称">{grantDetailObj.grantName}</Descriptions.Item>
                <Descriptions.Item label="营销项目">{grantDetailObj.marketProjectName}</Descriptions.Item>
                <Descriptions.Item label="发放人数">{grantDetailObj.grantNum}</Descriptions.Item>
                <Descriptions.Item label="发放成功人数">{grantDetailObj.grantSuccessNum}</Descriptions.Item>
                <Descriptions.Item label="发放失败人数">{grantDetailObj.grantFailNum}</Descriptions.Item>
              </Descriptions>
              :
              currentInfo.cardPackageFlag == 1 ?
                <>
                  <Descriptions column={6} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
                    <Descriptions.Item label="批次ID">{grantDetailObj.grantBatchId}</Descriptions.Item>
                    <Descriptions.Item label="批次名称">{grantDetailObj.grantName}</Descriptions.Item>
                    <Descriptions.Item label="营销项目">{grantDetailObj.marketProjectName}</Descriptions.Item>
                    <Descriptions.Item label="发放人数">{grantDetailObj.grantNum}</Descriptions.Item>
                    <Descriptions.Item label="发放成功人数">{grantDetailObj.grantSuccessNum}</Descriptions.Item>
                    <Descriptions.Item label="发放失败人数">{grantDetailObj.grantFailNum}</Descriptions.Item>
                  </Descriptions>
                  <Descriptions column={6} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
                    <Descriptions.Item label="卡包ID">{grantDetailObj.couponPackageNo}</Descriptions.Item>
                    <Descriptions.Item label="卡包名称">{grantDetailObj.couponPackageName}</Descriptions.Item>
                    <Descriptions.Item label="已发放卡包数量">{grantDetailObj.grantCardPackageNum}</Descriptions.Item>
                    <Descriptions.Item label="已领取卡包数量">{grantDetailObj.receiveCount}</Descriptions.Item>
                  </Descriptions>
                </>
                :
                currentInfo.cardPackageFlag == 2 ?
                  <Descriptions column={6} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
                    <Descriptions.Item label="批次ID">{grantDetailObj.grantBatchId}</Descriptions.Item>
                    <Descriptions.Item label="批次名称">{grantDetailObj.grantName}</Descriptions.Item>
                    <Descriptions.Item label="营销项目">{grantDetailObj.marketProjectName}</Descriptions.Item>
                    <Descriptions.Item label="兑换码数量">{grantDetailObj.verifyNum}</Descriptions.Item>
                    <Descriptions.Item label="兑换人数">{grantDetailObj.verifyPeopleNum}</Descriptions.Item>
                  </Descriptions>
                  :
                  currentInfo.cardPackageFlag == 3 ?
                    <Descriptions column={7} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
                      <Descriptions.Item label="批次ID">{grantDetailObj.grantBatchId}</Descriptions.Item>
                      <Descriptions.Item label="批次名称">{grantDetailObj.grantName}</Descriptions.Item>
                      <Descriptions.Item label="营销项目">{grantDetailObj.marketProjectName}</Descriptions.Item>
                      <Descriptions.Item label="发放人数">{grantDetailObj.grantNum}</Descriptions.Item>
                      <Descriptions.Item label="发放成功人数">{grantDetailObj.grantSuccessNum}</Descriptions.Item>
                      <Descriptions.Item label="发放失败人数">{grantDetailObj.grantFailNum}</Descriptions.Item>
                      <Descriptions.Item label="领取人数">{grantDetailObj.receivePeopleNum}</Descriptions.Item>
                    </Descriptions>
                    :
                    currentInfo.cardPackageFlag == 4 ?
                      <Descriptions column={6} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
                        <Descriptions.Item label="批次ID">{grantDetailObj.grantBatchId}</Descriptions.Item>
                        <Descriptions.Item label="批次名称">{grantDetailObj.grantName}</Descriptions.Item>
                        <Descriptions.Item label="营销项目">{grantDetailObj.marketProjectName}</Descriptions.Item>
                        <Descriptions.Item label="发放人数">{grantDetailObj.grantNum}</Descriptions.Item>
                      </Descriptions>
                      : ''
          }

          <Table
            dataSource={grantDetailObj.grantDetailList}
            pagination={false}>
            <Column title="明细ID" dataIndex="objectId" key="objectId" align="center" />
            <Column title="卡券ID" dataIndex="skuCardNo" key="skuCardNo" align="center" />
            <Column title="卡券名称" dataIndex="skuCardName" key="skuCardName" align="center" />
            <Column title="卡券品类" dataIndex="skuCardCategoryName" key="skuCardCategoryName" align="center" />
            <Column title="面值" dataIndex="faceValue" key="faceValue" align="center" />
            <Column title="使用门槛" dataIndex="isUseThreshold" key="isUseThreshold" render={(isUseThreshold, record) => useThresholdRender(isUseThreshold, record)} />
            <Column title="单批数量" dataIndex="singleNum" key="singleNum" align="center" />
            <Column title="领取有效期" dataIndex="effectiveStartDate" key="effectiveStartDate" align="center" 
              render={(text, all) => <span>{currentInfo.cardPackageFlag==4 || currentInfo.cardPackageFlag==3 || currentInfo.cardPackageFlag==2? (all.receiveLimitDays) ?  `${all.receiveLimitDays}天` : '' : (all.effectiveStartDate && all.effectiveEndDate) ? `${all.effectiveStartDate}-${all.effectiveEndDate}`: ''}</span>}/>
            <Column title="使用有效期" dataIndex="effectDate" key="effectDate" align="center"
              render={(text, all) => effectDateType(text, all)}
            />
            <Column title="可否转增" dataIndex="isGive" key="isGive" align="center"
              render={(text, all) => text == 1 || text == 0 ? '否' : '是'}
            />
            {
              currentInfo.cardPackageFlag == 3 ? '' :
                <Column title="发放张数" dataIndex="allCount" key="allCount" align="center" />
            }
            {
              currentInfo.cardPackageFlag == 0 || currentInfo.cardPackageFlag == 2 || currentInfo.cardPackageFlag == 3 ?
                <Column title="领取张数" dataIndex="receiveCount" key="receiveCount" align="center" />
                : ''
            }
          </Table>
        </>
      </Modal>
    </>
  )
}


export default connect(({ cardgrantManageModel }) => ({
  grantDetailObj: cardgrantManageModel.grantDetailObj,
}))(detailModal)