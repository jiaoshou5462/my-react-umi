import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message, Pagination} from "antd"
import style from "./style.less"

const { TextArea } = Input;
const modifyIcCarModel = (props) => {
  const [form] = Form.useForm();
  let { dispatch, modifyIdCarVisible, hideModifyIdCar, wechatId, getSwittch} = props,
    [visible, setVisible] = useState(false),
    [isDisabled, setIsDisabled] = useState(1)
  
  /*回调*/
  useEffect(() => {
    if (modifyIdCarVisible) {
      form.resetFields()
      setVisible(modifyIdCarVisible);
    }
  }, [modifyIdCarVisible])
  /* 校验身份证号 */
  const checkIdentityNo = (rule, value,callback) => {
    let type = form.getFieldValue('identityType')
    if(type==1) { // 身份证
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
      if(!value) {
        callback('请填写新身份证号!')
      }else {
        if(!regIdNo.test(value)){ 
          callback('身份证号有误!')
        }else {
          callback()
        }
      }
    };
    if(type==2) { // 护照
      if(!value) {
        callback('请填写新护照号!')
      }else {
        callback()
      }
    };
    if(type==3) { // 港澳台居民居住证
      if(!value) {
        callback('请填写新港澳台居民居住证!')
      }else {
        callback()
      }
    };
    if(type==4) { // 外国人永久居留证
      let regIdNo = /^CAN\d{12}$/; 
      if(!value) {
        callback('请填写新外国人永久居留证!')
      }else {
        if(!regIdNo.test(value)){ 
          callback('外国人永久居留证号有误!')
        }else {
          callback()
        }
      }
    };
    if(type==5) { // 军官证
      if(!value) {
        callback('请填写新军官证!')
      }else {
        callback()
      }
    };
    if(type==6) { // 台湾居民来往大陆通行证
      if(!value) {
        callback('请填写新台湾居民来往大陆通行证!')
      }else {
        callback()
      }
    };
    if(type==7) { // 港澳居民来往内地通行证
      if(!value) {
        callback('请填写新港澳居民来往内地通行证!')
      }else {
        callback()
      }
    };
  }
  
  let handleCancel = () => {
    setVisible(false)
    hideModifyIdCar()
  }
  let handleOk = (e) => {
    // form.submit();
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
          hideModifyIdCar();
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
        title="修改身份证号"
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}
        wrapClassName={style.modal_content_part}
        footer={null}
      >
        <Form form={form} labelCol={{ span: 4 }}  onFinish={handleOk}>
          <Form.Item label="证件类型" name="identityType" rules={[{ required: true, message: "请选择证件类型"}]}>
            <Select showSearch allowClear  placeholder="请选择" optionFilterProp="children" onChange={()=> {setIsDisabled(2)}}>
              <Option key={1} value={1}>身份证</Option>
              <Option key={2} value={2}>护照</Option>
              <Option key={3} value={3}>港澳台居民居住证</Option>
              <Option key={4} value={4}>外国人永久居留证</Option>
              <Option key={5} value={5}>军官证</Option>
              <Option key={6} value={6}>台湾居民来往大陆通行证</Option>
              <Option key={7} value={7}>港澳居民来往内地通行证</Option>
            </Select>
          </Form.Item>
          <Form.Item label="新证件号" validateTrigger='onBlur' name="identityNo" rules={[{ required: true, validator:checkIdentityNo}]}>
            <Input placeholder="请输入" disabled={isDisabled==1}/>
          </Form.Item>
          <Form.Item label="姓名" className={style.unbunding_reason} name="customerName" rules={[{ required: true}]}>
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item label="修改原因：" name="remark1" className={style.unbunding_reason} rules={[{ required: true}]}>
            <TextArea rows={4} />
          </Form.Item>
          <div className={style.btn_content}>
            <Button className={style.btn_radius} htmlType="submit" type="primary" className={style.confirm_btn}>确认</Button>
            <Button className={style.btn_radius} htmlType="button" onClick={handleCancel}>取消</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
};
export default connect(({ putModal }) => ({
}))(modifyIcCarModel)
