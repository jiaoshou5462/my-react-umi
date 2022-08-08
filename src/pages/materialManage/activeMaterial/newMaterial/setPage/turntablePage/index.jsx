import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Switch, Row, Col, Modal, Tabs, Select, message,Form, Upload, Button , Input, Radio } from "antd"
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import SetColor from '../../components/setColor';   //选择颜色组件
import TurntableHomeReview from "../../components/turntableHomePreview";
import TurntableGamePreview from "../../components/turntableGamePreview";
import { UploadOutlined } from '@ant-design/icons';

import { uploadIcon } from '@/services/activity.js';

const turbtalePageMeterial = (props) => {
  let [form] = Form.useForm()
  let { dispatch,submitBasicMaterialData,basicMaterialData,basicValidSubmit} = props;
  // 全部字段初始化
let [homeDataInit,setHomeDataInit] = useState({
  homeBackgroundImage:'',
  homeBelowBackgroundColor:'#ffffff',
  homeParticipateButtonBackgroundColor:'#D8D8D8',
  homeParticipateButtonFontColor:'#868686',
  homePeripheralOperationColor:'#868686',
  homePeripheralOperationBackgroundColor:'',
  homeAdStyleSelectType:2,
  homeAdStyle:null,
  isShare:1,
  isHomeAdPreviewShow:1,
  activityRuleUniteStyle:null,
  winUniteStyle:null,
  lotteryAllStyle:null,
  isBackClore:false,
  activityRuleUniteStyleType:2,
  activityRuleUniteStyle:null,
  lotteryAllStyleType:2,
  lotteryAllStyle:null,
  winUniteStyleType:2,
  winUniteStyle:null
})

let [gameDataInit, setGameDataInit] = useState({
  turntableBackgroundImage:'',
  turntableLuckyDrawFontColor:'#666',
  turntableLuckyDrawBackgroundColor:'',
  isBackCloreGame:false,
  tunTypeValueSelect:2,
  turntableDiskStyle:null,
  tunTypeValueSelect2:2,
  turntablePointerStyle:null,
  inviteFriendsTypeStyle:null,
  firendSelectType:2,
  shareSelectType:2,
  turntableInviteFriendsStyle:null,
  gameAdStyleSelectType:2,
  isTaskStyle:null,
  isInviteBuddy:1,
  isSpecifyLink:1,
  inviteFriends:1
})
useEffect(()=>{
  form.setFieldsValue({
    tunTypeValueSelect:2,
    tunTypeValueSelect2:2,
    firendSelectType:2,
    shareSelectType:2,
    gameAdStyleSelectType:2,
    activityRuleUniteStyleType:2,
    lotteryAllStyleType:2,
    winUniteStyleType:2,
    homeAdStyleSelectType:2
  })
},[])

 
/* ===首页配置=== */
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  // 上传背景图校验
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  // 图片上传字段赋值
  let handleChangeHome = (info,type) => {
    if (info.file.status === 'done') {
      homeDataInit[type] = info.file.response.items
      setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
    }else if(info.file.status === 'error'){
      message.error('上传失败')
    }
  };
  // 首页颜色更改
  let setMcolor = (n,i) => {
    homeDataInit[n] = i 
    setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
  }
   //是否需透明底
   let onBackCloreChange = (value) => {
    homeDataInit.isBackClore = value
    homeDataInit.homePeripheralOperationBackgroundColor = value?'rgb(0,0,0,0.3)':''
    setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
  }
  // 选择本地还是通用
  let localeOrCommonHomeSelectChange = (e,selectType,type)=>{
    homeDataInit[selectType] = e.target.value
    homeDataInit[type] = ''
    let setFieldsData = Object.assign({},homeDataInit,gameDataInit)
    form.setFieldsValue(setFieldsData)
    setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
  }  
  // 通用样式选择
  let commonHomeSelectChange = (e,type) => {
    homeDataInit[type] = e.target.value
    setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))

  }
  /* ===游戏页配置=== */
  // 背景上传 
  let beforeUploadGame = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChangeGame = (info,type) => {
    if (info.file.status === 'done') {
      gameDataInit[type] = info.file.response.items
      setGameDataInit(JSON.parse(JSON.stringify(gameDataInit)))
    }else if(info.file.status === 'error'){
      message.error('上传失败')
    }
  };
  //颜色更改
  let setGameMcolor = (n,i) => {
    gameDataInit[n] = i
    setGameDataInit(JSON.parse(JSON.stringify(gameDataInit)))
  }
  // 剩余机会
  let onBackchanceChange = (value) => {
    gameDataInit.isBackCloreGame = value
    gameDataInit.turntableLuckyDrawBackgroundColor = value?'rgb(0,0,0,0.3)':''
    setGameDataInit(JSON.parse(JSON.stringify(gameDataInit)))
  }
   // 游戏页选择本地或通用
   let localeOrCommonGameSelectChange = (e,selectType,type) => {
    gameDataInit[selectType] = e.target.value
    gameDataInit[type] = ''
    let setFieldsData = Object.assign({},homeDataInit,gameDataInit)
    form.setFieldsValue(setFieldsData)
    setGameDataInit(JSON.parse(JSON.stringify(gameDataInit)))
  }
  // 通用样式选择
  let commonGameSelectChange = (e,type) => {
    gameDataInit[type] = e.target.value
    setGameDataInit(JSON.parse(JSON.stringify(gameDataInit)))
  }
  
 /* 弹窗字段更改 */
 let localeOrCommonSelectChange = (e,selectType,type) => {
  homeDataInit[selectType] = e.target.value
  homeDataInit[type] = ''
  let setFieldsData = Object.assign({},homeDataInit,gameDataInit)
  form.setFieldsValue(setFieldsData)
  setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
 }
 let commonSelectChange = (e, type) => {
  homeDataInit[type] = e.target.value
  setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
 }

// 必填字段是否都必填，必填之后保存素材
  let [configvalid,setConfigValid] = useState(false)
  let setConfigSubmit = () => {
  form.validateFields().then(values => {
    setConfigValid(true)
  })
  .catch(errorInfo => {
    setConfigValid(false)
  });
  }
  let setPageSave = () => {
    submitBasicMaterialData()
    setConfigSubmit()
  }
  useEffect(()=>{
    let saveMaterialData = Object.assign({},homeDataInit,gameDataInit)
    if(basicValidSubmit && configvalid){
      basicMaterialData.styleValue = JSON.stringify(saveMaterialData)
      dispatch({
        type: 'activeMaterial/saveOrUpdate',
        payload: {
          method: 'postJSON',
          params: basicMaterialData
        },
        callback: (res) => {
          if(res.code === '0000') {
            let mesText = basicMaterialData.materialId?'编辑成功':'创建成功'
            message.success(mesText)
            setTimeout(()=>{
              history.goBack()
              setConfigValid(false)
            },2000)
          }else{
            message.error(res.message)
            setConfigValid(false)
          }

        }
      })
    }
  },[basicValidSubmit,configvalid])
// 页面存在操作之后。保存按钮亮起
  let [operaCount,setOperaCount] = useState(0)
  useEffect(()=>{
    if(basicMaterialData.styleValue){
      let styleValue = JSON.parse(basicMaterialData.styleValue)
      for(let x in homeDataInit){
        homeDataInit[x] = styleValue[x]
        if(x=='isBackClore'){
          homeDataInit[x] = styleValue.homePeripheralOperationBackgroundColor?true:false
        }
      }
      for(let x in gameDataInit){
        gameDataInit[x] = styleValue[x]
        if(x=='isBackCloreGame'){
          gameDataInit[x] = styleValue.turntableLuckyDrawBackgroundColor?true:false
        }
      }
      setHomeDataInit(JSON.parse(JSON.stringify(homeDataInit)))
      setGameDataInit(JSON.parse(JSON.stringify(gameDataInit)))
      form.setFieldsValue(styleValue)
    }
    if(basicMaterialData.materialId){
      operaCount++
    }else{
      operaCount = operaCount+2
    }
    setOperaCount(operaCount>10?10:operaCount)
  },[basicMaterialData])
  useEffect(()=>{
    operaCount++
    setOperaCount(operaCount>10?10:operaCount)
  },[homeDataInit,gameDataInit])
  // 保存按钮是否高亮
  let [cancelSaveVisible,setCancelSaveVisible] = useState(false)
  let cancelPageSave = () => {
    if(operaCount>3){
      setCancelSaveVisible(true)
    }else{
       history.goBack()
    }
  }
  let cancelSaveHandleOk = () => {
    setCancelSaveVisible(false)
    history.goBack()
  }
  let cancelSaveHandleCancel = () => {
    setCancelSaveVisible(false)
  }

  return (
    <>
      <Form  form={form}  label >
        <div className={style.sub_content}>
            <div className={style.sub_tag_title}>页面元素配置</div>
            <div className={style.homePage}>
              <div className={style.homePage_set}>
                <div className={style.sub_part_title}>首页</div>
                <Row>
                  <Col span={8}>
                    <div className={style.image_content}>
                      <span><i>*</i>背景图：</span>
                      {homeDataInit.homeBackgroundImage?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={homeDataInit.homeBackgroundImage}/>:null}
                    </div>
                    <Form.Item className={style.image_upload} name='homeBackgroundImage' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：750px*1624px" rules={[{ required: true, message: "请上传背景图" }]}>
                      <Upload
                        name="files"
                        action={uploadIcon}
                        beforeUpload={beforeUpload}
                        onChange={(file)=>handleChangeHome(file,'homeBackgroundImage')}
                        headers={headers}>
                        <Button  icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div className={style.image_content}>
                      <span><i>*</i>周边操作：</span>
                    </div>
                    <div className={style.set_part}>
                      <Form.Item  name='homePeripheralOperationColor' label="字体颜色" >
                        <SetColor colors={homeDataInit.homePeripheralOperationColor} colorName='homePeripheralOperationColor' setMColor={setMcolor} />
                      </Form.Item>
                      <Form.Item  name='isBackClore' label="是否需透明底" >
                        <Switch  checkedChildren="开" unCheckedChildren="关" checked={homeDataInit.isBackClore} onChange={onBackCloreChange} />
                      </Form.Item>
                      {homeDataInit.isBackClore?<Form.Item  name='homePeripheralOperationBackgroundColor' label="背景颜色">
                        <SetColor colors={homeDataInit.homePeripheralOperationBackgroundColor} colorName='homePeripheralOperationBackgroundColor' setMColor={setMcolor} />
                      </Form.Item>:null}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={style.image_content}>
                      <span><i>*</i>参与按钮</span>
                    </div>
                    <div className={style.set_part}>
                      <Form.Item  name='homeParticipateButtonFontColor' label="字体颜色" >
                        <SetColor colors={homeDataInit.homeParticipateButtonFontColor} colorName='homeParticipateButtonFontColor' setMColor={setMcolor} />
                      </Form.Item>
                      <Form.Item  name='homeParticipateButtonBackgroundColor' label="背景颜色">
                        <SetColor colors={homeDataInit.homeParticipateButtonBackgroundColor} colorName='homeParticipateButtonBackgroundColor' setMColor={setMcolor} />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item  name='homeAdStyleSelectType' label="广告位" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                      <Radio.Group value={homeDataInit.homeAdStyleSelectType} onChange={(e)=>localeOrCommonHomeSelectChange(e,'homeAdStyleSelectType','homeAdStyle')}>
                        <Radio value={1}>本地上传</Radio>
                        <Radio value={2}>通用模板</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {homeDataInit.homeAdStyleSelectType===1?<div style={{overflow:'auto',marginLeft:'120px'}}>
                       <div className={style.image_content}>
                          {homeDataInit.homeAdStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={homeDataInit.homeAdStyle}/>:null}
                        </div>
                        <Form.Item className={style.image_upload} name='homeAdStyle' labelCol={{flex:'0 0 120px'}} extra="建议尺寸：290px*94px" rules={[{ required: true, message: "请上传图片" }]}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(file)=>handleChangeHome(file,'homeAdStyle')}
                            headers={headers}>
                            <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                      </div>:
                      <div style={{overflow:'auto',marginLeft:'120px'}} >
                        <Form.Item name="homeAdStyle" label=""  rules={[{ required: true, message: "请选择模板" }]}>
                            <Radio.Group className={style.side_adver_list} value={homeDataInit.homeAdStyle} onChange={(e)=>commonHomeSelectChange(e,'homeAdStyle')}>
                              <Radio value={1} className={style.side_wrap3_li}>样式1
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg1}`}>
                                  <div><h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                              <Radio value={2} className={style.side_wrap3_li}>样式2
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg2}`}>
                                  <div><h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                              <Radio value={3} className={style.side_wrap3_li}>样式3
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg3}`}>
                                  <div><h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                              <Radio value={4} className={style.side_wrap3_li}>样式4
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg4}`}>
                                  <div> <h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                       </div>
                     }
                  </Col>
                </Row>
              </div>
              <div className={style.homePage_review}>
                <TurntableHomeReview homeDataInit={homeDataInit}/>
              </div>
            </div>
            <div className={style.sub_part_title}>游戏页</div>
              <div className={style.homePage}>
                <div className={style.homePage_set}>
                  <Row>
                    <Col span={8}>
                      <div className={style.image_content}>
                        <span><i>*</i>背景图：</span>
                        {gameDataInit.turntableBackgroundImage?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={gameDataInit.turntableBackgroundImage}/>:null}
                      </div>
                      <Form.Item className={style.image_upload} name='turntableBackgroundImage' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：750px*1624px" rules={[{ required: true, message: "请上传图片" }]}>
                        <Upload
                          name="files"
                          action={uploadIcon}
                          beforeUpload={beforeUploadGame}
                          onChange={(file)=>handleChangeGame(file,'turntableBackgroundImage')}
                          headers={headers}>
                          <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <div className={style.image_content}>
                        <span><i>*</i>剩余机会：</span>
                      </div>
                      <div className={style.set_part}>
                        <Form.Item  name='turntableLuckyDrawFontColor' label="字体颜色">
                          <SetColor colors={gameDataInit.turntableLuckyDrawFontColor} colorName='turntableLuckyDrawFontColor' setMColor={setGameMcolor} />
                        </Form.Item>
                        <Form.Item  name='isBackCloreGame' label="是否需透明底">
                          <Switch  checkedChildren="开" unCheckedChildren="关" checked={gameDataInit.isBackCloreGame} onChange={onBackchanceChange} />
                        </Form.Item>
                        {gameDataInit.isBackCloreGame?<Form.Item  name='turntableLuckyDrawBackgroundColor' label="背景颜色">
                          <SetColor colors={gameDataInit.turntableLuckyDrawBackgroundColor} colorName='turntableLuckyDrawBackgroundColor' setMColor={setGameMcolor} />
                        </Form.Item>:null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item  name='tunTypeValueSelect' label="盘面样式" labelCol={{flex:'0 0 120px'}}  rules={[{ required: true, message: "请上传图片" }]} >
                       <Radio.Group value={gameDataInit.tunTypeValueSelect} onChange={(e)=>localeOrCommonGameSelectChange(e,'tunTypeValueSelect','turntableDiskStyle')}>
                          <Radio value={1}>本地上传</Radio>
                          <Radio value={2}>通用模板</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {gameDataInit.tunTypeValueSelect==1?<div style={{overflow:'auto',marginLeft:'120px'}}>
                        <div className={style.image_content}>
                          {gameDataInit.turntableDiskStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={gameDataInit.turntableDiskStyle}/>:null}
                        </div>
                        <Form.Item className={style.image_upload} name='turntableDiskStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：278px*278px" rules={[{ required: true, message: "请上传图片" }]}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUploadGame}
                            onChange={(file)=>handleChangeGame(file,'turntableDiskStyle')}
                            headers={headers}>
                            <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                      </div>:
                      <div style={{overflow:'auto',marginLeft:'120px'}}>
                        <Form.Item  name='turntableDiskStyle' labelCol={{flex:'0 0 120px'}}  rules={[{ required: true, message: "请选择模板" }]}>
                          <Radio.Group value={gameDataInit.turntableDiskStyle} className={style.side_wrap1_list} onChange={(e)=>{commonGameSelectChange(e,'turntableDiskStyle')}}>
                            <Radio value={1} className={style.side_wrap1_li}>样式1
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m20.png')} /></div>
                            </Radio>
                            <Radio value={2} className={style.side_wrap1_li}>样式2
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m21.png')} /></div>
                            </Radio>
                            <Radio value={3} className={style.side_wrap1_li}>样式3
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m22.png')} /></div>
                            </Radio>
                            <Radio value={4} className={style.side_wrap1_li}>样式4
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m26.png')} /></div>
                            </Radio>
                            <Radio value={5} className={style.side_wrap1_li}>样式5
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m27.png')} /></div>
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                      }
                    </Col>
                    <Col span={12}>
                      <Form.Item  name='tunTypeValueSelect2' label="指针样式" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                        <Radio.Group value={gameDataInit.tunTypeValueSelect2} onChange={(e)=>localeOrCommonGameSelectChange(e,'tunTypeValueSelect2','turntablePointerStyle')}>
                          <Radio value={1}>本地上传</Radio>
                          <Radio value={2}>通用模板</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {gameDataInit.tunTypeValueSelect2==1?<div style={{overflow:'auto',marginLeft:'120px'}}>
                        <div className={style.image_content}>
                          {gameDataInit.turntablePointerStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={gameDataInit.turntablePointerStyle}/>:null}
                        </div>
                        <Form.Item className={style.image_upload} name='turntablePointerStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：80px*118px" rules={[{ required: true, message: "请上传图片" }]}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUploadGame}
                            onChange={(file)=>handleChangeGame(file,'turntablePointerStyle')}
                            headers={headers}>
                            <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                      </div>:
                      <div style={{overflow:'auto'}}>
                        <Form.Item name='turntablePointerStyle'style={{overflow:'auto',marginLeft:'120px'}} labelCol={{flex:'0 0 120px'}}   rules={[{ required: true, message: "请选择模板" }]}>
                            <Radio.Group value={gameDataInit.turntablePointerStyle} className={`${style.side_wrap1_list} ${style.side_wrap1_list2}`} onChange={(e)=>{commonGameSelectChange(e,'turntablePointerStyle')}}>
                            <Radio value={1} className={style.side_wrap1_li}>样式1
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m28.png')} /></div>
                            </Radio>
                            <Radio value={2} className={style.side_wrap1_li}>样式2
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m29.png')} /></div>
                            </Radio>
                            <Radio value={3} className={style.side_wrap1_li}>样式3
                              <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m30.png')} /></div>
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item  name='firendSelectType' label="分享好友" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                        <Radio.Group value={gameDataInit.firendSelectType} onChange={(e)=>localeOrCommonGameSelectChange(e,'firendSelectType','inviteFriendsTypeStyle')}>
                          <Radio value={1}>本地上传</Radio>
                          <Radio value={2}>通用模板</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {gameDataInit.firendSelectType==1?<div style={{overflow:'auto',marginLeft:'120px'}}>
                        <div className={style.image_content}>
                          {gameDataInit.inviteFriendsTypeStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={gameDataInit.inviteFriendsTypeStyle}/>:null}
                        </div>
                        <Form.Item className={style.image_upload} name='inviteFriendsTypeStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：290px*40px" rules={[{ required: true, message: "请上传图片" }]}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUploadGame}
                            onChange={(file)=>handleChangeGame(file,'inviteFriendsTypeStyle')}
                            headers={headers}>
                            <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                      </div>:
                      <div style={{overflow:'auto',marginLeft:'120px'}} >
                         <div  className={`${style.side_wrap3_table} ${style.side_wrap3_table2}`}>
                            <Form.Item  name='inviteFriendsTypeStyle' labelCol={{flex:'0 0 120px'}}  rules={[{ required: true, message: "请选择模板" }]}>
                              <Radio.Group value={gameDataInit.inviteFriendsTypeStyle} className={style.side_wrap3_list} onChange={(e)=>{commonGameSelectChange(e,'inviteFriendsTypeStyle')}}>
                                <Radio value={1} className={style.side_wrap3_li}>样式1
                                  <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/pirend_m1.png')}></img></div>
                                </Radio>
                                <Radio value={2} className={style.side_wrap3_li}>样式2
                                  <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/pirend_m2.png')}></img></div>
                                </Radio>
                                <Radio value={3} className={style.side_wrap3_li}>样式3
                                  <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/pirend_m3.png')}></img></div>
                                </Radio>
                                <Radio value={4} className={style.side_wrap3_li}>样式4
                                  <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/pirend_m4.png')}></img></div>
                                </Radio>
                              </Radio.Group>
                            </Form.Item>
                          </div>
                      </div>}
                    </Col>
                    <Col span={12}>
                      <Form.Item  name='shareSelectType' label="邀请好友" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                        <Radio.Group value={gameDataInit.shareSelectType} onChange={(e)=>localeOrCommonGameSelectChange(e,'shareSelectType','turntableInviteFriendsStyle')}>
                          <Radio value={1}>本地上传</Radio>
                          <Radio value={2}>通用模板</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {gameDataInit.shareSelectType==1?<div style={{overflow:'auto',marginLeft:'120px'}}>
                        <div className={style.image_content}>
                          {gameDataInit.turntableInviteFriendsStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={gameDataInit.turntableInviteFriendsStyle}/>:null}
                        </div>
                        <Form.Item className={style.image_upload} name='turntableInviteFriendsStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：290px*194px" rules={[{ required: true, message: "请上传图片" }]}>
                          <Upload
                             name="files"
                             action={uploadIcon}
                             beforeUpload={beforeUploadGame}
                             onChange={(file)=>handleChangeGame(file,'turntableInviteFriendsStyle')}
                             headers={headers}>
                            <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                      </div>:
                      <div style={{overflow:'auto',marginLeft:'120px'}} >
                        <div className={`${style.side_wrap3_table} ${style.side_wrap3_table2}`}>
                         <Form.Item className={style.turntableInviteFriendsStyle} name='turntableInviteFriendsStyle' labelCol={{flex:'0 0 120px'}}   rules={[{ required: true, message: "请选择模板" }]}>
                            <Radio.Group value={gameDataInit.turntableInviteFriendsStyle} className={style.side_wrap3_list} onChange={(e)=>{commonGameSelectChange(e,'turntableInviteFriendsStyle')}}>
                              <Radio value={1} className={style.side_wrap3_li}>样式1
                                <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/share_m5.png')}></img></div>
                              </Radio>
                              <Radio value={2} className={style.side_wrap3_li}>样式2
                                <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/share_m2.png')}></img></div>
                              </Radio>
                              <Radio value={3} className={style.side_wrap3_li}>样式3
                                <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/share_m3.png')}></img></div>
                              </Radio>
                              <Radio value={4} className={style.side_wrap3_li}>样式4
                                <div className={style.side_wrap3_liimg}><img src={require('../../../../../../assets/activity/share_m4.png')}></img></div>
                              </Radio>
                            </Radio.Group>
                        </Form.Item>
                        </div>
                      </div>}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item  name='gameAdStyleSelectType' label="广告位" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                        <Radio.Group value={gameDataInit.gameAdStyleSelectType} onChange={(e)=>localeOrCommonGameSelectChange(e,'gameAdStyleSelectType','isTaskStyle')}>
                          <Radio value={1}>本地上传</Radio>
                          <Radio value={2}>通用模板</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {gameDataInit.gameAdStyleSelectType==1?<div style={{overflow:'auto',marginLeft:'120px'}}>
                        <div className={style.image_content}>
                          {gameDataInit.isTaskStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={gameDataInit.isTaskStyle}/>:null}
                        </div>
                        <Form.Item className={style.image_upload} name='isTaskStyle' labelCol={{flex:'0 0 120px'}} extra="建议尺寸：290px*94px" rules={[{ required: true, message: "请上传图片" }]}>
                          <Upload
                             name="files"
                             action={uploadIcon}
                             beforeUpload={beforeUploadGame}
                             onChange={(file)=>handleChangeGame(file,'isTaskStyle')}
                             headers={headers}>
                            <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                      </div>:
                      <div style={{overflow:'auto',marginLeft:'120px'}}>
                        <Form.Item name="isTaskStyle" label=""  rules={[{ required: true, message: "请选择模板" }]} onChange={(e)=>commonGameSelectChange(e,'isTaskStyle')}>
                            <Radio.Group value={gameDataInit.isTaskStyle} className={style.side_adver_list}>
                              <Radio value={1} className={style.side_wrap3_li}>样式1
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg1}`}>
                                  <div><h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                              <Radio value={2} className={style.side_wrap3_li}>样式2
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg2}`}>
                                  <div><h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                              <Radio value={3} className={style.side_wrap3_li}>样式3
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg3}`}>
                                  <div><h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                              <Radio value={4} className={style.side_wrap3_li}>样式4
                                <div className={`${style.side_adver_liimg} ${style.side_adver_liimg4}`}>
                                  <div> <h5>标题名称</h5>
                                    <p></p></div>
                                </div>
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </div>
                      }
                    </Col>
                  </Row>
              </div>
              <div className={style.homePage_review}>
                <TurntableGamePreview gameDataInit={gameDataInit}/>
              </div>
            </div>
            <div className={style.sub_part_title}>弹窗</div>
            <Row>
              <Col span={8}>
                <Form.Item  name='activityRuleUniteStyleType' label="活动规则" labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group value={homeDataInit.activityRuleUniteStyleType} onChange={(e)=>localeOrCommonSelectChange(e,'activityRuleUniteStyleType','activityRuleUniteStyle')}>
                    <Radio value={1}>本地上传</Radio>
                    <Radio value={2}>通用模板</Radio>
                  </Radio.Group>
                </Form.Item>
                {homeDataInit.activityRuleUniteStyleType==1?<div style={{overflow:'auto',marginLeft:'120px',height:'184px'}}>
                  <div className={style.image_content}>
                    {homeDataInit.activityRuleUniteStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={homeDataInit.activityRuleUniteStyle}/>:null}
                  </div>
                  <Form.Item className={style.image_upload} name='activityRuleUniteStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：250px*260px" rules={[{ required: true, message: "请上传图片" }]}>
                    <Upload
                      name="files"
                      action={uploadIcon}
                      beforeUpload={beforeUpload}
                      onChange={(file)=>handleChangeHome(file,'activityRuleUniteStyle')}
                      headers={headers}>
                      <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                    </Upload>
                  </Form.Item>
                </div>:
                <div style={{overflow:'auto',marginLeft:'120px',height:'184px'}}>
                    <Form.Item name='activityRuleUniteStyle' labelCol={{flex:'0 0 120px'}}    rules={[{ required: true, message: "请选择模板" }]}>
                      <Radio.Group value={homeDataInit.activityRuleUniteStyle} className={style.side_wrap1_list} onChange={(e)=>commonSelectChange(e,'activityRuleUniteStyle')}>
                        <Radio value={1} className={style.side_wrap1_li}>样式1
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/setpage_m15.png')}></img></span></div>
                        </Radio>
                        <Radio value={2} className={style.side_wrap1_li}>样式2
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/setpage_m16.png')}></img></span></div>
                        </Radio>
                        <Radio value={3} className={style.side_wrap1_li}>样式3
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/m_style_3_5.png')}></img></span></div>
                        </Radio>
                        <Radio value={4} className={style.side_wrap1_li}>样式4
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/m_style_4_4.png')}></img></span></div>
                        </Radio>
                        <Radio value={5} className={style.side_wrap1_li}>样式5
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/m_style_5_5.png')}></img></span></div>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                </div>}
                <div  className={style.pop_content}>
                  <TurntableHomeReview homeDataInit={homeDataInit}  popTypes={1}/>
                </div>
              </Col>
              <Col span={8}>
                <Form.Item  name='winUniteStyleType' label="中奖记录" labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group value={homeDataInit.winUniteStyleType} onChange={(e)=>localeOrCommonSelectChange(e,'winUniteStyleType','winUniteStyle')}>
                    <Radio value={1}>本地上传</Radio>
                    <Radio value={2}>通用模板</Radio>
                  </Radio.Group>
                </Form.Item>
                {homeDataInit.winUniteStyleType==1?<div style={{overflow:'auto',marginLeft:'120px',height:'184px'}}>
                  <div className={style.image_content}>
                    {homeDataInit.winUniteStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={homeDataInit.winUniteStyle}/>:null}
                  </div>
                  <Form.Item className={style.image_upload} name='winUniteStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：250px*260px" rules={[{ required: true, message: "请上传图片" }]}>
                    <Upload
                     name="files"
                     action={uploadIcon}
                     beforeUpload={beforeUpload}
                     onChange={(file)=>handleChangeHome(file,'winUniteStyle')}
                     headers={headers}>
                      <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                    </Upload>
                  </Form.Item>
                </div>:
                <div style={{overflow:'auto',marginLeft:'120px',height:'184px'}}>
                   <Form.Item  name='winUniteStyle' labelCol={{flex:'0 0 120px'}}   rules={[{ required: true, message: "请选择模板" }]}>
                      <Radio.Group value={homeDataInit.winUniteStyle} className={style.side_wrap1_list} onChange={(e)=>commonSelectChange(e,'winUniteStyle')}>
                        <Radio value={1} className={style.side_wrap1_li}>样式1
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/setpage_m15.png')}></img></span></div>
                        </Radio>
                        <Radio value={2} className={style.side_wrap1_li}>样式2
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/setpage_m16.png')}></img></span></div>
                        </Radio>
                        <Radio value={3} className={style.side_wrap1_li}>样式3
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/m_style_3_5.png')}></img></span></div>
                        </Radio>
                        <Radio value={4} className={style.side_wrap1_li}>样式4
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/m_style_4_4.png')}></img></span></div>
                        </Radio>
                        <Radio value={5} className={style.side_wrap1_li}>样式5
                          <div className={style.side_wrap1_liimg}><span><img src={require('../../../../../../assets/activity/m_style_5_5.png')}></img></span></div>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                </div>}
                <div  className={style.pop_content}>
                   <TurntableHomeReview  homeDataInit={homeDataInit} popTypes={2}/>
                </div>
              </Col>
              <Col span={8}>
                <Form.Item  name='lotteryAllStyleType' label="抽奖结果" labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group value={homeDataInit.lotteryAllStyleType} onChange={(e)=>localeOrCommonSelectChange(e,'lotteryAllStyleType','lotteryAllStyle')}>
                    <Radio value={1}>本地上传</Radio>
                    <Radio value={2}>通用模板</Radio>
                  </Radio.Group>
                </Form.Item>
                {homeDataInit.lotteryAllStyleType==1?<div style={{overflow:'auto',marginLeft:'120px',height:'184px'}}>
                  <div className={style.image_content}>
                    {homeDataInit.lotteryAllStyle?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={homeDataInit.lotteryAllStyle}/>:null}
                  </div>
                  <Form.Item className={style.image_upload} name='lotteryAllStyle' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：250px*260px" rules={[{ required: true, message: "请上传图片" }]}>
                    <Upload
                       name="files"
                       action={uploadIcon}
                       beforeUpload={beforeUpload}
                       onChange={(file)=>handleChangeHome(file,'lotteryAllStyle')}
                       headers={headers}>
                      <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                    </Upload>
                  </Form.Item>
                </div>:
                <div style={{overflow:'auto',marginLeft:'120px',height:'184px'}}>
                  <Form.Item  name='lotteryAllStyle' label="" labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请选择模板" }]}>
                    <Radio.Group value={homeDataInit.lotteryAllStyle} className={style.side_wrap1_list} onChange={(e)=>commonSelectChange(e,'lotteryAllStyle')}>
                      <Radio value={1} className={style.side_wrap1_li}>样式1
                        <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m15.png')}></img></div>
                      </Radio>
                      <Radio value={2} className={style.side_wrap1_li}>样式2
                        <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/setpage_m17.png')}></img></div>
                      </Radio>
                      <Radio value={3} className={style.side_wrap1_li}>样式3
                        <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/m_style_3_1.png')}></img></div>
                      </Radio>
                      <Radio value={4} className={style.side_wrap1_li}>样式4
                        <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/m_style_4_1.png')}></img></div>
                      </Radio>
                      <Radio value={5} className={style.side_wrap1_li}>样式5
                        <div className={style.side_wrap1_liimg}><img src={require('../../../../../../assets/activity/m_style_5_1.png')}></img></div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>}
                <div  className={style.pop_content}>
                   <TurntableHomeReview homeDataInit={homeDataInit} popTypes={3}/>
                </div>
              </Col>
            </Row>
            <div className={style.btn_content}>
              <Button  size="large" className={style.btn_cancel}  onClick={cancelPageSave}>取消</Button>
              <Button type="primary" size="large" disabled={operaCount>3?false:true}  onClick={setPageSave}>确认</Button>
            </div>
        </div>
      </Form>
      <Modal title='取消保存' visible={cancelSaveVisible} onOk={cancelSaveHandleOk} onCancel={cancelSaveHandleCancel}>
        <p>请确认是否取消？</p>
      </Modal>
    </>
  )
};
export default connect(({ activeMaterial }) => ({
}))(turbtalePageMeterial)
