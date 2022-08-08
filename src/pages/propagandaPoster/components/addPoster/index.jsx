import { UploadOutlined } from '@ant-design/icons'
import { uploadIcon } from '@/services/activity.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { Button, DatePicker, Form, Input, Upload, message, Modal, Radio, Select, Space, Row, Col, Image } from "antd"
import React, { useEffect, useState } from "react"
import { connect } from 'umi'
import style from "./style.less"
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
const { Option } = Select
const newProduct = (props) => {
  const [form] = Form.useForm()
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken }
  let { dispatch, modalInfo, closeModal } = props
  let dateFormat = 'YYYY-MM-DD HH:mm'
  const [categoryList, setCategoryList] = useState([])//海报分类
  const [fileList, setFileList] = useState(null)//图片
  const [salePositionData, setSalePositionData] = useState([])//图片
  const [onOffTime, setOnOffTime] = useState(null)//上架时间
  const [OffTime, setOffTime] = useState(null)//下架时间
  const [onOffTimeStatus, setOnOffTimeStatus] = useState(null)//状态 禁用时间框
  const qrPositionData = [
    { name: '底部居右', value: 'right' },
    { name: '底部居中', value: 'center' },
    { name: '底部居左', value: 'left' }
  ]
  useEffect(() => {
    if (modalInfo.modalName == 'edit') {
      posterDetail({ objectId: modalInfo.info })
    }
    setCategoryList(modalInfo.categoryList)
  }, [])

  let submitEvent = (param) => {
    console.log(param, "param");
    if(param.posterStatus == 1 && onOffTime == null){
      return message.warn("请选择上架时间！")
    }
    if (fileList == null) {
      return message.warn("请上传海报图片！")
    }
    console.log(OffTime,onOffTime,OffTime>onOffTime);
    let nowDate = moment(new Date()).format('YYYY-MM-DD HH:mm')
    if(OffTime<onOffTime){
      return message.error("下架时间不能小于上架时间！")
    }
    if(nowDate>onOffTime){
      return message.error("上架时间不能小于当前时间！")
    }
    let pm = JSON.parse(JSON.stringify(param));
    if (modalInfo.modalName == 'edit') {
      pm.objectId = modalInfo.info
    }
    if (param.posterStatus == 1) {
      pm.onshelfTimeStr = onOffTime
    }
    pm.offshelfTimeStr = OffTime
    pm.posterUrl = fileList
    console.log(pm)
    addPoster(pm)
  }

  // 海报详情
  let posterDetail = (param) => {
    dispatch({
      type: 'propagandPoster/posterDetail',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        console.log("res", res);
        if (res.result.code == '0') {
          let forms = res.body
          onQrcode(forms.layouts[0].cssPosition)
          putOnTimeOnChange(forms.posterStatus)
          let flag = false;
          if (forms.onshelfTimeStr != null) {
            flag = true
            setOnOffTime(forms.onshelfTimeStr)
            putOnTimeOnChange(1)
          }
          setOffTime(forms.offshelfTimeStr)
          // if (forms.posterStatus == 1) {
          //   console.log(forms.onshelfTimeStr);
          //   setOnOffTime(forms.onshelfTimeStr)
          //   setOffTime(forms.offshelfTimeStr)
          // }
          setFileList(forms.posterUrl)

          form.setFieldsValue({
            posterTitle: forms.posterTitle,
            posterCategoryId: forms.posterCategoryId,
            posterStatus: flag ? 1 : forms.posterStatus,
            qrCodePosition: forms.layouts[0].cssPosition,
            salePosition: forms.layouts[1].cssPosition,
            isHot: forms.isHot,
          })

        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 新增海报
  let addPoster = (param) => {
    dispatch({
      type: 'propagandPoster/saveOrUpdatePoster',
      payload: {
        method: 'postJSON',
        params: param
      },
      callback: res => {
        if (res.result.code == '0') {
          message.success(res.result.message)
          closeModal()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let handleChange = (value) => {
    if (value.file.status == 'done') {
      setFileList(value.file.response.items);
    }
  }

  let removeImage = () => {
    setFileList('')
  }

  let onQrcode = (e) => {
    console.log(e);
    if (e === 'center') {
      setSalePositionData([
        { name: '宣传海报下方', value: 'bottom' },
        { name: '二维码左侧', value: 'left' },
        { name: '二维码右侧', value: 'right' },
      ])
    } else if (e === 'left') {
      setSalePositionData([
        { name: '宣传海报下方', value: 'bottom' },
        { name: '二维码右侧', value: 'right' },
      ])
    } else {
      setSalePositionData([
        { name: '宣传海报下方', value: 'bottom' },
        { name: '二维码左侧', value: 'left' },
      ])
    }
  }

  let putOnTimeOnChange = (e) => {
    if (e != 1) {
      setOnOffTime(null)
    }
    setOnOffTimeStatus(e)
  }

  let offshelfOnChange = (e) => {
    setOffTime(e == null ? null : e.format('YYYY-MM-DD HH:mm'))
  }

  let onOffshelfOnChange = (e) => {
    setOnOffTime(e == null ? null : e.format('YYYY-MM-DD HH:mm'))
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('minute');
  }

  return (
    <>
      <Modal
        width={1000}
        title={modalInfo.modalName == 'add' ? "新增海报" : "编辑海报"}
        maskClosable={false}
        visible={modalInfo.modalName ? true : false}
        footer={null}
        onCancel={() => closeModal()}
      >
        <Form form={form} onFinish={submitEvent}>
          <Row>
            <Col flex="auto">
              <Form.Item label="海报标题" name="posterTitle" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="海报分类" name="posterCategoryId" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Select
                  showSearch
                  notFoundContent='暂无数据'
                  placeholder="请选择"
                >
                  {
                    categoryList && categoryList.length ? categoryList.map((item, key) => {
                      return <Option value={item.objectId}>{item.categoryName}</Option>
                    }) : ''
                  }
                </Select>
              </Form.Item>

              <Form.Item label="上架时间" name="posterStatus" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Radio.Group onChange={(e) => putOnTimeOnChange(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value={2}>立即上架</Radio>
                    <Radio value={1}>预上架，自定义上架时间
                    </Radio>
                    <Radio value={4}>暂不上架</Radio>
                  </Space>

                </Radio.Group>
              </Form.Item>
              <Form labelCol={{ flex: '0 0 120px' }} className={style.datePicks} rules={[{ required: true }]}>
                <DatePicker disabledDate={disabledDate} showTime onChange={onOffshelfOnChange} disabled={onOffTimeStatus != 1} value={onOffTime ? moment(onOffTime, dateFormat) : null} defaultValue={onOffTime ? moment(onOffTime, dateFormat) : null} format={dateFormat} />
              </Form>
              <Form.Item label="下架时间" name="offshelfTimeEnd" labelCol={{ flex: '0 0 120px' }} >
                预下架，自定义下架时间<DatePicker disabledDate={disabledDate} showTime onChange={offshelfOnChange} value={OffTime ? moment(OffTime, dateFormat) : null} defaultValue={OffTime ? moment(OffTime, dateFormat) : null} format={dateFormat} />
              </Form.Item>
              <Form.Item label="二维码位置" name="qrCodePosition" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Select
                  showSearch
                  notFoundContent='暂无数据'
                  placeholder="请选择"
                  onChange={onQrcode}
                >
                  {qrPositionData.map(item => {
                    return <Option value={item.value}>{item.name}</Option>
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="销售信息位置" name="salePosition" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Select
                  showSearch
                  notFoundContent='暂无数据'
                  placeholder="请选择"
                >
                  {salePositionData.map(item => {
                    return <Option value={item.value}>{item.name}</Option>
                  })}
                </Select>
              </Form.Item>

              <Form.Item label="是否为热门推荐" name="isHot" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Radio.Group >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col flex="0 0 260px" className={style.image_box}>
              <Row>
                <div className={style.allcol}>
                  <div className={style.yulantu}>海报预览图</div>
                  <div >
                    <img width={258}
                      height={377}
                      className={style.images}
                      src={fileList}
                    />
                  </div>
                </div>
              </Row>
              <Row>
                <div className={style.allcols}>
                  <div>
                    <Upload
                      name="files"
                      action={uploadIcon}
                      headers={headers}
                      onChange={handleChange}
                      onRemove={removeImage}
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>上传图片</Button>
                    </Upload>
                    <p>建议尺寸：1080X1920px</p>
                  </div>
                </div>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <div >
              <Button htmlType="submit" type="primary" className={style.confirm_btn}>保存</Button>
              <Button htmlType="button" onClick={() => closeModal()}>取消</Button>
            </div>
          </Row>

        </Form>
      </Modal>
    </>
  )
};
export default connect((productMange) => ({
}))(newProduct)
