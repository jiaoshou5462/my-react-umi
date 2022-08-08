import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message, Pagination} from "antd"
import style from "./style.less"

const { TextArea } = Input;
const unbundingOpenidModel = (props) => {
  
  let { dispatch, modifyPhoneNumberVisble, hideModifyPhoneEdit, wechatId, getSwittch} = props,
      [form] = Form.useForm(),
      [visible, setVisible] = useState(false),
      [modifyData, setModifyData] = useState({
        customerPhone:'',
        remark:'',
        objectId:wechatId
      })
  
  /*回调*/
  useEffect(() => {
    if (modifyPhoneNumberVisble) {
      form.resetFields()
      setVisible(modifyPhoneNumberVisble);
    }
  }, [modifyPhoneNumberVisble])
  /* 校验手机号 */
  const checkPhopneNo = (rule, value,callback) => {
    let re = /^1\d{10}$/;
    if(!value) {
      callback('请填写手机号')
    }else{
      if(!re.test(value)){ 
        callback('手机号有误')
      }else{
        callback()
      }  
    } 
   }
  let handleCancel = () => {
    setVisible(false)
    hideModifyPhoneEdit()
  }
  let handleOk = (e) =>{
    let data = {
      ...e,
      objectId:wechatId
    }
    dispatch({
      type: 'customerListDetail/updatePhoneAndCardNo',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if(res.result.code === '0') {
          hideModifyPhoneEdit();
          setVisible(false);
          getSwittch()
        }else {
          message.error(res.result.message)
        }
         
      }
    })
  }
  return (
    <>
      <Modal
        width={630}
        title="修改手机号"
        maskClosable={false}
        visible={visible}
        onCancel={handleCancel}
        wrapClassName={style.modal_content_part}
        footer={null}
      >
        <Form form={form} onFinish={handleOk}>
          <Form.Item label="新手机号："  name="customerPhone" validateTrigger='onBlur' rules={[{ required: true,validator:checkPhopneNo}]}>
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item label="修改原因：" name="remark" className={style.unbunding_reason} rules={[{ required: true}]}>
            <TextArea rows={4} />
          </Form.Item>
          <div className={style.btn_content}>
            <Button className={style.btn_radius} htmlType="submit" type="primary"  className={style.confirm_btn}>确认</Button>
            <Button className={style.btn_radius} htmlType="button" onClick={handleCancel}>取消</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
};
export default connect(({ putModal }) => ({
}))(unbundingOpenidModel)
