import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Modal,
  Row,
  Button,
  Space,
  Input,
  Descriptions,
  message
} from "antd"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
const { TextArea } = Input
moment.locale('zh-cn')
const saveModalPage = (props) => {
  let { dispatch, saveVisible, onCallbackSave, detail,detailNerArr} = props

  //是否事故车、预约单
  let settleNodeItem = {
    0: "否",
    1: "是"
  }

  useEffect(() => {
    console.log(detailNerArr)
  }, [])

  /*关闭*/
  let onCancel = () => {
    onCallbackSave(false)
  }

  /*保存*/
  let save = () => {
    dispatch({
      type: "comboModal/addRescueOrderList",
      payload: {
        method: 'postJSON',
        params: detail
      },
      callback: (res) => {
        if (res.result.code === '0') {
          onCallbackSave(true)
          message.success('保存成功!')
        } else {
          onCallbackSave(false)
          message.error(res.result.message)
        }
      }
    })
  }


  return (
    <>
      <Modal
        title={'新订单预览'}
        onCancel={onCancel}
        width={800}
        destroyOnClose
        visible={saveVisible}
        centered={true}
        keyboard={false}
        maskClosable={false}
        footer={""}
      >
        <div className={style.box}>
            <Descriptions title="客户信息" column={3}  >
              <Descriptions.Item label="报案电话">{detail && detail.mobileNo || '-'}</Descriptions.Item>
              <Descriptions.Item label="姓名">{detail && detail.customerName || '-'}</Descriptions.Item>
              <Descriptions.Item label="车牌号">{detail && detail.plateNo || '-'}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="工单信息" column={2}  >
              <Descriptions.Item label="工单号">{detail && detail.traceCode || '-'}</Descriptions.Item>
              <Descriptions.Item label="承保单位">{detailNerArr && detailNerArr.channelBranchId || '-'}</Descriptions.Item>
              <Descriptions.Item label="服务类型">{detailNerArr && detailNerArr.serviceTypeId || '-'}</Descriptions.Item>
              <Descriptions.Item label="服务项目">{detailNerArr && detailNerArr.serviceId || '-'}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={1}  >
              <Descriptions.Item label="救援地址">{detailNerArr && detailNerArr.province}/{detailNerArr && detailNerArr.caseCity}/{detailNerArr && detailNerArr.regionId} {detailNerArr && detailNerArr.caseAddress}/{detail && detail.caseAddressFlag}</Descriptions.Item>
              <Descriptions.Item label="目的地址">{detailNerArr && detailNerArr.destProvince}/{detailNerArr && detailNerArr.destCity}/{detailNerArr && detailNerArr.destRegionId} {detailNerArr && detailNerArr.destination}/{detail && detail.destinationFlag}</Descriptions.Item>
            </Descriptions>
            <Descriptions  column={3}  >
              <Descriptions.Item label="车辆位置">{detailNerArr && detailNerArr.positionId || '-'}</Descriptions.Item>
              <Descriptions.Item label="故障类型">{detailNerArr && detailNerArr.assistantType || '-'}</Descriptions.Item>
              <Descriptions.Item label="事故车">{settleNodeItem[detail && detail.isAccident] || '-'}</Descriptions.Item>
            </Descriptions>
            <Descriptions  column={2}  >
              <Descriptions.Item label="预约单">{settleNodeItem[detail && detail.reservationFlg] || '-'}</Descriptions.Item>
              <Descriptions.Item label="预约时间">{detail && detail.reservationTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="车辆及保险信息" column={3}  >
              <Descriptions.Item label="车辆品牌">{detail && detail.carBrand || '-'}</Descriptions.Item>
              <Descriptions.Item label="车型">{detailNerArr && detailNerArr.carType || '-'}</Descriptions.Item>
              <Descriptions.Item label="颜色">{detailNerArr && detailNerArr.carColor || '-'}</Descriptions.Item>
              <Descriptions.Item label="车架号">{detail && detail.identityNo || '-'}</Descriptions.Item>
              <Descriptions.Item label="保单号">{detail && detail.policyNo || '-'}</Descriptions.Item>
            </Descriptions>


          <Row justify="end" className={style.button_sty}>
            <Space size={22}>
              <Button htmlType="button" onClick={onCancel}>取消</Button>
              <Button htmlType="submit" type="primary" onClick={save}>确认</Button>
            </Space>
          </Row>
        </div>
      </Modal>

    </>
  )
};
export default connect(({ comboModal}) => ({
}))(saveModalPage)
