import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, InboxOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

let originTime = "";
const activityPage = (props) => {
  let { dispatch, subimtData, adverData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange, applyTheme } = props;
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
  useEffect(()=>{
    if(applyTheme){
      getStageSActivityThree();
    }else{
      if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
        getStageSActivityThree();
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
    let value = adverForm1.getFieldsValue();
    let turntableAd = value.turntableAd ? value.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg1[i] : '') : [];
    if(turntableAd.length < 1 && isShowAdver){
      message.error("任务广告至少上传一个！");
      return false;
    }
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
    color1: "#D8D8D8",   //按钮背景色
    color2: "#868686",  //按钮字体颜色
    color3: "rgba(0, 0, 0, 0.5)",  //排行榜、中奖记录背景色
    color4: "#fff",  //排行榜、中奖记录字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "#868686",  //我的最高分、参与人数、剩余次数字体颜色
    color7: "rgba(0, 0, 0, 0.5)",  //我的最高分、参与人数、剩余次数背景色
    color8: "#868686",  //周边操作字体颜色
    color9: "rgba(0,0,0,.5)",  //周边操作背景色
    color10: "#868686",  //活动时间字体颜色
    color11: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
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
    toFormData.homeBelowBackgroundColor = indexColor.color5;
    toFormData.homeParticipateButtonBackgroundColor = indexColor.color1;
    toFormData.homeParticipateButtonFontColor = indexColor.color2;
    toFormData.homeParticipateButtonTxt = btnTxt;
    toFormData.homeRecordBackgroundColor = indexColor.color3;
    toFormData.homeRecordFontColor = indexColor.color4;
    toFormData.homeGamecountFontColor = indexColor.color6;
    toFormData.homeGamecountBackgroundColor = isBackClore1 ? indexColor.color7 : null;
    toFormData.homePlayFontColor = indexColor.color8;
    toFormData.homePlayBackgroundColor = isBackClore ? indexColor.color9 : null;
    toFormData.activityTimeFontColor = indexColor.color10;
    toFormData.activityTimeBackgroundColor = isBackClore2 ? indexColor.color11 : null;
    toFormData.turntableInviteFriendsStyle = shareType;
    toFormData.turntableInviteFriendsTitle = shareTitle;
    toFormData.turntableInviteFriendsCopywriting = shareTitle2;
    toFormData.inviteFriendsTypeStyle = firendType;
    toFormData.turntableAdTitleFontColor = "#fff";
    toFormData.inviteFriendsTitle = shareFirend;
    toFormData.homeAd = homeAd;
    toFormData.isHomeAdPreviewShow = notCheck ? 0 : banChecked ? 1 : 0;
    toFormData.homeAdTitleName = adverTitName;
    toFormData.homeAdStyle = temp.homeAdStyle;
    toFormData.homeAdIsShow = parseInt(adverIsTit) || 0;
    toFormData.activityTime = activityTime;
    dispatch({
      type: 'strikeActivityHome/newStyleSave',
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
          window.activityData_materialApply.activityTime = toFormData.activityTime ? toFormData.activityTime : originTime;
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
  let saveAd = () => {
    let value = adverForm1.getFieldsValue();
    let turntableAd = value.turntableAd ? value.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg1[i] : '') : []
    if(turntableAd.length < 1){
      message.error('任务广告至少上传一个！');
      return false;
    }
    let toForm = {
      turntableAd,
      activityId: activityInfo.objectId,
      isShow: parseInt(adverIsTit1) || 0,
      turntableAdTitleName : adverTitName1 ? adverTitName1 : '',
      isTaskShow : parseInt(adverIsTit1) ? parseInt(value.isTaskShow) : 0,
      isTaskStyle : isTaskStyle,
    }
    dispatch({
      type: 'strikeActivityHome/saveAddCountAdStyle',
      payload: {
        method: 'postJSON',
        params: toForm
      },
      callback: (res) => {
        if (res.result.code === '0') {
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.turntableAd = toForm.turntableAd;
          window.activityData_materialApply.isShow = toForm.tuentableGameIsShow;
          window.activityData_materialApply.turntableAdTitleName = toForm.turntableAdTitleName;
          window.activityData_materialApply.isTaskShow = toForm.isTaskShow;
          window.activityData_materialApply.isShow = toForm.isShow;
          message.success(res.result.message);
          onChangType(false);
          if (setIsDataStore && isDataStore) {
            subInfo();
          }
        } else {
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
  }
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
    changeAdverTitName(e.target.value)
  }
  let removeAdver = (value) => {
    let toImgArr = [...adverImg];
    toImgArr.splice(value, 1);
    setAdverImg(toImgArr);
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
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  // let [startTime, setStartTime] = useState("");//开始时间
  // let [endTime, setEndTime] = useState("");//结束时间
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);//规则 玩法
  let [isBackClore1, setIsBackClore1] = useState(false);//剩余次数
  let onBackCloreChange = (value) => {
    setIsBackClore(value)
  }
  let onBackCloreChange1 = (value) => {
    setIsBackClore1(value)
  }
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  let onBackCloreChange2 = (value) => {
    setIsBackClore2(value)
  }
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
  let activityTimeChange = (value) => {
    setActivityTime(value.target.value);
    onChangType(true);
  }
  //广告
  let [adverForm1] = Form.useForm();
  let [adverImg1, setAdverImg1] = useState([]);
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
  let adverChange1 = (i, info) => {
    let toImgArr = [...adverImg1];
    toImgArr[i] = info.file.response ? info.file.response.items : "";
    setAdverImg1(toImgArr);
    onChangType(true);
  };
  let removeAdver1 = (value) => {
    let toImgArr = [...adverImg1];
    toImgArr.splice(value, 1);
    setAdverImg1(toImgArr);
    onChangType(true);
  }
  //广告对应跳转
  let [adverLink, setAdverLink] = useState([0]);
  let setAdLine = (vaule, i) => {
    let toLink = [...adverLink];
    toLink[vaule] = i;
    setAdverLink(toLink);
    onChangType(true);
  }
  //广告标题
  let [adverIsTit1, changeAdverIsTit1] = useState(1);
  let [adverTitName1, changeAdverTitName1] = useState("");
  let setAdverIsTit1 = (e) => {
    changeAdverIsTit1(e.target.value)
    onChangType(true);
  }
  let setAdverTitName1 = (e) => {
    changeAdverTitName1(e.target.value)
    onChangType(true);
  }
  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [isTaskStyle, changeAdverType1] = useState(1);
  let setAdverIsNum1 = (e) => {
    changeAdverIsNum1(e.target.value)
    onChangType(true);
  }
  let setAdverType1 = (e) => {
    changeAdverType1(parseInt(e.target.value))
    onChangType(true);
  }
  //参与按钮
  let [btnTxt, setBtnTxt] = useState("立即开始");  //按钮名称
  let setbtnTxt = (value) => {
    setBtnTxt(value.target.value)
    onChangType(true);
  }
  //分享相关
  let [isShowFirend, setIsShowFirend] = useState(false);  //是否显示分享好友块
  let [isShowShare, setIsShowShare] = useState(false);  //是否显示邀请好友块
  let [isShowAdver, setIsShowAdver] = useState(false);  //是否显示加次数广告位
  let [drawPoints, setDrawPoints] = useState(0);  //抽奖次数
  let [firendType, setFirendType] = useState(1);
  let [inviteMemeberBoostNum, setInviteMemeberBoostNum] = useState(0);  //邀请好友注册助力人数要求
  let setFirends = (vaule) => {
    setFirendType(vaule.target.value)
    onChangType(true);
  }
  let [inviteFriendsNum, setInviteFriendsNum] = useState(1);  //分享好友机会次数要求
  let [specifyLinkNum, setSpecifyLinkNum] = useState(0);  //广告-指定上线
  let [shareFirend, setShareFirend] = useState("分享好友立即得抽奖机会");  //标题名称
  let setFirendTt = (value) => {
    setShareFirend(value.target.value)
    onChangType(true);
  }
  let [shareType, setShareType] = useState(1);
  let setShares = (vaule) => {
    setShareType(vaule.target.value)
    onChangType(true);
  }
  let [shareTitle, setShareTitle] = useState("邀请好友注册助力");  //标题名称
  let setShareTt = (value) => {
    setShareTitle(value.target.value)
    onChangType(true);
  }

  //邀请记录-描述文案
  let [shareTitle2, setShareTitle2] = useState("");
  let setShareTt2 = (value) => {
    setShareTitle2(value.target.value)
    onChangType(true);
  }
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'strikeActivityHome/getStyleByActivityIdAndStyleCode',
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
          window.activityData_materialApply.activityTime = items.activityTime ? items.activityTime : originTime;
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if(items){
            setFormData({ ...items });
            setImageUrl(items.homeBackgroundImage);
            let inviteFriendsTypeStyle = items.inviteFriendsTypeStyle ? items.inviteFriendsTypeStyle : 1;
            setFirendType(inviteFriendsTypeStyle);
            let inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
            setShareFirend(inviteFriendsTitle);
            let turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
            setShareTitle(turntableInviteFriendsTitle);
            let turntableInviteFriendsStyle = items.turntableInviteFriendsStyle ? items.turntableInviteFriendsStyle : 1;
            setShareType(turntableInviteFriendsStyle);
            let turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting ? items.turntableInviteFriendsCopywriting : "";
            setShareTitle2(turntableInviteFriendsCopywriting);
            let toSColor = indexColor;
            toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#D8D8D8';
            toSColor.color2 = items.homeParticipateButtonFontColor || '#868686';
            toSColor.color3 = items.homeRecordBackgroundColor || 'rgba(0, 0, 0, 0.5)';
            toSColor.color4 = items.homeRecordFontColor || '#fff';
            toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
            toSColor.color6 = items.homeGamecountFontColor || '#868686';
            toSColor.color7 = items.homeGamecountBackgroundColor || 'rgba(0, 0, 0, 0.5)';
            toSColor.color8 = items.homePlayFontColor || '#868686';
            toSColor.color9 = items.homePlayBackgroundColor || 'rgba(0,0,0,.5)';
            toSColor.color10 = items.activityTimeFontColor || '#868686';
            toSColor.color11 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.homePlayBackgroundColor) {
              setIsBackClore(true)
            } else {
              setIsBackClore(false)
            }
            if (items.homeGamecountBackgroundColor) {
              setIsBackClore1(true)
            } else {
              setIsBackClore1(false)
            }
            if (items.activityTimeBackgroundColor) {
              setIsBackClore2(true)
            } else {
              setIsBackClore2(false)
            }
            setindexColor({ ...toSColor });
            setBtnTxt(items.homeParticipateButtonTxt ? items.homeParticipateButtonTxt : '');
            setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false);
            items.homeAdStyle = items.homeAdStyle ? ( parseInt(items.homeAdStyle) ? parseInt(items.homeAdStyle) : items.homeAdStyle ) : 1;
            adverForm.setFieldsValue({
              homeAdTitleName: items.homeAdTitleName,
              homeAd: items.homeAd,
              homeAdStyle: items.homeAdStyle,
              isShow: items.homeAdIsShow ? items.homeAdIsShow : 0
            })
            changeAdverType(items.homeAdStyle);
            let toadverImg = [];
            if (items.homeAd && items.homeAd.length > 0) {
              items.homeAd.map((n) => {
                toadverImg.push(n.adImg ? n.adImg : '');
              })
            }
            setAdverImg([...toadverImg]);
            changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
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
      type: 'strikeActivityHome/backStageSActivityThree',
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
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.turntableAd = items.turntableAd;
          window.activityData_materialApply.isShow = items.tuentableGameIsShow;
          window.activityData_materialApply.turntableAdTitleName = items.turntableAdTitleName;
          window.activityData_materialApply.isTaskShow = items.isTaskShow;
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare);
          let drawPoints = items.drawPoints ? items.drawPoints : 0;
          setDrawPoints(drawPoints);
          let inviteFriends = items.inviteFriends == 1 ? true : false;
          setIsShowFirend(inviteFriends);
          //邀请好友显示
          let isInviteBuddy = items.isInviteBuddy == 1 ? true : false;
          setIsShowShare(isInviteBuddy);
          let isSpecifyLink = items.isSpecifyLink == 1 ? true : false;
          setIsShowAdver(isSpecifyLink);
          let timestamp = (new Date()).getTime();
          let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
          toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
          setTimeNum(toStamp);
          setInviteFriendsNum(items.inviteFriendsNum);
          setInviteMemeberBoostNum(items.inviteMemeberBoostNum);
          setSpecifyLinkNum(items.specifyLinkNum);
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0)
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0)
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
          // setStartTime(items.startTime)
          // setEndTime(items.endTime)
          originTime = items.startTime + '——' + items.endTime;
          let toSColor = indexColor;
          setindexColor({ ...toSColor });
          //可加次数广告
          changeAdverTitName1(items.turntableAdTitleName);
          items.isTaskStyle = items.isTaskStyle ? ( parseInt(items.isTaskStyle) ? parseInt(items.isTaskStyle) : items.isTaskStyle ) : 1;
          adverForm1.setFieldsValue({   //广告表单
            homeAdTitleName: items.turntableAdTitleName,
            isTaskShow: !items.isTaskShow ? 0 : 1,
            isShow: items.tuentableGameIsShow ? items.tuentableGameIsShow : 0,
            turntableAd: items.turntableAd,
            isTaskStyle: items.isTaskStyle
          })
          changeAdverType1(items.isTaskStyle);
          let toadverImg1 = [];
          if (items.turntableAd && items.turntableAd.length > 0) {
            items.turntableAd.map((n) => {
              toadverImg1.push(n.adImg ? n.adImg : '');
            })
          }
          setAdverImg1([...toadverImg1]);
          changeAdverIsTit1(items.tuentableGameIsShow);
          changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
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
      if(isShowAdver){
        saveAd(adverForm1.getFieldsValue())
      }
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
    adverForm1.setFieldsValue({   //可加次数广告表单
      isShow: 1,
      isTaskShow: 1,
      homeAdStyleFontColor: "#666",
      homeAdTitleName: "",
      turntableAd: [{}],
      isTaskStyle: 1
    })
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStrikeConfig();
    }
  }, []);
  // let [isShowParticipants, getIsShowParticipants] = useState(0);//是否展示参与人数
  let [gameNumber, setGameNumber] = useState(0);//剩余次数
  let [gameNumberType, setGameNumberType] = useState(1);//剩余次数
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
          // getIsShowParticipants(items.showNumber);
          setGameNumber(items.gameNumber);
          setGameNumberType(items.gameNumberType);
        } else {
          message.info(res.result.message)
        }
      }
    })
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
                  indexInt === 2 ? '参与按钮' :
                    indexInt === 3 ? '排行榜、中奖记录' :
                      indexInt === 4 ? '周边操作' :
                        indexInt === 6 ? '分享好友' :
                          indexInt === 7 ? '邀请好友' :
                            indexInt === 8 ? '我的最高分、剩余次数' :
                              indexInt === 10 ? '活动时间' :
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
              <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
                {/* 中奖广播条 */}
                {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
                {logo ?
                <div className={styles.index_logo} style={winBroadcastSwitch === 1 ? null : {top: "20px"}}><img src={logo} alt="" /></div>
                 : null}
                {timeSwitch === 1 ?
                <div className={styles.index_time} style={{ "color": indexColor.color10 }} onClick={setTools.bind(this, 10)}>
                  <div className={styles.time_wrap}>
                    {isBackClore2 ? <span style={{ "background": indexColor.color11 }}></span> : null}
                    <div>{activityTime}</div>
                  </div>
                  {/* <div>{startTime ? startTime : '活动开始时间'}——{endTime ? endTime : '活动结束时间'}</div> */}
                </div>
                : null}
                {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
                <div className={styles.index_pos_bom}>
                  <div className={styles.index_score} onClick={setTools.bind(this, 8)} style={{ color: `${indexColor.color6}`,top: winBroadcastSwitch === 1 ? '45px' : '15px'}} >
                    <i>我的最高分：1000</i>
                    {isBackClore1 ? <span className={styles.back} style={{ 'background': indexColor.color7 }}></span> : null}
                  </div>
                  <div className={styles.index_info} style={{ top: winBroadcastSwitch === 1 ? '45px' : '15px' }}>
                    <span onClick={setTools.bind(this, 3)} style={{ 'color': indexColor.color4, 'background': indexColor.color3 }}>排行榜</span>
                    <span onClick={setTools.bind(this, 3)} style={{ 'color': indexColor.color4, 'background': indexColor.color3 }}>中奖记录</span>
                  </div>
                  {/* {isShowParticipants ? 
                    <div className={styles.index_people} onClick={setTools.bind(this, 8)} style={{ color: `${indexColor.color6}`}} >
                      <i>已有10000人参与活动</i>
                      {isBackClore1 ? <span className={styles.back} style={{ 'background': indexColor.color7 }}></span> : null}
                    </div>
                  :null} */}
                  {gameNumberType != 2 ? 
                    <div className={styles.index_count} style={{ "color": indexColor.color6 }} onClick={setTools.bind(this, 8)}>
                      {isBackClore1 ? <span style={{ "background": indexColor.color7 }}></span> : null}
                      <i>剩余{gameNumber}次机会</i>
                    </div>
                  : null}
                  <div className={styles.index_button} onClick={setTools.bind(this, 2)}>
                    {countdownSwitch == 1 && timeNum ?
                    <span className={styles.button_countdown} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>距离活动开始还剩余{timeNum}</span>
                    :<span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '立即开始'}</span>}
                  </div>
                  <div className={styles.index_play} onClick={setTools.bind(this, 4)} style={{ 'color': indexColor.color8 }}>
                    {isBackClore ? <span style={{ 'background': indexColor.color9 }}></span> : null}
                    <i>活动规则  <b>|</b>  玩法介绍</i></div>
                  {/* 分享 */}
                  {isShowFirend ? <div className={styles.box_wrapper}>
                    <div className={`${styles.phone_share} ${styles.phone_hover}`} onClick={setTools.bind(this, 6)}>
                      {
                        firendType == 1 ? <img src={require('../../../../assets/activity/pirend_m1.png')} />
                          : firendType == 2 ? <img src={require('../../../../assets/activity/pirend_m2.png')} />
                            : firendType == 3 ? <img src={require('../../../../assets/activity/pirend_m3.png')} />
                              : firendType == 4 ? <img src={require('../../../../assets/activity/pirend_m4.png')} />
                                : typeof firendType == 'string' ? <img src={firendType} />
                                  : null
                      }
                      <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                    </div>
                  </div> : null}
                  {isShowShare ? <div className={styles.box_wrapper}>
                    <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg} ${shareType == 1 ? styles.phone_share_bg1 : shareType == 2 ? styles.phone_share_bg2 : shareType == 3 ? styles.phone_share_bg3 : shareType == 4 ? styles.phone_share_bg4 : null}`} 
                    style={typeof shareType == 'string' ? {backgroundImage: `url(${shareType})`,backgroundSize: '100% auto'} : null} onClick={setTools.bind(this, 7)}>
                      <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                      <div className={styles.phone_share_btn}>立即邀请</div>
                      <div className={styles.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                      <div className={styles.phone_share_list}>
                        <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                      </div>
                    </div>
                  </div> : null}
                  {isShowAdver ? <div className={styles.box_wrapper}>
                    <div className={`${styles.index_poster} ${styles.phone_hover}`} style={typeof isTaskStyle == 'number' ? { backgroundColor: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${isTaskStyle})`,backgroundSize: '100% auto'}} onClick={setTools.bind(this, 5)}>
                      {adverIsTit1 == 1 ?
                        <h4 style={{ 'color': "#fff" }}><span>{adverTitName1 ? adverTitName1 : '广告标题'}</span>   {adverIsNum1 == 1 ? <span>  0/{specifyLinkNum}</span> : null}</h4>
                        : null}
                      <Carousel>
                        {adverImg1.length > 0 ?
                          adverImg1.map((item, key) => {
                            return <div className={styles.indec_poster_banner} key={key}><img src={item} /></div>
                          })
                          : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                        }
                      </Carousel>
                    </div>
                  </div> : null}
                  {banChecked ? <div className={styles.box_wrapper}>
                    <div className={styles.index_poster} onClick={setTools.bind(this, 9)} style={ typeof homeAdStyle == 'number' ? { backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${homeAdStyle})`}}>
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
                    <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color5} colorName='color5' setMColor={setMcolor} /></span>
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
                    {/* <div className={styles.style_m1_img}><img src="" alt="默认图片"></img></div> */}
                  </div>
                  
                  <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                </div>
                : indexInt == 2 ?
                  <div className={styles.style_box_m2}>    {/* 参与按钮 */}
                    <div className={styles.style_box_main}>
                      <div className={styles.style_box_btns}><strong className={styles.style_box_strong}>按钮文案</strong>
                        <Input className={styles.style_box_btn_pn} value={btnTxt} onChange={setbtnTxt} maxLength="8" placeholder="立即开始" />
                      </div>
                      <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span></div>
                      <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                  </div>
                  : indexInt == 3 ?
                    <div className={styles.style_box_m2}>    {/* 排行榜、中奖记录 */}
                      <div className={styles.style_box_main}>
                        <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span></div>
                        <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color4} colorName='color4' setMColor={setMcolor} /></span></div>
                      </div>
                      <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                    </div>
                    // 周边操作  活动规则、玩法介绍
                    : indexInt == 4 ?
                      <div className={styles.style_box_m2}>
                        <div className={styles.style_box_main}>
                          <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color8} colorName='color8' setMColor={setMcolor} /></span></div>
                          <div><strong className={styles.style_box_strong}>是否需透明底</strong>
                            <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore} onChange={onBackCloreChange} />
                          </div>
                          {isBackClore ? <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color9} colorName='color9' setMColor={setMcolor} /></span></div> : null}

                        </div>
                        <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                      </div>
                    // 我的最高分、参与人数、剩余次数
                    : indexInt == 8 ?
                      <div className={styles.style_box_m2}>
                        <div className={styles.style_box_main}>
                          <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color6} colorName='color6' setMColor={setMcolor} /></span></div>
                          <div><strong className={styles.style_box_strong}>是否需透明底</strong>
                            <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore1} onChange={onBackCloreChange1} />
                          </div>
                          {isBackClore1 ? <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color7} colorName='color7' setMColor={setMcolor} /></span></div> : null}

                        </div>
                        <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                      </div>
                      // 好友分享
                      : indexInt == 6 ?
                        <div className={`${styles.side_wrap3} ${styles.side_wrap}`}>
                          <div className={styles.side_wrap_by}>
                            <div className={styles.side_wrap3_top}>
                              <span>标题名称：</span>
                              <Input className={styles.side_wrap3_toppn} value={shareFirend} onChange={setFirendTt} maxLength="14" placeholder="最多不超过14个字" />
                            </div>
                            <div className={`${styles.side_wrap3_table} ${styles.side_wrap3_table2}`}>
                              <h6>样式：</h6>
                              <Radio.Group value={firendType} className={styles.side_wrap3_list} onChange={setFirends}>
                                <Radio value={1} className={styles.side_wrap3_li}>样式1
                                  <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/pirend_m1.png')}></img></div>
                                </Radio>
                                <Radio value={2} className={styles.side_wrap3_li}>样式2
                                  <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/pirend_m2.png')}></img></div>
                                </Radio>
                                <Radio value={3} className={styles.side_wrap3_li}>样式3
                                  <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/pirend_m3.png')}></img></div>
                                </Radio>
                                <Radio value={4} className={styles.side_wrap3_li}>样式4
                                  <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/pirend_m4.png')}></img></div>
                                </Radio>
                              </Radio.Group>
                            </div>

                          </div>
                          <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit" onClick={() => { subInfo() }}>保存</Button></div>
                        </div>
                        // 活动时间
                        : indexInt == 10 ?
                        <div className={styles.style_box_m2}>
                          <div className={styles.style_box_main}>
                            <div>
                              <strong className={styles.style_box_strong}>活动时间</strong>
                              <Input className={styles.style_box_btn_pn} value={activityTime} onChange={activityTimeChange} />
                            </div>
                            <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color10} colorName='color10' setMColor={setMcolor} /></span></div>
                            <div><strong className={styles.style_box_strong}>是否需透明底</strong>
                              <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore2} onChange={onBackCloreChange2} />
                            </div>
                            {isBackClore2 ? <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color11} colorName='color11' setMColor={setMcolor} /></span></div> : null}

                          </div>
                          <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                        </div>
                        // 邀请记录栏
                        : indexInt == 7 ?
                          <div className={`${styles.side_wrap3} ${styles.side_wrap}`}>
                            <div className={styles.side_wrap_by}>
                              <div className={styles.side_wrap3_top}>
                                <p>
                                  <span>标题名称：</span>
                                  <Input className={styles.side_wrap3_toppn} value={shareTitle} onChange={setShareTt} maxLength="12" />
                                </p>
                                <p>
                                  <span>描述文案：</span>
                                  <Input className={styles.side_wrap3_toppn} value={shareTitle2} onChange={setShareTt2} maxLength="30" />
                                </p>
                              </div>
                              <div className={styles.side_wrap3_table}>
                                <h6>样式：</h6>
                                <Radio.Group value={shareType} className={styles.side_wrap3_list} onChange={setShares}>
                                  <Radio value={1} className={styles.side_wrap3_li}>样式1
                                    <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/share_m5.png')}></img></div>
                                  </Radio>
                                  <Radio value={2} className={styles.side_wrap3_li}>样式2
                                    <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/share_m2.png')}></img></div>
                                  </Radio>
                                  <Radio value={3} className={styles.side_wrap3_li}>样式3
                                    <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/share_m3.png')}></img></div>
                                  </Radio>
                                  <Radio value={4} className={styles.side_wrap3_li}>样式4
                                    <div className={styles.side_wrap3_liimg}><img src={require('../../../../assets/activity/share_m4.png')}></img></div>
                                  </Radio>
                                </Radio.Group>
                              </div>

                            </div>
                            <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit" onClick={() => { subInfo() }}>保存</Button></div>
                          </div>
                          : null}
              {/* 广告 可增加游戏次数广告*/}
              <div className={`${styles.side_wrap4} ${styles.side_wrap}`} style={{ display: indexInt == 5 ? 'block' : 'none' }}>
                <div className={styles.side_wrap_by}>
                  <Form form={adverForm1} onFinish={saveAd} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    <div className={styles.side_wrap4_top}>
                      <Form.Item name="isShow" label="标题：" onChange={setAdverIsTit1} rules={[{ required: true, message: "请选择标题" }]}>
                        <Radio.Group>
                          <Radio value={1}>显示</Radio>
                          <Radio value={0}>隐藏</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {/* <Form.Item name="homeAdStyleFontColor" label="字体颜色：">
                                                <SetColor colors={gameColor.color3} colorName='color3' setMColor={setMcolor} ></SetColor>
                                            </Form.Item> */}
                      {
                        adverIsTit1 == 1 ? <div style={{ width: '100%' }}>
                          {indexInt == 5 ? <Form.Item name="homeAdTitleName" label="标题名称：" rules={[{ required: true, message: "请输入标题" }]}>
                            <Input onChange={setAdverTitName1} />
                          </Form.Item> : null}
                          <Form.Item name="isTaskShow" label="任务计数：" onChange={setAdverIsNum1} rules={[{ required: true, message: "请选择任务计数" }]}>
                            <Radio.Group>
                              <Radio value={1}>显示</Radio>
                              <Radio value={0}>隐藏</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </div> : null
                      }
                      <Form.Item name="isTaskStyle" label="样式：" onChange={setAdverType1} rules={[{ required: true, message: "请选择样式" }]}>
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
                    <div className={styles.side_wrap4_list}> {/* 广告动态栏 */}
                      <Form.List name="turntableAd">
                        {(fields, { add, remove }) => {
                          return (
                            <div className={styles.side_wrap4_list_mian}>
                              {fields.map((field, index) => (
                                <div className={`${styles.side_wrap4_li} ${styles.style_box3_li}`}>
                                  <Form.Item name={[field.name, 'adImg']} label="广告图：" extra="建议尺寸：686px*220px" rules={[{ required: true, message: "请上传广告图" }]}>
                                    <Upload
                                      name="files"
                                      listType="picture"
                                      action={uploadIcon}
                                      showUploadList={false}
                                      beforeUpload={adverUpload1.b}
                                      onChange={adverChange1.bind(this, index)}
                                      headers={headers}
                                    >
                                      <Button icon={<UploadOutlined />}>上传图片</Button>
                                    </Upload>
                                  </Form.Item>

                                  <div className={styles.style_box3_li_img}>
                                    <img src={adverImg1[index]}></img>
                                  </div>

                                  <Form.Item name={[field.name, 'adJumpType']} label="跳转类型：" rules={[{ required: true, message: '请选择跳转类型' }]}>
                                    <Select placeholder="请选择" onChange={setAdLine.bind(this, index)}>
                                      {/* <Option value='0'>内部链接</Option> */}
                                      <Option value={1}>外部链接</Option>
                                      {/* <Option value='2'>文章咨询</Option>
                                                            <Option value='3'>保险产品</Option> */}
                                    </Select>
                                  </Form.Item>
                                  {adverLink[index] == '2' ?
                                    <Form.Item name={[field.name, 'adArticle']} label="文章：">
                                      <Button>添加文章</Button>
                                    </Form.Item>
                                    : <Form.Item name={[field.name, 'adContent']} label="链接：" rules={[{ required: true, message: '请输入链接' }]}>
                                      <Input />
                                    </Form.Item>
                                  }
                                  <span className={styles.adver_remove} onClick={() => { remove(field.name); removeAdver1(field.name); }}>删除</span>
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
                    <div className={`${styles.style_box_btn} ${styles.side_wrap_btn2}`}><Button type="primary" htmlType="submit">保存</Button></div>
                  </Form>
                </div>
                {/* <div className={`${styles.side_wrap_btn} ${styles.side_wrap_btn2}`}><Button type="primary" htmlType="submit" onClick={() => { subInfo() }}>保存</Button></div> */}
              </div>
              <div className={styles.style_box_m3} style={{ display: indexInt == 9 ? 'block' : 'none' }}>    {/* 广告 */}
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
export default connect(({ strikeActivityHome, loading, selectTheme }) => ({
  subimtData: strikeActivityHome.subimtData,
  adverData: strikeActivityHome.adverData,
  applyTheme: selectTheme.applyTheme
}))(activityPage);
