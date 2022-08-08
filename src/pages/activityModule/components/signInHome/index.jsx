import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, GiftOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined,ScheduleOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

const activityPage = (props) => {
  let { dispatch, subimtData, adverData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange } = props;
  let [formData, setFormData] = useState({});
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
    let temp = adverForm.getFieldsValue();
    let homeAd = temp.homeAd ? temp.homeAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(homeAd.length < 1 && banChecked){
      message.error('展示广告至少上传一个！');
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

  let [adverForm] = Form.useForm();
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [banChecked, setBanChecked] = useState(false);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //页面背景色  homePageBackgroundColor
    // color2: "#D8D8D8",   //活动规则背景色 activityRuleBackgroundColor
    // color3: "#868686",  //活动规则字体颜色 activityRuleFontColor
    color4: "#fff",  //签到栏背景色 signInDeskBackgroundColor
    color5: "#D8D8D8",   //签到按钮未签到按钮颜色 beforeSignInBackgroundColor
    color6: "#868686",  //签到按钮未签到字体颜色 beforeSignInFontColor
    color7: "#D8D8D8",   //签到按钮已签到按钮颜色 afterSignInBackgroundColor
    color8: "#868686",  //签到按钮已签到字体颜色 afterSignInFontColor
    color9: "#868686",  //签到栏主题字体颜色 signInDeskTopicFontColor
    color10: "#868686",  //签到栏提示字体颜色 signInDeskNoticeFontColor
    color11: "#fff",  //奖池背景色 prizePoolBackgroundColor
    color12: "#868686",  //奖池名称字体颜色 prizePoolNameFontColor
    color13: "#868686",  //奖池提示字体颜色 prizePoolNoticeFontColor
    color14: "#868686",  //奖品名称字体颜色 prizesNameFontColor
    color15: "#fff",   //签到规则背景色 signRulesBackgroundColor
    color16: "#868686",  //签到规则字体颜色 signRulesFontColor
    color17: "#868686",  //中奖记录字体颜色 winningRecordFontColor
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  let [showDraw, setShowDraw] = useState(false);  //分享图标
  //广告位显示切换
  let adverChang = (e) => {
    let value = e.target.checked
    setBanChecked(value)
    if (!value) {
      adverSubmit({}, true)
    }
    onChangType(true);
  };
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
  //  上传背景图
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG/GIF 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = (info, name) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
      onChangType(true);
    }
  };
  //首页广告图片上传
  let [adverImg, setAdverImg] = useState([]);
  let adverUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt5M;
  }
  let adverChange = (i, info) => {
    let toImgArr = [...adverImg];
    toImgArr[i] = info.file.response ? info.file.response.items : "";
    setAdverImg(toImgArr);
    onChangType(true);
  };
  //提交
  let subInfo = (notCheck) => {
    let temp = adverForm.getFieldsValue();
    let homeAd = temp.homeAd ? temp.homeAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    let toFormData = formData;
    toFormData.homeBackgroundImage = imageUrl;
    toFormData.prizePoolNotice = prizePoolNotice;
    toFormData.signTopicWord = signTopicWord;
    toFormData.homePageBackgroundColor = indexColor.color1;
    // toFormData.activityRuleBackgroundColor = indexColor.color2;
    // toFormData.activityRuleFontColor = indexColor.color3;
    toFormData.signInDeskBackgroundColor = indexColor.color4;
    toFormData.beforeSignInBackgroundColor = indexColor.color5;
    toFormData.beforeSignInFontColor = indexColor.color6;
    toFormData.afterSignInBackgroundColor = indexColor.color7;
    toFormData.afterSignInFontColor = indexColor.color8;
    toFormData.signInDeskTopicFontColor = indexColor.color9;
    toFormData.signInDeskNoticeFontColor = indexColor.color10;
    toFormData.prizePoolBackgroundColor = indexColor.color11;
    toFormData.prizePoolNameFontColor = indexColor.color12;
    toFormData.prizePoolNoticeFontColor = indexColor.color13;
    toFormData.prizesNameFontColor = indexColor.color14;
    toFormData.signRulesBackgroundColor = indexColor.color15;
    toFormData.signRulesFontColor = indexColor.color16;
    toFormData.winningRecordFontColor = indexColor.color17;
    toFormData.beforeSignImg = beforeSignImg;
    toFormData.afterSignImg = afterSignImg;
    toFormData.timeoutSignImg = timeoutSignImg;
    toFormData.prizeSignImg = prizeSignImg;
    toFormData.homeAd = homeAd;
    toFormData.isHomeAdPreviewShow = notCheck ? 0 : banChecked ? 1 : 0;
    toFormData.homeAdTitleName = adverTitName;
    toFormData.homeAdStyle = temp.homeAdStyle;
    toFormData.homeAdIsShow = parseInt(adverIsTit) || 0;
    dispatch({
      type: 'signInHome/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'signInHome',
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
          setIsDataStore(false)
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
  };
  //首页广告保存
  let adverSubmit = (value, notCheck) => {
    let temp = adverForm.getFieldsValue();
    let homeAd = temp.homeAd ? temp.homeAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(homeAd.length < 1 && !notCheck){
      setIsDataStore(false);
      setIsDataTypes(false);
      message.error('展示广告至少上传一个！');
      return
    }
    subInfo(notCheck);
  };
  //广告标题
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
  let setAdverIsTit = (e) => {
    changeAdverIsTit(e.target.value)
    onChangType(true);
  }
  let setAdverTitName = (e) => {
    changeAdverTitName(e.target.value);
    onChangType(true);
  }
  let removeAdver = (value) => {
    let toImgArr = [...adverImg];
    toImgArr.splice(value, 1);
    setAdverImg(toImgArr);
    onChangType(true);
  }
  //剩余倒计时
  let [timeNum, setTimeNum] = useState('');
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  //个位补0
  let Appendzero = (obj) => {
    if (obj < 10) return "0" + obj; else return obj;
  }
  let setMoment = (value) => {
    let SysSecond = parseInt(value / 1000);
    var second = Appendzero(Math.floor(SysSecond % 60));            // 计算秒
    var minite = Appendzero(Math.floor((SysSecond / 60) % 60));      //计算分
    var hour = Appendzero(Math.floor((SysSecond / 3600)));      //计算小时
    let endTime = hour + '小时' + minite + '分钟' + second + '秒';
    return endTime;
  }
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(1);//广播
  let [countdownSwitch, setCountdownSwitch] = useState(1);//倒计时
  //签到主题文案
  let [signTopicWord, setSignTopicWord] = useState("签到抽好礼");
  let signTopicWordChange = (value) => {
    setSignTopicWord(value.target.value)
    onChangType(true);
  }
  //奖池提示文案
  let [prizePoolNotice, setPrizePoolNotice] = useState("奖品数量有限，先到先得");
  let prizePoolNoticeChange = (value) => {
    setPrizePoolNotice(value.target.value)
    onChangType(true);
  }
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'signInHome/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'signInHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          if (items) {
            setFormData({ ...items });
            setImageUrl(items.homeBackgroundImage);
            let toSColor = indexColor;
            toSColor.color1 = items.homePageBackgroundColor || '#D8D8D8';
            // toSColor.color2 = items.activityRuleBackgroundColor || '#D8D8D8';
            // toSColor.color3 = items.activityRuleFontColor || '#868686';
            toSColor.color4 = items.signInDeskBackgroundColor || '#fff';
            toSColor.color5 = items.beforeSignInBackgroundColor || '#D8D8D8';
            toSColor.color6 = items.beforeSignInFontColor || '#868686';
            toSColor.color7 = items.afterSignInBackgroundColor || '#D8D8D8';
            toSColor.color8 = items.afterSignInFontColor || '#868686';
            toSColor.color9 = items.signInDeskTopicFontColor || '#868686';
            toSColor.color10 = items.signInDeskNoticeFontColor || '#868686';
            toSColor.color11 = items.prizePoolBackgroundColor || '#fff';
            toSColor.color12 = items.prizePoolNameFontColor || '#868686';
            toSColor.color13 = items.prizePoolNoticeFontColor || '#868686';
            toSColor.color14 = items.prizesNameFontColor || '#868686';
            toSColor.color15 = items.signRulesBackgroundColor || '#fff';
            toSColor.color16 = items.signRulesFontColor || '#868686';
            toSColor.color17 = items.winningRecordFontColor || '#868686';
            setindexColor({ ...toSColor });
            setBeforeSignImg(items.beforeSignImg);
            setAfterSignImg(items.afterSignImg);
            setTimeoutSignImg(items.timeoutSignImg);
            setPrizeSignImg(items.prizeSignImg);
            setSignTopicWord(items.signTopicWord ? items.signTopicWord : '签到抽好礼');
            setPrizePoolNotice(items.prizePoolNotice ? items.prizePoolNotice : '奖品数量有限，先到先得');
            adverForm.setFieldsValue({
              homeAdTitleName: items.homeAdTitleName,
              homeAd: items.homeAd,
              homeAdStyle: items.homeAdStyle ? items.homeAdStyle : 1,
              isShow: items.homeAdIsShow ? items.homeAdIsShow : 0
            })
            setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false);
            let toadverImg = [];
            if (items.homeAd && items.homeAd.length > 0) {
              items.homeAd.map((n) => {
                toadverImg.push(n.adImg ? n.adImg : '');
              })
            }
            setAdverImg([...toadverImg]);
            changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
            changeAdverType(items.homeAdStyle ? items.homeAdStyle : 1);
            changeAdverTitName(items.homeAdTitleName);
          }
        }
      }
    });
  }
  let [logo, setLogo] = useState("");//企业logo图片url
  let queryEnterpriseLogo = () => {
    dispatch({
      type: 'visHome/queryEnterpriseLogo',
      payload: {
        method: 'get',
        params: {}
      },
      callback:(res)=>{
        if (res.result.code == "0") {
          if(res.body){
            setLogo(res.body);
          }
        }
      }
    })
  }
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'signInHome/backStageSActivityThree',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        getStyleByActivityIdAndStyleCode();
        if (res.result.code == "0") {
          let items = res.body;
          if(items.isEnterprise){
            queryEnterpriseLogo();
          }
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare);
          setShowDraw(items.showDraw == 1);
          let timestamp = (new Date()).getTime();
          let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
          toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
          setTimeNum(toStamp);
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0)
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0)
          let toSColor = indexColor;
          setindexColor({ ...toSColor });
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  let [homeAdStyle, changeAdverType] = useState(1);
  let setAdverType = (e) => {
    changeAdverType(parseInt(e.target.value))
    onChangType(true);
  }
  useEffect(() => {
    if (isDataStore) {
      if (banChecked) {   //广告位是否显示
        adverSubmit(adverForm.getFieldsValue())
      } else {
        subInfo();
      }
    }
  }, [subimtData, adverData, indexInt, isDataStore])


  useEffect(() => {
    adverForm.setFieldsValue({   //首页广告表单
      isShow: 1,
      homeAdStyleFontColor: "#666",
      homeAd: [{}],
      homeAdStyle: 1
    });
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStageSActivityThree();
      queryPrize();
    }
  }, []);
  let [prizesList, setPrizeList] = useState([]);//奖池奖品信息
  let queryPrize = () => {
    dispatch({
      type: 'signInHome/queryPrize',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          if(items.length > 9){
            items = items.slice(0,9)
          }
          setPrizeList(items)
        } else {
          message.info(res.result.message)
        }
      }
    })
  }
  //签到图标
  let [beforeSignImg, setBeforeSignImg] = useState('');//未签到
  let [afterSignImg, setAfterSignImg] = useState('');//已签到
  let [timeoutSignImg, setTimeoutSignImg] = useState('');//过时未签到
  let [prizeSignImg, setPrizeSignImg] = useState('');//奖品
  //签到图标图片上传
  let signIconChange = (info,type) => {
    onChangType(true);
    if (info.file.status === 'done') {
      let imgUrl=info.file.response.items;
      if(type == 'beforeSignImg') setBeforeSignImg(imgUrl);
      if(type == 'afterSignImg') setAfterSignImg(imgUrl);
      if(type == 'timeoutSignImg') setTimeoutSignImg(imgUrl);
      if(type == 'prizeSignImg') setPrizeSignImg(imgUrl);
      onChangType(true);
    }
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
            <div className={styles.index_adver}><Checkbox onChange={adverChang} checked={banChecked}>广告位</Checkbox></div>
            <div style={{ marginLeft: '265px' }}>
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 2 ? '活动规则' :
                    indexInt === 3 ? '签到栏' :
                      indexInt === 4 ? '活动奖池' :
                        indexInt === 6 ? '签到规则' :
                          indexInt === 7 ? '查看中奖记录' :
                              // indexInt === 10 ? '活动时间' :
                                '广告位'
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
                {/* 中奖广播条 */}
                {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
                {/* 企业logo */}
                {logo ?
                <div className={styles.index_logo} style={winBroadcastSwitch === 1 ? null : {top: "20px"}}><img src={logo} alt="" /></div>
                 : null}
                <div className={styles.index_info}>活动规则</div>
                {isIcoShare == 1 ? <div className={styles.index_share}>分享活动</div> : null}
                <div className={styles.index_pos_bom}>
                  <div className={styles.index_signin}  onClick={setTools.bind(this, 3)} style={{ 'background': indexColor.color4 }}>
                    <div className={styles.title} style={{ 'color': indexColor.color9 }}>{signTopicWord ? signTopicWord : '签到抽好礼'}</div>
                    <div className={styles.label} style={{ 'color': indexColor.color10 }}>已连续签到X天，还差Y天就可抽奖啦！</div>
                    <div className={styles.signin_content}>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ afterSignImg ? afterSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date}>第1天</span>
                      </div>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ timeoutSignImg ? timeoutSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date}>第2天</span>
                      </div>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ afterSignImg ? afterSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date}>第3天</span>
                      </div>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ beforeSignImg ? beforeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date} style={{ 'color': "#333",'fontWeight':'700' }}>第4天</span>
                      </div>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ prizeSignImg ? prizeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date}>第5天</span>
                      </div>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ beforeSignImg ? beforeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date}>第6天</span>
                      </div>
                      <div className={styles.item}>
                        <img className={styles.icon} src={ beforeSignImg ? beforeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                        <span className={styles.date}>第7天</span>
                      </div>
                    </div>
                    <div className={styles.index_button}>
                      {countdownSwitch == 1 && timeNum ?
                      <span className={styles.button_countdown} style={{ 'color': indexColor.color6, 'background': indexColor.color5 }}>距离活动开始还剩余{timeNum}</span>
                      :<span style={{ 'color': indexColor.color6, 'background': indexColor.color5 }}>立即签到</span>}
                    </div>
                    <div className={styles.signin_backgd}></div>
                  </div>
                  {showDraw ? <div className={styles.index_prizes} onClick={setTools.bind(this, 4)} style={{ 'background': indexColor.color11 }}>
                    <div className={styles.prize_title}>
                      <div className={styles.prize_topic} style={{ 'color': indexColor.color12 }}>活动奖池</div>
                      <div className={styles.prize_label} style={{ 'color': indexColor.color13 }}><span>{prizePoolNotice ? prizePoolNotice : '奖品数量有限，先到先得'}</span></div>
                    </div>
                    <div className={styles.prize_content}>
                      {prizesList && prizesList.length > 0 && prizesList.map(item => {
                        return <div className={styles.prize_item}>
                          <img src={item.prizeImg} alt="" />
                          <div className={styles.prize_name} style={{ 'color': indexColor.color14 }}>{item.prizeName}</div>
                        </div>
                      })}
                    </div>
                  </div> : null}
                  
                  <div className={styles.index_rules} onClick={setTools.bind(this, 6)} style={{ 'background': indexColor.color15 }}>
                    <div className={styles.rules_content}>
                      <div className={styles.rules_item}>
                        <div className={styles.rules_title}>
                        <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                        <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                        </div>
                        <div className={styles.rules_btn}>已过期</div>
                      </div>
                      <div className={styles.rules_item}>
                        <div className={styles.rules_title}>
                          <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                          <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                          </div>
                          <div className={styles.rules_btn} style={{ 'color': indexColor.color8, 'background': indexColor.color7 }}>已抽奖</div>
                      </div>
                      <div className={styles.rules_item}>
                        <div className={styles.rules_title}>
                        <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                        <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                        </div>
                        <div className={styles.rules_btn} style={{ 'color': indexColor.color6, 'background': indexColor.color5 }}>立即抽奖</div>
                      </div>
                      <div className={styles.rules_item}>
                        <div className={styles.rules_title}>
                        <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                        <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                        </div>
                        <div className={styles.rules_btn} style={{ 'color': indexColor.color8, 'background': indexColor.color7 }}>未完成</div>
                      </div>
                    </div>
                    <div className={styles.rules_line} style={{ 'background': indexColor.color17 }}></div>
                    <div className={styles.index_record} onClick={setTools.bind(this, 7)} style={{ 'color': indexColor.color17 }}>查看中奖记录</div>
                  </div>
                  {banChecked ? <div className={styles.box_wrapper}>
                    <div className={styles.index_poster} onClick={setTools.bind(this, 9)} style={{ backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' }}>
                      {adverIsTit == 1 ?
                        <h4 style={{ 'color': "#fff" }}>{adverTitName ? adverTitName : '广告标题'}</h4>
                        : null}
                      <Carousel>
                        {adverImg.length > 0 ?
                          adverImg.map((item, key) => {
                            return <div className={styles.indec_poster_banner} key={key}><img src={item}></img></div>
                          })
                          : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                        }
                      </Carousel>
                    </div>
                  </div> : null}
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
                  
                  <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                </div>
                : indexInt == 2 ?
                  <div className={styles.style_box_m2}>    {/* 活动规则 */}
                    <div className={styles.style_box_main}>
                      <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                      <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span></div>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                  </div>
                  : indexInt == 3 ?
                    <div className={styles.style_box_m2}>    {/* 签到栏 */}
                      <div className={styles.style_box_main}>
                        <div className={styles.style_label}>签到栏</div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>背景色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color4} colorName='color4' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>签到按钮</div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>未签到颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color5} colorName='color5' setMColor={setMcolor} /></span></div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color6} colorName='color6' setMColor={setMcolor} /></span></div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>已签到颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color7} colorName='color7' setMColor={setMcolor} /></span></div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color8} colorName='color8' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>主题</div>
                        <div className={styles.style_box_btns}><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>主题文案</strong>
                          <Input className={styles.style_box_btn_pn} maxLength="10" value={signTopicWord} onChange={signTopicWordChange} placeholder="签到抽好礼~" />
                        </div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color9} colorName='color9' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>提示</div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color10} colorName='color10' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>签到图标</div>
                        <div className={styles.index_icon}>
                          <div className={styles.icon_item}>
                            <div className={styles.icon_title}>未签到</div>
                             <div className={styles.icon_showImg}>
                                <img src={beforeSignImg ? beforeSignImg : require('../../../../assets/activity/dollMachine_m4.png')}></img>
                              </div>
                            <div className={styles.icon_content}>
                              <div className={styles.icon_upload}>
                                <Upload
                                  name="files"
                                  action={uploadIcon}
                                  beforeUpload={beforeUpload}
                                  onChange={(e) => { signIconChange(e, 'beforeSignImg') }}
                                  headers={headers}
                                >
                                  <Button>上传图片</Button>
                                </Upload>
                              </div>
                              <div className={styles.icon_notice}>建议尺寸：96px*96px</div>
                            </div>
                          </div>
                          <div className={styles.icon_item}>
                            <div className={styles.icon_title}>已签到</div>
                            {afterSignImg ? 
                              <div className={styles.icon_showImg}>
                                <img src={afterSignImg} alt="" />
                              </div>
                            : <div className={styles.icon_showImg}>
                                <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                              </div>}
                            <div className={styles.icon_content}>
                              <div className={styles.icon_upload}>
                                <Upload
                                  name="files"
                                  action={uploadIcon}
                                  beforeUpload={beforeUpload}
                                  onChange={(e) => { signIconChange(e, 'afterSignImg') }}
                                  headers={headers}
                                >
                                  <Button>上传图片</Button>
                                </Upload>
                              </div>
                              <div className={styles.icon_notice}>建议尺寸：96px*96px</div>
                            </div>
                          </div>
                          <div className={styles.icon_item}>
                            <div className={styles.icon_title}>超时</div>
                            {timeoutSignImg ? 
                              <div className={styles.icon_showImg}>
                                <img src={timeoutSignImg} alt="" />
                              </div>
                            : <div className={styles.icon_showImg}>
                                <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                              </div>}
                            <div className={styles.icon_content}>
                              <div className={styles.icon_upload}>
                                <Upload
                                  name="files"
                                  action={uploadIcon}
                                  beforeUpload={beforeUpload}
                                  onChange={(e) => { signIconChange(e, 'timeoutSignImg') }}
                                  headers={headers}
                                >
                                  <Button>上传图片</Button>
                                </Upload>
                              </div>
                              <div className={styles.icon_notice}>建议尺寸：96px*96px</div>
                            </div>
                          </div>
                          <div className={styles.icon_item}>
                            <div className={styles.icon_title}>中奖</div>
                            {prizeSignImg ? 
                              <div className={styles.icon_showImg}>
                                <img src={prizeSignImg} alt="" />
                              </div>
                            : <div className={styles.icon_showImg}>
                                <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                              </div>}
                            <div className={styles.icon_content}>
                              <div className={styles.icon_upload}>
                                <Upload
                                  name="files"
                                  action={uploadIcon}
                                  beforeUpload={beforeUpload}
                                  onChange={(e) => { signIconChange(e, 'prizeSignImg') }}
                                  headers={headers}
                                >
                                  <Button>上传图片</Button>
                                </Upload>
                              </div>
                              <div className={styles.icon_notice}>建议尺寸：96px*96px</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                    </div>
                    : indexInt == 4 ?
                    <div className={styles.style_box_m2}>    {/* 奖池*/}
                      <div className={styles.style_box_main}>
                        <div className={styles.style_label}>奖池</div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>背景色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color11} colorName='color11' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>奖池名称</div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color12} colorName='color12' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>提示文案</div>
                        <div className={styles.style_box_btns}><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>文案</strong>
                          <Input className={styles.style_box_btn_pn} maxLength="16" value={prizePoolNotice} onChange={prizePoolNoticeChange} placeholder="奖品数量有限，先到先得" />
                        </div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color13} colorName='color13' setMColor={setMcolor} /></span></div>
                        <div className={styles.style_label}>奖品名称</div>
                        <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color14} colorName='color14' setMColor={setMcolor} /></span></div>
                      </div>
                      <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                    </div>
                    : indexInt == 6 ?  
                      <div className={styles.style_box_m2}> {/* 规则 */}
                        <div className={styles.style_box_main}>
                          <div className={styles.style_label}>规则</div>
                          <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color15} colorName='color15' setMColor={setMcolor} /></span></div>
                          <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color16} colorName='color16' setMColor={setMcolor} /></span></div>
                          <div className={styles.style_label}>中奖记录</div>
                          <div><strong className={`${styles.style_box_strong} ${styles.marginLeft}`}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color17} colorName='color17' setMColor={setMcolor} /></span></div>
                        </div>
                        <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                      </div>: null}
             
              <div className={styles.style_box_m4} style={{ display: indexInt == 9 ? 'block' : 'none' }}>    {/* 广告 */}
                <div className={styles.style_box_main}>
                  <Form form={adverForm} onFinish={adverSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    <div className={styles.style_box3_top}>
                      <Form.Item name="isShow" label="标题：" onChange={setAdverIsTit}>
                        <Radio.Group>
                          <Radio value={1}>显示</Radio>
                          <Radio value={0}>隐藏</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {adverIsTit == 1 ? 
                        <Form.Item name="homeAdTitleName" label="标题名称：" rules={[{ required: true, message: "请输入标题" }]}>
                          <Input onChange={setAdverTitName} />
                        </Form.Item>
                      : null}
                      <Form.Item name="homeAdStyle" label="样式：" onChange={setAdverType} rules={[{ required: true, message: "请选择样式" }]}>
                        <Radio.Group className={styles.side_adver_list}>
                          <Radio value={1} className={styles.side_wrap3_li}>样式1
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg1}`}>
                              <div><h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                          <Radio value={2} className={styles.side_wrap3_li}>样式2
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg2}`}>
                              <div><h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                          <Radio value={3} className={styles.side_wrap3_li}>样式3
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg3}`}>
                              <div><h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                          <Radio value={4} className={styles.side_wrap3_li}>样式4
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg4}`}>
                              <div> <h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className={styles.style_box3_list}> {/* 广告动态栏 */}
                      <Form.List name="homeAd">
                        {(fields, { add, remove }) => {
                          return (
                            <div>
                              {fields.map((field, index) => (
                                <div className={styles.style_box3_li} key={index} >
                                  <Form.Item name={[field.name, 'adImg']} label="广告图：" extra="建议尺寸：686px*220px" rules={[{ required: true, message: "请上传广告图" }]}>
                                    <Upload
                                      name="files"
                                      listType="picture"
                                      showUploadList={false}
                                      action={uploadIcon}
                                      beforeUpload={adverUpload.b}
                                      onChange={adverChange.bind(this, index)}
                                      headers={headers}
                                    >
                                      <Button icon={<UploadOutlined />}>上传图片</Button>
                                    </Upload>
                                  </Form.Item>
                                  <div className={styles.style_box3_li_img}>
                                    <img src={adverImg[index]}></img>
                                  </div>
                                  <Form.Item name={[field.name, 'adJumpType']} label="跳转类型：" rules={[{ required: true, message: '请选择跳转类型' }]}>
                                    <Select placeholder="请选择">
                                      <Option value={0}>外部链接</Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item name={[field.name, 'adContent']} label="链接：" rules={[{ required: true, message: '请输入链接' }]}>
                                    <Input />
                                  </Form.Item>
                                  <span className={styles.adver_remove} onClick={() => { remove(field.name); removeAdver(field.name); }}>删除</span>
                                </div>
                              ))}
                              <Form.Item className={styles.adver_addbtn}>
                                <Button onClick={(value) => { if (fields.length < 5) { add() } }} icon={<PlusOutlined />}>新增广告图（至多五个）</Button>
                              </Form.Item>
                            </div>
                          );
                        }}
                      </Form.List>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" htmlType="submit">保存</Button></div>
                  </Form>
                </div>
              </div>
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
export default connect(({ signInHome, loading }) => ({
  subimtData: signInHome.subimtData,
  adverData: signInHome.adverData,

}))(activityPage);
