import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Steps, Button } from "antd"
import style from './style.less';
import moment from 'moment'
import 'moment/locale/zh-cn'
const { Step } = Steps;
moment.locale('zh-cn')
import FirstStep from "../list/component/firstStep";
import SecondStep from "../list/component/secondStep";
import ThirdStep from "../list/component/thirdStep";
// import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const createNewOrderPage = (props) => {
  let { dispatch, currentStep } = props

  /*== 更改当前step ==*/
  let changeStep = (currentStep) => {
    if (currentStep == 0) {
      dispatch({
        type: 'createNewOrder/isToFirstStep',
        payload: new Date().getTime()
      })
    } else if (currentStep == 1) {
      dispatch({
        type: 'createNewOrder/isToSecondStep',
        payload: new Date().getTime()
      })
    } else {
      dispatch({
        type: 'createNewOrder/isToThirdStep',
        payload: new Date().getTime()
      })
    }
  }

  useEffect(() => {
    return () => {  // 离开当前页面清除数据
      dispatch({
        type: 'createNewOrder/setReset',
      })
    }
  }, [])

  let goToBack = () => {
    history.push('/order/rescueOrder/list')
    dispatch({
      type: 'createNewOrder/setReset',
    })
  }

  return (
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <span>新建订单</span>
        </div>
        <div className={style.step_content}>
          <div className={style.step_part}>
            <Steps current={currentStep}>
              <Step title="填写客户信息" onClick={() => changeStep(0)} />
              <Step title="填写服务信息" onClick={() => changeStep(1)} />
              <Step title="提交订单" onClick={() => changeStep(2)} />
            </Steps>
          </div>
        </div>
        <div className={style.step_detail}>
          {currentStep == 0 ? <FirstStep /> : currentStep == 1 ? <SecondStep /> : <ThirdStep />}
        </div>
      </div>
      {/* <BottomArea>
        <Button onClick={goToBack}>返回上级</Button>
      </BottomArea> */}
    </div>
  )
};
export default connect(({ createNewOrder }) => ({
  currentStep: createNewOrder.currentStep
}))(createNewOrderPage)
