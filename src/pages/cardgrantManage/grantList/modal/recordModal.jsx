import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Descriptions, Modal, message, InputNumber
} from "antd"
import moment from 'moment'
import style from './modalStyle.less';

const { Column } = Table;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;


//发放记录弹框
const recordModal = (props) => {
  let { dispatch, isRecordModalVisible, closeModal, currentInfo, toFatherValue, queryRecord } = props;
  let [form] = Form.useForm();
  // console.log(currentInfo, 'currentInfo')

  // 名单，错误名单下载
  const [fullListExcel, setFullListExcel] = useState('');
  const [errorListExcel, setErrorListExcel] = useState('');

  useEffect(() => {
    recordGrant()
  }, [])

  //发放记录数据接口
  const recordGrant = () => {
    dispatch({
      type: 'cardgrantManageModel/queryGrantRecord',
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: currentInfo.grantBatchId
      },
      callback: (res) => {
        setFullListExcel(res.body.fullListExcel)
        setErrorListExcel(res.body.errorListExcel)
      }
    })
  }

  let recordOption = (text, all) => {
    // 如果投放单的（successCount = 0），也不显示“撤回发放”,失败的张数0 ,就不需要导出失败名单了
    // 领取人数>0,不展示撤回发放
    return <>
      {
        text == 0 ? <a onClick={exportNameList}>导出名单</a> :
          //领取人数-发放人数>=0不展示撤回发放
          // text == 1 && all.receiveCount - all.grantNum < 0 ? <a onClick={withdrawGrant}>撤回发放</a> :
          text == 1 ? '-' :
            text == 2 && all.quantity != 0 ? <a onClick={exportFailNameList}>导出失败名单</a> : '-'
      }
    </>
  }
  // 导出名单
  let exportNameList = () => {
    // 2有值调download文件下载,无值调导出名单接口
    if (fullListExcel) {
      fileDownload(1)
    } else {
      dispatch({
        type: 'cardgrantManageModel/nameListExcel',//导出名单
        payload: {
          method: 'postJSON',
          params: {
            grantBatchId: currentInfo.grantBatchId,
            status: 1000//全部名单1000，失败：3
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {
            message.warning({ content: res.body })
            reRecord()
          } else {
            message.error({ content: res.result.message })
          }
        }
      })
    }
  }

  // 有值文件下载
  let fileDownload = (type) => {
    dispatch({
      type: 'cardgrantManageModel/fileDownload',//下载文件
      payload: {
        method: 'get',
        params: {},
        fileCode: type == 1 && fullListExcel ? fullListExcel : type == 2 && errorListExcel ? errorListExcel : '',
        responseType: 'blob'
      },
      callback: (res) => {
        if (res) {
          const url = window.URL.createObjectURL(new Blob([res], { type: "application/json" }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          if (type == 1) {
            link.setAttribute('download', currentInfo.grantBatchId + '批次发放详情.xls')
          } else {
            link.setAttribute('download', currentInfo.grantBatchId + '批次发放失败详情.xls')
          }
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    })
  }

  // 撤回发放
  let withdrawGrant = () => {
    dispatch({
      type: 'cardgrantManageModel/toWithdraw',//撤回发放
      payload: {
        method: 'postJSON',
        params: {
          grantBatchId: currentInfo.grantBatchId,
          cardPackageFlag: currentInfo.cardPackageFlag
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success({ content: '正在撤回...' })
          // setIsRecordModalVisible(false)
          // listGrant();
          closeModal();
          toFatherValue(true)
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }

  // 导出失败名单
  let exportFailNameList = () => {
    // 2有值调download文件下载,无值调导出名单接口
    if (errorListExcel) {
      fileDownload(2)
    } else {
      dispatch({
        type: 'cardgrantManageModel/nameListExcel',//导出失败名单
        payload: {
          method: 'postJSON',
          params: {
            grantBatchId: currentInfo.grantBatchId,
            status: 3//全部名单1000，失败：3
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {
            message.warning({ content: res.body })
            reRecord()
          } else {
            message.error({ content: res.result.message })
          }
        }
      })
    }
  }

  // 空值再调发放记录
  let reRecord = () => {
    dispatch({
      type: 'cardgrantManageModel/queryGrantRecord',//发放记录
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: currentInfo.grantBatchId
      },
      callback: (res) => {
        setFullListExcel(res.body.fullListExcel)
        setErrorListExcel(res.body.errorListExcel)
      }
    })
  }
  // 卡券，N选M
  const coiponRecordList = [
    { recordName: '发放总张数', explain: '该批次总共发放的卡券数，每日0点更新使用情况（状态、领取时间、使用时间）', quantity: `${queryRecord.allCount}`, option: 0 },
    { recordName: '发放成功张数', explain: '发放成功的张数', quantity: `${queryRecord.successCount}`, option: 1 },
    { recordName: '发放失败张数', explain: '发放失败的张数', quantity: `${queryRecord.failCount}`, option: 2 },
    { recordName: '撤回张数', explain: '发放成功后撤回的张数，用户已使用或卡券已过期的无法撤回', quantity: `${queryRecord.withdraw}`, option: 3 },
  ]
  // 卡包
  const cardbagRecordList = [
    { recordName: '发放卡包总数', explain: '该批次总共发放的卡包数，每日0点更新使用情况（状态、领取时间、使用时间）', quantity: `${queryRecord.allCount}`, option: 0 },
    { recordName: '发放成功卡包数', explain: '发放成功的卡包数', quantity: `${queryRecord.successCount}`, option: 1 },
    { recordName: '发放失败卡包数', explain: '发放失败的卡包数', quantity: `${queryRecord.failCount}`, option: 2 },
    { recordName: '撤回卡包数', explain: '发放成功后撤回的卡包数，用户已使用或卡券已过期的无法撤回', quantity: `${queryRecord.withdraw}`, option: 3 },
  ]
  // 兑换码，接口投放
  const exchangeCodeRecordList = [
    { recordName: '发放总张数', explain: '该批次总共发放的卡券数，每日0点更新使用情况（状态、领取时间、使用时间）', quantity: `${queryRecord.allCount}`, option: 1 },
    { recordName: '发放成功张数', explain: '发放成功的张数', quantity: `${queryRecord.successCount}`, option: 1 },
    { recordName: '发放失败张数', explain: '发放失败的张数', quantity: `${queryRecord.failCount}`, option: 1 },
    { recordName: '撤回张数', explain: '发放成功后撤回的张数，用户已使用或卡券已过期的无法撤回', quantity: `${queryRecord.withdraw}`, option: 1 },
  ]
  return (
    <Modal
      title={
        currentInfo.cardPackageFlag == 0 ? '卡券发放记录' :
          currentInfo.cardPackageFlag == 1 ? '卡包发放记录' :
            currentInfo.cardPackageFlag == 2 ? '兑换码发放记录' :
              currentInfo.cardPackageFlag == 3 ? 'N选M发放记录' :
                currentInfo.cardPackageFlag == 4 ? '接口发放记录' :
                  ''
      }
      width='70%'
      visible={isRecordModalVisible}
      onCancel={() => { closeModal() }}
      footer={[
        <Button key="closeRecord" onClick={() => closeModal()}>
          关闭
        </Button>
      ]}
    >
      {
        currentInfo.cardPackageFlag == 0 || currentInfo.cardPackageFlag == 2 || currentInfo.cardPackageFlag == 3 || currentInfo.cardPackageFlag == 4 ?
          <Descriptions column={4} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
            <Descriptions.Item label="批次ID">{currentInfo.grantBatchId}</Descriptions.Item>
            <Descriptions.Item label="批次名称">{currentInfo.grantName}</Descriptions.Item>
            <Descriptions.Item label="投放类型">{currentInfo.cardPackageFlagName}</Descriptions.Item>
          </Descriptions>
          :
          currentInfo.cardPackageFlag == 1 ?
            <Descriptions column={4} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
              <Descriptions.Item label="批次ID">{currentInfo.grantBatchId}</Descriptions.Item>
              <Descriptions.Item label="批次名称">{currentInfo.grantName}</Descriptions.Item>
              <Descriptions.Item label="投放类型">{currentInfo.cardPackageFlagName}</Descriptions.Item>
              <Descriptions.Item label="卡包名称">{currentInfo.couponPackageName}</Descriptions.Item>
            </Descriptions>
            : ''
      }

      <Table
        dataSource={
          currentInfo.cardPackageFlag == 0 || currentInfo.cardPackageFlag == 3 ? coiponRecordList :
            currentInfo.cardPackageFlag == 1 ? cardbagRecordList :
              currentInfo.cardPackageFlag == 2 || currentInfo.cardPackageFlag == 4 ? exchangeCodeRecordList : []
        }
        bordered
        pagination={false}
      >
        <Column title="名目" dataIndex="recordName" key="recordName" align="center" />
        <Column title="说明" dataIndex="explain" key="explain" align="center" />
        <Column title="数量（张）" dataIndex="quantity" key="quantity" align="center" />
        <Column title="操作" dataIndex="option" key="option" align="center"
          render={(text, all) => recordOption(text, all)}
        />

      </Table>
    </Modal>
  )
}


export default connect(({ cardgrantManageModel }) => ({
  queryRecord: cardgrantManageModel.queryRecord,
}))(recordModal)