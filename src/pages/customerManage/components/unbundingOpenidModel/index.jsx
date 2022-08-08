import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message, Pagination} from "antd"
import style from "./style.less"

const { TextArea } = Input;
const unbundingOpenidModel = (props) => {
  const [form] = Form.useForm();
  
  let { dispatch, unbundingOpenidVisble, hideUnbundingOpenModel, openId, wechatId,getSwittch } = props,
    [visible, setVisible] = useState(false),
    [confirmVisible, setConfirmVisible] = useState(false),
    [reason, setReason] = useState('')

  /*回调*/
  useEffect(() => {
    if (unbundingOpenidVisble) {
      setVisible(unbundingOpenidVisble);
    }
  }, [unbundingOpenidVisble])

  let handleCancel = () => {
    hideUnbundingOpenModel(false)
    setVisible(false)
  }
  let onReasonChange = (e) => {
    let value = e.target.value
    setReason(value)
  }

  let handleOk = () =>{
    setConfirmVisible(true)
  }
  let confirmHandleOk = () => {
    let data = {
      openId:openId,
      remark:reason,
      objectId:wechatId
    }
    dispatch({
      type: 'customerListDetail/unbindWechat',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if(res.result.code === '0') {
          setConfirmVisible(false)
          setVisible(false)
          getSwittch()
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  let confirmHandleCancel = () => {
     setConfirmVisible(false)
  }
 
  return (
    <>
      <Modal
        width={630}
        title="微信解绑"
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}
      >
         <div>
            <span>原微信昵称(OpenId)</span>
            <span className={style.old_name}>{openId}</span>
          </div>
          <Row>
            <Col span={4}>
              <span>解绑原因：</span>
            </Col>
            <Col span={20}>
              <TextArea
                placeholder='请输入'
                rows={4}
                onChange={onReasonChange}
                className={style.copy_item_right}
              />
            </Col>
          </Row>
          <Modal
            width={460}
            title="确认信息"
            maskClosable={false}
            visible={confirmVisible}
            onOk={confirmHandleOk} 
            onCancel={confirmHandleCancel}
          >
            <div>
              你确定要解绑客户微信号吗？（解绑后原微信号无法自动登陆，重新绑定其他微信号需用相同手机号及身份证号方可绑定）
            </div>
          </Modal>
      </Modal>
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(unbundingOpenidModel)
