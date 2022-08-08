import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch, Modal } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, RedoOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined } from '@ant-design/icons';
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
    let turntableAd = temp.turntableAd ? temp.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(turntableAd.length < 1 && isShowAdver){
      message.error('广告至少上传一个！');
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
    color1: "#1890FF",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color5: "#ffffff",  //页面背景色
    color7: "#666",  //剩余次数字体颜色
    color8: "rgba(0,0,0,.3)",  //剩余次数背景色
  });
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
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
  let [drawImageUrl, setDrawImageUrl] = useState("");  //开奖效果图
  let [fileList,setFileList] = useState([]);//海报背景图
  let [previewImage,setPreviewImage] = useState('');
  let [previewVisible,setPreviewVisible] = useState(false);
  let [previewTitle,setPreviewTitle] = useState('');
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
      }else if (name == 'draw') {
        setDrawImageUrl(info.file.response.items)
      }
      onChangType(true);
    }
    if(name == 'poster'){
      let toItem = info.fileList;
      setFileList(toItem);
      if(toItem[toItem.length - 1].status && toItem[toItem.length - 1].status == 'done'){
        setImageUrl(toItem[toItem.length - 1].url ? toItem[toItem.length - 1].url : toItem[toItem.length - 1].response.items)
      }
    }
  };
  let handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  }
  let getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  let handleCancel = () => {
    setPreviewVisible(false);
  }
  let [saveInfo,setSaveInfo] = useState(false);
  //提交
  let subInfo = () => {
    let temp = adverForm.getFieldsValue();
    let turntableAd = temp.turntableAd ? temp.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(indexInt == 5 && turntableAd.length < 1){
      setIsDataStore(false);
      setIsDataTypes(false);
      message.error('广告至少上传一个！');
      return
    }
    let toFormData = formData;
    toFormData.gameBackgroundImage = imageUrl;
    toFormData.lotterySpecialEffectsImage = drawImageUrl;
    toFormData.gameBelowBackgroundColor = indexColor.color5;
    toFormData.gameParticipateButtonBackgroundColor = indexColor.color1;
    toFormData.gameParticipateButtonFontColor = indexColor.color2;
    toFormData.gameParticipateButtonTxt = btnTxt ? btnTxt : "立即抽奖";
    toFormData.gameSaveButtonTxt = saveTxt ? saveTxt : "保存图片";
    toFormData.turntableInviteFriendsStyle = shareType;
    toFormData.turntableInviteFriendsTitle = shareTitle;
    toFormData.turntableInviteFriendsCopywriting = shareTitle2;
    toFormData.turntableLuckyDrawFontColor = indexColor.color7;
    toFormData.turntableLuckyDrawBackgroundColor = isBackClore1 ? indexColor.color8 : null;
    toFormData.inviteFriendsTypeStyle = firendType;
    toFormData.turntableAdTitleFontColor = "#fff";
    toFormData.inviteFriendsTitle = shareFirend;
    toFormData.turntableAd = turntableAd;
    toFormData.tuentableGameIsShow = parseInt(adverIsTit) || 0;
    toFormData.turntableAdTitleName = adverTitName ? adverTitName : '';
    toFormData.isTaskShow = parseInt(temp.isTaskShow);
    toFormData.isTaskStyle = parseInt(isTaskStyle);
    let tofileList=[];
    fileList && fileList.length > 0 && fileList.forEach(item => {
      let toitem={};
      toitem.url = item.url ? item.url : item.response.items;
      toitem.status = item.status;
      toitem.name = item.name;
      tofileList.push(toitem)
    })
    toFormData.fileList = tofileList;
    dispatch({
      type: 'posterDirectGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'posterDirectHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success(res.result.message);
          onChangType(false);
          if (isDataStore) {
            // storeConfig(true);
          }
          setSaveInfo(true)
        } else {
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
  };
  useEffect(()=>{
    if(saveAdInfo && saveInfo){
      onChangType(false);
      storeConfig(true);
    }else if(saveInfo && !isShowAdver){
      onChangType(false);
      storeConfig(true);
    }
  },[saveAdInfo,saveInfo])
  let [saveAdInfo,setSaveAdInfo] = useState(false);
  let saveAd = () => {
    let value = adverForm.getFieldsValue();
    let turntableAd = value.turntableAd ? value.turntableAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : []
    let toForm = {
      turntableAd,
      activityId: activityInfo.objectId,
      isShow: parseInt(adverIsTit) || 0,
      turntableAdTitleName : adverTitName ? adverTitName : '',
      isTaskShow : parseInt(adverIsTit) ? parseInt(value.isTaskShow) : 0,
      isTaskStyle : parseInt(isTaskStyle),
    }
    dispatch({
      type: 'posterDirectGame/saveAddCountAdStyle',
      payload: {
        method: 'postJSON',
        params: toForm
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success(res.result.message);
          onChangType(false);
          if (setIsDataStore && isDataStore) {
            subInfo(0);
          }
          setSaveAdInfo(true)
        } else {
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
  }
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  //是否需透明底
  let [isBackClore1, setIsBackClore1] = useState(false);//剩余次数
  let onBackCloreChange1 = (value) => {
    setIsBackClore1(value)
  }

  //广告
  let [adverForm] = Form.useForm();
  let [adverImg, setAdverImg] = useState([]);
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
  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [isTaskStyle, changeAdverType] = useState(1);
  let setAdverIsNum = (e) => {
    changeAdverIsNum1(e.target.value)
    onChangType(true);
  }
  let setAdverType = (e) => {
    changeAdverType(e.target.value)
    onChangType(true);
  }
  //参与按钮
  let [btnTxt, setBtnTxt] = useState("立即抽奖");  //按钮名称
  let setbtnTxt = (value) => {
    setBtnTxt(value.target.value)
    onChangType(true);
  }
  //参与按钮
  let [saveTxt, setSaveTxt] = useState("保存图片");  //保存按钮
  let setsaveTxt = (value) => {
    setSaveTxt(value.target.value)
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
      type: 'posterDirectGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'posterDirectHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          if (res.body && res.body.styleValue) {
            let items = JSON.parse(res.body.styleValue);
            setFormData({ ...items });
            setImageUrl(items.gameBackgroundImage);
            setDrawImageUrl(items.lotterySpecialEffectsImage ? items.lotterySpecialEffectsImage : '');
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
            toSColor.color5 = items.gameBelowBackgroundColor || '#ffffff';
            toSColor.color2 = items.gameParticipateButtonFontColor || '#fff';
            toSColor.color1 = items.gameParticipateButtonBackgroundColor || '#1890FF';
            toSColor.color7 = items.turntableLuckyDrawFontColor || '#666'
            toSColor.color8 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.turntableLuckyDrawBackgroundColor) {
              setIsBackClore1(true)
            } else {
              setIsBackClore1(false)
            }
            setindexColor({ ...toSColor });
            setBtnTxt(items.gameParticipateButtonTxt ? items.gameParticipateButtonTxt : "立即抽奖");
            setSaveTxt(items.gameSaveButtonTxt ? items.gameSaveButtonTxt : "保存图片");
            setFileList(items.fileList);
          }
        }
      }
    });
  }
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'posterDirectGame/backStageSActivityThree',
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
          setInviteFriendsNum(items.inviteFriendsNum);
          setInviteMemeberBoostNum(items.inviteMemeberBoostNum);
          setSpecifyLinkNum(items.specifyLinkNum);
          //可加次数广告
          changeAdverTitName(items.turntableAdTitleName);
          adverForm.setFieldsValue({   //广告表单
            gameAdTitleName: items.turntableAdTitleName,
            isTaskShow: !items.isTaskShow ? 0 : 1,
            isShow: items.tuentableGameIsShow ? items.tuentableGameIsShow : 0,
            turntableAd: items.turntableAd,
            isTaskStyle: items.isTaskStyle ? items.isTaskStyle : 1
          })
          changeAdverType(items.isTaskStyle ? items.isTaskStyle : 1);
          let toadverImg = [];
          if (items.turntableAd && items.turntableAd.length > 0) {
            items.turntableAd.map((n) => {
              toadverImg.push(n.adImg ? n.adImg : '');
            })
          }
          setAdverImg([...toadverImg]);
          changeAdverIsTit(items.tuentableGameIsShow);
          changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  useEffect(() => {
    if (isDataStore) {
      if(isShowAdver){
        saveAd(adverForm.getFieldsValue())
      }
      subInfo();
    }
  }, [subimtData, adverData, indexInt, isDataStore])
  useEffect(() => {
    adverForm.setFieldsValue({   //可加次数广告表单
      isShow: 1,
      isTaskShow: 1,
      gameAdTitleName: "",
      turntableAd: [{}],
      isTaskStyle: 1
    })
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStageSActivityThree();
      getStyleByActivityIdAndStyleCode();
    }
  }, []);
  return (
    <div>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div style={{ marginLeft: '365px' }}>
              {
                indexInt === 1 ? '海报图配置' :
                indexInt === 2 ? '功能按钮配置' :
                indexInt === 7 ? '邀请好友' :
                indexInt === 8 ? '剩余次数、重新生成' :
                indexInt === 6 ? '分享好友' :
                '广告位'
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
              <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
                {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
                <div className={styles.index_pos_bom}>
                  <div className={styles.index_count} style={{ "color": indexColor.color7 }} onClick={setTools.bind(this, 8)}>
                    {isBackClore1 ? <span style={{ "background": indexColor.color8 }}></span> : null}
                    <i>剩余抽奖次数：{drawPoints}次</i>
                  </div>
                  <div className={styles.index_button} onClick={setTools.bind(this, 2)}>
                    <span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '立即抽奖'}</span>
                  </div>
                  <div className={styles.index_button} onClick={setTools.bind(this, 2)}>
                    <span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{saveTxt ? saveTxt : '保存图片'}</span>
                  </div>
                  <div className={`${styles.index_count} ${styles.index_count1}`} style={{ "color": indexColor.color7 }} onClick={setTools.bind(this, 8)}>
                    {isBackClore1 ? <span style={{ "background": indexColor.color8 }}></span> : null}
                    <RedoOutlined className={styles.refresh}/>
                    <i>重新生成</i>
                  </div>
                  {/* 分享 */}
                  {isShowFirend ? <div className={styles.box_wrapper}>
                    <div className={`${styles.phone_share} ${styles.phone_hover}`} onClick={setTools.bind(this, 6)}>
                      {
                        firendType == 1 ? <img src={require('../../../../assets/activity/pirend_m1.png')} />
                          : firendType == 2 ? <img src={require('../../../../assets/activity/pirend_m2.png')} />
                            : firendType == 3 ? <img src={require('../../../../assets/activity/pirend_m3.png')} />
                              : firendType == 4 ? <img src={require('../../../../assets/activity/pirend_m4.png')} />
                                : null
                      }
                      <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                    </div>
                  </div> : null}
                  {isShowShare ? <div className={styles.box_wrapper}>
                    <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg} ${shareType == 1 ? styles.phone_share_bg1 : shareType == 2 ? styles.phone_share_bg2 : shareType == 3 ? styles.phone_share_bg3 : shareType == 4 ? styles.phone_share_bg4 : null}`} onClick={setTools.bind(this, 7)}>
                      <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                      <div className={styles.phone_share_btn}>立即邀请</div>
                      <div className={styles.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                      <div className={styles.phone_share_list}>
                        <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                      </div>
                    </div>
                  </div> : null}
                  {isShowAdver ? <div className={styles.box_wrapper}>
                    <div className={`${styles.index_poster} ${styles.phone_hover}`} style={{ backgroundColor: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'none' }} onClick={setTools.bind(this, 5)}>
                      {adverIsTit == 1 ?
                        <h4 style={{ 'color': "#fff" }}><span>{adverTitName ? adverTitName : '广告标题'}</span>   {adverIsNum1 == 1 ? <span>  0/{specifyLinkNum}</span> : null}</h4>
                        : null}
                      <Carousel>
                        {adverImg.length > 0 ?
                          adverImg.map((item, key) => {
                            return <div className={styles.indec_poster_banner} key={key}><img src={item} /></div>
                          })
                          : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                        }
                      </Carousel>
                    </div>
                  </div> : null}
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
                    <span className={styles.side_wrap2_color}>
                      <SetColor colors={indexColor.color5} colorName='color5' setMColor={setMcolor} />
                    </span>
                  </div>
                  <p style={{ color: 'rgba(0, 0, 0, 0.25)' }}>背景图无法完全覆盖屏幕时，会显示此底色</p>
                  <div className={styles.style_box_main}>
                    <strong>海报图</strong>
                    <div className={styles.style_m1_upimg}>
                      <div className={styles.style_upimg_btn}>
                        <Upload
                          name="files"
                          action={uploadIcon}
                          headers={headers}
                          listType="picture-card"
                          beforeUpload={beforeUpload}
                          fileList={fileList}
                          multiple={true}
                          onPreview={handlePreview}
                          onChange={(e) => { handleChange(e, 'poster') }}
                        >
                          <span style={{color: "#999"}}>上传图片</span>
                        </Upload>
                      </div>
                      <p>建议尺寸：750px*1624px</p>
                    </div>
                  </div>
                  
                  <div className={`${styles.style_box_main} ${styles.style_box_main2}`}>
                    <strong>开奖特效图</strong>
                    <div className={styles.style_m1_upimg}>
                      <div className={styles.style_upimg_btn1}>
                        <Upload
                          name="files"
                          action={uploadIcon}
                          beforeUpload={beforeUpload}
                          onChange={(e) => { handleChange(e, 'draw') }}
                          headers={headers}
                        >
                          <Button>上传图片</Button>
                        </Upload>
                      </div>

                      <p>建议尺寸：500*500px</p>
                    </div>
                  </div>
                  <div className={styles.style_m1_img}><img src={drawImageUrl ? drawImageUrl : require('../../../../assets/kaijaing.png')} alt="默认图片"></img></div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                </div>
              : indexInt == 2 ?
                <div className={styles.style_box_m2}>    {/* 参与按钮 */}
                  <div className={styles.style_box_main}>
                    <div className={styles.style_box_btns}><strong className={styles.style_box_strong}>抽奖按钮文案</strong>
                      <Input className={styles.style_box_btn_pn} value={btnTxt} onChange={setbtnTxt} maxLength="6" placeholder='立即抽奖'/>
                    </div>
                    <div className={styles.style_box_btns}><strong className={styles.style_box_strong}>保存按钮文案</strong>
                      <Input className={styles.style_box_btn_pn} value={saveTxt} onChange={setsaveTxt} maxLength="6" placeholder='保存图片'/>
                    </div>
                    <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span></div>
                    <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={ subInfo}>保存</Button></div>
                </div>
              : indexInt == 8 ?// 剩余次数颜色
                <div className={styles.style_box_m2}>
                  <div className={styles.style_box_main}>
                    <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color7} colorName='color7' setMColor={setMcolor} /></span></div>
                    <div><strong className={styles.style_box_strong}>是否需透明底</strong>
                      <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore1} onChange={onBackCloreChange1} />
                    </div>
                    {isBackClore1 ? <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color8} colorName='color8' setMColor={setMcolor} /></span></div> : null}
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                </div>
              : indexInt == 6 ?// 好友分享
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
                  <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit" onClick={subInfo}>保存</Button></div>
                </div>
              : indexInt == 7 ?// 邀请记录栏
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
                  <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit" onClick={subInfo}>保存</Button></div>
                </div>
              : null}
              {/* 广告 可增加游戏次数广告*/}
              <div className={`${styles.side_wrap4} ${styles.side_wrap}`} style={{ display: indexInt == 5 ? 'block' : 'none' }}>
                <div className={styles.side_wrap_by}>
                  <Form form={adverForm} onFinish={saveAd} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    <div className={styles.side_wrap4_top}>
                      <Form.Item name="isShow" label="标题：" onChange={setAdverIsTit} rules={[{ required: true, message: "请选择标题" }]}>
                        <Radio.Group>
                          <Radio value={1}>显示</Radio>
                          <Radio value={0}>隐藏</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {adverIsTit == 1 ? 
                        <div style={{ width: '100%' }}>
                          {indexInt == 5 ? 
                            <Form.Item name="gameAdTitleName" label="标题名称：" rules={[{ required: true, message: "请输入标题" }]}>
                              <Input onChange={setAdverTitName} />
                            </Form.Item> 
                          : null}
                          <Form.Item name="isTaskShow" label="任务计数：" onChange={setAdverIsNum} rules={[{ required: true, message: "请选择任务计数" }]}>
                            <Radio.Group>
                              <Radio value={1}>显示</Radio>
                              <Radio value={0}>隐藏</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </div> 
                      : null}
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
                                <div className={`${styles.side_wrap4_li} ${styles.style_box3_li}`}>
                                  <Form.Item name={[field.name, 'adImg']} label="广告图：" extra="建议尺寸：686px*220px" rules={[{ required: true, message: "请上传广告图" }]}>
                                    <Upload
                                      name="files"
                                      listType="picture"
                                      action={uploadIcon}
                                      showUploadList={false}
                                      beforeUpload={adverUpload1.b}
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
                    <div style={{'margin-left':'15px'}} className={styles.side_wrap_btn}><Button type="primary" htmlType="submit">保存</Button></div>
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
export default connect(({ posterDirectGame, loading }) => ({
  subimtData: posterDirectGame.subimtData,
  adverData: posterDirectGame.adverData,
}))(activityPage);
