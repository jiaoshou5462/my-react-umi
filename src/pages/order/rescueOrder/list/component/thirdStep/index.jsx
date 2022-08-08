import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Button,
  Descriptions,
  Input,
  Form,
  message,
} from "antd"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
const { TextArea } = Input
moment.locale('zh-cn')
const thirdStep = (props) => {
  let { dispatch, echoThirdStepData, toSecondStep, firstStepDetile, secondStepDetile, echoFirstStepData, echoSecondStepData,secondListData} = props
  const [form] = Form.useForm();
  let [formData, setFormData] = useState({
    memo: null,
  })

  useEffect(() => {
    scrollToTop()
  }, [])

  let scrollToTop = () =>{
    var c = document.documentElement.scrollTop || document.body.scrollTop;
    if(c > 0){
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0,c-c/8)
    }
  }

  //是否事故车、预约单
  let settleNodeItem = {
    0: "否",
    1: "是"
  }

  useEffect(() => {
    if (toSecondStep) {
      backOff()
    }
  }, [toSecondStep])

  useEffect(() => {
    form.resetFields()
    if (echoThirdStepData) {
      for (let x in formData) {
        formData[x] = echoThirdStepData[x] ? echoThirdStepData[x] : formData[x] // 避免回来重新选择单选出现未选择的情况
      }
      setFormData({ ...formData })
      form.setFieldsValue(echoThirdStepData)
    } else {
      form.resetFields()
    }

  }, [echoThirdStepData])
  /*返回上一步*/
  let backOff = () => {
    // 暂存第二步必填字段
    dispatch({
      type: 'createNewOrder/setEditEchoThirdStepData',
      payload: {
        echoThirdStepData: form.getFieldValue(),
      }
    })
    dispatch({
      type: 'createNewOrder/setCurrentStep',
      payload: 1
    })
  }

  /*保存*/
  let save = () => {
    // 暂存第二步必填字段
    let thirdData =  form.getFieldValue();
    const detail = Object.assign(echoFirstStepData, echoSecondStepData,thirdData);
    dispatch({
      type: "createNewOrder/addRescueOrderList",
      payload: {
        method: 'postJSON',
        params: detail
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success('保存成功!')
          history.push('/order/rescueOrder/list')
          dispatch({
            type: 'createNewOrder/setReset',
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <div className={style.third_step}>
      <Form form={form} onFinish={save}>
        <div className={style.item_form}>
          <Descriptions title="客户信息" column={2} labelStyle={{ marginLeft: 8 }}>
            <Descriptions.Item label="报案电话">{echoFirstStepData && echoFirstStepData.mobileNo || '-'}</Descriptions.Item>
            <Descriptions.Item label="姓名">{echoFirstStepData && echoFirstStepData.customerName || '-'}</Descriptions.Item>
            <Descriptions.Item label="车牌号">{echoFirstStepData && echoFirstStepData.plateNo || '-'}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className={style.item_form}>
          <Descriptions title="工单信息" column={2} labelStyle={{ marginLeft: 8 }}>
            <Descriptions.Item label="工单号">{echoFirstStepData && echoFirstStepData.traceCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="承保单位">{firstStepDetile && firstStepDetile.channelBranchId || '-'}</Descriptions.Item>
            <Descriptions.Item label="服务类型">{secondStepDetile && secondStepDetile.serviceTypeId || '-'}</Descriptions.Item>
            <Descriptions.Item label="服务项目">{secondStepDetile && secondStepDetile.serviceId || '-'}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={1} labelStyle={{ marginLeft: 8 }}>
            <Descriptions.Item label="救援地址">{secondStepDetile && secondStepDetile.province}{secondStepDetile && secondStepDetile.caseCity}{secondStepDetile && secondStepDetile.regionId} {secondStepDetile && secondStepDetile.caseAddress}{echoSecondStepData && echoSecondStepData.caseAddressFlag}</Descriptions.Item>
            <Descriptions.Item label="目的地址">{secondStepDetile.destProvince ? <>{secondStepDetile && secondStepDetile.destProvince}{secondStepDetile && secondStepDetile.destCity}{secondStepDetile && secondStepDetile.destRegionId} {secondStepDetile && secondStepDetile.destination}{echoSecondStepData && echoSecondStepData.destinationFlag}</> : '-'}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={2} labelStyle={{ marginLeft: 8 }}>
            <Descriptions.Item label="车辆位置">{secondStepDetile && secondStepDetile.positionId || '-'}</Descriptions.Item>
            <Descriptions.Item label="故障类型">{secondStepDetile && secondStepDetile.assistantType || '-'}</Descriptions.Item>
            <Descriptions.Item label="事故车">{settleNodeItem[echoSecondStepData && echoSecondStepData.isAccident] || '-'}</Descriptions.Item>
            <Descriptions.Item label="预约单">{settleNodeItem[echoSecondStepData && echoSecondStepData.reservationFlg] || '-'}</Descriptions.Item>
            <Descriptions.Item label="预约时间">{echoSecondStepData && echoSecondStepData.reservationTime || '-'}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className={style.item_form}>
          <Descriptions title="车辆及保险信息" column={2} labelStyle={{ marginLeft: 8 }}>
            <Descriptions.Item label="车辆品牌">{echoFirstStepData && echoFirstStepData.carBrand || '-'}</Descriptions.Item>
            <Descriptions.Item label="车型">{firstStepDetile && firstStepDetile.carType || '-'}</Descriptions.Item>
            <Descriptions.Item label="颜色">{firstStepDetile && firstStepDetile.carColor || '-'}</Descriptions.Item>
            <Descriptions.Item label="车架号">{echoFirstStepData && echoFirstStepData.identityNo || '-'}</Descriptions.Item>
            <Descriptions.Item label="保单号">{echoFirstStepData && echoFirstStepData.policyNo || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className={style.item_line}></div>

        <Form.Item label="订单附言" name='memo' className={style.item_memo}>
          <TextArea placeholder="请输入" allowClear maxLength={100} />
        </Form.Item>
        <div className={style.icon_tips}>请填写本次服务其他相关信息，订单附言将会发送给服务人员</div>

        <div className={style.btn_content}>
          <Button className={`${style.next_setp} ${style.part_gap}`} onClick={backOff}>上一步</Button>
          <Button type="primary" htmlType="submit" className={style.next_setp} >保存</Button>
        </div>
      </Form>
    </div>
  )
};
export default connect(({ createNewOrder }) => ({
  echoThirdStepData: createNewOrder.echoThirdStepData,
  toSecondStep: createNewOrder.toSecondStep,
  firstStepDetile: createNewOrder.firstStepDetile,
  secondStepDetile: createNewOrder.secondStepDetile,
  echoFirstStepData: createNewOrder.echoFirstStepData,
  echoSecondStepData: createNewOrder.echoSecondStepData,
  secondListData: createNewOrder.secondListData,
}))(thirdStep)
