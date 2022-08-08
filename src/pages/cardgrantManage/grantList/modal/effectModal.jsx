import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Descriptions, Modal, message, InputNumber
} from "antd"
import moment from 'moment'
import style from './modalStyle.less';
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'

const { TextArea } = Input;
const { Column } = Table;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

//列表详情弹框
const detailModal = (props) => {
  let { dispatch, isEffectModalVisible, closeModal, effectInfo, toFatherValue, effectDetailList } = props;
  let [form] = Form.useForm();
  // console.log(effectInfo, 'effectInfo')

  useEffect(() => {
    getStartInfo()
  }, [])

  //生效信息
  const getStartInfo = () => {
    dispatch({
      type: 'cardgrantManageModel/getStartInfo',
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: effectInfo.grantBatchId
      }
    })
  }


  const effectDateType = (text, all) => {
    return <>
      {
        all.effectDateType == 2 ? 
          <span>以保单时间为准</span>
        : 
        all.useValidType == 1 ?
          <span>{all.effectiveDays ? (all.effectiveDays || 0) : all.useValidDays }天（发放后立即生效）</span>
        :
        all.useValidType == 2 ?
          <span>{all.effectiveDays ? (all.effectiveDays || 0) : (all.useValidDays || 0) }天（领取后立即生效）</span>
        :
        all.effectDateType == 1 ?
          <span>{moment(all.effectStartDate).format('YYYY.MM.DD')}~{moment(all.effectEndDate).format('YYYY.MM.DD')}</span>
        :
          <span>{ all.effectiveDays }</span>
      }
      {/* {
        all.useValidType == 1 ?
          <span>{all.effectiveDays ? (all.effectiveDays || 0) : all.useValidDays }天（发放后立即生效）</span>
        :
        all.useValidType == 2 ?
          <span>{all.effectiveDays ? (all.effectiveDays || 0) : (all.useValidDays || 0) }天（领取后立即生效）</span>
        :
        all.effectDateType == 1 ?
          <span>{moment(all.effectStartDate).format('YYYY.MM.DD')}~{moment(all.effectEndDate).format('YYYY.MM.DD')}</span>
        :
        all.effectDateType == 2 ? 
          <span>以保单时间为准</span> 
        :
          <span>{ all.effectiveDays }</span>
      } */}
    </>
  }

  // 确定发放
  const handleEffectOk = () => {
    dispatch({
      type: 'cardgrantManageModel/getStartEffect',//生效
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: effectInfo.grantBatchId
      },
      callback: (res) => {
        console.log(res, '88')
        if (res.result.code == '0') {
          closeModal();
          toFatherValue(true)
          message.success(res.result.message);
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <>
      <Modal
        title={
          effectInfo.cardPackageFlag == 0 ? '卡券发放确认' :
            effectInfo.cardPackageFlag == 1 ? '卡包发放确认' :
              effectInfo.cardPackageFlag == 2 ? '兑换码发放确认' :
                effectInfo.cardPackageFlag == 3 ? 'N选M发放确认' :
                  effectInfo.cardPackageFlag == 4 ? '接口发放确认' :
                    ''
        }
        width={'70%'}
        visible={isEffectModalVisible}
        okText='确认发放'
        // footer={null}
        onOk={handleEffectOk}
        onCancel={() => { closeModal() }}
      >
        <>
          {
            effectInfo.cardPackageFlag == 1 ?
              <h3 style={{ marginLeft: '0px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold', fontSize: '16px' }}>当前卡包</h3>
              : ''
          }
          <Descriptions column={3} labelStyle={{ marginLeft: '30px', marginBottom: '20px' }}>
            <Descriptions.Item label="批次ID">{effectInfo.grantBatchId}</Descriptions.Item>
            <Descriptions.Item label="批次名称">{effectInfo.grantName}</Descriptions.Item>
            <Descriptions.Item label="投放类型">{effectInfo.cardPackageFlagName}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '30px', marginBottom: '20px' }}>
            <Descriptions.Item label="发放人群">{effectInfo.grantGroupName}</Descriptions.Item>
            <Descriptions.Item label="即将发放人数">{effectInfo.grantNum}</Descriptions.Item>
            {
              effectInfo.cardPackageFlag == 1 ?
                <Descriptions.Item label="卡包名称">{effectInfo.couponPackageName}</Descriptions.Item>
                : ''
            }
          </Descriptions>
          <Table dataSource={effectDetailList} pagination={false}>
            <Column title="卡券ID" dataIndex="skuCardNo" key="skuCardNo" />
            <Column title="卡券名称" dataIndex="skuCardName" key="skuCardName" />
            <Column title="卡券品类" dataIndex="skuCardCategoryName" key="skuCardCategoryName" />
            <Column title="面值" dataIndex="faceValue" key="faceValue" />
            <Column title="使用门槛" dataIndex="isUseThreshold" key="isUseThreshold" render={(isUseThreshold, record) => useThresholdRender(isUseThreshold, record) } />
            <Column title="领取有效期" dataIndex="effectiveStartDate" key="effectiveStartDate"
              render={(text, all) => <span>{effectInfo.cardPackageFlag==4 || effectInfo.cardPackageFlag==3 || effectInfo.cardPackageFlag==2? (all.receiveLimitDays) ? `${all.receiveLimitDays}天` : '' : (all.effectiveStartDate && all.effectiveEndDate) ? `${all.effectiveStartDate}-${all.effectiveEndDate}`: ''}</span>}
            />
            <Column title="使用有效期" dataIndex="effectDate" key="effectDate"
              render={(text, all) => effectDateType(text, all)}
            />
          </Table>
        </>
      </Modal>
    </>
  )

}


export default connect(({ cardgrantManageModel }) => ({
  effectDetailList: cardgrantManageModel.effectDetailList,
  // couponList: cardgrantManageModel.couponList,
  // couponTotal: cardgrantManageModel.couponTotal,
  // invoiceInfoModal: cardgrantManageModel.invoiceInfoModal,
  // appllyDetailList: cardgrantManageModel.appllyDetailList,
  // total: cardgrantManageModel.total,//命名空间名.变量
  // detailTotal: cardgrantManageModel.detailTotal
}))(detailModal)