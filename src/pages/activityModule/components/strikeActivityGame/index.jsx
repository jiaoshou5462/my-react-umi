import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Form, InputNumber, Input, Button, Checkbox, Upload, message, Radio, Switch } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, LeftOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

//根据环境变量 匹配对应的预览域名
let homeHost = {
  'local':'https://dev.yltapi.com',
  'dev':'https://dev.yltapi.com',
  'test1':'https://test1.yltapi.com',
  'uat':'https://uat.yltapi.com',
  'prod':'https://www.yltapi.com',
}[process.env.DEP_ENV]
const activityPage = (props) => {
  let { dispatch, subimtData, adverData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange, applyTheme } = props;
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
  useEffect(()=>{
    if(applyTheme){
      getStyleByActivityIdAndStyleCode();
    }else{
      if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
        getStyleByActivityIdAndStyleCode();
      }
    }
  },[applyTheme])
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
    let notice = false;
    dropGoodsList.map((item)=>{
      if(!item.imgUrl || !item.rate || (item.scoreType == 1 && !item.addScore) || (item.scoreType == 2 && !item.reduceScore)){
        notice = true;
      }
    })
    if(notice){
      message.error('请完善物品信息！');
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
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息

  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#FCFCFC",   //背景图下方底色
    color2: '#868686',  //倒计时字体颜色
    color3: '#fff',  //倒计时背景颜色
    color4: '#868686',  //目标分数字体颜色
    color5: 'rgba(0,0,0,.5)',  //目标分数背景颜色
    color6: '#fff',  //得分背景颜色
    color7: '#868686',  //得分字体颜色
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
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);//规则 记录
  let onBackCloreChange = (value) => {
    setIsBackClore(value);
    onChangType(true);
  }
  //  上传图
  let [imageUrl, setImageUrl] = useState("");  //首页背景
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
      if (name == 'back') {
        setImageUrl(info.file.response.items)
      }
      onChangType(true);
    }
  };

  //皮肤主题
  // let [styleType, setStyleType] = useState(1);
  let setStyle = (vaule) => {
    setStyleType(vaule.target.value)
    onChangType(true);
  }

  let [showCode, setShowCode] = useState(false);//是否展示动态预览按钮
  //提交 
  let subInfo = () => {
    let toFormData = formData;
    toFormData.gameBackgroundImage = imageUrl;
    toFormData.gameBackgroundColor = indexColor.color1;
    toFormData.countDownFontColor = indexColor.color2;
    toFormData.countDownBackgroundColor = indexColor.color3;
    toFormData.goalScoreFontColor = indexColor.color4;
    toFormData.goalScoreBackgroundColor = isBackClore ? indexColor.color5 : '';
    toFormData.scoreBackgroundColor = indexColor.color6;
    toFormData.scoreFontColor = indexColor.color7;
    toFormData.goodsSpeed = goodsSpeed;
    if(indexInt == 3){
      if(!targetScore){
        message.info('请设置游戏目标分数！');
        return
      }
      if(!goodsSpeed){
        message.info('请设置物品下落速度！');
        return
      }
      
      if(!dropGoodsList || dropGoodsList.length < 1){
        message.info('请新增物品！');
        return
      }
      let notice = false;
      let totalRate = 0;
      dropGoodsList.map((item)=>{
        if(!item.imgUrl || !item.rate || (item.scoreType == 1 && !item.addScore) || (item.scoreType == 2 && !item.reduceScore)){
          notice = true;
        }
        totalRate = totalRate + item.rate;
      })
      if(notice){
        message.info('请完善物品信息！');
        return
      }
      if(totalRate < 100){
        message.info('当前物品比例未满100%！');
        return
      }else if(totalRate > 100){
        message.info('当前物品比例不能超过100%！');
        return
      }
      updateGameStrikeConfig();
    }
    toFormData.dropGoodsList = dropGoodsList;
    dispatch({
      type: 'strikeActivityGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'strikeHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.homeAd = toFormData.homeAd;
          window.activityData_materialApply.homeAdTitleName = toFormData.homeAdTitleName;
          window.activityData_materialApply.inviteFriendsTitle = toFormData.inviteFriendsTitle ? toFormData.inviteFriendsTitle : "分享好友立即得抽奖机会";
          window.activityData_materialApply.homeAdIsShow = toFormData.homeAdIsShow;
          window.activityData_materialApply.isHomeAdPreviewShow = toFormData.isHomeAdPreviewShow;
          window.activityData_materialApply.isFans = toFormData.isFans;
          window.activityData_materialApply.showButton = toFormData.showButton;
          window.activityData_materialApply.homeParticipateButtonTxt = toFormData.homeParticipateButtonTxt;
          window.activityData_materialApply.turntableInviteFriendsCopywriting = toFormData.turntableInviteFriendsCopywriting;
          window.activityData_materialApply.turntableInviteFriendsTitle = toFormData.turntableInviteFriendsTitle ? toFormData.turntableInviteFriendsTitle : "邀请好友注册助力";
          window.activityData_materialApply.dropGoodsList = toFormData.dropGoodsList;
          window.activityData_materialApply.goodsSpeed = toFormData.goodsSpeed;
          setShowCode(true);
          message.success(res.result.message);
          onChangType(false);
          if (isDataStore) {
            storeConfig(true);
          }
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  let [countDown, setCountDown] = useState(0);//倒计时
  let [targetScore,setTargetScore] = useState(0);//目标分数
  let [fullScore,setFullScore] = useState(0);//游戏满分
  let [goodsSpeed,setGoodsSpeed] = useState(100);//物品下落速度
  let [gameNumberType,setGameNumberType] = useState(1);//物品下落速度
  let targetScoreChange = (e) => {
    setTargetScore(e);
    onChangType(true);
  }
  let goodsSpeedChange = (e) => {
    setGoodsSpeed(e);
    onChangType(true);
  }
  //获取游戏配置数据
  let getStrikeConfig = () => {
    dispatch({
      type: 'strikeActivityRules/getGameStrikeConfig',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          setCountDown(items.countDown);
          setTargetScore(items.targetScore ? items.targetScore : 0);
          setFullScore(items.maxScore ? items.maxScore : 0);
          setGameNumberType(items.gameNumberType ? items.gameNumberType : 1);
        } else {
          message.info(res.result.message)
        }
      }
    })
  }
  //保存游戏分数
  let updateGameStrikeConfig = (value) => {
    dispatch({
      type: 'strikeActivityRules/updateGameStrikeConfig',
      payload: {
        method: 'postJSON',
        params: {
          activityId: activityInfo.objectId,
          maxScore: fullScore,
          targetScore: targetScore,
          gameNumberType: gameNumberType,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          onChangType(false);
        } else {
          message.info(res.result.message)
        }
      }
    })
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
  useEffect(() => {
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStrikeConfig();
    }
  }, []);

  useEffect(() => {
    if (isDataStore) {
      subInfo()
    }
  }, [isDataStore]);
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'strikeActivityGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'strikeHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.homeAd = items.homeAd;
          window.activityData_materialApply.homeAdTitleName = items.homeAdTitleName;
          window.activityData_materialApply.inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
          window.activityData_materialApply.homeAdIsShow = items.homeAdIsShow;
          window.activityData_materialApply.isHomeAdPreviewShow = items.isHomeAdPreviewShow;
          window.activityData_materialApply.isFans = items.isFans;
          window.activityData_materialApply.showButton = items.showButton;
          window.activityData_materialApply.homeParticipateButtonTxt = items.homeParticipateButtonTxt;
          window.activityData_materialApply.turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting;
          window.activityData_materialApply.turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
          window.activityData_materialApply.dropGoodsList = items.dropGoodsList;
          window.activityData_materialApply.goodsSpeed = items.goodsSpeed;
          if(items){
            setFormData({ ...items });
            setImageUrl(items.gameBackgroundImage ? items.gameBackgroundImage : '');
            if(items.goalScoreBackgroundColor){
              setIsBackClore(true);
            }
            let toIndexColor = indexColor;
            toIndexColor.color1 = items.gameBackgroundColor ? items.gameBackgroundColor : '#FCFCFC';
            toIndexColor.color2 = items.countDownFontColor ? items.countDownFontColor : '#868686';
            toIndexColor.color3 = items.countDownBackgroundColor ? items.countDownBackgroundColor : '#fff';
            toIndexColor.color4 = items.goalScoreFontColor ? items.goalScoreFontColor : '#868686';
            toIndexColor.color5 = items.goalScoreBackgroundColor ? items.goalScoreBackgroundColor : 'rgba(0,0,0,.5)';
            toIndexColor.color6 = items.scoreBackgroundColor ? items.scoreBackgroundColor : '#fff';
            toIndexColor.color7 = items.scoreFontColor ? items.scoreFontColor : '#868686';
            setindexColor({ ...toIndexColor });
            setGoodsSpeed(items.goodsSpeed ? items.goodsSpeed : 100);
            let toDropGoodsList = items.dropGoodsList;
            if(toDropGoodsList && toDropGoodsList.length > 0){
              setShowCode(true);
              toDropGoodsList = toDropGoodsList.map(item => {
                if(!item.scoreType){
                  item.scoreType = 1;
                }
                return item;
              })
            }
            setDropGoodsList(toDropGoodsList);
          }
        }
      }
    });
  }
 
  //设置游戏满分和目标分数
  useEffect(()=>{
    if(dropGoodsList && dropGoodsList.length > 0){
      let totalScore = 0;
      dropGoodsList.map(item=>{
        if(item.addScore && item.rate){
          totalScore = totalScore + (item.rate / 100) * 100 * item.addScore;
        }
      })
      setFullScore(totalScore);
    }
  },dropGoodsList)
  let [dropGoodsList,setDropGoodsList] = useState([]);//掉落物品合集
  //点击分数 增加、扣除
  let clickScoreChange = (e,index) => {
    let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
    toDropGoodsList[index].scoreType=e.target.value;
    if(e.target.value == 1){
      toDropGoodsList[index].reduceScore = null;
    }else{
      toDropGoodsList[index].addScore = null;
    }
    setDropGoodsList(toDropGoodsList);
    onChangType(true);
  }
  //增加分数
  let addScoreChange = (e,index) => {
    let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
    toDropGoodsList[index].addScore = e;
    setDropGoodsList(toDropGoodsList);
    onChangType(true);
  }
  //扣减分数
  let reduceScoreChange = (e,index) => {
    let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
    toDropGoodsList[index].reduceScore = e;
    setDropGoodsList(toDropGoodsList);
    onChangType(true);
  }
  //掉落物品图片上传
  let dropGoodImgChange = (info,index) => {
    onChangType(true);
    if (info.file.status === 'done') {
      let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
      toDropGoodsList[index].imgUrl=info.file.response.items;
      setDropGoodsList(toDropGoodsList);
      onChangType(true);
    }
  }
  //物品比例设置
  let rateChange = (e,index) => {
    let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
    toDropGoodsList[index].rate = e;
    setDropGoodsList(toDropGoodsList);
    onChangType(true);
  }
  //删除物品
  let delDropGoods = (index) => {
    let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
    toDropGoodsList = toDropGoodsList.filter((item,key)=>key != index);
    setDropGoodsList(toDropGoodsList);
  }
  //添加物品
  let addDropGoods = () => {
    let toDropGoodsList =dropGoodsList ? JSON.parse(JSON.stringify(dropGoodsList)) : [];
    if(toDropGoodsList && toDropGoodsList.length >= 5){
      return
    }
    let good = {
      imgUrl:"",
      scoreType: 1,
      addScore: null,
      reduceScore: null,
      rate:null,
    }
    
    toDropGoodsList.push(good);
    setDropGoodsList(toDropGoodsList);
    onChangType(true);
  }
  //二维码动态预览
  let getQRCode = () => {

  }
  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            {
              dropGoodsList && dropGoodsList.length > 0 && showCode ? 
              <div className={styles.index_adver}><span onClick={setTools.bind(this, 2)}>动态预览</span></div>
              : null
            }
            <div style={{ marginLeft: (dropGoodsList && dropGoodsList.length > 0) ? '285px' : '365px' }}>
            {/* <div style={{ marginLeft: '365px' }}> */}
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 2 ? '动态预览' :
                    indexInt === 3 ? '掉落物品合集' :
                      indexInt === 4 ? '倒计时样式' :
                        indexInt === 5 ? '目标分' :
                          indexInt === 6 ? '当前得分' :
                            '其它'
              }
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.internalName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              {/* 活动首页 */}
              <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color1}`, backgroundImage: `url(${imageUrl})` }}>
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)} ></div>
                <div className={styles.index_goalScore} onClick={setTools.bind(this, 5)} style={{ color: `${indexColor.color4}` }} >
                  <i>目标分：{targetScore}</i>
                  {isBackClore ? <span className={styles.goalBg} style={{ 'background': indexColor.color5 }}></span> : null}
                </div>
                <div className={styles.index_time} onClick={setTools.bind(this, 4)} style={{ color: `${indexColor.color2}`,background:`${indexColor.color3}` }}>{countDown}S</div>
                <div className={styles.index_score} onClick={setTools.bind(this, 6)} style={{ color: `${indexColor.color7}`,background:`${indexColor.color6}` }}>得分：0</div>
                {/* 掉落物品图片占位 */}
                <div className={`${styles.index_drop} ${styles.index_drop1}`} onClick={setTools.bind(this, 3)}>
                  {dropGoodsList && dropGoodsList[0] && dropGoodsList[0].imgUrl ?
                    <img src={dropGoodsList[0].imgUrl} alt="" /> 
                    :<img src={require('../../../../assets/dropGood.png')} alt="" />
                  }
                </div>
                <div className={`${styles.index_drop} ${styles.index_drop2}`} onClick={setTools.bind(this, 3)}>
                  {dropGoodsList && dropGoodsList[1] && dropGoodsList[1].imgUrl ?
                    <img src={dropGoodsList[1].imgUrl} alt="" /> 
                    :<img src={require('../../../../assets/dropGood.png')} alt="" />
                  }
                </div>
                <div className={`${styles.index_drop} ${styles.index_drop3}`} onClick={setTools.bind(this, 3)}>
                  {dropGoodsList && dropGoodsList[2] && dropGoodsList[2].imgUrl ?
                    <img src={dropGoodsList[2].imgUrl} alt="" /> 
                    :<img src={require('../../../../assets/dropGood.png')} alt="" />
                  }
                </div>
                <div className={`${styles.index_drop} ${styles.index_drop4}`} onClick={setTools.bind(this, 3)}>
                  {dropGoodsList && dropGoodsList[3] && dropGoodsList[3].imgUrl ?
                    <img src={dropGoodsList[3].imgUrl} alt="" /> 
                    :<img src={require('../../../../assets/dropGood.png')} alt="" />
                  }
                </div>
                <div className={`${styles.index_drop} ${styles.index_drop5}`} onClick={setTools.bind(this, 3)}>
                  {dropGoodsList && dropGoodsList[4] && dropGoodsList[4].imgUrl ?
                    <img src={dropGoodsList[4].imgUrl} alt="" /> 
                    :<img src={require('../../../../assets/dropGood.png')} alt="" />
                  }
                </div>
              </div>
              <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
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
                  
                </div>
                : indexInt == 2 ?
                  <div className={styles.style_box_m2}>    {/* 动态预览 */}
                    <Button type="primary" onClick={() => { getQRCode() }}>二维码预览</Button>
                    <QRCode
                      id="qrCode"
                      value={`${homeHost}/wechat-carowner-new/home?channelId=${activityInfo.channelId}&activityId=${activityInfo.objectId}&jumpPage=/sub-common/mould/strikePreview`}
                      size={200} // 二维码的大小
                      fgColor="#000000" // 二维码的颜色
                      style={{ margin: 'auto' }}
                    />
                  </div>
                  : indexInt == 3 ?
                    <div>
                      <div className={styles.style_box_m5}>    {/* 掉落物品集合 */}
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>游戏满分：{fullScore}</span>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}><span style={{color:"red"}}>*</span>目标分：</span>
                          <InputNumber value={targetScore} disabled={detailStatus || isActivityHave} onChange={(value) => { targetScoreChange(value) }} parser={limitNumber} formatter={limitNumber} min={0}/>
                        </div>
                        <div className={styles.notice_wrap}>
                          <p className={styles.notice}>完成目标分可参与抽奖</p>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}><span style={{color:"red"}}>*</span>物品下落速度：</span>
                          <InputNumber value={goodsSpeed} disabled={detailStatus || isActivityHave} onChange={(value) => { goodsSpeedChange(value) }} parser={limitNumber} className={styles.box2_count_width2} formatter={limitNumber} min={10} max={500}/>
                        </div>
                        <div className={styles.notice_wrap}>
                          <p className={styles.notice}>数值越大物品下落越快，当前100%为默认速度</p>
                        </div>
                      </div>
                      <div className={styles.style_box_m3}>    {/* 掉落物品集合 */}
                      {
                        dropGoodsList && dropGoodsList.length > 0 && dropGoodsList.map((item,index)=>{
                          return <div className={styles.box_item}>
                            <div className={styles.box_item_li}>
                              <div className={styles.item_li_label}>物品{index+1}：</div>
                              <div className={styles.item_li_img}>
                                {item.imgUrl? 
                                <img src={item.imgUrl} className={styles.style_bm3_li_m1}/> 
                                : 
                                <div className={styles.style_bm3_li_m2}>
                                  <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                                  <p>默认图</p>
                                </div>
                                }
                              </div>
                              <div>
                                <Upload
                                  name="files"
                                  action={uploadIcon}
                                  showUploadList={false}
                                  beforeUpload={beforeUpload}
                                  onChange={(e) => { dropGoodImgChange(e, index) }}
                                  headers={headers}
                                >
                                  <Button disabled={detailStatus || isActivityHave}>上传图片</Button>
                                </Upload>
                                <p className={styles.style_bm3_li_up2}>建议尺寸：184px*184px</p>
                              </div>
                            </div>
                            <div className={`${styles.box_item_li} ${styles.box_item_li1}` }>
                              <div className={styles.item_li_label}>点击分数：</div>
                              <Radio.Group disabled={detailStatus || isActivityHave} value={item.scoreType} className={styles.box_item_choose} onChange={(value)=>{clickScoreChange(value,index)}}>
                                <Radio value={1}>增加  
                                <InputNumber value={item.addScore} disabled={detailStatus || isActivityHave || item.scoreType == 2} onChange={(value) => { addScoreChange(value,index) }} parser={limitNumber} formatter={limitNumber} className={styles.box_item_score} min={0}/>
                                </Radio>
                                <Radio value={2}>扣除  
                                <InputNumber value={item.reduceScore} disabled={detailStatus || isActivityHave || item.scoreType == 1} onChange={(value) => { reduceScoreChange(value,index) }} parser={limitNumber} formatter={limitNumber} className={styles.box_item_score} min={0}/>
                                </Radio>
                              </Radio.Group>
                            </div>
                            <div className={`${styles.box_item_li} ${styles.box_item_li1}` }>
                              <div className={styles.item_li_label}>物品比例：</div>
                              <InputNumber value={item.rate} disabled={detailStatus || isActivityHave} onChange={(value) => { rateChange(value,index) }} parser={limitNumber} formatter={limitNumber} className={styles.box_item_rate} min={0} max={100}/>
                            </div>
                            <div className={`${styles.box_item_li} ${styles.box_item_li2}` }>
                              <p>所有物品比例累加应为100%</p>
                            </div>
                            {detailStatus || isActivityHave ? null : <div className={styles.box_item_del} onClick={()=>{delDropGoods(index)}}>删除</div>}
                            
                          </div>
                        })
                      }
                        <div className={styles.good_addbtn}>
                        {detailStatus || isActivityHave ? null : <Button onClick={() => { addDropGoods() }} icon={<PlusOutlined />}>新增物品（至多五个）</Button>}
                        </div>
                      </div>
                    </div>
                    : indexInt == 4 ?
                      <div className={styles.style_box_m4}>    {/* 倒计时样式 */}
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>背景颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>字体颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span>
                        </div>
                      </div>
                      : indexInt == 5 ?
                      <div className={styles.style_box_m4}>    {/* 目标分数 */}
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>字体颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color4} colorName='color4' setMColor={setMcolor} /></span>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span1}>是否需透明底：</span>
                          <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore} onChange={onBackCloreChange} />
                        </div>
                        {isBackClore ? 
                          <div className={styles.side_wrap2_li}>
                            <span className={styles.side_wrap2_span}>背景颜色：</span>
                            <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color5} colorName='color5' setMColor={setMcolor} /></span>
                          </div> 
                        : null}
                      </div>
                        : indexInt == 6 ?
                        <div className={styles.style_box_m4}>    {/* 当前得分 */}
                          <div className={styles.side_wrap2_li}>
                            <span className={styles.side_wrap2_span}>背景颜色：</span>
                            <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color6} colorName='color6' setMColor={setMcolor} /></span>
                          </div>
                          <div className={styles.side_wrap2_li}>
                            <span className={styles.side_wrap2_span}>字体颜色：</span>
                            <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color7} colorName='color7' setMColor={setMcolor} /></span>
                          </div>
                        </div>

                          : null}
              {
                indexInt != 2 ? 
                <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                : null
              }
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
export default connect(({ strikeActivityGame, loading, selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(activityPage);
