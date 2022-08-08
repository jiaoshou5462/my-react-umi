import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, InboxOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗
import { addLeadingSlash } from 'history-with-query/PathUtils';

const activityPage = (props) => {
  let { dispatch, subimtData, onChangType, isDataStore, setIsDataTypes, storeConfig, showLayer, isDataChange, applyTheme } = props;
  let [formData, setFormData] = useState({});
  let [prizeList, setPrizeList] = useState([]) //奖品列表
  let [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息

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
      getStyleByActivityIdAndStyleCode();
    }else{
      if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
        getStageSActivityThree();
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
    let value = adverForm.getFieldsValue();
    let turntableAd = value.turntableAd ? value.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : []
    if(turntableAd.length < 1 && isShowAdver){
      message.error('广告至少上传一个！');
      return false;
    }
    if (isDataChange) {
      showLayer(2)
    } else {
      history.push("/activityConfig/activityList/activityModule/finish");
    }
  }

  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息

  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;
  //对应编辑栏
  const [indexInt, setIndexInt] = useState(1);
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //转盘样式
  let [tunType, setTunType] = useState(1);
  let setTuns = (vaule) => {
    setTunType(vaule.target.value)
    onChangType(true);
  }
  //指针样式
  let [tunType2, setTunType2] = useState(1);
  let setTuns2 = (vaule) => {
    setTunType2(vaule.target.value)
    onChangType(true);
  }
  //背景
  let [imageUrl, setImageUrl] = useState("");  //背景图
  let beforeUpload = (file) => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = info => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
      onChangType(true);
    }
  };
  //颜色设置
  let [gameColor, setgameColor] = useState({}) //参与按钮及信息颜色配置
  useEffect(() => {
    let tempColor = {  //参与按钮及信息颜色配置
      color1: "#fff",   //背景色
      color2: "#666",
      color3: "#666",
      color4: "rgba(0,0,0,.3)",  //剩余次数背景色
    }
    setgameColor(tempColor);
  }, [])
  let setMcolor = (n, i) => {
    let toMcolors = { ...gameColor };
    toMcolors[n] = i;
    setgameColor(toMcolors);
    onChangType(true);
  };
  //邀请记录
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

  //分享活动
  let [shareFirend, setShareFirend] = useState("分享好友立即得抽奖机会");  //标题名称
  let setFirendTt = (value) => {
    setShareFirend(value.target.value)
    onChangType(true);
  }
  let [firendType, setFirendType] = useState(1);
  let setFirends = (vaule) => {
    setFirendType(vaule.target.value)
    onChangType(true);
  }
  //广告
  let [adverForm] = Form.useForm();
  let [adverImg, setAdverImg] = useState([]);
  let adverUpload = (file) => {
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
  let adverChange = (i, info) => {
    let toImgArr = [...adverImg];
    toImgArr[i] = info.file.response ? info.file.response.items : "";
    setAdverImg(toImgArr);
    onChangType(true);
  };
  let removeAdver = (value) => {
    let toImgArr = [...adverImg];
    toImgArr.splice(value, 1);
    setAdverImg(toImgArr);
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
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
  let setAdverIsTit = (e) => {
    changeAdverIsTit(e.target.value)
    onChangType(true);
  }
  let setAdverTitName = (e) => {
    changeAdverTitName(e.target.value)
    onChangType(true);
  }
  let [adverIsNum, changeAdverIsNum] = useState(1);
  let [isTaskStyle, changeAdverType] = useState(1);
  let setAdverIsNum = (e) => {
    changeAdverIsNum(e.target.value)
    onChangType(true);
  }
  let setAdverType = (e) => {
    changeAdverType(parseInt(e.target.value))
    onChangType(true);
  }
  let [isShowFirend, setIsShowFirend] = useState(true);  //是否显示邀请好友块
  let [isShowShare, setIsShowShare] = useState(false);  //是否显示邀请分享块
  let [isShowAdver, setIsShowAdver] = useState(false);  //是否显示任务广告位
  let [drawPoints, setDrawPoints] = useState(0);  //抽奖次数
  let [inviteMemeberBoostNum, setInviteMemeberBoostNum] = useState(0);  //邀请上线
  let [specifyLinkNum, setSpecifyLinkNum] = useState(0);  //广告-指定上线
  let [inviteFriendsNum, setInviteFriendsNum] = useState(1);  //分享好友机会
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);
  let onBackCloreChange = (value) => {
    setIsBackClore(value)
  }
  //form保存
  let addStyle = () => {
    let toFormData = formData;
    toFormData.turntableDiskStyle = tunType;
    toFormData.turntablePointerStyle = tunType2;
    toFormData.turntableBackgroundImage = imageUrl;
    toFormData.belowBackgroundColor = gameColor.color1;
    toFormData.turntableInviteFriendsStyle = shareType;
    toFormData.turntableInviteFriendsTitle = shareTitle;
    toFormData.turntableInviteFriendsCopywriting = shareTitle2;
    toFormData.turntableAdTitleFontColor = gameColor.color3;
    toFormData.turntableLuckyDrawFontColor = gameColor.color2;
    toFormData.turntableLuckyDrawBackgroundColor = isBackClore ? gameColor.color4 : null;
    toFormData.inviteFriendsTypeStyle = firendType;
    toFormData.inviteFriendsTitle = shareFirend;
    dispatch({
      type: 'visGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'tableHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.homeAd = toFormData.homeAd;
          window.activityData_materialApply.homeAdTitleName = toFormData.homeAdTitleName;
          window.activityData_materialApply.inviteFriendsTitle = toFormData.inviteFriendsTitle ? toFormData.inviteFriendsTitle : "分享好友立即得抽奖机会";
          window.activityData_materialApply.homeAdIsShow = toFormData.homeAdIsShow;
          window.activityData_materialApply.isHomeAdPreviewShow = toFormData.isHomeAdPreviewShow;
          window.activityData_materialApply.isFans = toFormData.isFans;
          window.activityData_materialApply.showButton = toFormData.showButton;
          window.activityData_materialApply.turntableInviteFriendsCopywriting = toFormData.turntableInviteFriendsCopywriting;
          window.activityData_materialApply.turntableInviteFriendsTitle = toFormData.turntableInviteFriendsTitle ? toFormData.turntableInviteFriendsTitle : "邀请好友注册助力";
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
  let adverSubmit = () => {
    let value = adverForm.getFieldsValue();
    let turntableAd = value.turntableAd ? value.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(turntableAd.length < 1){
      message.error('广告至少上传一个！');
      return false;
    }
    let toForm = {
      turntableAd,
      activityId: activityInfo.objectId,
      isShow: parseInt(adverIsTit) || 0,
      turntableAdTitleName : adverTitName ? adverTitName : '',
      isTaskShow : parseInt(adverIsTit) ? parseInt(value.isTaskShow) : 0,
      isTaskStyle : isTaskStyle,
    }
    dispatch({
      type: 'visGame/saveAddCountAdStyle',
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
          if (isDataStore) {
            storeConfig(true);
          }
        } else {
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
  }
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'visGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'tableHome',
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
          window.activityData_materialApply.turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting;
          window.activityData_materialApply.turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
          if(items){
            setFormData({ ...items });
            setImageUrl(items.turntableBackgroundImage);
            let togameColor = gameColor;
            togameColor.color1 = items.belowBackgroundColor || '#fff'
            togameColor.color2 = items.turntableLuckyDrawFontColor || '#666'
            togameColor.color3 = items.turntableAdTitleFontColor || '#666'
            togameColor.color4 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.turntableLuckyDrawBackgroundColor) {
              setIsBackClore(true)
            } else {
              setIsBackClore(false)
            }
            setgameColor({ ...togameColor });
            let turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
            setShareTitle(turntableInviteFriendsTitle);
            let turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting ? items.turntableInviteFriendsCopywriting : "";
            setShareTitle2(turntableInviteFriendsCopywriting);
            let turntableInviteFriendsStyle = items.turntableInviteFriendsStyle ? items.turntableInviteFriendsStyle : 1;
            setShareType(turntableInviteFriendsStyle);
            let inviteFriendsTypeStyle = items.inviteFriendsTypeStyle ? items.inviteFriendsTypeStyle : 1;
            setFirendType(inviteFriendsTypeStyle);
            let inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
            setShareFirend(inviteFriendsTitle);
            let turntableDiskStyle = items.turntableDiskStyle ? items.turntableDiskStyle : 1;
            setTunType(turntableDiskStyle);
            let turntablePointerStyle = items.turntablePointerStyle ? items.turntablePointerStyle : 1;
            setTunType2(turntablePointerStyle);
            if(items.isTaskStyle){
              items.isTaskStyle = parseInt(items.isTaskStyle) ? parseInt(items.isTaskStyle) : items.isTaskStyle;
              adverForm.setFieldsValue({   //广告表单
                isTaskStyle: items.isTaskStyle
              })
              changeAdverType(items.isTaskStyle);
            }
          }
        }
      }
    });
  }
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'visGame/backStageSActivityThree',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body;
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.turntableAd = items.turntableAd;
          window.activityData_materialApply.isShow = items.tuentableGameIsShow;
          window.activityData_materialApply.turntableAdTitleName = items.turntableAdTitleName ? items.turntableAdTitleName : "广告标题ß";
          window.activityData_materialApply.isTaskShow = items.isTaskShow;
          let drawPoints = items.drawPoints ? items.drawPoints : 0;
          setDrawPoints(drawPoints);
          let isInviteBuddy = items.isInviteBuddy == 1 ? true : false
          setIsShowShare(isInviteBuddy);
          let isSpecifyLink = items.isSpecifyLink == 1 ? true : false
          setIsShowAdver(isSpecifyLink);
          let inviteFriends = items.inviteFriends == 1 ? true : false
          setIsShowFirend(inviteFriends);
          setInviteMemeberBoostNum(items.inviteMemeberBoostNum);
          setInviteFriendsNum(items.inviteFriendsNum)
          setSpecifyLinkNum(items.specifyLinkNum);
          changeAdverTitName(items.turntableAdTitleName);
          items.isTaskStyle = items.isTaskStyle ? ( parseInt(items.isTaskStyle) ? parseInt(items.isTaskStyle) : items.isTaskStyle ) : 1;
          adverForm.setFieldsValue({   //广告表单
            homeAdTitleName: items.turntableAdTitleName,
            isTaskShow: !items.isTaskShow ? 0 : 1,
            isShow: !items.tuentableGameIsShow ? 0 : 1,
            turntableAd: items.turntableAd,
            isTaskStyle: items.isTaskStyle
          })
          changeAdverType(items.isTaskStyle);
          changeAdverIsNum(items.isTaskShow ? items.isTaskShow : 0);
          let toadverImg = [];
          if (items.turntableAd && items.turntableAd.length > 0) {
            items.turntableAd.map((n) => {
              toadverImg.push(n.adImg ? n.adImg : '');
            })
          }
          setAdverImg([...toadverImg]);
          changeAdverIsTit(items.tuentableGameIsShow);
        }
      }
    });
  };
  useEffect(() => {
    if (isDataStore) {
      if(isShowAdver){
      adverSubmit();
      }
      addStyle();
    }
  }, [isDataStore]);

  useEffect(() => {
    adverForm.setFieldsValue({   //首页广告表单
      isShow: 1,
      isTaskShow: 1,
      homeAdTitleName: "",
      turntableAd: [{}],
      isTaskStyle: 1
    })
    getPrizeDetail()
  }, []);
  /*获取已保存奖品详请*/
  let getPrizeDetail = () => {
    let data = {
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'winningRules/getPrizeDetail',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setPrizeList(res.body)
        }
      }
    })
  }

  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-转盘也页*/}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div style={{ marginLeft: '320px' }}>
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 2 ? '盘面样式' :
                    indexInt === 3 ? '剩余抽奖机会' :
                      indexInt === 4 ? '邀请好友' :
                        indexInt === 6 ? '分享活动' :
                          '广告位'
              }
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap} style={{ 'height': isShowFirend && isShowShare && isShowAdver ? '1014px' : (isShowShare && isShowAdver) || (isShowFirend && isShowShare) ? '914px' : isShowShare || isShowAdver ? '777px' : '671px' }}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.internalName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
              {/* 活动页 */}
              <div className={styles.index_wrap} style={{ "backgroundColor": gameColor.color1, 'height': isShowFirend && isShowShare && isShowAdver ? "907px" : (isShowShare && isShowAdver) || (isShowFirend && isShowShare) ? '807px' : isShowShare || isShowAdver ? '670px' : '566px' }}>
                <div className={`${styles.phone_backgd} ${styles.phone_hover}`} onClick={setTools.bind(this, 1)}><img src={imageUrl}></img></div>
                <div className={`${styles.phone_tuns} ${styles.phone_hover}`} onClick={setTools.bind(this, 2)}>
                  <div className={`${styles.phone_tunbox} ${tunType == 1 || tunType == 5 ? styles.phone_tunbox1 : tunType == 2 || tunType == 4 ? styles.phone_tunbox2 : tunType == 4 ? styles.phone_tunbox3 : styles.phone_tunbox2}`} style={prizeList.length <= 4 ? { "transform": 'rotate(' + ((((2 * Math.PI * 120) / (prizeList.length)) / 4) + 4) + 'deg)' } : { "transform": 'rotate(' + (((2 * Math.PI * 120) / (prizeList.length)) / 4) + 'deg)' }}>
                    {/* 转盘 */}
                    {
                      prizeList.map((item, key) => {
                        return <div key={key} className={styles.turntable_detail_box} style={{ "width": (2 * Math.PI * 124) / (prizeList.length), 'margin-left': '-' + ((2 * Math.PI * 124) / (prizeList.length)) / 2 + 'px', 'transform': `rotate(${(360 / (prizeList.length)) * key}deg)` }}>
                          <span className={styles.turntable_detail_trans}><i style={{ 'border-left': `${((2 * Math.PI * 124) / (prizeList.length)) / 2}px solid transparent`, 'border-right': `${((2 * Math.PI * 124) / (prizeList.length)) / 2}px solid transparent` }}></i></span>
                          <p>{item.prizeName}</p>
                          <img src={item.prizeImg}></img>
                        </div>
                      })
                    }
                  </div>
                  <div className={styles.phone_tunbox_back}>
                    <span>
                      {
                        tunType == 1 ?
                          <img className={styles.phone_tunbox_back_m1} src={require('../../../../assets/activity/setpage_m20.png')} />
                          : tunType == 2 ?
                            <img className={styles.phone_tunbox_back_m1} src={require('../../../../assets/activity/setpage_m21.png')}></img>
                            : tunType == 3 ?
                              <img className={styles.phone_tunbox_back_m1} src={require('../../../../assets/activity/setpage_m22.png')}></img>
                              : tunType == 4 ?
                                <img className={styles.phone_tunbox_back_m1} src={require('../../../../assets/activity/setpage_m26.png')}></img>
                                : tunType == 5 ?
                                  <img className={styles.phone_tunbox_back_m1} src={require('../../../../assets/activity/setpage_m27.png')}></img>
                                  : <img className={styles.phone_tunbox_back_m1} src={tunType}></img>
                      }
                      {
                        tunType2 == 1 ?
                          <img className={styles.phone_tunbox_back_m2} src={require('../../../../assets/activity/setpage_m28.png')} />
                          : tunType2 == 2 ?
                            <img className={styles.phone_tunbox_back_m2} src={require('../../../../assets/activity/setpage_m29.png')} />
                            : tunType2 == 3 ?
                              <img className={styles.phone_tunbox_back_m2} src={require('../../../../assets/activity/setpage_m30.png')} />
                              : <img className={styles.phone_tunbox_back_m2} src={tunType2} />
                      }
                    </span>
                  </div>
                  {/* <span>*/}
                  {/*  {*/}
                  {/*    tunType == 1 ? <img src={require('../../../../assets/activity/setpage_m9.png')}></img> :*/}
                  {/*      tunType == 2 ? <img src={require('../../../../assets/activity/setpage_m10.png')}></img> :*/}
                  {/*        tunType == 3 ? <img src={require('../../../../assets/activity/setpage_m11.png')}></img> : null*/}
                  {/*  }*/}
                  {/*</span> */}
                </div>
                <div className={`${styles.phone_count} ${styles.phone_hover}`} style={{ "color": gameColor.color2 }} onClick={setTools.bind(this, 3)}>
                  {isBackClore ? <span style={{ "background": gameColor.color4 }}></span> : null}
                  <i>您还有{drawPoints}次机会</i></div>
                <div className={styles.phone_bombox}>
                  {isShowFirend ? <div className={`${styles.phone_share} ${styles.phone_hover} ${styles.phone_share_firend}`} onClick={setTools.bind(this, 6)}>
                    {
                      firendType == 1 ? <img src={require('../../../../assets/activity/pirend_m1.png')} />
                        : firendType == 2 ? <img src={require('../../../../assets/activity/pirend_m2.png')} />
                          : firendType == 3 ? <img src={require('../../../../assets/activity/pirend_m3.png')} />
                            : firendType == 4 ? <img src={require('../../../../assets/activity/pirend_m4.png')} />
                              : typeof firendType == 'string' ? <img src={firendType} />
                                : null
                    }
                    <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                  </div> : null}
                  {isShowShare ? <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg} ${shareType == 1 ? styles.phone_share_bg1 : shareType == 2 ? styles.phone_share_bg2 : shareType == 3 ? styles.phone_share_bg3 : shareType == 4 ? styles.phone_share_bg4 : null}`}
                  style={typeof shareType == 'string' ? {backgroundImage: `url(${shareType})`,backgroundSize: '100% auto'} : null} onClick={setTools.bind(this, 4)}>
                    <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                    <div className={styles.phone_share_btn}>立即邀请</div>
                    <div className={styles.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                    <div className={styles.phone_share_list}>
                      <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                    </div>
                  </div>
                    : null}

                  {
                    isShowAdver ? <div className={`${styles.phone_adver} ${styles.phone_hover}`} style={typeof isTaskStyle == 'number' ? { backgroundColor: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${isTaskStyle})`,backgroundSize: '100% auto'}} onClick={setTools.bind(this, 5)}>
                      {adverIsTit == 1 ?
                        <h4><span>{adverTitName ? adverTitName : '广告标题'}</span>{adverIsNum == 1 ? <i>0/{specifyLinkNum}</i> : null}</h4>
                        : null}
                      <Carousel>
                        {adverImg.length > 0 ?
                          adverImg.map((item, key) => {
                            return <div className={styles.phone_count_banner} key={key}><img src={item} /></div>
                          })
                          : <div className={styles.phone_count_banner}><h3>广告</h3></div>
                        }
                      </Carousel>
                    </div>
                      : null}

                </div>

              </div>
            </div>
          </div>
          {/* 编辑 */}
          <div className={styles.side_style}>
            <Form form={adverForm} onFinish={adverSubmit} labelCol={{ span: 3 }} wrapperCol={{ span: 12 }}>
              {/* 转盘样式 */}
              {indexInt == 2 ?
                <div className={`${styles.side_wrap1} ${styles.side_wrap}`}>
                  <div className={styles.side_wrap_by}>
                    <h6>盘面样式：</h6>
                    <Radio.Group value={tunType} className={styles.side_wrap1_list} onChange={setTuns}>
                      <Radio value={1} className={styles.side_wrap1_li}>样式1
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m20.png')} /></div>
                      </Radio>
                      <Radio value={2} className={styles.side_wrap1_li}>样式2
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m21.png')} /></div>
                      </Radio>
                      <Radio value={3} className={styles.side_wrap1_li}>样式3
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m22.png')} /></div>
                      </Radio>
                      <Radio value={4} className={styles.side_wrap1_li}>样式4
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m26.png')} /></div>
                      </Radio>
                      <Radio value={5} className={styles.side_wrap1_li}>样式5
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m27.png')} /></div>
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div className={styles.side_wrap_by}>
                    <h6>指针样式：</h6>
                    <Radio.Group value={tunType2} className={`${styles.side_wrap1_list} ${styles.side_wrap1_list2}`} onChange={setTuns2}>
                      <Radio value={1} className={styles.side_wrap1_li}>样式1
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m28.png')} /></div>
                      </Radio>
                      <Radio value={2} className={styles.side_wrap1_li}>样式2
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m29.png')} /></div>
                      </Radio>
                      <Radio value={3} className={styles.side_wrap1_li}>样式3
                        <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m30.png')} /></div>
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div className={styles.side_wrap_btn}><Button type="primary" onClick={addStyle}>保存</Button></div>
                </div>
                //  背景
                : indexInt == 1 ?
                  <div className={`${styles.side_wrap2} ${styles.side_wrap}`}>
                    <div className={styles.side_wrap_by}>
                      <div className={styles.side_wrap2_li}>
                        <span className={styles.side_wrap2_span}>背景图下方底色：</span>
                        <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color1} colorName='color1' setMColor={setMcolor} ></SetColor></span>
                      </div>
                      <div className={styles.side_wrap2_li}>
                        <span className={styles.side_wrap2_span}>上传背景图：</span>
                        {imageUrl ? 
                          <div className={styles.backImg_show}>
                            <img src={imageUrl} alt="" />
                          </div>
                        : null}
                        <div className={styles.side_wrap2_upimg}>
                          <Upload
                            name="files"
                            action={uploadIcon}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            headers={headers}
                          >
                            <Button icon={<UploadOutlined />}>上传图片</Button>
                          </Upload>
                        </div>
                        <p className={styles.style_upimg_pn}>建议尺寸：750px*1624px</p>
                      </div>
                      
                    </div>
                    <div className={styles.side_wrap_btn}><Button type="primary" onClick={addStyle}>保存</Button></div>
                  </div>
                  // 字体颜色
                  : indexInt == 3 ?
                    <div className={`${styles.side_wrap2} ${styles.side_wrap}`}>
                      <div className={styles.side_wrap_by}>
                        <div className={styles.side_wrap2_li} style={{ marginTop: '25px' }}>
                          <span className={styles.side_wrap2_span}>字体颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color2} colorName='color2' setMColor={setMcolor} ></SetColor></span>
                        </div>

                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>是否需透明底：</span>
                          <Switch className={styles.side_wrap2_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore} onChange={onBackCloreChange} />
                        </div>
                        {isBackClore ? <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>背景颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color4} colorName='color4' setMColor={setMcolor} ></SetColor></span>
                        </div> : null}
                      </div>
                      <div className={styles.side_wrap_btn}><Button type="primary" onClick={addStyle}>保存</Button></div>
                    </div>
                    // 邀请记录栏
                    : indexInt == 4 ?
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
                        <div className={styles.side_wrap_btn}><Button type="primary" onClick={addStyle}>保存</Button></div>
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
                          <div className={styles.side_wrap_btn}><Button type="primary" onClick={addStyle}>保存</Button></div>
                        </div>
                        : null}
              {/* 广告 */}
              <div className={`${styles.side_wrap4} ${styles.side_wrap}`} style={{ display: indexInt == 5 ? 'block' : 'none' }}>
                <div className={styles.side_wrap_by}>
                  <div className={styles.side_wrap4_top}>
                    <Form.Item name="isShow" label="标题：" onChange={setAdverIsTit} rules={[{ required: true, message: "请选择标题" }]}>
                      <Radio.Group>
                        <Radio value={1}>显示</Radio>
                        <Radio value={0}>隐藏</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {
                      adverIsTit == 1 ? <div style={{ width: '100%' }}>
                        {indexInt == 5 ? <Form.Item name="homeAdTitleName" label="标题名称：" rules={[{ required: true, message: "请输入标题" }]}>
                          <Input onChange={setAdverTitName} />
                        </Form.Item> : null}
                        <Form.Item name="isTaskShow" label="任务计数：" onChange={setAdverIsNum} rules={[{ required: true, message: "请选择任务计数" }]}>
                          <Radio.Group>
                            <Radio value={1}>显示</Radio>
                            <Radio value={0}>隐藏</Radio>
                          </Radio.Group>
                        </Form.Item>

                      </div> : null
                    }

                    <Form.Item name="isTaskStyle" label="样式：" onChange={setAdverType} rules={[{ required: true, message: "请选择样式" }]}>
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
                              <div className={styles.side_wrap4_li} key={index} >
                                <Form.Item name={[field.name, 'adImg']} label="广告图：" extra="建议尺寸：686px*220px" rules={[{ required: true, message: "请上传广告图" }]}>
                                  <Upload
                                    name="files"
                                    listType="picture"
                                    action={uploadIcon}
                                    showUploadList={false}
                                    beforeUpload={adverUpload.b}
                                    onChange={adverChange.bind(this, index)}
                                    headers={headers}
                                  >
                                    <Button icon={<UploadOutlined />}>上传图片</Button>
                                  </Upload>
                                </Form.Item>

                                <div className={styles.style_box4_li_img}>
                                  <img src={adverImg[index]}></img>
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

                </div>
                <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit">保存</Button></div>
              </div>
            </Form>
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
export default connect(({ visGame, loading, selectTheme}) => ({
  subimtData: visGame.subimtData,
  applyTheme: selectTheme.applyTheme
}))(activityPage);
