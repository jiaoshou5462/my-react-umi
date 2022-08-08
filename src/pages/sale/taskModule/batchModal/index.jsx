import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import 'swiper/swiper.less';
import "swiper/swiper-bundle.css"
import {
  Row,
  Col,
  Form,
  Modal,
  Select,
  message,
  Input,
} from "antd"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const { Option } = Select

const batchModalPage =(props)=>{
  let {dispatch, location, throngVisible, onHideThrong, taskType, list, crowdBatch} = props
  let [form] = Form.useForm()
  let [visible, setVisible] = useState(false)
  useEffect(() => {
    if(taskType !== 2){
      form.resetFields()
    }
  },[taskType])
  /*回调*/
  useEffect(()=>{
    if(throngVisible){
      setVisible(throngVisible)
      getList()
      if(crowdBatch.length > 0) {
        form.setFieldsValue({crowdBatch})
      }
    }
  },[throngVisible, crowdBatch])

  let getList = () => {
    dispatch({
      type: 'batchModal/getList',
      payload: {
        method: 'get',
        params: {}
      }
    })
  }
  /*确定选择人群*/
  let onOk = () => {
    let temp = form.getFieldsValue()
    if(temp.crowdBatch && temp.crowdBatch.length > 0){
      onHideThrong({list: temp.crowdBatch, status: 1})
    }else {
      onHideThrong({list: [], status: 2})
    }
    setVisible(false)
  }
  /*关闭*/
  let onCancel = () => {
    let temp = {
      status: 0
    }
    if(crowdBatch.length <= 0) {
      form.resetFields()
    }
    onHideThrong(temp)
    setVisible(false)
  }
  /*自定义校验*/
  let changeValues = (rule ,value , callback) => {
    let tempArr = []
    if (value.length > 2){
      tempArr = [].concat(value.slice(0,1), value.slice(-1) )
      form.setFieldsValue({
        crowdBatch : tempArr ,
      })
      callback('最多选择两个批次')
    } else {
      tempArr = value
      callback()
    }
  }
  return <>
    <Modal
        width={650}
        onOk={onOk}
        okText='确定'
        title="选择客户人群"
        cancelText='取消'
        closable={false}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
    >
      <div className={style.batch_box}>
        <Form form={form} style={{width: '100%'}}>
          <Row>
            <Col span={24}>
              <Form.Item label="客户导入批次" name='crowdBatch' labelCol={{flex: '0 0 110px'}} rules={[{ message: "最多只能选择两个批次", validator: changeValues }]}>
                <Select
                    mode="tags"
                    showArrow
                    allowClear
                    placeholder="请选择"
                    style={{ width: '100%' }}
                >
                  {
                    list.length > 0 ? list.map((item, key) => {
                      return <Option key={key} value={item.batchId}>{item.batchId}</Option>
                    }) : null
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  </>
}
export default connect(({batchModal})=>({
  list: batchModal.list,
}))(batchModalPage)


