import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message, Pagination} from "antd"
import style from "./style.less"

const { TextArea } = Input;
const editAddressModel = (props) => {
  const [form] = Form.useForm();
  let { dispatch, editAddressVisible, onHidePutModal } = props,
    [visible, setVisible] = useState(false)
  
  /*回调*/
  useEffect(() => {
    if (editAddressVisible) {
      setVisible(editAddressVisible);
    }
  }, [editAddressVisible])

  let handleCancel = () => {
    // onHidePutModal(false)
    setVisible(false)
  }
  let handleOk = () =>{
    // setConfirmVisible(true)
    form.submit();
  }
  let handleAddOk = () =>{

  }
  let handleAddCancel = () =>{
    setconfirmVisible(false)

  }
  let onSearch = () =>{

  }
  let onChange = () =>{

  }
  let openAddTag = () =>{
    setconfirmVisible(true)
  }
  return (
    <>
      <Modal
        width={630}
        title="编辑地址"
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <Form form={form} >
          <Row gutter={20}>
              <Col span={8}>
                <Form.Item label='所在省份' >
                  <Input placeholder="请输入"/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='城市' >
                  <Input placeholder="请输入"/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='区域' >
                  <Input placeholder="请输入"/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label='详细地址'>
                  <Input placeholder="请输入"/>
                </Form.Item>
              </Col>
           </Row>
        </Form>
      </Modal>
    </>
  )
};
export default connect(({ putModal }) => ({
}))(editAddressModel)
