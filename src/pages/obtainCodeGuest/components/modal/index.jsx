import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { connect, history } from 'umi';
import style from "./style.less"
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './canvasUtils'
import { Form, Input, Table, Modal, message, Select, Radio, Row, Col, Tooltip, Typography, Slider, Button, InputNumber, Divider, Space } from "antd"
import { QuestionCircleOutlined,RedoOutlined ,UndoOutlined} from '@ant-design/icons';
import PosterChange from '../../../informationManager/components/posterChange';
import { dataURLtoFile, readFile } from '@/utils/utils'
const { Option } = Select
const { TextArea } = Input;
let croppedImage = '';
let backgroundUrl = '';
let imgSet = {
  width: 220,
  height:240,
}
let reactEasyCrop_CropArea = '';
const modal = (props) => {
  let statusArr = [{
    id: 1,
    title: '绑定'
  }, {
    id: 2,
    title: '关注'
  }, {
    id: 6,
    title: '注册'
  }, {
    id: 7,
    title: '其他'
  }, {
    id: 8,
    title: '企微二维码'
  }]
  let codeArr = [{
    id: 0,
    title: '永久'
  }, {
    id: 1,
    title: '限时'
  }]
  let { dispatch, mdalInfo, toFatherValue } = props,
    [form] = Form.useForm()
  const [stateValue, setStateValue] = useState(0) //显示状态
  const [addCodeValue, setAddCodeValue] = useState(0);//添加卡券单选
  const [addBgvalue, setAddBgValue] = useState(0); //背景单选
  const [defultValue, setDefultValue] = useState(0); //默认海报单选
  const [changePosterModal, setChangePosterModal] = useState('');
  const [spanList, setSpanList] = useState('')//选择宣传海报回调
  const [userType, setUserType] = useState(0);// 判断用户状态
  const [enableBg, setEnableBg] = useState(0);// 是否启用背景
  const [showCode, setShowCode] = useState(0);// 是否展示二维码
  const [addCode, setAddCode] = useState(0);// 是否添加卡券
  const [validDay, setValidDay] = useState(0);// 二维码有效天
  const [validHour, setValidHour] = useState(0);// 二维码有效小时
  const [wechatList, setWechatList] = useState([]);// 微信公众号列表
  const [maxHour, setMaxHour] = useState(24);// 小时
  const [maxDay, setMaxDay] = useState(30);//
  const [disHour, setDisHour] = useState(false);//
  const [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || '')
  const [codeObj,setCodeObj] = useState({
    width: '100%',
    height: '100%',
  })

  const [payload, setPayload] = useState({
    channelId,
  })
  //新增
  const add = (params) => {

    dispatch({
      type: 'obtainCodeGuest/addSaveQrGuide',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success(res.result.message)
          toFatherValue(true)
        } else {
          message.success(res.result.message)
        }
      }
    })
  }
  // 查询详情
  let getNewsDetails = (record) => {
    dispatch({
      type: 'obtainCodeGuest/editDetail',
      payload: {
        method: 'get',
        params: {
          objectId: record
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          if (res.body.data.posterTitle) {
            getValue({
              name: res.body.data.posterTitle,
              id: res.body.data.posterId,
            });
          }

          setStateValue(res.body.data.isDefault)
          setAddCodeValue(res.body.data.isCard)
          setAddBgValue(res.body.data.backgroundFalg)
          setEnableBg(res.body.data.backgroundFalg)
          setDefultValue(res.body.data.posterLockFlag)
          checkCustomerRelationType(res.body.data.customerRelationType)
          termOfValidity(res.body.data.validityType)
          setUserType(res.body.data.customerRelationType)
          setDay(res.body.data.validityTimeDay)
          if(res.body.data.validityTimeDay == 30){
            setDay(30)
            setDisHour(true)
          }else{
            setDisHour(false)
            setHour(res.body.data.validityTimeHour)
          }
          setImageSrc(res.body.data.backgroundUrl)
          // handleChange(res.body.data.iconUrl, 'upload')
          form.setFieldsValue({
            customerRelationType: res.body.data.customerRelationType,
            qrTitle: res.body.data.qrTitle,
            qrDesc: res.body.data.qrDesc,
            qrUrl: res.body.data.qrUrl,
            wechatId: res.body.data.wechatId,
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  useEffect(() => {
    setStateValue(0)
    setAddCodeValue(0)
    setAddBgValue(0)
    setDefultValue(0)
    setShowCode(0)
    if (mdalInfo.modalName == 'edit') {
      getNewsDetails(mdalInfo.objectId)
    }
  }, [])


  //显示状态
  const onChange = (e) => {
    setStateValue(e.target.value);
  };
  //添加卡券
  let onChangeAddCode = e => {
    setAddCode(e.target.value)
    setAddCodeValue(e.target.value);
  };
  //启用背景
  const onChangeAddBg = e => {
    setEnableBg(e.target.value)
    setAddBgValue(e.target.value);
  };
  //锁定海报
  const onChangeDefault = e => {
    setDefultValue(e.target.value);
  };
  //二维码有效天
  const setDay = e => {
    console.log(e == 30,"e",e)
    if(e == 30){
      setMaxHour(0)
      setValidHour(0)
      setDisHour(true)
    }else{
      // setMaxHour(24)
      setDisHour(false)
    }
    setValidDay(e)
  };
  //二维码有效小时
  const setHour = e => {

    setValidHour(e)
  };

  //客户所属状态
  const checkCustomerRelationType = (e) => {
    setUserType(e)
    e == 1 || e == 2 ? dispatch({
      type: 'obtainCodeGuest/getWechatList',
      payload: {
        method: 'postJSON',
        params: {}

      },
      callback: res => {
        if (res.result.code == '0') {
          setWechatList(res.body.list)
        }
      }
    }) : e == undefined ? setUserType(0) : ""
  };


  //二维码有效期
  const termOfValidity = (e) => {
    e == 1 ? setShowCode(1) : ""
    setShowCode(e)
  };

  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pixelCrop, setPixelCrop] = useState(null)

  const onCropComplete = useCallback((croppedArea, pixelCrop) => {
    reactEasyCrop_CropArea = document.querySelector('.reactEasyCrop_CropArea');
    setCodeObj({
      width:reactEasyCrop_CropArea.clientWidth/3,
    });
    setPixelCrop(pixelCrop)
  }, [])

  const showCroppedImage = () => {

    return new Promise(async (resolve, reject) => {
      croppedImage = await getCroppedImg(

          {imageSrc,
          pixelCrop,
          rotation,
          width:imgSet.width,
          height:imgSet.height,
        }

      )
      resolve(croppedImage)
    })
  }
  //上传图片
  const uploadImg = (download) => {
    return new Promise(async (resolve, reject) => {
      let base64 = await showCroppedImage(); //图片路径
      let file = dataURLtoFile(base64, 'image.jpg');
      let formData = new FormData();
      formData.append("files", file);
      // return;
      dispatch({
        type: 'obtainCodeGuest/uploadIcon',
        payload: {
          method: 'upload',
          params: formData,
        },
        callback: (res) => {
          if (res.code == 'S000000') {
            if(download){
              // window.open(res.items)
              let a = document.createElement('a');
              a.href = res.items;
              a.download = 'img.jpg';
              a.click();
            }
            backgroundUrl = res.items;
            resolve();
          }
        }
      })
    })
  }

  const onFileChange = async e => {
    let files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0]
      // if(file.size/1024 > 400){
      //   message.warning("图片大小不能超过400kb");
      //   return;
      // }
      let imageDataUrl = await readFile(file)
      let _image = new Image();
      _image.src=imageDataUrl;
      _image.onload=()=>{
        if(_image.width<660 || _image.height<720){
          message.warning("图片尺寸不符合,尺寸太小");
        }else{
          setImageSrc(imageDataUrl)
        }
      }
    }
  }


  //保存编辑
  let submitEvent = async (json) => {
    if (addBgvalue == 1 ) {//启用背景
      if(!imageSrc){
        message.warning("请选择图片");
        return;
      }
      await uploadImg();
    }
    // param.channelId = channelId
    let param = JSON.parse(JSON.stringify(json))
    param.posterId = spanList?spanList.id:null
    param.backgroundUrl = backgroundUrl
    console.log(backgroundUrl,imageSrc)

    param.validityType = 0
    if (mdalInfo.modalName != 'add') {
      param.objectId = mdalInfo.objectId
    }
    param.isDefault = stateValue
    param.isCard = addCodeValue
    param.backgroundFalg = addBgvalue
    param.posterLockFlag = defultValue
    param.validityType = showCode
    if(!(showCode == 0)){
      if(validDay == 0 && validHour == 0) return message.warning("限时时间不能为空")
      param.validityTimeDay = validDay
      param.validityTimeHour = validHour
    }

    add(param)
  }

  // 选择海报
  let changePoster = () => {
    setChangePosterModal({ modalName: 'changePost' })
  }

  //关闭选择宣传海报弹框
  let callModalPoster = () => {
    setChangePosterModal('')
  }

  //接受子组件传过来的值
  let getValue = (value) => {
    form.setFieldsValue({
    })
    setSpanList(value)
  }
  //顺时针90°
  const rotationClick=()=>{
    let num = rotation+90;
    setRotation(num);
  }
  //逆时针90°
  const UnRotationClick=()=>{
    let num = rotation-90;
    setRotation(num);
  }


  return (
    <>
      {/* 新增角色 */}
      <Modal title={mdalInfo.modalName == 'add' ? '新增获客码引导内容' : '编辑获客码引导内容'}
        width={1000}
        visible={mdalInfo.modalName == 'add' || mdalInfo.modalName == 'edit'}
        footer={null}
        okText={"保存"}
        onCancel={() => { toFatherValue(false) }}
      >
        <Form form={form} onFinish={submitEvent}>
          <Row>
            <Col flex="auto">
              <Form.Item label="客户" name="channelId" labelCol={{ flex: '0 0 120px' }} >
                <Select
                  showSearch
                  notFoundContent='暂无数据'
                  placeholder="输入客户可筛选"
                  optionFilterProp="children"
                  disabled
                  defaultValue={JSON.parse(localStorage.getItem('tokenObj')).channelName}
                >
                </Select>
              </Form.Item>
              <Form.Item label="标题" name="qrTitle" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Input placeholder="请输入" maxLength={20} />
              </Form.Item>
              <Form.Item label="描述" name="qrDesc" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <TextArea showCount maxLength={64} placeholder="请输入" />
              </Form.Item>
              <Form.Item label="默认显示" labelCol={{ flex: '0 0 120px' }}>
                <Radio.Group onChange={onChange} value={stateValue}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="客户所属状态" name="customerRelationType" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                <Select placeholder="不限" allowClear onChange={checkCustomerRelationType}>
                  {
                    statusArr.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item label={
                    <div>
                      二维码有效期&nbsp;
                      <Tooltip placement="bottom" title={'1、二维码有效期，即掌客通小程序中每次加载出来的引导用户关注公众号的二维码有效期时长，如关注获客码，绑定获客码了；\n 2、二维码有效期默认永久，可选择限时二维码，限时二维码的有效期可编辑范围为“0天1小时~30天0小时'}>
                        <QuestionCircleOutlined style={{ color: "#b5a8a8" }} />
                      </Tooltip>
                    </div>
                  } labelCol={{ flex: '0 0 120px' }} >
                    <Select defaultValue="永久" onChange={termOfValidity} value={showCode} defaultValue={0}>
                      {
                        codeArr.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.title}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                </Col>
                {
                  showCode == 1 ?
                    <Col span={12}>
                      <Row>
                        <Col  style={{ marginLeft: "15px" }}>
                          <Form.Item  >
                            <InputNumber min={0} max={30} onChange={setDay} value={validDay} defaultValue={validDay} /> 天
                          </Form.Item>
                        </Col>
                        <Col  style={{ marginLeft: "15px" }}>
                          <Form.Item  >
                            <InputNumber min={0} max={23} onChange={setHour} value={validHour} defaultValue={validHour}  disabled={disHour}/> 小时
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col> : ''
                }
              </Row>

              {
                userType == 1 || userType == 2 ?
                  <Form.Item label="关联公众号" name="wechatId" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                    <Select
                      allowClear
                      notFoundContent='暂无数据'
                      optionFilterProp="children"
                    >
                      {
                        wechatList.map((item, key) => {
                          return <Option key={key} value={item.objectId}>{item.wechatAppName}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  :
                  userType == 6 || userType == 7 || userType == 0 ?
                    <Form.Item label="URL：" name="qrUrl" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
                      <Input placeholder="请输入"></Input>
                    </Form.Item> : null
              }
              {
                userType != 8 ? <Form.Item label="允许添加卡券" labelCol={{ flex: '0 0 120px' }} >
                  <Radio.Group onChange={onChangeAddCode} value={addCodeValue}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item> : null
              }
              <Form.Item label="启用背景" labelCol={{ flex: '0 0 120px' }} >
                <Radio.Group onChange={onChangeAddBg} value={addBgvalue}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              {
                enableBg == 1 ?
                  <Form.Item label="背景图片" name="backgroundUrl" labelCol={{ flex: '0 0 120px' }}>
                    <input type="file" onChange={onFileChange} accept="image/*" />
                    <div>（背景图片建议规格： 尺寸：662 X 721，格式：jpg，大小：不超过400kb）</div>
                  </Form.Item>
                  : enableBg == 2
              }

              <Form.Item label="默认宣传海报" name="showPg" labelCol={{ flex: '0 0 120px' }} >
                <Button type="primary" onClick={() => { changePoster() }}>
                  选择宣传海报
                </Button>
                {spanList ? <span><span className={style.fontNameSize}>{spanList.name}</span> <span className={style.fontSize} onClick={() => { setSpanList(null) }}>X</span></span>
                  : ''}
              </Form.Item>

              <Form.Item label={
                <div>
                  锁定默认海报&nbsp;
                  <Tooltip placement="bottom" title={'1、在设置过默认宣传海报的前提下，锁定默认海报，则销售人员在“掌客通-小程序”上直接选择该获客码进行生成海报操作，直接显示默认宣传海报且不允许更换海报和二维码；\n 2、当没有设置默认宣传海报时，则锁定默认海报功能无效。'}>
                    <QuestionCircleOutlined style={{ color: "#b5a8a8" }} />
                  </Tooltip>
                </div>
              } labelCol={{ flex: '0 0 120px' }}>
                <Radio.Group onChange={onChangeDefault} value={defultValue}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>

            </Col>

            <Col flex="0 0 260px" className={style.image_box}>
              <div className={style.big_bg_box}>
                <div className={style.bg_box}>
                  <div className={style.ceopper_box}>
                    {
                      enableBg == 1 ?
                      <Cropper
                      image={imageSrc}
                      crop={crop}
                      rotation={rotation}
                      zoom={zoom}
                      minZoom={1}
                      aspect= {2.2/2.4}
                      // cropSize={{width:imgSet.width,height:imgSet.height}}
                      onCropChange={setCrop}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      showGrid={false}
                    />:""
                    }
                  </div>
                </div>

                {enableBg == 1 ?
                  <div className={style.zoom_box}>
                    <div className={style.zoom_box}>
                    <div className={style.zoom_item1}>
                        <UndoOutlined onClick={UnRotationClick}/>
                        <RedoOutlined onClick={rotationClick} style={{ marginLeft: "15px" }}/>
                      </div>
                      <div className={style.zoom_item}>
                        <Slider
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(zoom) => setZoom(zoom)}
                        />
                      </div>
                    </div>
                  </div>
                  : enableBg == 0
                }

                <div>
                  {addCode == 1 ?
                    <div>
                      <div >绑定赠送卡券</div>
                      <Divider />
                    </div>
                    : addCode == 0
                  }
                  <div className={style.buttom_title} onClick={()=>uploadImg(true)}>保存图片</div>
                  <div >查看更多获客码</div>
                </div>

                <div className={style.code_box}>
                  <img
                    src="https://test1.yltapi.com/uniway/static/imgs/qrcode.png"
                    className={style.image_style} style={{width: codeObj.width}}
                  />
                </div>

              </div>
            </Col>

          </Row>
          <Row justify="end" >
            <Space size={22}>
              <Button htmlType="button" onClick={() => { toFatherValue(false) }}>取消</Button>
              <Button htmlType="submit" type="primary">保存</Button>
            </Space>
          </Row>
        </Form>



      </Modal>
      {changePosterModal ? <PosterChange modalInfo={changePosterModal} channelType={'getCode'} toFatherValue={(flag) => callModalPoster(flag)} getValue={(val) => { getValue(val) }}></PosterChange> : ''}
    </>
  )
}
export default connect(({ obtainCodeGuest }) => ({
}))(modal)







