import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Modal,
  Row,
  Button,
  Space,
  Input,
  Form,
  message,
} from "antd"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
const { TextArea } = Input
moment.locale('zh-cn')
const inputModalPage = (props) => {
  let { dispatch, inputVisible, onCallbackInput, inputNo, location } = props
  const [form] = Form.useForm();

  useEffect(() => {
    if(inputVisible){
      form.resetFields()
    }
  }, [inputVisible])

  /*关闭*/
  let onCancel = () => {
    onCallbackInput(false)
  }

  /*保存*/
  let save = (e) => {
    e.caseId = location
    if (inputNo == 1) {
      dispatch({
        type: "rescueOrderList/rescueOrderUrge",
        payload: {
          method: 'postJSON',
          params: e
        },
        callback: (res) => {
          if (res.result.code === '0') {
            onCallbackInput(true)
            message.success('保存成功!')
          } else {
            onCallbackInput(false)
            message.error(res.result.message)
          }
        }
      })
    } else {
      dispatch({
        type: "rescueOrderList/rescueOrderRemark",
        payload: {
          method: 'postJSON',
          params: e
        },
        callback: (res) => {
          if (res.result.code === '0') {
            onCallbackInput(true)
            message.success('保存成功!')
          } else {
            onCallbackInput(false)
            message.error(res.result.message)
          }
        }
      })
    }
  }


  return (
    <>
      <Modal
        title={inputNo == 1 ? <div className={style.block__header}>订单催促</div> : <div className={style.block__header}>订单备注</div>}
        onCancel={onCancel}
        width={800}
        destroyOnClose
        visible={inputVisible}
        centered={true}
        keyboard={false}
        maskClosable={false}
        footer={""}
      >
        <div className={style.box}>
          <Form className={style.form__cont} form={form} onFinish={save} layout="vertical">
              {
                inputNo == 1 ?
                  <Form.Item label="消息内容" name='messageRemark'  className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                    <TextArea maxLength={100} placeholder="请输入" allowClear />
                  </Form.Item>
                  :
                  <Form.Item label="消息内容" name='content'  className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                    <TextArea maxLength={100} placeholder="请输入" allowClear />
                  </Form.Item>
              }

            <Row justify="end" className={style.button_sty}>
              <Space>
                <Button htmlType="button" onClick={onCancel}>取消</Button>
                <Button htmlType="submit" type="primary">提交</Button>
              </Space>
            </Row>
          </Form>
        </div>
      </Modal>

    </>
  )
};
export default connect(({ rescueOrderList }) => ({
}))(inputModalPage)
