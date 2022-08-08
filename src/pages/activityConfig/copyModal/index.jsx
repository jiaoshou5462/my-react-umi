import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Form,
  Row,
  Input,
  Modal,
  DatePicker,
  Space,
  Button,
  message,
  Tooltip,
  Radio
} from "antd"
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from "./style.less"
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import SelectActivityThrong from "@/pages/activityModule/selectActivityThrong";
const { RangePicker } = DatePicker;

const copyModalPage = (props) => {
  let { dispatch, copyData, copyVisible, onHideCopyModal, onGetList, copySearch } = props,
    [visible, setVisible] = useState(false),
    [form] = Form.useForm();
  let [checkThrong, setCheckThrong] = useState(0) //选择参与人群value
  let [throngVisible, setThrongVisible] = React.useState(false) //添加人群弹窗状态
  let [list, setList] = useState([]) //人群列表
  let [throngType, setThrongType] = useState(1) //1可参与人群;2排除可参与人群
  let [activityThrongList, setActivityThrongList] = useState([]) //可参与人群
  let [unActivityThrongList, setUnActivityThrongList] = useState([]) //排除可参与人群

  /*回调*/
  useEffect(() => {
    if (copyVisible) {
      setVisible(copyVisible);
      setActivityThrongList([]);
      setUnActivityThrongList([]);
      setCheckThrong(0)
    }
    form.setFieldsValue({
      internalName: "",
      displayName: "",
      activityTime: '',
      isCheckThrong:0
    });
  }, [copyVisible, copyData, copySearch]);
  //取消
  let onCancel = () => {
    onHideCopyModal(false)
    setVisible(false)
  }
  //确定
  let onSubmit = values => {
    let data = {
      activityId: copyData.objectId,
      displayName: values.displayName,
      endTime: moment(values.activityTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      internalName: values.internalName,
      startTime: moment(values.activityTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      activityThrongList:activityThrongList?activityThrongList:[],
      unActivityThrongList,
      isCheckThrong:form.getFieldsValue().isCheckThrong
    }
    dispatch({
      type: 'copyModal/copyActivity',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          onHideCopyModal(false)
          setVisible(false)
          onGetList(copySearch)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
 
  /*可参与人群单选change*/
  let onCheckThrongChange = (e) => {
    let value = e.target.value
    setCheckThrong(value)
  }
  /*关闭人群弹窗*/
  let onHideThrong = (e) => {
    console.log(e)
    if (throngType === 1) {
      setActivityThrongList(e || [])
    } else {
      setUnActivityThrongList(e || [])
    }
    setList([])
    setThrongVisible(false)
  }
  /*选择可参与人群*/
  let onPickThrong = () => {
    setThrongType(1)
    setThrongVisible(true)
    setList(activityThrongList)
  }
  /*选择排除人群*/
  let onPickUnThrong = () => {
    setThrongType(2)
    setThrongVisible(true)
    setList(unActivityThrongList)
  }
  return (
    <>
      {/*选择人群*/}
      <SelectActivityThrong
        list={list}
        throngType={throngType}
        onHideThrong={onHideThrong}
        throngVisible={throngVisible}
      />
      <Modal
        width={1000}
        title="复制"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <div className={styles.copy_modal_by}>
          <Form form={form} onFinish={onSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
            <Form.Item label="选择可参与人群：" name='isCheckThrong' className={styles.form__item} rules={[{ required: true, message: "请选择渠道" }]}>
              <Radio.Group onChange={onCheckThrongChange}>
                <Radio value={0}>全部人群</Radio>
                <Radio value={1}>自定义人群</Radio>
              </Radio.Group>
            </Form.Item>
            {
              checkThrong === 1 ? <Form.Item className={styles.form_item_check}>
                <Button type="primary" onClick={onPickThrong} className={styles.form_item_check_btn}>选择人群</Button>
                {activityThrongList.length > 0?<span className={styles.form_item_check_title}>已选择：</span>:null}
                {
                  activityThrongList.length > 0 && activityThrongList.map((item, key) => {
                    return <span>{item.throngName} {item.count}人；</span>
                  })
                }
              </Form.Item> : null
            }
            <Form.Item className={styles.form_item_check}>
              <span>
                <Tooltip title="排除的人群没法参与活动">
                  <InfoCircleOutlined className={styles.wrap2_ico} />
                </Tooltip>
                排除人群：
              </span>
              <Button type="primary" onClick={onPickUnThrong} className={styles.form_item_check_btn}>选择人群</Button>
              {unActivityThrongList.length > 0?<span className={styles.form_item_check_title}>已选择：</span>:''}
              {
                unActivityThrongList.length > 0 && unActivityThrongList.map((item, key) => {
                  return <span>{item.throngName} {item.count}人；</span>
                })
              }
            </Form.Item>

            <Form.Item name="internalName" label="活动内部名称：" className={styles.form__item} rules={[{ required: true, message: "请填写活动内部名称" }]}>
              <Input maxLength="20" />
            </Form.Item>

            <Form.Item name="displayName" label="活动展示名称：" help='该信息会展示在用户端标题处' className={styles.form__item} rules={[{ required: true, message: "请填写活动展示名称" }]}>
              <Input maxLength="20" />
            </Form.Item>

            <Form.Item name="activityTime" label="活动时间：" className={styles.form__item} rules={[{ required: true, message: "请选择活动时间" }]}>
              <RangePicker locale={locale} showTime format="YYYY-MM-DD HH:mm:ss" className={styles.form_item_width2} />
            </Form.Item>
            <Row justify="center" align="center" className={styles.form__item2}>
              <Space size={20}>
                <Button onClick={onCancel}>取消</Button>
                <Button type="primary" htmlType="submit">确定</Button>
              </Space>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  )
};
export default connect(({ copyModal }) => ({
}))(copyModalPage)
