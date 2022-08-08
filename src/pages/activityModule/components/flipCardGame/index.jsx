import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch, Modal } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, RedoOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

const activityPage = (props) => {
  let { dispatch, subimtData, adverData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange } = props;
  let [formData, setFormData] = useState({});
  let [detailStatus, setDetailStatus] = useState(localStorage.getItem('activityDetail') === '1' ? true : false) //是否是详请状态，1为是
  let [isActivityHave, setIsActivityHave] = useState(localStorage.getItem('isActivityHave')) //是否是活动发布状态
  //取消弹窗
  let [isCancelModal, setIsCancelModal] = useState(false);
  let setIsCancel = () => {
    if (isDataChange) {
      showLayer(4)
    } else {
      setIsCancelModal(true);
    }
  }
  let onClickCancel = (e) => {
    setIsCancelModal(false);
    setIsStepBack(false);
  }
  //上一步
  let [isStepBack, setIsStepBack] = useState(false);
  let [isStepInt, setIsStepInt] = useState(0);   //跳转对应页
  let setStepBack = (i) => {
    if (isDataChange) {
      showLayer(3)
    } else {
      setIsStepInt(i);
      setIsStepBack(true);
    }
  }
  //下一步
  let setStepNext = () => {
    if((!countDown || !backCard || !cardImg1 || !cardImg2 || !cardImg3) || cardNum == 6 && (!cardImg4 || !cardImg5 || !cardImg6)){
      message.info('请完善卡片图组配置！');
      return
    }
    if (isDataChange) {
      showLayer(2)
    } else {
      history.push("/activityConfig/activityList/activityModule/finish");
    }
  }
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;

  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#ffffff",  //页面背景色
    color2: "#D8D8D8",   //倒计时背景色
    color3: "#868686",  //倒计时字体颜色
  });
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //颜色切换
  let setMcolor = (n, i) => {
    let toMcolors = { ...indexColor };
    toMcolors[n] = i;
    setindexColor(toMcolors);
    onChangType(true);
  }
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [backCard, setBackCard] = useState('');//背景图
  let [cardImg1, setCardImg1] = useState('');//图片1
  let [cardImg2, setCardImg2] = useState('');//图片2
  let [cardImg3, setCardImg3] = useState('');//图片3
  let [cardImg4, setCardImg4] = useState('');//图片4
  let [cardImg5, setCardImg5] = useState('');//图片5
  let [cardImg6, setCardImg6] = useState('');//图片6
  //  上传背景图
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
  let handleChange = (info, name) => {
    onChangType(true);
    if (info.file.status === 'done') {
      if(name == 'back'){
        setImageUrl(info.file.response.items)
      }
      let toCardList = JSON.parse(JSON.stringify(cardList));
      if(name == 'backCard'){
        let items = info.file.response.items;
        setBackCard(items);
        toCardList[0] = items;
        if(cardNum == 3){
          toCardList[4] = items;
          toCardList[5] = items;
          toCardList = toCardList.slice(0,6);
        }else if(cardNum == 6){
          for(let i = 7; i < 12; i ++){
            toCardList[i] = items;
          }
        }
      }
      if(name == 'cardImg1'){
        setCardImg1(info.file.response.items);
        toCardList[1] = info.file.response.items;
      }
      if(name == 'cardImg2'){
        setCardImg2(info.file.response.items);
        toCardList[2] = info.file.response.items;
      }
      if(name == 'cardImg3'){
        setCardImg3(info.file.response.items);
        toCardList[3] = info.file.response.items;
      }
      if(name == 'cardImg4'){
        setCardImg4(info.file.response.items);
        toCardList[4] = info.file.response.items;
      }
      if(name == 'cardImg5'){
        setCardImg5(info.file.response.items);
        toCardList[5] = info.file.response.items;
      }
      if(name == 'cardImg6'){
        setCardImg6(info.file.response.items);
        toCardList[6] = info.file.response.items;
      }
      setCardList(toCardList);
      onChangType(true);
    }
  };
  let getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  //提交
  let subInfo = () => {
    let toFormData = formData;
    toFormData.gameBackgroundImage = imageUrl;
    toFormData.gameBelowBackgroundColor = indexColor.color1;
    toFormData.countdownBackgroundColor = indexColor.color2;
    toFormData.countdownFontColor = indexColor.color3;
    toFormData.backCard = backCard;
    toFormData.cardImg1 = cardImg1;
    toFormData.cardImg2 = cardImg2;
    toFormData.cardImg3 = cardImg3;
    toFormData.cardImg4 = cardImg4;
    toFormData.cardImg5 = cardImg5;
    toFormData.cardImg6 = cardImg6;
    toFormData.countDown = countDown;
    toFormData.cardNum = cardNum;
    if((!countDown || !backCard || !cardImg1 || !cardImg2 || !cardImg3) ||cardNum == 6 && (!cardImg4 || !cardImg5 || !cardImg6)){
      message.info('请完善卡片图组配置！');
      return
    }
    dispatch({
      type: 'flipCardGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'flipCardHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success(res.result.message);
          onChangType(false);
          if (isDataStore) {
            storeConfig(true);
          }
        } else {
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
  };
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  //广告
  let adverUpload1 = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能高于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\D/g, '') : ''
    } else {
      return null
    }
  }
  //倒计时
  let [countDown, setCountDown] = useState(null);  //倒计时时间
  let countdownChange = (value) => {
    setCountDown(value)
    onChangType(true);
  }
  //卡组数量
  let [cardNum, setCardNum] = useState(3);  //卡组数量
  let cardNumChange = (value) => {
    let val = value.target.value;
    setCardNum(val)
    let toCardList = JSON.parse(JSON.stringify(cardList));
    toCardList[0] = backCard;
    toCardList[1] = cardImg1;
    toCardList[2] = cardImg2;
    toCardList[3] = cardImg3;
    if(val == 3){
      toCardList[4] = backCard;
      toCardList[5] = backCard;
      toCardList = toCardList.slice(0,6);
    }else if(val == 6){
      toCardList[4] = cardImg4;
      toCardList[5] = cardImg5;
      toCardList[6] = cardImg6;
      for(let i = 7; i < 12; i ++){
        toCardList[i] = backCard;
      }
    }
    setCardList(toCardList);
    onChangType(true);
  }
  let [cardList, setCardList] = useState(['','','','','','']);//卡组图片数组
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'flipCardGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'flipCardHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          if (res.body && res.body.styleValue) {
            let items = JSON.parse(res.body.styleValue);
            setFormData({ ...items });
            setImageUrl(items.gameBackgroundImage);
            let toSColor = indexColor;
            toSColor.color1 = items.gameBelowBackgroundColor || '#ffffff';
            toSColor.color2 = items.countdownBackgroundColor|| '#D8D8D8';
            toSColor.color3 = items.countdownFontColor || '#868686';
            setCountDown(items.countDown || null);
            items.cardNum = items.cardNum ? items.cardNum : 3;
            setCardNum(items.cardNum);
            let toCardList = [];
            toCardList[0] = items.backCard;
            toCardList[1] = items.cardImg1;
            toCardList[2] = items.cardImg2;
            toCardList[3] = items.cardImg3;
            if(items.cardNum == 3){
              toCardList[4] = items.backCard;
              toCardList[5] = items.backCard;
              toCardList = toCardList.slice(0,6);
            }else if(items.cardNum == 6){
              toCardList[4] = items.cardImg4;
              toCardList[5] = items.cardImg5;
              toCardList[6] = items.cardImg6;
              for(let i = 7; i < 12;i ++){
                toCardList[i] = items.backCard;
              }
            }
            setCardList(toCardList);
            setindexColor({ ...toSColor });
            setBackCard(items.backCard);
            setCardImg1(items.cardImg1);
            setCardImg2(items.cardImg2);
            setCardImg3(items.cardImg3);
            setCardImg4(items.cardNum == 6 ? items.cardImg4 : '');
            setCardImg5(items.cardNum == 6 ? items.cardImg5 : '');
            setCardImg6(items.cardNum == 6 ? items.cardImg6 : '');
          }
        }
      }
    });
  }
  useEffect(() => {
    if (isDataStore) {
      subInfo();
    }
  }, [subimtData, adverData, indexInt, isDataStore])
  useEffect(() => {
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStyleByActivityIdAndStyleCode();
    }
  }, []);
  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div style={{ marginLeft: '365px' }}>
              {
                indexInt === 1 ? '背景图' :
                indexInt === 2 ? '卡片图组配置' : '倒计时'
              }
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}>
                <img src={require('../../../../assets/activity/setpage_m1.png')}></img>
              </div>
              <div className={styles.phone_img2}>
                <LeftOutlined className={styles.phone_img2_1} />
                <span>{activityInfo.internalName}</span>
                <EllipsisOutlined className={styles.phone_img2_2} />
              </div>
              {/* 活动首页 */}
              <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color1}`, backgroundImage: `url(${imageUrl})` }}>
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
                <div className={styles.index_time} onClick={setTools.bind(this, 3)} style={{ color: `${indexColor.color3}`,background:`${indexColor.color2}` }}>{countDown}S</div>
                <div className={styles.index_content} onClick={setTools.bind(this, 2)}>
                  {cardList && cardList.length > 0 && cardList.map((item, index) => {
                    return <div className={styles.index_cardItem}>
                      {item ? <img src={item} alt="" /> : <img className={styles.cardItem_ori} src={require('../../../../assets/activity/dollMachine_m4.png')}></img>}
                    </div>
                  })}
                </div>
              </div>
              <div className={styles.phone_img3}>
                <img src={require('../../../../assets/activity/setpage_m2.png')}></img>
              </div>
            </div>
          </div>
          {/* 编辑 */}
          <div className={styles.side_style}>
            <div className={styles.style_box}>
              {/* 背景图 */}
              {indexInt == 1 ?
                <div className={styles.style_box_m1}>
                  <div className={styles.side_wrap2_li}>
                    <span className={styles.side_wrap2_span}>背景图下方底色：</span>
                    <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span>
                  </div>
                  <p style={{ color: 'rgba(0, 0, 0, 0.25)' }}>背景图无法完全覆盖屏幕时，会显示此底色</p>
                  <div className={styles.style_box_main}>
                    <strong>背景图</strong>
                    {imageUrl ? 
                      <div className={styles.backImg_show}>
                        <img src={imageUrl} alt="" />
                      </div>
                    : null}
                    <div className={styles.style_m1_upimg}>
                      <div className={styles.style_upimg_btn}>
                        <Upload
                          name="files"
                          action={uploadIcon}
                          beforeUpload={beforeUpload}
                          onChange={(e) => { handleChange(e, 'back') }}
                          headers={headers}
                        >
                          <Button>上传图片</Button>
                        </Upload>
                      </div>

                      <p>建议尺寸：750px*1624px</p>
                    </div>
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={()=>{subInfo()}}>保存</Button></div>
                </div>
              : indexInt == 2 ?
                <div className={styles.style_box_m1}>    {/* 卡片图组配置 */}
                  <div className={styles.side_wrap2_li}>
                    <span className={styles.side_wrap2_span}><span className={styles.card_star}>*</span>游戏时间：</span>
                    <InputNumber value={countDown} disabled={detailStatus || isActivityHave} onChange={(value) => { countdownChange(value) }} parser={limitNumber} formatter={limitNumber} min={1}/> S
                  </div>
                  <div className={styles.side_wrap2_li}>
                    <span className={styles.side_wrap2_span}><span className={styles.card_star}>*</span>卡组数量：</span>
                    <Radio.Group disabled={detailStatus || isActivityHave} value={cardNum} onChange={(value)=>{cardNumChange(value)}}>
                      <Radio value={3}>3组</Radio>
                      <Radio value={6}>6组</Radio>
                    </Radio.Group>
                  </div>
                  <div className={styles.card_upload}>
                    <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>背面图</strong>
                      <div className={styles.item_li_img}>
                        {backCard? 
                        <img src={backCard} className={styles.style_bm3_li_m1}/> 
                        : 
                        <div className={styles.style_bm3_li_m2}>
                          <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                          <p>默认图</p>
                        </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'backCard') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div>
                    <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>图片1</strong>
                      <div className={styles.item_li_img}>
                        {cardImg1? 
                          <img src={cardImg1} className={styles.style_bm3_li_m1}/> 
                          : 
                          <div className={styles.style_bm3_li_m2}>
                            <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                            <p>默认图</p>
                          </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'cardImg1') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div>
                    <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>图片2</strong>
                      <div className={styles.item_li_img}>
                        {cardImg2? 
                          <img src={cardImg2} className={styles.style_bm3_li_m1}/> 
                          : 
                          <div className={styles.style_bm3_li_m2}>
                            <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                            <p>默认图</p>
                          </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'cardImg2') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div>
                    <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>图片3</strong>
                      <div className={styles.item_li_img}>
                        {cardImg3? 
                          <img src={cardImg3} className={styles.style_bm3_li_m1}/> 
                          : 
                          <div className={styles.style_bm3_li_m2}>
                            <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                            <p>默认图</p>
                          </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'cardImg3') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div>
                    {cardNum == 6 ? <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>图片4</strong>
                      <div className={styles.item_li_img}>
                        {cardImg4? 
                          <img src={cardImg4} className={styles.style_bm3_li_m1}/> 
                          : 
                          <div className={styles.style_bm3_li_m2}>
                            <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                            <p>默认图</p>
                          </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'cardImg4') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div> : null}
                    {cardNum == 6 ? <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>图片5</strong>
                      <div className={styles.item_li_img}>
                        {cardImg5? 
                          <img src={cardImg5} className={styles.style_bm3_li_m1}/> 
                          : 
                          <div className={styles.style_bm3_li_m2}>
                            <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                            <p>默认图</p>
                          </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'cardImg5') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div> : null}
                    {cardNum == 6 ? <div className={styles.card_upload_main}>
                      <strong><span className={styles.card_star}>*</span>图片6</strong>
                      <div className={styles.item_li_img}>
                        {cardImg6? 
                          <img src={cardImg6} className={styles.style_bm3_li_m1}/> 
                          : 
                          <div className={styles.style_bm3_li_m2}>
                            <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                            <p>默认图</p>
                          </div>
                        } 
                      </div>
                      <div className={styles.style_m1_upimg}>
                        <div className={styles.style_upimg_btn}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={(e) => { handleChange(e, 'cardImg6') }}
                            headers={headers}
                          >
                            <Button>上传图片</Button>
                          </Upload>
                        </div>
                        <p>建议尺寸：196px*220px</p>
                      </div>
                    </div> : null}
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={ subInfo}>保存</Button></div>
                </div>
              : <div className={styles.style_box_m2}>
                  <div className={styles.style_box_main}>
                    <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                    <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span></div>
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                </div>}
            </div>
          </div>
        </div>
        <div className={styles.wrap_bom}>
          <Button onClick={setIsCancel}>返回列表</Button>
          <Button onClick={setStepBack.bind(this, 2)}>上一步</Button>
          <Button type="primary" onClick={setStepNext}>下一步</Button>
        </div>
      </div>
    </div>
  )
}
export default connect(({ flipCardGame, loading }) => ({
  subimtData: flipCardGame.subimtData,
  adverData: flipCardGame.adverData,
}))(activityPage);
