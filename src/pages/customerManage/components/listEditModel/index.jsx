import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Tag, Form, Checkbox, Input, Modal, Table, Select, Button, message, Pagination} from "antd"
import style from "./style.less"
const listEditModal = (props) => {
  const [form] = Form.useForm();
  let [addTagVisible, setAddTagVisible] = useState(false)
  let {Search} = Input
  const plainOptions = ['Apple', 'Pear', 'Orange'];
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  
  let { dispatch, putData, listEditVisble, onHidePutModal } = props,
    [visible, setVisible] = useState(false),
    [list, setList] = useState([]),
    [loading, setLoading] = useState(true),
    [isEnd, setIsEnd] = useState(false),
    [channelLinkName, setChannelLinkName] = useState('');

  /*回调*/
  useEffect(() => {
    if (listEditVisble) {
      setVisible(listEditVisble);
    }
    if (Object.keys(putData).length > 0) {
      if (putData.status == 5) {
        setIsEnd(true);
      }
    }

  }, [listEditVisble, putData])

  let handleCancel = () => {
    onHidePutModal(false)
    setVisible(false)
  }
  let handleOk = () =>{

  }
  let handleAddOk = () =>{

  }
  let handleAddCancel = () =>{
    setAddTagVisible(false)

  }
  let onSearch = () =>{

  }
  let onChange = () =>{

  }
  let openAddTag = () =>{
    setAddTagVisible(true)
  }
  return (
    <>
      <Modal
        width={630}
        title="编辑用户"
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <div className={style.edit_title}>基础信息</div>
        <Form form={form}>
          <Row gutter={60}>
            <Col span={12}>
              <Form.Item label='用户姓名' >
                <Input placeholder="请输入"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='手机号' >
                <Input placeholder="请输入"/>
              </Form.Item>
            </Col>
          </Row>
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
        <div className={style.edit_title}>标签信息</div>
        <div className={style.tag_content}>
          <Tag color='red'>标签1</Tag>
          <div className={style.add_tag} onClick={()=>openAddTag()}>+添加标签</div>
        </div>
        <Modal
            width={480}
            title="添加标签"
            maskClosable={false}
            visible={addTagVisible}
            onOk={handleAddOk} 
            onCancel={handleAddCancel}
          >
            <Form form={form}>
              <Row justify="space-around">
                <Form.Item label="标签名称">  
                <Search
                  placeholder="请输入"
                  allowClear
                  enterButton="搜索"
                  size="small"
                  onSearch={onSearch}
                />
                </Form.Item> 
              </Row>
            </Form>
            <div className={style.add_tag_content}>
                <Checkbox.Group options={plainOptions}  onChange={onChange} />
            </div>
          </Modal>
      </Modal>
      
    </>
  )
};
export default connect(({ putModal }) => ({
}))(listEditModal)
